import { Search, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";
import { filterServices, type Service } from "@/data/services";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = filterServices(query);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (svc: Service) => {
    setQuery("");
    setShowResults(false);
    if (svc.link) navigate(svc.link);
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    setShowResults(true);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    } else if (e.key === "Escape") {
      setShowResults(false);
      setActiveIndex(-1);
    }
  };

  const clearQuery = () => {
    setQuery("");
    setShowResults(false);
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="Bangladesh cityscape" className="h-full w-full object-cover" />
        <div className="absolute inset-0 gradient-navy opacity-90" />
      </div>

      <div className="container relative z-10 flex flex-col items-center py-20 text-center sm:py-28 md:py-36">
        <span className="mb-4 inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-foreground opacity-0 animate-fade-up">
          🇧🇩 Your Gateway to Government Services
        </span>

        <h1
          className="font-bangla mb-6 max-w-3xl text-3xl font-bold leading-tight text-primary-foreground opacity-0 animate-fade-up sm:text-4xl md:text-5xl lg:text-6xl"
          style={{ animationDelay: "0.1s" }}
        >
          নাগরিক সেবা এখন আপনার{" "}
          <span className="text-accent">হাতের মুঠোয়</span>
        </h1>

        <p
          className="mb-10 max-w-xl text-base text-primary-foreground/70 opacity-0 animate-fade-up sm:text-lg"
          style={{ animationDelay: "0.2s" }}
        >
          Find information on Passport, NID, Land Registry, and 100+ government
          services — all in one place.
        </p>

        {/* Search bar with live results */}
        <div
          ref={wrapperRef}
          className="relative w-full max-w-2xl opacity-0 animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="flex items-center overflow-hidden rounded-xl bg-card shadow-2xl shadow-navy-dark/30">
            <Search className="ml-4 h-5 w-5 shrink-0 text-muted-foreground sm:ml-5" />
            <input
              type="text"
              placeholder="সেবা খুঁজুন... (e.g., Passport, NID, Birth Certificate)"
              className="font-bangla flex-1 bg-transparent px-3 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none sm:px-4 sm:py-4 md:text-base"
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => query.trim() && setShowResults(true)}
            />
            {query && (
              <button
                onClick={clearQuery}
                className="mr-1 rounded-md p-1.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button className="mr-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-navy-light sm:px-6">
              Search
            </button>
          </div>

          {/* Live search results dropdown */}
          {showResults && query.trim() && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border bg-card shadow-xl animate-fade-in">
              {results.length > 0 ? (
                <ul className="divide-y divide-border">
                  {results.map((svc) => (
                    <li key={svc.subtitle}>
                      <button
                        onClick={() => handleSelect(svc)}
                        className="flex w-full items-center gap-3.5 px-5 py-3.5 text-left transition-colors hover:bg-secondary"
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${svc.color}`}
                        >
                          <svc.icon className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bangla text-sm font-bold text-card-foreground">
                            {svc.label}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {svc.subtitle} — {svc.description}
                          </p>
                        </div>
                        {svc.link && (
                          <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-accent">
                            View →
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-5 py-6 text-center">
                  <p className="font-bangla text-sm text-muted-foreground">
                    কোনো সেবা পাওয়া যায়নি
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    No services found for "{query}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Quick tags */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {["Passport", "NID Card", "Birth Certificate", "Land Registry"].map(
              (tag) => (
                <button
                  key={tag}
                  onClick={() => handleInputChange(tag)}
                  className="rounded-full border border-primary-foreground/20 px-3 py-1 text-xs text-primary-foreground/70 transition-colors hover:bg-primary-foreground/10"
                >
                  {tag}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

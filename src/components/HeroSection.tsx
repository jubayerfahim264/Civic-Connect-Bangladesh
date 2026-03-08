import { Search } from "lucide-react";
import { useState } from "react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const [query, setQuery] = useState("");

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

        {/* Search bar */}
        <div
          className="w-full max-w-2xl opacity-0 animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="flex items-center overflow-hidden rounded-xl bg-card shadow-2xl shadow-navy-dark/30">
            <Search className="ml-4 h-5 w-5 shrink-0 text-muted-foreground sm:ml-5" />
            <input
              type="text"
              placeholder="সেবা খুঁজুন... (e.g., Passport, NID, Birth Certificate)"
              className="font-bangla flex-1 bg-transparent px-3 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none sm:px-4 sm:py-4 md:text-base"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="mr-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-navy-light sm:px-6">
              Search
            </button>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {["Passport", "NID Card", "Birth Certificate", "Land Registry"].map(
              (tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
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

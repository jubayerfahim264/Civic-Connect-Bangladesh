import { Search } from "lucide-react";
import { useState } from "react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const [query, setQuery] = useState("");

  return (
    <section className="relative overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="Bangladesh cityscape" className="h-full w-full object-cover" />
        <div className="absolute inset-0 gradient-navy opacity-90" />
      </div>

      <div className="container relative z-10 flex flex-col items-center py-24 text-center md:py-36">
        <span className="mb-4 inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-foreground opacity-0 animate-fade-up">
          🇧🇩 Your Gateway to Government Services
        </span>

        <h1 className="mb-6 max-w-3xl font-heading text-4xl font-extrabold leading-tight text-primary-foreground opacity-0 animate-fade-up md:text-5xl lg:text-6xl" style={{ animationDelay: "0.1s" }}>
          Government Services,{" "}
          <span className="text-accent">Simplified</span>
        </h1>

        <p className="mb-10 max-w-xl text-lg text-primary-foreground/70 opacity-0 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          Find information on Passport, NID, Land Registry, and 100+ government services — all in one place.
        </p>

        {/* Search bar */}
        <div className="w-full max-w-2xl opacity-0 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center overflow-hidden rounded-xl bg-card shadow-2xl shadow-navy-dark/30">
            <Search className="ml-5 h-5 w-5 shrink-0 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for a service... (e.g., Passport, NID, Birth Certificate)"
              className="flex-1 bg-transparent px-4 py-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none md:text-base"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="mr-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-navy-light">
              Search
            </button>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {["Passport", "NID Card", "Birth Certificate", "Land Registry"].map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="rounded-full border border-primary-foreground/20 px-3 py-1 text-xs text-primary-foreground/70 transition-colors hover:bg-primary-foreground/10"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

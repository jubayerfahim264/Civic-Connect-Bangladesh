import { ArrowRight, Clock } from "lucide-react";

const updates = [
  {
    date: "March 7, 2026",
    title: "E-Passport Delivery Now Available at District Offices",
    summary: "Citizens can now collect their e-passports from any district passport office across Bangladesh.",
    tag: "Passport",
  },
  {
    date: "March 5, 2026",
    title: "NID Smart Card Distribution Extended to March 31",
    summary: "The Election Commission has extended the deadline for smart NID card distribution in all upazilas.",
    tag: "NID",
  },
  {
    date: "March 3, 2026",
    title: "Online Land Mutation Application Launched in 4 New Districts",
    summary: "The digital land mutation system is now operational in Rajshahi, Rangpur, Sylhet, and Barishal divisions.",
    tag: "Land",
  },
  {
    date: "February 28, 2026",
    title: "SSC Results 2026 Published Online",
    summary: "Secondary School Certificate examination results are now available on the education board website.",
    tag: "Education",
  },
];

const tagColors: Record<string, string> = {
  Passport: "bg-primary/10 text-primary",
  NID: "bg-accent/10 text-accent",
  Land: "bg-civic-green/10 text-civic-green",
  Education: "bg-civic-gold/10 text-civic-gold",
};

const LatestUpdates = () => {
  return (
    <section id="updates" className="bg-secondary py-20">
      <div className="container">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wider text-accent">
              Stay Informed
            </span>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Latest Updates
            </h2>
          </div>
          <a
            href="#"
            className="hidden items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-accent md:flex"
          >
            View all updates <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {updates.map((item, i) => (
            <article
              key={i}
              className="group flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md opacity-0 animate-fade-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="mb-3 flex items-center gap-3">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tagColors[item.tag] || "bg-muted text-muted-foreground"}`}>
                  {item.tag}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" /> {item.date}
                </span>
              </div>
              <h3 className="mb-2 font-heading text-lg font-bold text-card-foreground group-hover:text-accent transition-colors">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.summary}
              </p>
            </article>
          ))}
        </div>

        <a
          href="#"
          className="mt-8 flex items-center justify-center gap-1 text-sm font-semibold text-primary md:hidden"
        >
          View all updates <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
};

export default LatestUpdates;

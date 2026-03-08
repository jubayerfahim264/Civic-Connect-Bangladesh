import {
  FileText,
  CreditCard,
  MapPin,
  GraduationCap,
  Heart,
  Scale,
  Building2,
  Users,
} from "lucide-react";

const categories = [
  { icon: FileText, label: "Passport & Visa", description: "Apply, renew, or track your passport", color: "bg-primary" },
  { icon: CreditCard, label: "NID Card", description: "National ID registration & correction", color: "bg-accent" },
  { icon: MapPin, label: "Land Registry", description: "Land records, mutation & registration", color: "bg-civic-green" },
  { icon: GraduationCap, label: "Education", description: "Board results, certificates & scholarships", color: "bg-civic-gold" },
  { icon: Heart, label: "Health Services", description: "Hospital info, health cards & programs", color: "bg-destructive" },
  { icon: Scale, label: "Legal & Justice", description: "Court info, case tracking & legal aid", color: "bg-navy-light" },
  { icon: Building2, label: "Business & Tax", description: "TIN, trade license & company registration", color: "bg-primary" },
  { icon: Users, label: "Social Services", description: "Allowances, social safety net programs", color: "bg-accent" },
];

const ServiceCategories = () => {
  return (
    <section id="services" className="bg-background py-20">
      <div className="container">
        <div className="mb-12 text-center">
          <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wider text-accent">
            Browse by Category
          </span>
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            Government Service Categories
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Explore all major government services organized by category for easy navigation.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <button
              key={cat.label}
              className="group flex flex-col items-start rounded-xl border border-border bg-card p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg opacity-0 animate-fade-up"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${cat.color} transition-transform group-hover:scale-110`}>
                <cat.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="mb-1 font-heading text-base font-bold text-card-foreground">
                {cat.label}
              </h3>
              <p className="text-sm text-muted-foreground">{cat.description}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCategories;

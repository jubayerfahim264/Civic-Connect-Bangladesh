import { useNavigate } from "react-router-dom";
import { services } from "@/data/services";
import { trackServiceVisit } from "@/lib/trackServiceVisit";

const ServiceGrid = () => {
  const navigate = useNavigate();

  return (
    <section id="services" className="bg-background py-16 sm:py-20">
      <div className="container">
        <div className="mb-10 text-center sm:mb-12">
          <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wider text-accent">
            সেবা সমূহ
          </span>
          <h2 className="font-bangla text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
            সরকারি সেবা ক্যাটাগরি
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground sm:text-base">
            সকল প্রধান সরকারি সেবা সহজ নেভিগেশনের জন্য ক্যাটাগরি অনুযায়ী সাজানো হয়েছে।
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
          {services.map((svc, i) => (
            <button
              key={svc.subtitle}
              onClick={() => svc.link && navigate(svc.link)}
              className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg opacity-0 animate-fade-up sm:p-6"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${svc.color} transition-transform group-hover:scale-110`}
              >
                <svc.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bangla text-base font-bold text-card-foreground sm:text-lg">
                  {svc.label}
                </h3>
                <span className="text-xs font-medium text-accent">{svc.subtitle}</span>
                <p className="font-bangla mt-1 text-sm text-muted-foreground">
                  {svc.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceGrid;

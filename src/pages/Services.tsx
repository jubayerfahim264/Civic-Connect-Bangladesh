import { ArrowRight, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AdminService } from "@/types/service";

// default icons for generic services
import {
  FileText,
  CreditCard,
  Receipt,
  Baby,
  Briefcase,
  Car,
  Hash,
  Heart,
  GraduationCap,
  Stethoscope,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Passport: FileText,
  "National ID": CreditCard,
  "Land Tax": Receipt,
  "Birth Registration": Baby,
  "Trade License": Briefcase,
  "Driving License": Car,
  "TIN Certificate": Hash,
  "Marriage Registration": Heart,
  "Education Board": GraduationCap,
  "Health Services": Stethoscope,
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: "easeOut" as const },
  }),
};

const ServiceCategories = () => {
  const [selected, setSelected] = useState<AdminService | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [services, setServices] = useState<AdminService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "services"), (snap) => {
      const data: AdminService[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as AdminService),
      }));
      setServices(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const now = Date.now();
  const cutoff = now - 1000 * 60 * 60 * 24 * 7; // 7 days

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 font-body text-xs font-semibold uppercase tracking-widest text-primary">
            সরকারি সেবা বিভাগ
          </span>
          <h1 className="font-heading text-4xl font-bold text-foreground sm:text-5xl">
            শ্রেণী দ্বারা ব্রাউজ করুন
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-body text-muted-foreground">
            সহজ নেভিগেশনের জন্য সমস্ত প্রধান সরকারি সেবা বিভাগ দ্বারা সংগঠিত
            করুন।
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`h-64 animate-pulse rounded-2xl bg-white shadow-sm ${
                  [0, 3].includes(i) ? "sm:col-span-2 lg:col-span-2" : ""
                }`}
              />
            ))}

          {!loading &&
            services.map((cat, i) => {
              const isHovered = hoveredIndex === i;
              const isNew = (cat.createdAt || 0) >= cutoff;
              const Icon = ICON_MAP[cat.title] || FileText;

              return (
                <motion.div
                  key={cat.id || i}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  onHoverStart={() => setHoveredIndex(i)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  whileHover={{ scale: 1.05 }}
                  className={`
                    group relative cursor-pointer overflow-hidden rounded-2xl
                    border border-border/40 bg-card/60 p-6
                    backdrop-blur-md transition-shadow duration-300
                    ${
                      isHovered
                        ? "shadow-lg shadow-primary/15 border-transparent"
                        : "shadow-sm"
                    }
                    ${[0, 3].includes(i) ? "sm:col-span-2 lg:col-span-2" : ""}
                  `}
                  onClick={() => setSelected(cat)}
                >
                  {isNew && (
                    <span className="absolute top-4 right-4 rounded-full bg-destructive px-2 py-1 text-xs font-semibold text-white">
                      New
                    </span>
                  )}

                  {/* Gradient glow behind card on hover */}
                  <motion.div
                    className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background:
                        "linear-gradient(135deg, hsl(226 71% 40% / 0.15), hsl(243 75% 59% / 0.15))",
                    }}
                  />

                  {/* Icon */}
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>

                  {/* Text */}
                  <h3 className="font-heading text-lg font-bold text-foreground">
                    {cat.title}
                  </h3>
                  <p className="mt-1 font-body text-sm text-muted-foreground">
                    {cat.description}
                  </p>

                  {/* Learn More — visible on hover */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={
                      isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }
                    }
                    transition={{ duration: 0.25 }}
                    className="mt-4 flex items-center gap-1 font-body text-sm font-semibold text-primary"
                  >
                    Learn More <ArrowRight className="h-4 w-4" />
                  </motion.div>
                </motion.div>
              );
            })}
        </div>

        {/* Detail modal */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm"
              onClick={() => setSelected(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-card relative mx-4 w-full max-w-lg bg-card/80 p-8 shadow-2xl"
              >
                <button
                  onClick={() => setSelected(null)}
                  className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>

                <h2 className="font-heading text-2xl font-bold text-foreground">
                  {selected.title} — ধাপে ধাপে
                </h2>

                {selected.steps && selected.steps.length > 0 ? (
                  <ol className="mt-6 space-y-3">
                    {selected.steps.map((step, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-3 font-body text-foreground"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary font-body text-xs font-bold text-primary-foreground">
                          {idx + 1}
                        </span>
                        {step}
                      </motion.li>
                    ))}
                  </ol>
                ) : (
                  <p className="mt-6 font-body text-muted-foreground">
                    বিস্তারিত তথ্য শীঘ্রই আসছে...
                  </p>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ServiceCategories;

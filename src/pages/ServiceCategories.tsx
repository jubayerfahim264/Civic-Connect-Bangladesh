import {
  FileText,
  CreditCard,
  MapPin,
  Receipt,
  Stethoscope,
  GraduationCap,
  Heart,
  Hash,
  Baby,
  Briefcase,
  Car,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const categories = [
  {
    icon: FileText,
    label: "পাসপোর্ট",
    description: "Passport application & renewal requirements",
    color: "bg-primary",
    href: "/services/passport",
    steps: [
      "দরকারি ডকুমেন্ট সংগ্রহ করুন",
      "অনলাইন ফর্ম পূরণ করুন",
      "শাখায় যান",
      "ফি প্রদান করুন",
      "পাসপোর্ট গ্রহণ করুন",
    ],
  },
  {
    icon: CreditCard,
    label: "জাতীয় পরিচয়পত্র",
    description: "National ID card eligibility & documents",
    color: "bg-accent",
    href: "/services/nid",
    steps: [
      "নিবন্ধনের ফরম সংগ্রহ করুন",
      "আবেদনপত্র পূরণ করুন",
      "লোকাল ইউপি/পৌরসভার অফিসে জমা দিন",
      "বায়োমেট্রিক তথ্য দিন",
      "কার্ড সংগ্রহের বিজ্ঞপ্তি অপেক্ষা করুন",
    ],
  },
  {
    icon: Receipt,
    label: "ভূমি কর",
    description: "Paying khajna and land tax details",
    color: "bg-civic-green",
    href: "/services/land-tax",
    steps: [
      "রেজিস্ট্রি তথ্য যাচাই করুন",
      "অনলাইন পেমেন্ট সিস্টেমে লগইন করুন",
      "কর পরিমাণ গণনা করুন",
      "অনলাইনে বা ব্যাংকে পেমেন্ট করুন",
      "রসিদ ডাউনলোড বা প্রিন্ট করুন",
    ],
  },

  {
    icon: Baby,
    label: "জন্ম নিবন্ধন",
    subtitle: "Birth Certificate",
    description: "জন্ম সনদ আবেদন ও ডাউনলোড",
    color: "bg-destructive",
    link: "",
    keywords: [
      "birth",
      "certificate",
      "জন্ম",
      "সনদ",
      "নিবন্ধন",
      "registration",
    ],
  },
  {
    icon: Briefcase,
    label: "ট্রেড লাইসেন্স",
    subtitle: "Trade License",
    description: "ব্যবসা লাইসেন্স আবেদন",
    color: "bg-navy-light",
    link: "",
    keywords: ["trade", "license", "ট্রেড", "লাইসেন্স", "business", "ব্যবসা"],
  },
  {
    icon: Car,
    label: "ড্রাইভিং লাইসেন্স",
    subtitle: "Driving License",
    description: "লাইসেন্স আবেদন ও নবায়ন",
    color: "bg-primary",
    link: "",
    keywords: ["driving", "license", "ড্রাইভিং", "লাইসেন্স", "brta", "গাড়ি"],
  },
  {
    icon: Hash,
    label: "টিন সার্টিফিকেট",
    subtitle: "TIN Certificate",
    description: "কর শনাক্তকরণ নম্বর",
    color: "bg-accent",
    link: "",
    keywords: ["tin", "tax", "certificate", "টিন", "কর", "nbr", "income tax"],
  },
  {
    icon: Heart,
    label: "বিবাহ নিবন্ধন",
    subtitle: "Marriage Registration",
    description: "বিবাহ সনদ আবেদন",
    color: "bg-destructive",
    link: "",
    keywords: [
      "marriage",
      "registration",
      "বিবাহ",
      "নিবন্ধন",
      "কাবিননামা",
      "wedding",
    ],
  },
  {
    icon: GraduationCap,
    label: "শিক্ষা বোর্ড",
    subtitle: "Education Board",
    description: "ফলাফল ও সনদ যাচাই",
    color: "bg-civic-green",
    link: "",
    keywords: [
      "education",
      "board",
      "result",
      "certificate",
      "শিক্ষা",
      "বোর্ড",
      "ssc",
      "hsc",
    ],
  },
  {
    icon: Stethoscope,
    label: "স্বাস্থ্য সেবা",
    subtitle: "Health Services",
    description: "হাসপাতাল তথ্য ও স্বাস্থ্য কার্ড",
    color: "bg-civic-gold",
    link: "",
    keywords: [
      "health",
      "hospital",
      "স্বাস্থ্য",
      "হাসপাতাল",
      "dghs",
      "medical",
    ],
  },
];

const ServiceCategories = () => {
  const [selected, setSelected] = useState<(typeof categories)[0] | null>(null);

  return (
    <section id="services" className="bg-gray-100 py-20">
      <div className="container">
        <div className="mb-12 text-center font-bangla">
          <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wider text-accent">
            শ্রেণী দ্বারা ব্রাউজ করুন
          </span>
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            সরকারি সেবা বিভাগ
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            সহজ নেভিগেশনের জন্য সমস্ত প্রধান সরকারি সেবা বিভাগ দ্বারা সংগঠিত
            করুন।
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <div
              key={cat.label}
              className="group flex flex-col justify-between rounded-xl border border-border bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg opacity-0 animate-fade-up"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div>
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${cat.color} transition-transform group-hover:scale-110`}
                >
                  <cat.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mb-1 font-heading text-base font-bold text-foreground">
                  {cat.label}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {cat.description}
                </p>
              </div>
              <button
                onClick={() => setSelected(cat)}
                className="mt-2 inline-block rounded-md bg-navy px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-navy-dark"
              >
                Check Requirements
              </button>
            </div>
          ))}
        </div>

        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="max-w-md rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-2 font-heading text-xl font-bold">
                {selected.label} রুলস (ধাপে ধাপে)
              </h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-foreground">
                {selected.steps?.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
              <button
                className="mt-4 text-sm text-navy underline"
                onClick={() => setSelected(null)}
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServiceCategories;

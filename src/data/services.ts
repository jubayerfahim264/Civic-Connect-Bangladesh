import {
  FileText,
  CreditCard,
  MapPin,
  Receipt,
  Baby,
  Briefcase,
  Car,
  Hash,
  Heart,
  GraduationCap,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

export interface Service {
  icon: LucideIcon;
  label: string;
  subtitle: string;
  description: string;
  color: string;
  link: string;
  keywords: string[];
}

export const services: Service[] = [
  {
    icon: FileText,
    label: "পাসপোর্ট",
    subtitle: "Passport",
    description: "আবেদন, নবায়ন ও ট্র্যাকিং",
    color: "bg-primary",
    link: "/services/passport",
    keywords: ["passport", "পাসপোর্ট", "visa", "travel", "e-passport", "mrp"],
  },
  {
    icon: CreditCard,
    label: "জাতীয় পরিচয়পত্র",
    subtitle: "NID Card",
    description: "নিবন্ধন ও সংশোধন",
    color: "bg-accent",
    link: "",
    keywords: ["nid", "national id", "পরিচয়পত্র", "smart card", "voter id"],
  },
  {
    icon: MapPin,
    label: "ভূমি রেজিস্ট্রি",
    subtitle: "Land Registry",
    description: "জমির রেকর্ড ও মিউটেশন",
    color: "bg-civic-green",
    link: "",
    keywords: ["land", "registry", "ভূমি", "জমি", "mutation", "deed", "রেজিস্ট্রি"],
  },
  {
    icon: Receipt,
    label: "ভূমি কর",
    subtitle: "Land Tax",
    description: "অনলাইনে খাজনা পরিশোধ",
    color: "bg-civic-gold",
    link: "",
    keywords: ["land tax", "khajna", "খাজনা", "কর", "tax"],
  },
  {
    icon: Baby,
    label: "জন্ম নিবন্ধন",
    subtitle: "Birth Certificate",
    description: "জন্ম সনদ আবেদন ও ডাউনলোড",
    color: "bg-destructive",
    link: "",
    keywords: ["birth", "certificate", "জন্ম", "সনদ", "নিবন্ধন", "registration"],
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
    keywords: ["marriage", "registration", "বিবাহ", "নিবন্ধন", "কাবিননামা", "wedding"],
  },
  {
    icon: GraduationCap,
    label: "শিক্ষা বোর্ড",
    subtitle: "Education Board",
    description: "ফলাফল ও সনদ যাচাই",
    color: "bg-civic-green",
    link: "",
    keywords: ["education", "board", "result", "certificate", "শিক্ষা", "বোর্ড", "ssc", "hsc"],
  },
  {
    icon: Stethoscope,
    label: "স্বাস্থ্য সেবা",
    subtitle: "Health Services",
    description: "হাসপাতাল তথ্য ও স্বাস্থ্য কার্ড",
    color: "bg-civic-gold",
    link: "",
    keywords: ["health", "hospital", "স্বাস্থ্য", "হাসপাতাল", "dghs", "medical"],
  },
];

export function filterServices(query: string): Service[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return services.filter(
    (s) =>
      s.label.toLowerCase().includes(q) ||
      s.subtitle.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.keywords.some((k) => k.toLowerCase().includes(q))
  );
}

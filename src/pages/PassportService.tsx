import { Check, Circle, FileText, CheckCircle2, ArrowLeft, ExternalLink, Clock, MapPin, Phone } from "lucide-react";
import { useState } from "react";

const steps = [
  {
    title: "অনলাইন আবেদন পূরণ",
    subtitle: "Fill Online Application",
    description: "Department of Immigration & Passports (DIP) এর ওয়েবসাইটে গিয়ে MRP/E-Passport আবেদন ফরম পূরণ করুন।",
    details: [
      "www.epassport.gov.bd ওয়েবসাইটে যান",
      "নতুন অ্যাকাউন্ট তৈরি করুন অথবা লগ ইন করুন",
      "আবেদন ফরম সঠিকভাবে পূরণ করুন",
      "পাসপোর্টের ধরন নির্বাচন করুন (সাধারণ/জরুরি)",
    ],
  },
  {
    title: "ফি পরিশোধ",
    subtitle: "Pay Fees",
    description: "নির্ধারিত ফি অনলাইন ব্যাংকিং, মোবাইল ব্যাংকিং বা ব্যাংক চালানের মাধ্যমে পরিশোধ করুন।",
    details: [
      "সাধারণ (৩-৪ সপ্তাহ): ৩,৪৫০/- ৫,৭৫০/- টাকা",
      "জরুরি (৭-১৫ দিন): ৬,৯০০/- ১১,৫০০/- টাকা",
      "bKash, Nagad, Rocket বা ব্যাংক চালান গ্রহণযোগ্য",
      "পেমেন্ট রসিদ সংরক্ষণ করুন",
    ],
  },
  {
    title: "অ্যাপয়েন্টমেন্ট নিন",
    subtitle: "Book Appointment",
    description: "আপনার নিকটতম পাসপোর্ট অফিসে বায়োমেট্রিক তথ্য প্রদানের জন্য তারিখ ও সময় নির্ধারণ করুন।",
    details: [
      "আবেদন জমা দেওয়ার পর অ্যাপয়েন্টমেন্ট স্লট নির্বাচন করুন",
      "নিকটতম পাসপোর্ট অফিস বেছে নিন",
      "অ্যাপয়েন্টমেন্ট স্লিপ প্রিন্ট করুন",
      "নির্ধারিত তারিখে সময়মতো উপস্থিত হন",
    ],
  },
  {
    title: "বায়োমেট্রিক এনরোলমেন্ট",
    subtitle: "Biometric Enrollment",
    description: "পাসপোর্ট অফিসে গিয়ে আঙুলের ছাপ, ছবি ও স্বাক্ষর প্রদান করুন।",
    details: [
      "সকল মূল কাগজপত্র সাথে নিন",
      "আঙুলের ছাপ (১০ আঙুল) প্রদান করুন",
      "ডিজিটাল ছবি তোলা হবে",
      "ইলেকট্রনিক স্বাক্ষর প্রদান করুন",
    ],
  },
  {
    title: "পাসপোর্ট সংগ্রহ",
    subtitle: "Collect Passport",
    description: "পাসপোর্ট তৈরি হলে SMS নোটিফিকেশন পাবেন। নির্ধারিত অফিস থেকে সংগ্রহ করুন।",
    details: [
      "SMS/Email এ নোটিফিকেশন পাবেন",
      "ডেলিভারি স্লিপ ও আবেদনের রসিদ সাথে নিন",
      "পাসপোর্ট অফিস থেকে সংগ্রহ করুন",
      "তথ্য যাচাই করে নিশ্চিত হন",
    ],
  },
];

const requiredDocs = [
  { label: "জাতীয় পরিচয়পত্র (NID) এর ফটোকপি", checked: false },
  { label: "জন্ম নিবন্ধন সনদের ফটোকপি", checked: false },
  { label: "পাসপোর্ট সাইজ ছবি (২ কপি)", checked: false },
  { label: "নাগরিকত্ব সনদ (প্রযোজ্য ক্ষেত্রে)", checked: false },
  { label: "পূর্বের পাসপোর্ট (নবায়নের ক্ষেত্রে)", checked: false },
  { label: "পেমেন্ট রসিদ / চালান কপি", checked: false },
  { label: "অ্যাপয়েন্টমেন্ট স্লিপ (প্রিন্ট কপি)", checked: false },
  { label: "পেশাগত সনদ (সরকারি কর্মচারীদের জন্য)", checked: false },
];

const PassportServicePage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [checkedDocs, setCheckedDocs] = useState<boolean[]>(
    requiredDocs.map(() => false)
  );

  const toggleDoc = (index: number) => {
    setCheckedDocs((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const checkedCount = checkedDocs.filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border bg-card">
        <div className="container flex items-center gap-4 py-4">
          <a
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </a>
          <div className="h-5 w-px bg-border" />
          <span className="text-xs text-muted-foreground">
            Services / Passport
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="gradient-navy">
        <div className="container py-10 sm:py-14">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent/20">
              <FileText className="h-7 w-7 text-accent-foreground" />
            </div>
            <div>
              <h1 className="font-bangla text-2xl font-bold text-primary-foreground sm:text-3xl md:text-4xl">
                পাসপোর্ট আবেদন প্রক্রিয়া
              </h1>
              <p className="mt-1 text-sm text-primary-foreground/60 sm:text-base">
                E-Passport Application — Step by Step Guide
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <span className="flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs text-primary-foreground/80">
                  <Clock className="h-3 w-3" /> ৩-৪ সপ্তাহ (সাধারণ)
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs text-primary-foreground/80">
                  <MapPin className="h-3 w-3" /> পাসপোর্ট অফিস
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs text-primary-foreground/80">
                  <Phone className="h-3 w-3" /> ১৫১০০
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container py-10 sm:py-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          {/* Left: Stepper */}
          <div className="flex-1 min-w-0">
            <h2 className="font-bangla mb-6 text-lg font-bold text-foreground sm:text-xl">
              আবেদনের ধাপসমূহ
            </h2>

            <div className="space-y-0">
              {steps.map((step, i) => {
                const isActive = i === activeStep;
                const isDone = i < activeStep;

                return (
                  <div key={i} className="flex gap-4">
                    {/* Vertical line + circle */}
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => setActiveStep(i)}
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                          isDone
                            ? "border-civic-green bg-civic-green"
                            : isActive
                            ? "border-accent bg-accent"
                            : "border-border bg-card"
                        }`}
                      >
                        {isDone ? (
                          <Check className="h-5 w-5 text-civic-green-foreground" />
                        ) : (
                          <span
                            className={`text-sm font-bold ${
                              isActive
                                ? "text-accent-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {i + 1}
                          </span>
                        )}
                      </button>
                      {i < steps.length - 1 && (
                        <div
                          className={`w-0.5 flex-1 min-h-[2rem] ${
                            isDone ? "bg-civic-green" : "bg-border"
                          }`}
                        />
                      )}
                    </div>

                    {/* Step content */}
                    <div className={`pb-8 ${i === steps.length - 1 ? "pb-0" : ""}`}>
                      <button
                        onClick={() => setActiveStep(i)}
                        className="text-left"
                      >
                        <h3
                          className={`font-bangla text-base font-bold transition-colors sm:text-lg ${
                            isActive
                              ? "text-foreground"
                              : isDone
                              ? "text-civic-green"
                              : "text-muted-foreground"
                          }`}
                        >
                          {step.title}
                        </h3>
                        <span className="text-xs font-medium text-accent">
                          {step.subtitle}
                        </span>
                      </button>

                      {isActive && (
                        <div className="mt-3 animate-fade-up rounded-xl border border-border bg-card p-5 shadow-sm">
                          <p className="font-bangla text-sm leading-relaxed text-card-foreground">
                            {step.description}
                          </p>
                          <ul className="mt-4 space-y-2.5">
                            {step.details.map((d, j) => (
                              <li
                                key={j}
                                className="flex items-start gap-2.5 text-sm text-muted-foreground"
                              >
                                <Circle className="mt-1 h-2 w-2 shrink-0 fill-accent text-accent" />
                                <span className="font-bangla">{d}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Step navigation */}
            <div className="mt-8 flex items-center gap-3">
              <button
                disabled={activeStep === 0}
                onClick={() => setActiveStep((s) => s - 1)}
                className="rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                পূর্ববর্তী
              </button>
              <button
                disabled={activeStep === steps.length - 1}
                onClick={() => setActiveStep((s) => s + 1)}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-navy-light disabled:opacity-40 disabled:cursor-not-allowed"
              >
                পরবর্তী ধাপ
              </button>
            </div>
          </div>

          {/* Right: Documents checklist */}
          <div className="w-full lg:w-[340px] xl:w-[380px] shrink-0">
            <div className="sticky top-20 rounded-xl border border-border bg-card shadow-sm">
              <div className="border-b border-border p-5">
                <h3 className="font-bangla text-base font-bold text-card-foreground sm:text-lg">
                  প্রয়োজনীয় কাগজপত্র
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Required Documents — {checkedCount}/{requiredDocs.length} ready
                </p>
                {/* Progress bar */}
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-civic-green transition-all duration-300"
                    style={{
                      width: `${(checkedCount / requiredDocs.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <ul className="divide-y divide-border">
                {requiredDocs.map((doc, i) => (
                  <li key={i}>
                    <button
                      onClick={() => toggleDoc(i)}
                      className="flex w-full items-start gap-3 px-5 py-3.5 text-left transition-colors hover:bg-secondary/50"
                    >
                      <div
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all ${
                          checkedDocs[i]
                            ? "border-civic-green bg-civic-green"
                            : "border-border bg-card"
                        }`}
                      >
                        {checkedDocs[i] && (
                          <Check className="h-3.5 w-3.5 text-civic-green-foreground" />
                        )}
                      </div>
                      <span
                        className={`font-bangla text-sm transition-all ${
                          checkedDocs[i]
                            ? "text-muted-foreground line-through"
                            : "text-card-foreground"
                        }`}
                      >
                        {doc.label}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              {checkedCount === requiredDocs.length && (
                <div className="border-t border-border p-5">
                  <div className="flex items-center gap-2 rounded-lg bg-civic-green/10 p-3">
                    <CheckCircle2 className="h-5 w-5 text-civic-green" />
                    <span className="font-bangla text-sm font-semibold text-civic-green">
                      সকল কাগজপত্র প্রস্তুত!
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick link */}
            <a
              href="https://www.epassport.gov.bd"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-border bg-card p-4 text-sm font-semibold text-primary transition-colors hover:bg-secondary"
            >
              <ExternalLink className="h-4 w-4" />
              epassport.gov.bd এ আবেদন করুন
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassportServicePage;

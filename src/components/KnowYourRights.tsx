import { useState } from "react";
import {
  Shield,
  Scale,
  FileText,
  Users,
  Home,
  HandHeart,
  ChevronDown,
  BookOpen,
} from "lucide-react";

interface RightTopic {
  icon: typeof Shield;
  title: string;
  titleEn: string;
  summary: string;
  color: string;
  keyPoints: string[];
  legalBasis: string;
}

const topics: RightTopic[] = [
  {
    icon: Shield,
    title: "গ্রেপ্তার হলে আপনার অধিকার",
    titleEn: "Rights Upon Arrest",
    summary:
      "পুলিশ কর্তৃক গ্রেপ্তার হলে প্রতিটি নাগরিকের কিছু মৌলিক অধিকার রয়েছে যা সংবিধান দ্বারা সুরক্ষিত।",
    color: "bg-destructive",
    keyPoints: [
      "গ্রেপ্তারের কারণ জানার অধিকার — পুলিশ অবশ্যই কারণ জানাতে বাধ্য",
      "২৪ ঘণ্টার মধ্যে ম্যাজিস্ট্রেটের সামনে হাজির করতে হবে",
      "আইনজীবীর সাথে পরামর্শের অধিকার রয়েছে",
      "জামিনযোগ্য অপরাধে জামিন পাওয়ার অধিকার",
      "নির্যাতন বা অমানবিক আচরণ থেকে সুরক্ষা",
      "পরিবারকে গ্রেপ্তারের বিষয়ে জানানোর অধিকার",
    ],
    legalBasis: "সংবিধানের অনুচ্ছেদ ৩৩ এবং ফৌজদারি কার্যবিধি (CrPC) ধারা ৬১",
  },
  {
    icon: FileText,
    title: "তথ্য অধিকার আইন",
    titleEn: "Right to Information (RTI)",
    summary:
      "যেকোনো সরকারি প্রতিষ্ঠান থেকে তথ্য পাওয়া প্রতিটি নাগরিকের আইনগত অধিকার। আবেদন করলে ২০ কর্মদিবসের মধ্যে তথ্য প্রদান বাধ্যতামূলক।",
    color: "bg-accent",
    keyPoints: [
      "যেকোনো সরকারি দপ্তরে তথ্যের জন্য আবেদন করা যায়",
      "আবেদনের জন্য কোনো কারণ দেখাতে হয় না",
      "২০ কর্মদিবসের মধ্যে তথ্য প্রদান বাধ্যতামূলক",
      "তথ্য না দিলে তথ্য কমিশনে অভিযোগ করা যায়",
      "দায়িত্বপ্রাপ্ত কর্মকর্তা তথ্য না দিলে জরিমানা হতে পারে",
      "জাতীয় নিরাপত্তা সংক্রান্ত কিছু তথ্য ব্যতিক্রম",
    ],
    legalBasis: "তথ্য অধিকার আইন, ২০০৯",
  },
  {
    icon: Home,
    title: "ভূমি ও সম্পত্তির অধিকার",
    titleEn: "Land & Property Rights",
    summary:
      "জমি ক্রয়-বিক্রয়, উত্তরাধিকার ও মিউটেশন সংক্রান্ত মৌলিক অধিকার জানা প্রতিটি নাগরিকের জন্য জরুরি।",
    color: "bg-civic-green",
    keyPoints: [
      "রেজিস্ট্রি ছাড়া জমি হস্তান্তর আইনত বৈধ নয়",
      "উত্তরাধিকার সূত্রে প্রাপ্ত সম্পত্তিতে নারীর সমান অধিকার",
      "জমি দখল হলে ১২ বছরের মধ্যে মামলা করতে হবে",
      "খতিয়ান ও পর্চা অনলাইনে যাচাই করা যায়",
      "মিউটেশন ছাড়া জমির মালিকানা পূর্ণ হয় না",
      "সরকারি অধিগ্রহণে ন্যায্য ক্ষতিপূরণ পাওয়ার অধিকার",
    ],
    legalBasis: "সংবিধানের অনুচ্ছেদ ৪২, রেজিস্ট্রেশন আইন ১৯০৮, ভূমি আইন",
  },
  {
    icon: Users,
    title: "ভোটাধিকার ও নির্বাচন",
    titleEn: "Voting & Election Rights",
    summary:
      "গণতন্ত্রে ভোটাধিকার সবচেয়ে গুরুত্বপূর্ণ অধিকার। প্রতিটি প্রাপ্তবয়স্ক নাগরিকের ভোট দেওয়ার অধিকার সংবিধান দ্বারা নিশ্চিত।",
    color: "bg-primary",
    keyPoints: [
      "১৮ বছর পূর্ণ হলে ভোটার তালিকায় নাম অন্তর্ভুক্তির অধিকার",
      "গোপন ব্যালটে ভোট প্রদানের অধিকার",
      "ভোট কেন্দ্রে কেউ প্রভাবিত করলে অভিযোগ করার অধিকার",
      "ভোটার আইডি কার্ড পাওয়ার অধিকার",
      "নির্বাচনে প্রার্থী হওয়ার অধিকার (যোগ্যতা সাপেক্ষে)",
      "নির্বাচনী ফলাফল চ্যালেঞ্জ করার আইনি পথ রয়েছে",
    ],
    legalBasis: "সংবিধানের অনুচ্ছেদ ১১, ১২২ এবং জনপ্রতিনিধিত্ব আদেশ ১৯৭২",
  },
  {
    icon: Scale,
    title: "ভোক্তা অধিকার",
    titleEn: "Consumer Protection Rights",
    summary:
      "পণ্য ও সেবা ক্রয়ের ক্ষেত্রে প্রতারণা, ভেজাল ও ওজনে কম দেওয়ার বিরুদ্ধে আইনি সুরক্ষা রয়েছে।",
    color: "bg-civic-gold",
    keyPoints: [
      "ভেজাল পণ্যের বিরুদ্ধে অভিযোগ দায়ের করার অধিকার",
      "ওজনে কম দিলে জাতীয় ভোক্তা অধিকার সংরক্ষণ অধিদপ্তরে অভিযোগ",
      "হটলাইন ১৬১২১ এ কল করে অভিযোগ জানানো যায়",
      "ক্ষতিপূরণ পাওয়ার অধিকার রয়েছে",
      "প্রতারণামূলক বিজ্ঞাপনের বিরুদ্ধে ব্যবস্থা নেওয়া যায়",
      "পণ্যের গুণগত মান ও মেয়াদ জানার অধিকার",
    ],
    legalBasis: "ভোক্তা অধিকার সংরক্ষণ আইন, ২০০৯",
  },
  {
    icon: HandHeart,
    title: "নারী ও শিশু নির্যাতন প্রতিরোধ",
    titleEn: "Protection Against Abuse",
    summary:
      "নারী ও শিশুদের বিরুদ্ধে সহিংসতা, যৌতুক, বাল্যবিবাহ ও পারিবারিক নির্যাতনের বিরুদ্ধে কঠোর আইন রয়েছে।",
    color: "bg-navy-light",
    keyPoints: [
      "যৌতুক দাবি করা আইনত দণ্ডনীয় অপরাধ",
      "পারিবারিক সহিংসতার বিরুদ্ধে আইনি সুরক্ষা পাওয়ার অধিকার",
      "জাতীয় জরুরি সেবা ৯৯৯ এ কল করে সাহায্য পাওয়া যায়",
      "বাল্যবিবাহ আইনত নিষিদ্ধ এবং দণ্ডনীয়",
      "ওয়ান স্টপ ক্রাইসিস সেন্টার থেকে বিনামূল্যে সেবা পাওয়া যায়",
      "নারী ও শিশু নির্যাতন দমন ট্রাইব্যুনালে মামলা করা যায়",
    ],
    legalBasis: "নারী ও শিশু নির্যাতন দমন আইন, ২০০০ (সংশোধিত ২০২০)",
  },
];

const KnowYourRights = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setExpandedIndex(expandedIndex === i ? null : i);
  };

  return (
    <section id="rights" className="bg-background py-16 sm:py-20">
      <div className="container">
        <div className="mb-10 text-center sm:mb-12">
          <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wider text-accent">
            আপনার অধিকার জানুন
          </span>
          <h2 className="font-bangla text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
            Know Your Rights
          </h2>
          <p className="font-bangla mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            প্রতিটি বাংলাদেশি নাগরিকের জানা উচিত এমন গুরুত্বপূর্ণ আইনি ও নাগরিক অধিকারসমূহ — সহজ ভাষায়।
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5">
          {topics.map((topic, i) => {
            const isOpen = expandedIndex === i;

            return (
              <div
                key={topic.titleEn}
                className={`rounded-xl border bg-card shadow-sm transition-all opacity-0 animate-fade-up ${
                  isOpen ? "border-accent shadow-md" : "border-border"
                }`}
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                {/* Header */}
                <button
                  onClick={() => toggle(i)}
                  className="flex w-full items-start gap-4 p-5 text-left sm:p-6"
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${topic.color}`}
                  >
                    <topic.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bangla text-base font-bold text-card-foreground sm:text-lg">
                      {topic.title}
                    </h3>
                    <span className="text-xs font-medium text-accent">
                      {topic.titleEn}
                    </span>
                    <p className="font-bangla mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {topic.summary}
                    </p>
                  </div>
                  <ChevronDown
                    className={`mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Expandable content */}
                {isOpen && (
                  <div className="animate-fade-in border-t border-border px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
                    <h4 className="font-bangla mb-3 flex items-center gap-2 text-sm font-semibold text-card-foreground">
                      <BookOpen className="h-4 w-4 text-accent" />
                      মূল বিষয়সমূহ
                    </h4>
                    <ul className="space-y-2.5">
                      {topic.keyPoints.map((point, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-2.5 text-sm"
                        >
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                          <span className="font-bangla text-muted-foreground leading-relaxed">
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 rounded-lg bg-secondary px-4 py-3">
                      <p className="font-bangla text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          আইনি ভিত্তি:{" "}
                        </span>
                        {topic.legalBasis}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default KnowYourRights;

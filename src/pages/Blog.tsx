/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowRight, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navbar from "@/components/Navbar";

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  category: string;
  createdAt?: any; // Can be a number, string, or Firestore Timestamp
  updatedAt?: any; // Added to track when an admin updates the post
}

// colors for a handful of categories; new ones fall back to muted styles
const tagColors: Record<string, string> = {
  Passport: "bg-primary/10 text-primary",
  NID: "bg-accent/10 text-accent",
  Land: "bg-civic-green/10 text-civic-green",
  Education: "bg-civic-gold/10 text-civic-gold",
};

// Helper function to handle different date formats (Firebase Timestamp vs raw Number/String)
const getTimestampMs = (val: any): number => {
  if (!val) return 0;
  if (typeof val.toMillis === "function") return val.toMillis();
  if (val.seconds) return val.seconds * 1000;
  return new Date(val).getTime();
};

const LatestUpdates = () => {
  const { category } = useParams<{ category?: string }>();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setBlogs(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }) as BlogPost),
      );
    });
    return unsub;
  }, []);

  const filtered = category
    ? blogs.filter((b) => b.category.toLowerCase() === category.toLowerCase())
    : blogs;

  const nowMs = Date.now();
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

  return (
    <>
      <Navbar />
      {/* Changed background to a very light gray (bg-gray-50) to create depth against white cards */}
      <section id="updates" className="bg-gray-50 dark:bg-zinc-950 py-20">
        <div className="container">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wider text-accent">
                Stay Informed
              </span>
              <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
                {category
                  ? `${category.charAt(0).toUpperCase() + category.slice(1)} Posts`
                  : "Latest Updates"}
              </h2>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {filtered.map((item, i) => {
              const createdMs = getTimestampMs(item.createdAt);
              const updatedMs = getTimestampMs(item.updatedAt);

              // Determine if it was updated and the effective date to show
              const isUpdated = updatedMs > 0 && updatedMs > createdMs;
              const displayTimeMs = isUpdated ? updatedMs : createdMs;

              // Check if it was created within the last 7 days
              const isNew =
                !isUpdated &&
                createdMs > 0 &&
                nowMs - createdMs <= SEVEN_DAYS_MS;

              // Properly format the date
              const dateStr = displayTimeMs
                ? new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(new Date(displayTimeMs))
                : "";

              return (
                <div
                  key={item.id}
                  // Added bg-white to contrast the gray background and ensured shadow-sm is applied
                  className="group flex flex-col rounded-xl border border-border bg-white dark:bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md opacity-0 animate-fade-up"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          tagColors[item.category] ||
                          "bg-muted text-muted-foreground"
                        }`}
                      >
                        {item.category}
                      </span>

                      {/* Small 'New' badge for posts < 7 days old */}
                      {isNew && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          New
                        </span>
                      )}

                      {/* Small 'Updated' badge if an admin has updated the post */}
                      {isUpdated && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          Updated
                        </span>
                      )}
                    </div>

                    <span className="flex items-center gap-1 whitespace-nowrap text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /> {dateStr}
                    </span>
                  </div>

                  <h3 className="mb-2 flex-1 font-heading text-lg font-bold text-card-foreground transition-colors group-hover:text-accent">
                    {item.title}
                  </h3>
                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                    {item.summary}
                  </p>

                  <Link
                    to={`/blog/post/${item.id}`}
                    className="mt-4 self-start rounded-md bg-primary/10 px-3 py-1 text-sm font-semibold text-primary opacity-0 transition-opacity hover:bg-primary/20 group-hover:opacity-100"
                  >
                    Read More
                  </Link>
                </div>
              );
            })}
          </div>

          <a
            href="#"
            className="mt-8 flex items-center justify-center gap-1 text-sm font-semibold text-primary md:hidden"
          >
            View all updates <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </>
  );
};

export default LatestUpdates;

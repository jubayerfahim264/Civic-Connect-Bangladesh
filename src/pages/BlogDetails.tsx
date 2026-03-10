/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  onSnapshot,
  query,
  collection,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface BlogPost {
  id: string;
  title: string;
  category: string;
  content: string;
  imageUrl?: string;
  authorEmail?: string;
  createdAt?: number;
}

const BlogDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const unsub = onSnapshot(doc(db, "blogs", id), (docSnap) => {
      if (docSnap.exists()) {
        const p = { id: docSnap.id, ...(docSnap.data() as any) } as BlogPost;
        setPost(p);
        setLoading(false);
      } else {
        setPost(null);
        setLoading(false);
      }
    });
    return unsub;
  }, [id]);

  // fetch related posts by category when post loads
  useEffect(() => {
    if (!post) return;
    const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs
        .map((d) => ({ id: d.id, ...(d.data() as any) }) as BlogPost)
        .filter((b) => b.id !== post.id && b.category === post.category)
        .slice(0, 5);
      setRelated(data);
    });
    return unsub;
  }, [post]);

  if (loading) {
    return (
      <div className="container py-12">
        <div className="space-y-4">
          <div className="h-8 w-3/4 bg-gray-200 animate-pulse rounded" />
          <div className="h-6 w-1/4 bg-gray-200 animate-pulse rounded" />
          <div className="h-64 bg-gray-200 animate-pulse rounded" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-4 bg-gray-200 animate-pulse rounded"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container py-12">
        <p className="text-red-500">Blog post not found.</p>
      </div>
    );
  }

  const dateStr = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString()
    : "";

  return (
    <div className="container py-12">
      {/* breadcrumbs */}
      <nav className="text-sm mb-4" aria-label="Breadcrumb">
        <ol className="list-reset flex text-muted-foreground">
          <li>
            <a href="/" className="hover:underline">
              Home
            </a>
          </li>
          <li className="mx-2">&gt;</li>
          <li>
            <a href="/blog" className="hover:underline">
              Blog
            </a>
          </li>
          <li className="mx-2">&gt;</li>
          <li className="font-semibold text-foreground">{post.category}</li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* main content */}
        <article className="flex-1">
          <button
            onClick={() => window.history.back()}
            className="mb-4 inline-flex items-center text-sm text-primary hover:underline"
          >
            &larr; Back to Blog
          </button>

          <header className="mb-6">
            <h1 className="text-4xl font-bold leading-tight mb-2">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="px-2 py-1 bg-primary/10 text-primary rounded">
                {post.category}
              </span>
              {post.authorEmail && <span>by {post.authorEmail}</span>}
              {dateStr && <span>&bull; {dateStr}</span>}
            </div>
          </header>

          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full rounded shadow mb-6"
            />
          )}

          <div className="prose max-w-3xl leading-relaxed">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {/* share section */}
          <div className="mt-12">
            <p className="text-sm font-semibold mb-2">Share:</p>
            <div className="flex gap-4">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  window.location.href,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  window.location.href,
                )}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-600"
              >
                Twitter
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  window.location.href,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-900"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </article>

        {/* sidebar */}
        {related.length > 0 && (
          <aside className="w-full lg:w-1/3">
            <h4 className="text-lg font-semibold mb-4">
              Popular in {post.category}
            </h4>
            <ul className="space-y-3">
              {related.map((r) => (
                <li key={r.id}>
                  <a
                    href={`/blog/post/${r.id}`}
                    className="text-primary hover:underline"
                  >
                    {r.title}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </div>
  );
};

export default BlogDetails;

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type VickVersePost = {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  youtubeUrl: string | null;
  category: string | null;
  tags: string | null;
  isFeatured: boolean;
  status: string;
  createdAt: string;
};

export default function VickVersePage() {
  const [posts, setPosts] = useState<VickVersePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/vickverse?page=${page}&limit=10`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to fetch VickVerse posts."
          );
        }

        setPosts(data.posts || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("VICKVERSE FETCH ERROR:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load VickVerse."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HEADER */}
      <section className="px-6 py-16 md:px-12">
        <div className="mx-auto max-w-6xl">

          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gray-400">
            Frankyshots
          </p>

          <h1 className="text-4xl font-bold md:text-6xl">
            VickVerse
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-gray-400 md:text-lg">
            Stories, ideas and content from the VickVerse YouTube channel.
          </p>

        </div>
      </section>

      {/* ARTICLES */}
      <section className="px-6 pb-20 md:px-12">
        <div className="mx-auto max-w-6xl">

          {/* LOADING */}
          {loading && (
            <div className="py-20 text-center text-gray-400">
              Loading VickVerse...
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="py-20 text-center">

              <p className="text-red-400">
                {error}
              </p>

              <button
                onClick={() => window.location.reload()}
                className="mt-5 rounded-lg border border-white/20 px-5 py-3 text-sm hover:bg-white/10"
              >
                Try Again
              </button>

            </div>
          )}

          {/* EMPTY */}
          {!loading && !error && posts.length === 0 && (
            <div className="py-20 text-center text-gray-400">
              No VickVerse articles found.
            </div>
          )}

          {/* POST GRID */}
          {!loading && !error && posts.length > 0 && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/vickverse/${post.slug}` as any}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-white/30"
                >

                  {/* IMAGE */}
                  <div className="aspect-video overflow-hidden bg-zinc-900">

                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-600">
                        No Image
                      </div>
                    )}

                  </div>

                  {/* ARTICLE CONTENT */}
                  <div className="p-6">

                    {/* CATEGORY */}
                    {post.category && (
                      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-gray-500">
                        {post.category}
                      </p>
                    )}

                    {/* TITLE */}
                    <h2 className="text-xl font-semibold leading-tight">
                      {post.title}
                    </h2>

                    {/* DESCRIPTION */}
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-400">
                      {post.description}
                    </p>

                    {/* FOOTER */}
                    <div className="mt-6 flex items-center justify-between">

                      <span className="text-sm text-gray-500">
                        {new Date(
                          post.createdAt
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>

                      <span className="text-sm text-white transition group-hover:translate-x-1">
                        Read More →
                      </span>

                    </div>

                  </div>

                </Link>
              ))}

            </div>
          )}

          {/* PAGINATION */}
          {!loading && !error && totalPages > 1 && (
            <div className="mt-14 flex items-center justify-center gap-4">

              <button
                onClick={() =>
                  setPage((current) => Math.max(1, current - 1))
                }
                disabled={page === 1}
                className="rounded-lg border border-white/10 px-5 py-3 text-sm transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
              >
                ← Previous
              </button>

              <span className="min-w-[100px] text-center text-sm text-gray-400">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setPage((current) =>
                    Math.min(totalPages, current + 1)
                  )
                }
                disabled={page === totalPages}
                className="rounded-lg border border-white/10 px-5 py-3 text-sm transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Next →
              </button>

            </div>
          )}

        </div>
      </section>

    </main>
  );
}
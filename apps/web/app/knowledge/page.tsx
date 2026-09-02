"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type KnowledgePost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  image: string | null;
  tags: string | null;
  status: string;
  createdAt: string;
};

export default function KnowledgePage() {
  const [posts, setPosts] = useState<KnowledgePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await fetch("/api/knowledge");

        if (!response.ok) {
          throw new Error("Failed to load knowledge posts");
        }

        const data = await response.json();

        setPosts(data.posts || []);
      } catch (error) {
        console.error(error);
        setError("Knowledge posts load nahi ho paaye.");
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HEADER */}
      <section className="border-b border-white/10 px-6 py-24 md:px-10">
        <div className="mx-auto max-w-7xl">

          <p className="text-xs uppercase tracking-[0.45em] text-gray-500">
            Frankyshots Knowledge
          </p>

          <h1 className="mt-5 text-5xl font-black tracking-tight md:text-7xl">
            Knowledge
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-500">
            Facts, wildlife information, conservation knowledge and
            interesting stories from the natural world.
          </p>

        </div>
      </section>


      {/* POSTS */}
      <section className="px-6 py-20 md:px-10">

        <div className="mx-auto max-w-7xl">

          {/* LOADING */}
          {loading && (
            <div className="py-20 text-center text-sm uppercase tracking-[0.3em] text-gray-500">
              Loading knowledge...
            </div>
          )}


          {/* ERROR */}
          {error && (
            <div className="border border-red-900/50 bg-red-950/20 p-6 text-red-400">
              {error}
            </div>
          )}


          {/* EMPTY */}
          {!loading && !error && posts.length === 0 && (
            <div className="border border-white/10 py-20 text-center">

              <p className="text-sm uppercase tracking-[0.3em] text-gray-600">
                No Knowledge Posts
              </p>

              <p className="mt-4 text-gray-500">
                Abhi koi knowledge post publish nahi ki gayi hai.
              </p>

            </div>
          )}


          {/* POSTS GRID */}
          {!loading && !error && posts.length > 0 && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

              {posts.map((post) => (

                <Link
                  key={post.id}
                  href={`/knowledge/${post.slug}`}
                  className="group block overflow-hidden border border-white/10 bg-neutral-950 transition hover:border-white/30"
                >

                  {/* IMAGE */}
                  {post.image ? (
                    <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">

                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    </div>
                  ) : (
                    <div className="flex aspect-[16/10] items-center justify-center bg-neutral-900">
                      <span className="text-xs uppercase tracking-[0.3em] text-gray-700">
                        Frankyshots Knowledge
                      </span>
                    </div>
                  )}


                  {/* CONTENT */}
                  <div className="p-7">

                    <p className="text-[10px] uppercase tracking-[0.3em] text-gray-600">
                      Knowledge
                    </p>

                    <h2 className="mt-4 text-2xl font-bold tracking-tight transition group-hover:text-gray-300">
                      {post.title}
                    </h2>

                    <p className="mt-4 line-clamp-4 text-sm leading-7 text-gray-500">
                      {post.content}
                    </p>


                    {/* TAGS */}
                    {post.tags && (
                      <div className="mt-5 flex flex-wrap gap-2">

                        {post.tags
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter(Boolean)
                          .map((tag) => (
                            <span
                              key={tag}
                              className="border border-white/10 px-2 py-1 text-[9px] uppercase tracking-wider text-gray-600"
                            >
                              #{tag}
                            </span>
                          ))}

                      </div>
                    )}


                    {/* VIEW */}
                    <div className="mt-7 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-gray-400">

                      Read More

                      <span className="text-lg transition-transform duration-300 group-hover:translate-x-2">
                        →
                      </span>

                    </div>

                  </div>

                </Link>

              ))}

            </div>
          )}

        </div>

      </section>


      {/* FOOTER */}
      <footer className="border-t border-white/10 px-6 py-10 md:px-10">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-gray-500 md:flex-row">

          <div className="font-semibold tracking-[0.2em] text-white">
            FRANKYSHOTS
          </div>

          <div>
            Wildlife • Conservation • Documentary
          </div>

        </div>

      </footer>

    </main>
  );
}
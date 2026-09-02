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
  updatedAt: string;
};

export default function KnowledgeAdminPage() {
  const [posts, setPosts] = useState<KnowledgePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPosts() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/knowledge", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load knowledge posts.");
      }

      const data = await response.json();

      setPosts(data.posts || []);
    } catch (error) {
      console.error("KNOWLEDGE ADMIN ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Knowledge posts load nahi ho paaye."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Kya aap is knowledge post ko delete karna chahte hain?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch("/api/knowledge", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Knowledge post delete nahi ho paaya."
        );
      }

      await loadPosts();
    } catch (error) {
      console.error("DELETE KNOWLEDGE ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Knowledge post delete nahi ho paaya."
      );
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white md:px-10">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
              Admin Panel
            </p>

            <h1 className="mt-3 text-4xl font-bold md:text-5xl">
              Knowledge
            </h1>

            <p className="mt-4 max-w-2xl text-gray-500">
              Wildlife, nature, history, facts aur informational
              posts manage karein.
            </p>
          </div>

          {/* NEW POST */}
          <Link
            href="/admin/knowledge/new"
            className="inline-flex w-fit items-center justify-center bg-white px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] text-black transition hover:bg-gray-200"
          >
            + New Knowledge Post
          </Link>

        </div>


        {/* ERROR */}
        {error && (
          <div className="mb-6 border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}


        {/* LOADING */}
        {loading && (
          <div className="border border-white/10 py-20 text-center text-sm uppercase tracking-[0.3em] text-gray-600">
            Loading Knowledge...
          </div>
        )}


        {/* EMPTY */}
        {!loading && posts.length === 0 && !error && (
          <div className="border border-white/10 bg-neutral-950 py-20 text-center">

            <p className="text-sm uppercase tracking-[0.3em] text-gray-600">
              No Knowledge Posts
            </p>

            <p className="mt-4 text-gray-500">
              Abhi koi knowledge post nahi hai.
            </p>

            <Link
              href="/admin/knowledge/new"
              className="mt-7 inline-flex border border-white/20 px-6 py-3 text-xs uppercase tracking-[0.2em] text-gray-400 transition hover:border-white hover:text-white"
            >
              Create First Post
            </Link>

          </div>
        )}


        {/* POSTS */}
        {!loading && posts.length > 0 && (
          <section>

            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-600">
                Existing Posts
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Knowledge Library
              </h2>
            </div>


            <div className="space-y-4">

              {posts.map((post) => (
                <div
                  key={post.id}
                  className="border border-white/10 bg-neutral-950 p-6"
                >

                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                    {/* POST INFO */}
                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-4">

                        <span
                          className={`text-[10px] uppercase tracking-[0.2em] ${
                            post.status === "published"
                              ? "text-green-400"
                              : "text-yellow-500"
                          }`}
                        >
                          {post.status}
                        </span>

                        {post.tags && (
                          <span className="text-[10px] uppercase tracking-[0.15em] text-gray-600">
                            {post.tags}
                          </span>
                        )}

                      </div>

                      <h3 className="mt-3 text-xl font-bold">
                        {post.title}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                        {post.content}
                      </p>

                      <p className="mt-3 text-xs text-gray-700">
                        /knowledge/{post.slug}
                      </p>

                    </div>


                    {/* ACTIONS */}
                    <div className="flex shrink-0 flex-wrap gap-3">

                      {/* VIEW */}
                      <Link
                        href={`/knowledge/${post.slug}`}
                        target="_blank"
                        className="border border-white/20 px-5 py-3 text-xs uppercase tracking-wider text-gray-300 transition hover:border-white hover:bg-white hover:text-black"
                      >
                        View
                      </Link>

                      {/* DELETE */}
                      <button
                        type="button"
                        onClick={() => handleDelete(post.id)}
                        className="border border-red-500/30 px-5 py-3 text-xs uppercase tracking-wider text-red-400 transition hover:border-red-400 hover:bg-red-500 hover:text-white"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>
              ))}

            </div>

          </section>
        )}

      </div>
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type PageItem = {
  id: string;
  title: string;
  slug: string;
  content: string;
  image: string | null;
  status: string;
  createdAt: string;
};

export default function PagesAdmin() {
  const router = useRouter();

  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPages();
  }, []);

  async function loadPages() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/pages", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load pages.");
      }

      const data = await response.json();

      setPages(data.pages ?? []);
    } catch (error) {
      console.error("PAGES LOAD ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load pages."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(page: PageItem) {
  if (deletingId) {
    return;
  }

  const confirmed = window.confirm(
    `Delete "${page.title}"?\n\nThis action cannot be undone.`
  );

  if (!confirmed) {
    return;
  }

  try {
    setDeletingId(page.id);
    setError("");

    const response = await fetch(
      `/api/pages/${page.id}`,
      {
        method: "DELETE",
      }
    );

    const text = await response.text();

    let data: {
      success?: boolean;
      error?: string;
    } = {};

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "The server returned an invalid response."
        );
      }
    }

    if (!response.ok) {
      throw new Error(
        data.error || "Unable to delete the page."
      );
    }

    setPages((currentPages) =>
      currentPages.filter(
        (item) => item.id !== page.id
      )
    );

  } catch (error) {
    console.error("DELETE PAGE ERROR:", error);

    setError(
      error instanceof Error
        ? error.message
        : "Unable to delete the page."
    );
  } finally {
    setDeletingId(null);
  }
}

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-10 flex items-end justify-between gap-6">

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
              Content Management
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              Pages
            </h1>

            <p className="mt-3 text-sm text-gray-500">
              Manage custom website pages.
            </p>
          </div>

          {/* NEW PAGE */}

          <button
            type="button"
            onClick={() =>
              router.push("/admin/pages/new")
            }
            className="shrink-0 border border-white/20 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition hover:border-white/50 hover:bg-white hover:text-black"
          >
            + New Page
          </button>

        </div>


        {/* ERROR */}

        {error && (
          <div className="mb-6 border border-red-500/20 bg-red-950/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}


        {/* PAGES LIST */}

        <div className="border border-white/10 bg-neutral-950">

          {/* TABLE HEADER */}

          <div className="grid grid-cols-[1fr_180px_180px_180px] border-b border-white/10 px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-gray-600">

            <span>
              Page
            </span>

            <span>
              Slug
            </span>

            <span>
              Status
            </span>

            <span>
              Action
            </span>

          </div>


          {/* LOADING */}

          {loading ? (

            <div className="px-6 py-10 text-sm text-gray-500">
              Loading pages...
            </div>

          ) : pages.length === 0 ? (

            /* EMPTY STATE */

            <div className="px-6 py-16 text-center">

              <p className="text-sm text-gray-500">
                No pages created yet.
              </p>

              <p className="mt-2 text-xs text-gray-700">
                Create your first custom website page.
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push("/admin/pages/new")
                }
                className="mt-6 border border-white/20 px-5 py-3 text-xs uppercase tracking-[0.2em] text-gray-400 transition hover:border-white hover:text-white"
              >
                Create First Page →
              </button>

            </div>

          ) : (

            /* PAGES */

            pages.map((page) => (

              <div
                key={page.id}
                className="grid grid-cols-[1fr_180px_180px_180px] items-center border-b border-white/10 px-6 py-5 last:border-b-0"
              >

                {/* PAGE */}

                <div>

                  <h2 className="font-medium">
                    {page.title}
                  </h2>

                  <p className="mt-1 text-xs text-gray-600">
                    Created{" "}
                    {new Date(
                      page.createdAt
                    ).toLocaleDateString()}
                  </p>

                </div>


                {/* SLUG */}

                <span className="text-sm text-gray-500">
                  /{page.slug}
                </span>


                {/* STATUS */}

                <span
                  className={`text-xs uppercase tracking-wider ${
                    page.status === "published"
                      ? "text-white"
                      : "text-gray-600"
                  }`}
                >
                  {page.status}
                </span>


                {/* ACTIONS */}

                <div className="flex items-center gap-5">

                  {/* EDIT */}

                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        `/admin/pages/${page.id}/edit`
                      )
                    }
                    className="text-xs uppercase tracking-[0.15em] text-white transition hover:text-gray-400"
                  >
                    Edit →
                  </button>


                  {/* DELETE */}

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(page)
                    }
                    disabled={deletingId === page.id}
                    className="text-xs uppercase tracking-[0.15em] text-red-500 transition hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {deletingId === page.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>

                </div>

              </div>

            ))

          )}

        </div>

      </div>
    </main>
  );
}
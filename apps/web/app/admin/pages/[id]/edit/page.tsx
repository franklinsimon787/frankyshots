"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import { useParams, useRouter } from "next/navigation";
import type { Route } from "next";

type PageData = {
  id: string;
  title: string;
  slug: string;
  content: string;
  image: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export default function EditPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const [page, setPage] = useState<PageData | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [status, setStatus] = useState("draft");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      loadPage();
    }
  }, [id]);

  async function loadPage() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/pages/${id}`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to load the page."
        );
      }

      const loadedPage: PageData = data.page;

      setPage(loadedPage);
      setTitle(loadedPage.title);
      setSlug(loadedPage.slug);
      setContent(loadedPage.content);
      setImage(loadedPage.image || "");
      setImagePreview(loadedPage.image || "");
      setStatus(loadedPage.status);
    } catch (error) {
      console.error("LOAD PAGE ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load the page."
      );
    } finally {
      setLoading(false);
    }
  }

  function createSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    setError("");

    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);

    // Actual upload will be connected to storage.
    setImage(file.name);
  }

  function removeImage() {
    setImage("");
    setImagePreview("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (saving) {
      return;
    }

    setError("");

    if (!title.trim()) {
      setError("Page title is required.");
      return;
    }

    if (!slug.trim()) {
      setError("Page slug is required.");
      return;
    }

    if (!content.trim()) {
      setError("Page content is required.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/pages/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          content: content.trim(),
          image: image || null,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to update the page."
        );
      }

      router.push("/admin/pages" as Route);
      router.refresh();
    } catch (error) {
      console.error("UPDATE PAGE ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to update the page."
      );

      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black px-6 py-12 text-white">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-600">
            Content Management
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Edit Page
          </h1>

          <p className="mt-6 text-sm text-gray-500">
            Loading page...
          </p>
        </div>
      </main>
    );
  }

  if (!page) {
    return (
      <main className="min-h-screen bg-black px-6 py-12 text-white">
        <div className="mx-auto max-w-5xl">

          <button
            type="button"
            onClick={() =>
              router.push("/admin/pages" as Route)
            }
            className="mb-6 text-xs uppercase tracking-[0.2em] text-gray-500 transition hover:text-white"
          >
            ← Back to Pages
          </button>

          <h1 className="text-4xl font-bold">
            Page Not Found
          </h1>

          <p className="mt-4 text-sm text-gray-500">
            The requested page could not be found.
          </p>

          {error && (
            <p className="mt-4 text-sm text-red-400">
              {error}
            </p>
          )}

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}

        <div className="mb-10">

          <button
            type="button"
            onClick={() =>
              router.push("/admin/pages" as Route)
            }
            className="mb-6 text-xs uppercase tracking-[0.2em] text-gray-500 transition hover:text-white"
          >
            ← Back to Pages
          </button>

          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
            Content Management
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Edit Page
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            Update and manage this website page.
          </p>

        </div>


        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="border border-white/10 bg-neutral-950 p-7"
        >

          {/* TITLE */}

          <div className="mb-7">

            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-gray-500">
              Page Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              className="w-full border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
            />

          </div>


          {/* SLUG */}

          <div className="mb-7">

            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-gray-500">
              Slug
            </label>

            <div className="flex items-center border border-white/10 bg-black">

              <span className="px-4 text-sm text-gray-600">
                /
              </span>

              <input
                type="text"
                value={slug}
                onChange={(event) =>
                  setSlug(
                    createSlug(event.target.value)
                  )
                }
                className="w-full bg-transparent px-2 py-3 text-sm text-white outline-none"
              />

            </div>

          </div>


          {/* CONTENT */}

          <div className="mb-7">

            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-gray-500">
              Page Content
            </label>

            <textarea
              value={content}
              onChange={(event) =>
                setContent(event.target.value)
              }
              rows={16}
              className="w-full resize-y border border-white/10 bg-black px-4 py-3 text-sm leading-7 text-white outline-none transition focus:border-white/30"
            />

          </div>


          {/* IMAGE */}

          <div className="mb-7">

            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-gray-500">
              Page Image
            </label>

            {!imagePreview ? (

              <label className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center border border-dashed border-white/15 bg-black px-6 py-10 text-center transition hover:border-white/30">

                <span className="text-sm font-medium text-gray-300">
                  Upload Image
                </span>

                <span className="mt-2 text-xs text-gray-600">
                  Click to select an image
                </span>

                <span className="mt-1 text-[10px] uppercase tracking-[0.15em] text-gray-700">
                  JPG, PNG or WEBP
                </span>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />

              </label>

            ) : (

              <div className="border border-white/10 bg-black p-4">

                <div className="overflow-hidden border border-white/10">
                  <img
                    src={imagePreview}
                    alt="Page preview"
                    className="max-h-[350px] w-full object-cover"
                  />
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">

                  <p className="max-w-[70%] truncate text-xs text-gray-500">
                    {image}
                  </p>

                  <button
                    type="button"
                    onClick={removeImage}
                    className="shrink-0 text-xs uppercase tracking-[0.15em] text-gray-500 transition hover:text-white"
                  >
                    Remove
                  </button>

                </div>

              </div>

            )}

          </div>


          {/* STATUS */}

          <div className="mb-8">

            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-gray-500">
              Status
            </label>

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
              className="border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30"
            >
              <option value="draft">
                Draft
              </option>

              <option value="published">
                Published
              </option>
            </select>

          </div>


          {/* ERROR */}

          {error && (
            <div className="mb-6 border border-red-500/20 bg-red-950/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}


          {/* ACTIONS */}

          <div className="flex items-center gap-4 border-t border-white/10 pt-7">

            <button
              type="submit"
              disabled={saving}
              className="border border-white/20 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() =>
                router.push("/admin/pages" as Route)
              }
              disabled={saving}
              className="px-5 py-3 text-xs uppercase tracking-[0.2em] text-gray-500 transition hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>

          </div>

        </form>

      </div>
    </main>
  );
}
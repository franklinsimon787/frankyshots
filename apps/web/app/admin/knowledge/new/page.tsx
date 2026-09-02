"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewKnowledgePostPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("published");

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // IMAGE UPLOAD
  // =====================================================

  async function handleImageUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Image upload nahi ho paayi."
        );
      }

      const uploadedImage =
        data.url || data.imageUrl || data.path;

      if (!uploadedImage) {
        throw new Error("Uploaded image ka URL nahi mila.");
      }

      setImage(uploadedImage);
    } catch (error) {
      console.error("IMAGE UPLOAD ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Image upload nahi ho paayi."
      );
    } finally {
      setUploading(false);
    }
  }

  // =====================================================
  // CREATE POST
  // =====================================================

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Title required hai.");
      return;
    }

    if (!content.trim()) {
      setError("Content required hai.");
      return;
    }

    if (uploading) {
      setError("Image upload complete hone ka wait karein.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch("/api/knowledge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          image: image.trim() || null,
          tags: tags.trim() || null,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Knowledge post create nahi ho paaya."
        );
      }

      router.push("/admin/knowledge");
      router.refresh();
    } catch (error) {
      console.error("CREATE KNOWLEDGE ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Knowledge post create nahi ho paaya."
      );
    } finally {
      setSaving(false);
    }
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white md:px-10">

      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="mb-12">

          <Link
            href="/admin/knowledge"
            className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gray-500 transition hover:text-white"
          >
            <span className="text-base">←</span>
            Back to Knowledge
          </Link>

          <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
            Admin Panel
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            New Knowledge Post
          </h1>

          <p className="mt-4 max-w-2xl text-gray-500">
            Wildlife, nature, history, facts aur
            informational content publish karein.
          </p>

        </div>


        {/* ERROR */}
        {error && (
          <div className="mb-6 border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}


        {/* FORM */}
        <section className="border border-white/10 bg-neutral-950 p-6 md:p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-7"
          >

            {/* TITLE */}
            <div>

              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-gray-500">
                Title *
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Example: Why Tigers Have Stripes"
                className="w-full border border-white/10 bg-black px-4 py-4 text-white outline-none transition placeholder:text-gray-700 focus:border-white/40"
              />

              <p className="mt-2 text-xs text-gray-600">
                Post ka main title.
              </p>

            </div>


            {/* CONTENT */}
            <div>

              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-gray-500">
                Content *
              </label>

              <textarea
                value={content}
                onChange={(e) =>
                  setContent(e.target.value)
                }
                placeholder="Knowledge post ka complete content yahan likhein..."
                rows={18}
                className="w-full resize-y border border-white/10 bg-black px-4 py-4 leading-7 text-white outline-none transition placeholder:text-gray-700 focus:border-white/40"
              />

              <p className="mt-2 text-xs text-gray-600">
                Content compulsory hai.
              </p>

            </div>


            {/* IMAGE */}
            <div>

              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-gray-500">
                Image
              </label>

              <div className="border border-white/10 bg-black p-5">

                <div className="flex flex-wrap items-center gap-4">

                  <label
                    className={`inline-flex cursor-pointer items-center gap-3 border px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] transition ${
                      uploading
                        ? "cursor-not-allowed border-white/10 text-gray-600"
                        : "border-white/20 text-gray-300 hover:border-white hover:bg-white hover:text-black"
                    }`}
                  >

                    <span>
                      {uploading
                        ? "Uploading..."
                        : "Choose Image"}
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading || saving}
                      className="hidden"
                    />

                  </label>

                  {image && (
                    <button
                      type="button"
                      onClick={() => setImage("")}
                      disabled={uploading || saving}
                      className="border border-red-500/30 px-5 py-3 text-xs uppercase tracking-wider text-red-400 transition hover:border-red-400 hover:bg-red-500 hover:text-white disabled:opacity-50"
                    >
                      Remove
                    </button>
                  )}

                </div>


                {/* IMAGE PREVIEW */}

                {image && (
                  <div className="mt-5 overflow-hidden border border-white/10 bg-neutral-900">

                    <img
                      src={image}
                      alt="Knowledge post preview"
                      className="max-h-[400px] w-full object-contain"
                    />

                  </div>
                )}

                <p className="mt-4 text-xs text-gray-600">
                  Optional — image nahi hogi tab bhi
                  post publish ho jayega.
                </p>

              </div>

            </div>


            {/* SEO TAGS */}
            <div>

              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-gray-500">
                SEO Tags
              </label>

              <input
                type="text"
                value={tags}
                onChange={(e) =>
                  setTags(e.target.value)
                }
                placeholder="tiger, wildlife, india, conservation"
                className="w-full border border-white/10 bg-black px-4 py-4 text-white outline-none transition placeholder:text-gray-700 focus:border-white/40"
              />

              <p className="mt-2 text-xs text-gray-600">
                Optional — tags ko comma se separate karein.
              </p>

            </div>


            {/* STATUS */}
            <div>

              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-gray-500">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                className="w-full border border-white/10 bg-black px-4 py-4 text-white outline-none focus:border-white/40"
              >

                <option value="published">
                  Published
                </option>

                <option value="draft">
                  Draft
                </option>

              </select>

            </div>


            {/* BUTTONS */}
            <div className="flex flex-wrap gap-4 border-t border-white/10 pt-7">

              <button
                type="submit"
                disabled={saving || uploading}
                className="bg-white px-7 py-4 text-xs font-bold uppercase tracking-[0.2em] text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Publishing..."
                  : "Publish Post"}
              </button>


              <Link
                href="/admin/knowledge"
                className={`border border-white/20 px-7 py-4 text-xs uppercase tracking-[0.2em] text-gray-400 transition hover:border-white hover:text-white ${
                  saving || uploading
                    ? "pointer-events-none opacity-50"
                    : ""
                }`}
              >
                Cancel
              </Link>

            </div>

          </form>

        </section>

      </div>

    </main>
  );
}
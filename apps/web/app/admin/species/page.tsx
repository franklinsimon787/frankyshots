"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";

type Species = {
  id: string;
  name: string;
  slug: string;
  category: string;
  location: string;
  summary: string;
  featuredImage: string;
  isFeatured: boolean;
  status: string;
};

type FormData = {
  name: string;
  slug: string;
  category: string;
  location: string;
  summary: string;
  featuredImage: string;
  isFeatured: boolean;
  status: string;
};

const emptyForm: FormData = {
  name: "",
  slug: "",
  category: "",
  location: "",
  summary: "",
  featuredImage: "",
  isFeatured: false,
  status: "published",
};

export default function SpeciesAdminPage() {
  const [species, setSpecies] = useState<Species[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<FormData>(emptyForm);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadSpecies() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/species", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load species.");
      }

      const data = await response.json();

      setSpecies(data);
    } catch (error) {
      console.error(error);
      setError("Unable to load species.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSpecies();
  }, []);

  function updateField(
    field: keyof FormData,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function createSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function handleNameChange(value: string) {
    setForm((current) => ({
      ...current,
      name: value,
      slug: editingId ? current.slug : createSlug(value),
    }));
  }

  async function handleImageUpload(
  event: ChangeEvent<HTMLInputElement>
) {
  const file = event.target.files?.[0];

  if (!file) {
    return;
  }

  try {
    setUploading(true);
    setError("");
    setMessage("");

    const uploadData = new FormData();

    uploadData.append("file", file);

    const response = await fetch("/api/species/upload", {
      method: "POST",
      body: uploadData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Image upload failed."
      );
    }

    setForm((current) => ({
      ...current,
      featuredImage: data.imagePath,
    }));

    setMessage("Image uploaded successfully.");
  } catch (error) {
    console.error(error);

    setError(
      error instanceof Error
        ? error.message
        : "Image upload failed."
    );
  } finally {
    setUploading(false);
  }
}

  async function handleSubmit(event: FormEvent) {
  event.preventDefault();

  try {
    setSaving(true);
    setError("");
    setMessage("");

    // Check required fields before sending to API
    const name = form.name.trim();
    const slug = form.slug.trim();
    const category = form.category.trim();
    const location = form.location.trim();
    const summary = form.summary.trim();
    const featuredImage = form.featuredImage.trim();

    const missingFields: string[] = [];

    if (!name) missingFields.push("Species Name");
    if (!slug) missingFields.push("Slug");
    if (!category) missingFields.push("Category");
    if (!location) missingFields.push("Location");
    if (!summary) missingFields.push("Summary");
    if (!featuredImage) missingFields.push("Featured Image");

    if (missingFields.length > 0) {
      setError(
        `Please fill these fields: ${missingFields.join(", ")}`
      );
      setSaving(false);
      return;
    }

    const method = editingId ? "PUT" : "POST";

    const body = editingId
      ? {
          id: editingId,
          name,
          slug,
          category,
          location,
          summary,
          featuredImage,
          isFeatured: form.isFeatured,
          status: form.status,
        }
      : {
          name,
          slug,
          category,
          location,
          summary,
          featuredImage,
          isFeatured: form.isFeatured,
          status: form.status,
        };

    console.log("SPECIES SUBMIT DATA:", body);

    const response = await fetch("/api/species", {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
          (editingId
            ? "Failed to update species."
            : "Failed to create species.")
      );
    }

    setMessage(
      editingId
        ? "Species updated successfully."
        : "Species created successfully."
    );

    setForm(emptyForm);
    setEditingId(null);

    await loadSpecies();
  } catch (error) {
    console.error(error);

    setError(
      error instanceof Error
        ? error.message
        : "Something went wrong."
    );
  } finally {
    setSaving(false);
  }
}
  function handleEdit(item: Species) {
    setEditingId(item.id);

    setForm({
      name: item.name,
      slug: item.slug,
      category: item.category,
      location: item.location,
      summary: item.summary,
      featuredImage: item.featuredImage,
      isFeatured: item.isFeatured,
      status: item.status,
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
    setError("");
  }

  async function handleDelete(id: string, name: string) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const response = await fetch("/api/species", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete species."
        );
      }

      setMessage("Species deleted successfully.");

      if (editingId === id) {
        cancelEdit();
      }

      await loadSpecies();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete species."
      );
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.35em] text-gray-500">
            Frankyshots Admin
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Species Management
          </h1>

          <p className="mt-3 text-gray-500">
            Add, edit, publish and manage wildlife species.
          </p>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-6 border border-white/10 bg-neutral-950 px-5 py-4 text-sm text-gray-300">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 border border-red-500/20 bg-red-950/20 px-5 py-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Add / Edit Form */}
        <section className="mb-12 border border-white/10 bg-neutral-950 p-7">

          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-600">
                {editingId ? "Modify Record" : "New Record"}
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                {editingId
                  ? "Edit Species"
                  : "Add New Species"}
              </h2>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="border border-white/10 px-4 py-2 text-xs uppercase tracking-wider text-gray-400 transition hover:border-white/30 hover:text-white"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-6 md:grid-cols-2"
          >


            {/* Name */}
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Species Name
              </label>

              <input
                type="text"
                value={form.name}
                onChange={(event) =>
                  handleNameChange(event.target.value)
                }
                placeholder="e.g. Bengal Tiger"
                required
                className="w-full border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-white/40"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Slug
              </label>

              <input
                type="text"
                value={form.slug}
                onChange={(event) =>
                  updateField(
                    "slug",
                    createSlug(event.target.value)
                  )
                }
                placeholder="bengal-tiger"
                required
                className="w-full border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-white/40"
              />
            </div>

            {/* Category */}
<div>
  <label className="mb-2 block text-sm text-gray-400">
    Category
  </label>

  <select
    value={form.category}
    onChange={(event) =>
      updateField("category", event.target.value)
    }
    required
    className="w-full border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-white/40"
  >
    <option value="" disabled>
      Select Category
    </option>

    <option value="Animals">
      Animals
    </option>

    <option value="Birds">
      Birds
    </option>

    <option value="Snakes">
      Snakes
    </option>

    <option value="Reptiles">
      Reptiles
    </option>

    <option value="Insects">
      Insects
    </option>

    <option value="Fish">
      Fish
    </option>

    <option value="Other">
      Other
    </option>
  </select>
</div>

            {/* Location */}
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Location
              </label>

              <input
                type="text"
                value={form.location}
                onChange={(event) =>
                  updateField(
                    "location",
                    event.target.value
                  )
                }
                placeholder="Nepanagar Forest"
                required
                className="w-full border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-white/40"
              />
            </div>

            {/* Summary */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-gray-400">
                Summary
              </label>

              <textarea
                value={form.summary}
                onChange={(event) =>
                  updateField(
                    "summary",
                    event.target.value
                  )
                }
                placeholder="Short description of the species..."
                required
                rows={5}
                className="w-full resize-none border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-white/40"
              />
            </div>

            {/* Image */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-gray-400">
                Featured Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="block w-full cursor-pointer border border-white/10 bg-black px-4 py-3 text-sm text-gray-400 file:mr-4 file:border-0 file:bg-white file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:text-black"
              />

              {uploading && (
                <p className="mt-3 text-xs text-gray-500">
                  Uploading image...
                </p>
              )}

              {form.featuredImage && (
                <div className="mt-5 flex items-start gap-5">
                  <img
                    src={form.featuredImage}
                    alt={form.name || "Species"}
                    className="h-32 w-48 object-cover"
                  />

                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-600">
                      Image Path
                    </p>

                    <p className="mt-2 break-all text-xs text-gray-500">
                      {form.featuredImage}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Status
              </label>

              <select
                value={form.status}
                onChange={(event) =>
                  updateField(
                    "status",
                    event.target.value
                  )
                }
                className="w-full border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/40"
              >
                <option value="draft">
                  Draft
                </option>

                <option value="published">
                  Published
                </option>
              </select>
            </div>

            {/* Featured */}
            <div className="flex items-center">
              <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-400">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(event) =>
                    updateField(
                      "isFeatured",
                      event.target.checked
                    )
                  }
                  className="h-4 w-4"
                />

                Mark as featured
              </label>
            </div>

            {/* Submit */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={saving || uploading}
                className="w-full bg-white px-6 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Species"
                    : "Add Species"}
              </button>
            </div>

          </form>
        </section>

        {/* Species List */}
        <section>

          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-600">
                Database
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                Species Records
              </h2>
            </div>

            <button
              type="button"
              onClick={loadSpecies}
              className="border border-white/10 px-4 py-2 text-xs uppercase tracking-wider text-gray-400 transition hover:border-white/30 hover:text-white"
            >
              Refresh
            </button>
          </div>

          {loading && (
            <p className="text-gray-500">
              Loading species...
            </p>
          )}

          {!loading && species.length === 0 && (
            <div className="border border-white/10 bg-neutral-950 p-8">
              <p className="text-gray-400">
                No published species records found.
              </p>
            </div>
          )}

          {!loading && species.length > 0 && (
            <div className="space-y-4">
              {species.map((item) => (
                <div
                  key={item.id}
                  className="border border-white/10 bg-neutral-950 p-6"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                    <div className="flex flex-col gap-5 sm:flex-row">

                      {/* Image */}
                      <div className="h-32 w-48 shrink-0 overflow-hidden bg-black">
                        <img
                          src={item.featuredImage}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Information */}
                      <div>
                        <h3 className="text-xl font-semibold">
                          {item.name}
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                          {item.category} · {item.location}
                        </p>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
                          {item.summary}
                        </p>

                        <p className="mt-3 text-xs text-gray-700">
                          /{item.slug}
                        </p>
                      </div>

                    </div>

                    {/* Controls */}
                    <div className="flex flex-wrap items-center gap-3 lg:justify-end">

                      <span className="border border-white/10 px-3 py-2 text-xs uppercase tracking-wider text-gray-400">
                        {item.status}
                      </span>

                      {item.isFeatured && (
                        <span className="border border-white/10 px-3 py-2 text-xs uppercase tracking-wider text-white">
                          Featured
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-white hover:text-black"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            item.id,
                            item.name
                          )
                        }
                        className="border border-red-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-red-400 transition hover:bg-red-500 hover:text-white"
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

        </section>

      </div>
    </main>
  );
}
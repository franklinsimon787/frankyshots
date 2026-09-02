"use client";

import { useEffect, useState } from "react";

type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  year: number;
  image: string;
  isFeatured: boolean;

  imdbUrl?: string | null;
  genre?: string | null;
  country?: string | null;
  languages?: string | null;
  releaseDate?: string | null;
  production?: string | null;
  director?: string | null;
  writer?: string | null;
  producer?: string | null;
  cinematography?: string | null;
  presenter?: string | null;
  trailerUrl?: string | null;

  createdAt: string;
};

type ProjectForm = {
  title: string;
  category: string;
  description: string;
  year: string;
  image: string;
  isFeatured: boolean;

  imdbUrl: string;
  genre: string;
  country: string;
  languages: string;
  releaseDate: string;
  production: string;
  director: string;
  writer: string;
  producer: string;
  cinematography: string;
  presenter: string;
  trailerUrl: string;
};

const emptyForm: ProjectForm = {
  title: "",
  category: "",
  description: "",
  year: "",
  image: "",
  isFeatured: false,

  imdbUrl: "",
  genre: "NA",
  country: "NA",
  languages: "NA",
  releaseDate: "NA",
  production: "NA",
  director: "NA",
  writer: "NA",
  producer: "NA",
  cinematography: "NA",
  presenter: "NA",
  trailerUrl: "",
};

const categories = [
  "Documentary",
  "Wildlife",
  "Photography",
  "Film",
  "Video",
  "Magazine",
  "Book",
  "Other",
];

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<ProjectForm>(emptyForm);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // --------------------------------------------------
  // LOAD PROJECTS
  // --------------------------------------------------

  async function loadProjects() {
    try {
      const response = await fetch("/api/projects", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to load projects."
        );
      }

      setProjects(data);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load projects."
      );
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  // --------------------------------------------------
  // FORM CHANGE
  // --------------------------------------------------

  function updateField(
    field: keyof ProjectForm,
    value: string | boolean
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
    setMessage("");
  }

  // --------------------------------------------------
  // IMAGE UPLOAD
  // --------------------------------------------------

  async function handleImageUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setUploading(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(
        "/api/species/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Image upload failed."
        );
      }

      const imagePath =
        data?.imagePath ||
        data?.url ||
        data?.path ||
        data?.image ||
        "";

      console.log(
        "PROJECT IMAGE UPLOAD RESPONSE:",
        data
      );

      if (!imagePath) {
        throw new Error(
          "Image upload API returned no usable image path."
        );
      }

      setForm((current) => ({
        ...current,
        image: imagePath,
      }));

      setMessage(
        "Project image uploaded successfully."
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Image upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  // --------------------------------------------------
  // RESET FORM
  // --------------------------------------------------

  function resetForm() {
    setForm({ ...emptyForm });
    setEditingId(null);
    setError("");
    setMessage("");
  }

  // --------------------------------------------------
  // EDIT
  // --------------------------------------------------

  function startEdit(project: Project) {
    setEditingId(project.id);

    setForm({
      title: project.title || "",
      category: project.category || "",
      description: project.description || "",
      year: project.year
        ? String(project.year)
        : "",
      image: project.image || "",
      isFeatured: Boolean(project.isFeatured),

      imdbUrl: project.imdbUrl || "",
      genre: project.genre || "NA",
      country: project.country || "NA",
      languages: project.languages || "NA",
      releaseDate:
        project.releaseDate || "NA",
      production:
        project.production || "NA",
      director:
        project.director || "NA",
      writer:
        project.writer || "NA",
      producer:
        project.producer || "NA",
      cinematography:
        project.cinematography || "NA",
      presenter:
        project.presenter || "NA",
      trailerUrl:
        project.trailerUrl || "",
    });

    setError("");
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      // ----------------------------------------------
      // BASIC VALIDATION
      // ----------------------------------------------

      if (!form.title.trim()) {
        throw new Error(
          "Please enter project title."
        );
      }

      if (!form.category.trim()) {
        throw new Error(
          "Please select a category."
        );
      }

      if (!form.description.trim()) {
        throw new Error(
          "Please enter project description."
        );
      }

      if (!form.year.trim()) {
        throw new Error(
          "Please enter project year."
        );
      }

      if (!form.image.trim()) {
        throw new Error(
          "Please upload project image."
        );
      }

      // ----------------------------------------------
      // PAYLOAD
      // ----------------------------------------------

      const payload = {
        id: editingId || undefined,

        title: form.title.trim(),

        category: form.category.trim(),

        description:
          form.description.trim(),

        year: Number(form.year),

        image: form.image.trim(),

        isFeatured:
          form.isFeatured,

        // --------------------------------------------
        // DOCUMENTARY / IMDb INFORMATION
        // --------------------------------------------

        imdbUrl:
          form.imdbUrl.trim() || null,

        genre:
          form.category === "Documentary"
            ? form.genre.trim() || "NA"
            : null,

        country:
          form.category === "Documentary"
            ? form.country.trim() || "NA"
            : null,

        languages:
          form.category === "Documentary"
            ? form.languages.trim() || "NA"
            : null,

        releaseDate:
          form.category === "Documentary"
            ? form.releaseDate.trim() || "NA"
            : null,

        production:
          form.category === "Documentary"
            ? form.production.trim() || "NA"
            : null,

        director:
          form.category === "Documentary"
            ? form.director.trim() || "NA"
            : null,

        writer:
          form.category === "Documentary"
            ? form.writer.trim() || "NA"
            : null,

        producer:
          form.category === "Documentary"
            ? form.producer.trim() || "NA"
            : null,

        cinematography:
          form.category === "Documentary"
            ? form.cinematography.trim() || "NA"
            : null,

        presenter:
          form.category === "Documentary"
            ? form.presenter.trim() || "NA"
            : null,

        trailerUrl:
          form.category === "Documentary"
            ? form.trailerUrl.trim() || null
            : null,
      };

      // ----------------------------------------------
      // SAVE / UPDATE
      // ----------------------------------------------

      const response = await fetch(
        "/api/projects",
        {
          method: editingId
            ? "PUT"
            : "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to save project."
        );
      }

      setMessage(
        editingId
          ? "Project updated successfully."
          : "Project added successfully."
      );

      resetForm();

      await loadProjects();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save project."
      );
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  async function deleteProject(id: string) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this project?"
      );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const response = await fetch(
        "/api/projects",
        {
          method: "DELETE",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to delete project."
        );
      }

      setMessage(
        "Project deleted successfully."
      );

      await loadProjects();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete project."
      );
    }
  }

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-10 text-white md:px-10">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.35em] text-gray-500">
            Admin Panel
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            {editingId
              ? "Edit Project"
              : "Add Project"}
          </h1>

          <p className="mt-3 max-w-2xl text-gray-500">
            Add and manage projects, films,
            documentaries and other production
            work.
          </p>
        </div>

        {/* MESSAGE */}

        {message && (
          <div className="mb-6 border border-white/10 bg-white/5 px-5 py-4 text-sm text-gray-200">
            {message}
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="mb-6 border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="border border-white/10 bg-neutral-900 p-6 md:p-8"
        >
          <div className="grid gap-8 md:grid-cols-2">

            {/* TITLE */}

            <div className="md:col-span-2">
              <label className="text-xs uppercase tracking-[0.25em] text-gray-500">
                Project Title
              </label>

              <input
                type="text"
                value={form.title}
                onChange={(event) =>
                  updateField(
                    "title",
                    event.target.value
                  )
                }
                placeholder="Project title"
                className="mt-3 w-full border border-white/10 bg-neutral-950 px-4 py-3 text-white outline-none transition focus:border-white/40"
              />
            </div>

            {/* CATEGORY */}

            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-gray-500">
                Category
              </label>

              <select
                value={form.category}
                onChange={(event) =>
                  updateField(
                    "category",
                    event.target.value
                  )
                }
                className="mt-3 w-full border border-white/10 bg-neutral-950 px-4 py-3 text-white outline-none transition focus:border-white/40"
              >
                <option value="">
                  Select Category
                </option>

                {categories.map(
                  (category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* YEAR */}

            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-gray-500">
                Year
              </label>

              <input
                type="number"
                value={form.year}
                onChange={(event) =>
                  updateField(
                    "year",
                    event.target.value
                  )
                }
                placeholder="2026"
                className="mt-3 w-full border border-white/10 bg-neutral-950 px-4 py-3 text-white outline-none transition focus:border-white/40"
              />
            </div>

            {/* DESCRIPTION */}

            <div className="md:col-span-2">
              <label className="text-xs uppercase tracking-[0.25em] text-gray-500">
                Description
              </label>

              <textarea
                value={form.description}
                onChange={(event) =>
                  updateField(
                    "description",
                    event.target.value
                  )
                }
                rows={6}
                placeholder="Project description"
                className="mt-3 w-full resize-y border border-white/10 bg-neutral-950 px-4 py-3 text-white outline-none transition focus:border-white/40"
              />
            </div>

            {/* IMAGE */}

            <div className="md:col-span-2">
              <label className="text-xs uppercase tracking-[0.25em] text-gray-500">
                Project Image
              </label>

              <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-center">

                <label className="inline-flex cursor-pointer items-center justify-center border border-white/20 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-gray-200">
                  {uploading
                    ? "Uploading..."
                    : "Choose Image"}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={
                      handleImageUpload
                    }
                    className="hidden"
                    disabled={uploading}
                  />
                </label>

                {form.image && (
                  <p className="break-all text-sm text-gray-500">
                    {form.image}
                  </p>
                )}
              </div>

              {form.image && (
                <div className="mt-5 overflow-hidden border border-white/10 bg-black">
                  <img
                    src={form.image}
                    alt="Project preview"
                    className="max-h-80 w-full object-contain"
                  />
                </div>
              )}
            </div>

            {/* ======================================
                DOCUMENTARY SECTION
            ====================================== */}

            {form.category ===
              "Documentary" && (
              <div className="md:col-span-2 border-t border-white/10 pt-8">

                <div className="mb-8">
                  <p className="text-xs uppercase tracking-[0.35em] text-gray-500">
                    Documentary
                  </p>

                  <h2 className="mt-3 text-2xl font-bold">
                    Documentary Information
                  </h2>

                  <p className="mt-2 text-sm leading-7 text-gray-500">
                    Enter the documentary
                    information manually. IMDb
                    details are not fetched
                    automatically.
                  </p>
                </div>

                {/* IMDb URL */}

                <div>
                  <label className="text-xs uppercase tracking-[0.25em] text-gray-500">
                    IMDb URL
                  </label>

                  <input
                    type="url"
                    value={form.imdbUrl}
                    onChange={(event) =>
                      updateField(
                        "imdbUrl",
                        event.target.value
                      )
                    }
                    placeholder="https://www.imdb.com/title/..."
                    className="mt-3 w-full border border-white/10 bg-neutral-950 px-4 py-3 text-white outline-none transition focus:border-white/40"
                  />

                  <p className="mt-2 text-xs text-gray-600">
                    Optional. Paste the IMDb
                    page link manually if the
                    documentary has one.
                  </p>
                </div>

                {/* DOCUMENTARY DETAILS */}

                <div className="mt-8 grid gap-6 md:grid-cols-2">

                  {/* GENRE */}

                  <div>
                    <label className="text-xs uppercase tracking-[0.2em] text-gray-500">
                      Genre
                    </label>

                    <input
                      type="text"
                      value={form.genre}
                      onChange={(event) =>
                        updateField(
                          "genre",
                          event.target.value
                        )
                      }
                      placeholder="NA"
                      className="mt-2 w-full border border-white/10 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-white/40"
                    />
                  </div>

                  {/* COUNTRY */}

                  <div>
                    <label className="text-xs uppercase tracking-[0.2em] text-gray-500">
                      Country
                    </label>

                    <input
                      type="text"
                      value={form.country}
                      onChange={(event) =>
                        updateField(
                          "country",
                          event.target.value
                        )
                      }
                      placeholder="NA"
                      className="mt-2 w-full border border-white/10 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-white/40"
                    />
                  </div>

                  {/* LANGUAGES */}

                  <div>
                    <label className="text-xs uppercase tracking-[0.2em] text-gray-500">
                      Languages
                    </label>

                    <input
                      type="text"
                      value={form.languages}
                      onChange={(event) =>
                        updateField(
                          "languages",
                          event.target.value
                        )
                      }
                      placeholder="NA"
                      className="mt-2 w-full border border-white/10 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-white/40"
                    />
                  </div>

                  {/* RELEASE DATE */}

                  <div>
                    <label className="text-xs uppercase tracking-[0.2em] text-gray-500">
                      Release Date
                    </label>

                    <input
                      type="text"
                      value={form.releaseDate}
                      onChange={(event) =>
                        updateField(
                          "releaseDate",
                          event.target.value
                        )
                      }
                      placeholder="NA"
                      className="mt-2 w-full border border-white/10 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-white/40"
                    />
                  </div>

                  {/* PRODUCTION */}

                  <div>
                    <label className="text-xs uppercase tracking-[0.2em] text-gray-500">
                      Production
                    </label>

                    <input
                      type="text"
                      value={form.production}
                      onChange={(event) =>
                        updateField(
                          "production",
                          event.target.value
                        )
                      }
                      placeholder="NA"
                      className="mt-2 w-full border border-white/10 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-white/40"
                    />
                  </div>

                  {/* DIRECTOR */}

                  <div>
                    <label className="text-xs uppercase tracking-[0.2em] text-gray-500">
                      Director
                    </label>

                    <input
                      type="text"
                      value={form.director}
                      onChange={(event) =>
                        updateField(
                          "director",
                          event.target.value
                        )
                      }
                      placeholder="NA"
                      className="mt-2 w-full border border-white/10 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-white/40"
                    />
                  </div>

                  {/* WRITER */}

                  <div>
                    <label className="text-xs uppercase tracking-[0.2em] text-gray-500">
                      Writer
                    </label>

                    <input
                      type="text"
                      value={form.writer}
                      onChange={(event) =>
                        updateField(
                          "writer",
                          event.target.value
                        )
                      }
                      placeholder="NA"
                      className="mt-2 w-full border border-white/10 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-white/40"
                    />
                  </div>

                  {/* PRODUCER */}

                  <div>
                    <label className="text-xs uppercase tracking-[0.2em] text-gray-500">
                      Producer
                    </label>

                    <input
                      type="text"
                      value={form.producer}
                      onChange={(event) =>
                        updateField(
                          "producer",
                          event.target.value
                        )
                      }
                      placeholder="NA"
                      className="mt-2 w-full border border-white/10 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-white/40"
                    />
                  </div>

                  {/* CINEMATOGRAPHY */}

                  <div>
                    <label className="text-xs uppercase tracking-[0.2em] text-gray-500">
                      Cinematography
                    </label>

                    <input
                      type="text"
                      value={form.cinematography}
                      onChange={(event) =>
                        updateField(
                          "cinematography",
                          event.target.value
                        )
                      }
                      placeholder="NA"
                      className="mt-2 w-full border border-white/10 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-white/40"
                    />
                  </div>

                  {/* PRESENTER */}

                  <div>
                    <label className="text-xs uppercase tracking-[0.2em] text-gray-500">
                      Presenter
                    </label>

                    <input
                      type="text"
                      value={form.presenter}
                      onChange={(event) =>
                        updateField(
                          "presenter",
                          event.target.value
                        )
                      }
                      placeholder="NA"
                      className="mt-2 w-full border border-white/10 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-white/40"
                    />
                  </div>

                  {/* TRAILER URL */}

                  <div className="md:col-span-2">
                    <label className="text-xs uppercase tracking-[0.2em] text-gray-500">
                      Trailer URL
                    </label>

                    <input
                      type="url"
                      value={form.trailerUrl}
                      onChange={(event) =>
                        updateField(
                          "trailerUrl",
                          event.target.value
                        )
                      }
                      placeholder="https://youtube.com/..."
                      className="mt-2 w-full border border-white/10 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-white/40"
                    />
                  </div>

                </div>
              </div>
            )}

            {/* FEATURED */}

            <div className="md:col-span-2">
              <label className="flex cursor-pointer items-center gap-3">

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

                <span className="text-sm text-gray-300">
                  Show as featured project
                </span>

              </label>
            </div>

          </div>

          {/* BUTTONS */}

          <div className="mt-10 flex flex-wrap gap-4">

            <button
              type="submit"
              disabled={
                loading || uploading
              }
              className="border border-white bg-white px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : editingId
                ? "Update Project"
                : "Add Project"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="border border-white/20 px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:border-white"
              >
                Cancel Edit
              </button>
            )}

          </div>
        </form>

        {/* ======================================
            PROJECT LIST
        ====================================== */}

        <section className="mt-16">

          <div className="mb-7">
            <p className="text-xs uppercase tracking-[0.35em] text-gray-500">
              Database
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Existing Projects
            </h2>
          </div>

          {projects.length === 0 ? (

            <div className="border border-white/10 bg-neutral-900 px-6 py-10 text-center text-gray-500">
              No projects found.
            </div>

          ) : (

            <div className="grid gap-5">

              {projects.map(
                (project) => (

                  <div
                    key={project.id}
                    className="border border-white/10 bg-neutral-900 p-5"
                  >

                    <div className="flex flex-col gap-6 md:flex-row">

                      {/* IMAGE */}

                      <div className="h-32 w-full shrink-0 overflow-hidden bg-black md:w-52">

                        {project.image ? (

                          <img
                            src={project.image}
                            alt={project.title}
                            className="h-full w-full object-cover"
                          />

                        ) : (

                          <div className="flex h-full items-center justify-center text-xs text-gray-600">
                            No Image
                          </div>

                        )}

                      </div>

                      {/* INFO */}

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-3">

                          <h3 className="text-xl font-semibold">
                            {project.title}
                          </h3>

                          <span className="border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-gray-500">
                            {project.category}
                          </span>

                          {project.isFeatured && (
                            <span className="border border-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white">
                              Featured
                            </span>
                          )}

                        </div>

                        <p className="mt-2 text-sm text-gray-600">
                          {project.year}
                        </p>

                        <p className="mt-4 line-clamp-3 text-sm leading-7 text-gray-500">
                          {project.description}
                        </p>

                        {project.category ===
                          "Documentary" &&
                          project.imdbUrl && (
                            <p className="mt-3 break-all text-xs text-gray-600">
                              IMDb:{" "}
                              {project.imdbUrl}
                            </p>
                          )}

                        <div className="mt-5 flex flex-wrap gap-3">

                          <button
                            type="button"
                            onClick={() =>
                              startEdit(
                                project
                              )
                            }
                            className="border border-white/20 px-5 py-2.5 text-xs uppercase tracking-[0.15em] transition hover:border-white"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteProject(
                                project.id
                              )
                            }
                            className="border border-red-500/30 px-5 py-2.5 text-xs uppercase tracking-[0.15em] text-red-300 transition hover:border-red-400"
                          >
                            Delete
                          </button>

                        </div>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </div>
    </main>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";

type VickVersePost = {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  image: string;
  youtubeUrl: string | null;
  category: string | null;
  tags: string | null;
  isFeatured: boolean;
  status: string;
  createdAt: string;
};

type PostForm = {
  title: string;
  slug: string;
  description: string;
  content: string;
  image: string;
  youtubeUrl: string;
  category: string;
  tags: string;
  isFeatured: boolean;
  status: string;
};

const emptyForm: PostForm = {
  title: "",
  slug: "",
  description: "",
  content: "",
  image: "",
  youtubeUrl: "",
  category: "",
  tags: "",
  isFeatured: false,
  status: "published",
};

function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function VickVersePostsPage() {
  const [posts, setPosts] = useState<VickVersePost[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState<PostForm>(emptyForm);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ======================================================
  // LOAD POSTS
  // ======================================================

  async function loadPosts() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/admin/api/vickverse", {
        cache: "no-store",
      });

      const text = await response.text();

      let data: any = {};

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(
            `Server returned invalid JSON (${response.status}).`
          );
        }
      }

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to load VickVerse posts."
        );
      }

      setPosts(data.posts ?? []);
    } catch (error) {
      console.error("LOAD POSTS ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load VickVerse posts."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  // ======================================================
  // IMAGE UPLOAD
  // ======================================================

  async function handleImageUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      if (!file.type.startsWith("image/")) {
        throw new Error("Please select an image file.");
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error("Image size must be less than 10 MB.");
      }

      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch("/api/vickverse/upload", {
        method: "POST",
        body: formData,
      });

      const text = await response.text();

      let data: any = {};

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(
            `Upload server returned invalid JSON (${response.status}).`
          );
        }
      }

      if (!response.ok) {
        throw new Error(
          data?.error || "Image upload failed."
        );
      }

      if (!data.url) {
        throw new Error(
          "Image uploaded but server did not return an image URL."
        );
      }

      setForm((current) => ({
        ...current,
        image: data.url,
      }));

      setSuccess("Image uploaded successfully.");
    } catch (error) {
      console.error("IMAGE UPLOAD ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Image upload failed."
      );
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  // ======================================================
  // CREATE POST
  // ======================================================

  async function handleCreatePost() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!form.title.trim()) {
        throw new Error("Title is required.");
      }

      if (!form.description.trim()) {
        throw new Error("Description is required.");
      }

      if (!form.content.trim()) {
        throw new Error("Content is required.");
      }

      if (!form.image.trim()) {
        throw new Error("Please upload a featured image.");
      }

      const postData = {
        title: form.title.trim(),

        slug: form.slug.trim()
          ? form.slug.trim()
          : form.title.trim(),

        description: form.description.trim(),

        content: form.content.trim(),

        image: form.image.trim(),

        youtubeUrl: form.youtubeUrl.trim()
          ? form.youtubeUrl.trim()
          : null,

        category: form.category.trim()
          ? form.category.trim()
          : null,

        tags: form.tags.trim()
          ? form.tags.trim()
          : null,

        isFeatured: Boolean(form.isFeatured),

        status: form.status || "published",
      };

      console.log("CREATING VICKVERSE POST:", postData);

      const response = await fetch("/api/vickverse", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(postData),
      });

      const text = await response.text();

      console.log(
        "VICKVERSE CREATE STATUS:",
        response.status
      );

      console.log(
        "VICKVERSE CREATE RESPONSE:",
        text
      );

      let data: any = {};

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(
            `Server returned invalid JSON (${response.status}).`
          );
        }
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            `Failed to create post. Server returned ${response.status}.`
        );
      }

      setForm(emptyForm);
      setShowForm(false);
      setEditingId(null);

      setSuccess("VickVerse post created successfully.");

      await loadPosts();
    } catch (error) {
      console.error("CREATE POST ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create VickVerse post."
      );
    } finally {
      setSaving(false);
    }
  }

  // ======================================================
  // UPDATE POST
  // ======================================================

  async function handleUpdatePost() {
    if (!editingId) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!form.title.trim()) {
        throw new Error("Title is required.");
      }

      if (!form.description.trim()) {
        throw new Error("Description is required.");
      }

      if (!form.content.trim()) {
        throw new Error("Content is required.");
      }

      if (!form.image.trim()) {
        throw new Error("Please upload a featured image.");
      }

      const updateData = {
        id: editingId,

        title: form.title.trim(),

        slug: form.slug.trim()
          ? form.slug.trim()
          : form.title.trim(),

        description: form.description.trim(),

        content: form.content.trim(),

        image: form.image.trim(),

        youtubeUrl: form.youtubeUrl.trim()
          ? form.youtubeUrl.trim()
          : null,

        category: form.category.trim()
          ? form.category.trim()
          : null,

        tags: form.tags.trim()
          ? form.tags.trim()
          : null,

        isFeatured: Boolean(form.isFeatured),

        status: form.status || "published",
      };

      const response = await fetch("/api/vickverse", {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(updateData),
      });

      const text = await response.text();

      let data: any = {};

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(
            `Server returned invalid JSON (${response.status}).`
          );
        }
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            `Failed to update post. Server returned ${response.status}.`
        );
      }

      setForm(emptyForm);
      setShowForm(false);
      setEditingId(null);

      setSuccess("VickVerse post updated successfully.");

      await loadPosts();
    } catch (error) {
      console.error("UPDATE POST ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update VickVerse post."
      );
    } finally {
      setSaving(false);
    }
  }

  // ======================================================
  // DELETE POST
  // ======================================================

  async function deletePost(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this VickVerse post?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/vickverse?id=${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        }
      );

      const text = await response.text();

      let data: any = {};

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(
            `Server returned invalid JSON (${response.status}).`
          );
        }
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            `Failed to delete post. Server returned ${response.status}.`
        );
      }

      setSuccess("VickVerse post deleted successfully.");

      await loadPosts();
    } catch (error) {
      console.error("DELETE POST ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete VickVerse post."
      );
    }
  }

  // ======================================================
  // OPEN EDIT
  // ======================================================

  function startEditing(post: VickVersePost) {
    setError("");
    setSuccess("");

    setEditingId(post.id);

    setForm({
      title: post.title || "",
      slug: post.slug || "",
      description: post.description || "",
      content: post.content || "",
      image: post.image || "",
      youtubeUrl: post.youtubeUrl || "",
      category: post.category || "",
      tags: post.tags || "",
      isFeatured: Boolean(post.isFeatured),
      status: post.status || "published",
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ======================================================
  // NEW POST
  // ======================================================

  function startNewPost() {
    setError("");
    setSuccess("");
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ======================================================
  // CANCEL FORM
  // ======================================================

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "#fff",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
            gap: "20px",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "12px",
                letterSpacing: "4px",
                color: "#777",
                marginBottom: "10px",
              }}
            >
              VICKVERSE
            </p>

            <h1
              style={{
                fontSize: "42px",
                margin: 0,
              }}
            >
              Posts
            </h1>

            <p
              style={{
                color: "#888",
                marginTop: "10px",
              }}
            >
              Create, edit and manage VickVerse content.
            </p>
          </div>

          <button
            onClick={loadPosts}
            style={secondaryButtonStyle}
          >
            Refresh
          </button>
        </div>

        {/* ERROR */}

        {error && (
          <div
            style={{
              padding: "18px 20px",
              marginBottom: "20px",
              border: "1px solid #522",
              borderRadius: "10px",
              color: "#ff7777",
              background: "#0b0505",
            }}
          >
            {error}
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div
            style={{
              padding: "18px 20px",
              marginBottom: "20px",
              border: "1px solid #264d35",
              borderRadius: "10px",
              color: "#8ee0a8",
              background: "#07100a",
            }}
          >
            {success}
          </div>
        )}

        {/* CREATE / EDIT FORM */}

        {showForm && (
          <section
            style={{
              border: "1px solid #222",
              borderRadius: "12px",
              padding: "30px",
              background: "#090909",
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "30px",
                gap: "20px",
              }}
            >
              <div>
                <p
                  style={{
                    color: "#777",
                    fontSize: "11px",
                    letterSpacing: "3px",
                    marginBottom: "8px",
                  }}
                >
                  VICKVERSE
                </p>

                <h2
                  style={{
                    fontSize: "28px",
                    margin: 0,
                  }}
                >
                  {editingId
                    ? "Edit Post"
                    : "Create New Post"}
                </h2>

                <p
                  style={{
                    color: "#888",
                    marginTop: "8px",
                  }}
                >
                  {editingId
                    ? "Update this VickVerse post."
                    : "Add a new story, article or video."}
                </p>
              </div>

              <button
                type="button"
                onClick={cancelForm}
                style={secondaryButtonStyle}
              >
                Cancel
              </button>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();

                if (editingId) {
                  handleUpdatePost();
                } else {
                  handleCreatePost();
                }
              }}
            >
              {/* TITLE */}

              <label style={labelStyle}>
                Title
              </label>

              <input
                value={form.title}
                onChange={(event) => {
                  const title = event.target.value;

                  setForm((current) => ({
                    ...current,
                    title,

                    ...(current.slug
                      ? {}
                      : {
                          slug: createSlug(title),
                        }),
                  }));
                }}
                placeholder="Post title"
                style={inputStyle}
              />

              {/* SLUG */}

              <label style={labelStyle}>
                Slug
              </label>

              <input
                value={form.slug}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    slug: createSlug(event.target.value),
                  }))
                }
                placeholder="post-slug"
                style={inputStyle}
              />

              <p
                style={{
                  color: "#666",
                  fontSize: "12px",
                  marginTop: "-12px",
                  marginBottom: "20px",
                }}
              >
                URL mein use hoga. Example:
                /vickverse/my-story
              </p>

              {/* DESCRIPTION */}

              <label style={labelStyle}>
                Description
              </label>

              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="Short description"
                rows={4}
                style={textareaStyle}
              />

              {/* CONTENT */}

              <label style={labelStyle}>
                Content
              </label>

              <textarea
                value={form.content}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    content: event.target.value,
                  }))
                }
                placeholder="Write the complete article/story here..."
                rows={12}
                style={textareaStyle}
              />

              {/* IMAGE */}

              <label style={labelStyle}>
                Featured Image
              </label>

              <div
                style={{
                  border: "1px dashed #444",
                  borderRadius: "10px",
                  padding: "20px",
                  marginBottom: "20px",
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{
                    display: "none",
                  }}
                />

                <button
                  type="button"
                  disabled={uploading}
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  style={{
                    background: "#fff",
                    color: "#000",
                    border: "none",
                    borderRadius: "8px",
                    padding: "12px 20px",
                    cursor: uploading
                      ? "not-allowed"
                      : "pointer",
                    fontWeight: 600,
                    opacity: uploading ? 0.6 : 1,
                  }}
                >
                  {uploading
                    ? "Uploading..."
                    : "Choose Image"}
                </button>

                {form.image && (
                  <div
                    style={{
                      marginTop: "20px",
                    }}
                  >
                    <img
                      src={form.image}
                      alt="Featured preview"
                      style={{
                        width: "280px",
                        height: "170px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid #333",
                        display: "block",
                        marginBottom: "10px",
                      }}
                    />

                    <div
                      style={{
                        color: "#666",
                        fontSize: "12px",
                        wordBreak: "break-all",
                      }}
                    >
                      {form.image}
                    </div>
                  </div>
                )}
              </div>

              {/* YOUTUBE */}

              <label style={labelStyle}>
                YouTube URL
              </label>

              <input
                value={form.youtubeUrl}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    youtubeUrl: event.target.value,
                  }))
                }
                placeholder="https://youtube.com/..."
                style={inputStyle}
              />

              {/* CATEGORY */}

              <label style={labelStyle}>
                Category
              </label>

              <input
                value={form.category}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    category: event.target.value,
                  }))
                }
                placeholder="Stories / Behind the Scenes / Documentary..."
                style={inputStyle}
              />

              {/* TAGS */}

              <label style={labelStyle}>
                Tags
              </label>

              <input
                value={form.tags}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    tags: event.target.value,
                  }))
                }
                placeholder="vickverse, stories, filmmaking"
                style={inputStyle}
              />

              {/* STATUS + FEATURED */}

              <div
                style={{
                  display: "flex",
                  gap: "30px",
                  alignItems: "center",
                  marginTop: "20px",
                  marginBottom: "30px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <label style={labelStyle}>
                    Status
                  </label>

                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        status: event.target.value,
                      }))
                    }
                    style={{
                      ...inputStyle,
                      width: "220px",
                      marginBottom: 0,
                    }}
                  >
                    <option value="published">
                      Published
                    </option>

                    <option value="draft">
                      Draft
                    </option>
                  </select>
                </div>

                <label
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    cursor: "pointer",
                    marginTop: "28px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        isFeatured:
                          event.target.checked,
                      }))
                    }
                  />

                  Featured Post
                </label>
              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={saving || uploading}
                style={{
                  background: "#fff",
                  color: "#000",
                  border: "none",
                  borderRadius: "8px",
                  padding: "14px 24px",
                  cursor:
                    saving || uploading
                      ? "not-allowed"
                      : "pointer",
                  fontWeight: 700,
                  opacity:
                    saving || uploading ? 0.6 : 1,
                }}
              >
                {saving
                  ? editingId
                    ? "Updating Post..."
                    : "Creating Post..."
                  : editingId
                    ? "Update VickVerse Post"
                    : "Create VickVerse Post"}
              </button>
            </form>
          </section>
        )}

        {/* POSTS HEADER */}

        {!showForm && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                margin: 0,
              }}
            >
              Posts ({posts.length})
            </h2>

            <button
              onClick={startNewPost}
              style={{
                background: "transparent",
                color: "#fff",
                border: "1px solid #444",
                borderRadius: "8px",
                padding: "10px 16px",
                cursor: "pointer",
              }}
            >
              + New Post
            </button>
          </div>
        )}

        {/* LOADING */}

        {loading ? (
          <div
            style={{
              padding: "40px",
              border: "1px solid #222",
              borderRadius: "12px",
              color: "#999",
            }}
          >
            Loading VickVerse posts...
          </div>
        ) : posts.length === 0 ? (
          /* EMPTY */

          <div
            style={{
              padding: "60px 20px",
              textAlign: "center",
              border: "1px solid #222",
              borderRadius: "12px",
              color: "#888",
            }}
          >
            No VickVerse posts found.
          </div>
        ) : (
          /* POSTS */

          <div
            style={{
              display: "grid",
              gap: "16px",
            }}
          >
            {posts.map((post) => (
              <article
                key={post.id}
                style={{
                  border: "1px solid #222",
                  borderRadius: "12px",
                  padding: "20px",
                  background: "#0a0a0a",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                  }}
                >
                  {/* IMAGE */}

                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      style={{
                        width: "180px",
                        height: "110px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        flexShrink: 0,
                      }}
                    />
                  )}

                  {/* CONTENT */}

                  <div
                    style={{
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "20px",
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            margin: "0 0 8px",
                            fontSize: "22px",
                          }}
                        >
                          {post.title}
                        </h3>

                        <p
                          style={{
                            margin: "0 0 12px",
                            color: "#999",
                          }}
                        >
                          {post.description}
                        </p>

                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            flexWrap: "wrap",
                            fontSize: "12px",
                          }}
                        >
                          <span style={tagStyle}>
                            {post.status}
                          </span>

                          {post.category && (
                            <span style={tagStyle}>
                              {post.category}
                            </span>
                          )}

                          {post.isFeatured && (
                            <span style={tagStyle}>
                              Featured
                            </span>
                          )}
                        </div>
                      </div>

                      <div
                        style={{
                          color: "#666",
                          fontSize: "13px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        /{post.slug}
                      </div>
                    </div>

                    {/* ACTIONS */}

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "18px",
                      }}
                    >
                      <button
                        onClick={() =>
                          startEditing(post)
                        }
                        style={{
                          background: "transparent",
                          color: "#fff",
                          border: "1px solid #444",
                          borderRadius: "6px",
                          padding: "7px 14px",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          deletePost(post.id)
                        }
                        style={{
                          background: "transparent",
                          color: "#ff7777",
                          border: "1px solid #522",
                          borderRadius: "6px",
                          padding: "7px 14px",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

// ======================================================
// STYLES
// ======================================================

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  background: "#111",
  color: "#fff",
  border: "1px solid #333",
  borderRadius: "8px",
  padding: "14px",
  marginBottom: "20px",
  outline: "none",
};

const textareaStyle = {
  ...inputStyle,
  resize: "vertical" as const,
};

const labelStyle = {
  display: "block",
  color: "#aaa",
  marginBottom: "8px",
};

const tagStyle = {
  border: "1px solid #333",
  borderRadius: "20px",
  padding: "5px 10px",
};

const secondaryButtonStyle = {
  background: "transparent",
  color: "#fff",
  border: "1px solid #444",
  borderRadius: "8px",
  padding: "12px 20px",
  cursor: "pointer",
};
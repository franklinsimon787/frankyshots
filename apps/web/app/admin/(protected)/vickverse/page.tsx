"use client";

import { useEffect, useState } from "react";

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

export default function VickVerseDashboard() {
  const [posts, setPosts] = useState<VickVersePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ======================================================
  // LOAD ALL POSTS
  // ======================================================

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/admin/api/vickverse?limit=50&page=1",
        {
          cache: "no-store",
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
          data?.error || "Failed to load VickVerse dashboard."
        );
      }

      setPosts(data.posts ?? []);
    } catch (error) {
      console.error("VICKVERSE DASHBOARD ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  // ======================================================
  // STATISTICS
  // ======================================================

  const totalPosts = posts.length;

  const publishedPosts = posts.filter(
    (post) => post.status === "published"
  ).length;

  const draftPosts = posts.filter(
    (post) => post.status === "draft"
  ).length;

  const featuredPosts = posts.filter(
    (post) => post.isFeatured
  ).length;

  // ======================================================
  // RECENT POSTS
  // ======================================================

  const recentPosts = [...posts]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  // ======================================================
  // DASHBOARD
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
        {/* ==================================================
            HEADER
        ================================================== */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "12px",
                letterSpacing: "4px",
                color: "#777",
                margin: "0 0 10px",
              }}
            >
              SUPER ADMIN
            </p>

            <h1
              style={{
                fontSize: "42px",
                lineHeight: 1.1,
                margin: 0,
                fontWeight: 700,
              }}
            >
              VickVerse
            </h1>

            <p
              style={{
                color: "#888",
                marginTop: "12px",
                marginBottom: 0,
              }}
            >
              VickVerse content management dashboard.
            </p>
          </div>

          <button
            type="button"
            onClick={loadDashboard}
            disabled={loading}
            style={{
              background: "#fff",
              color: "#000",
              border: "none",
              borderRadius: "8px",
              padding: "12px 20px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 600,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div
            style={{
              padding: "18px 20px",
              marginBottom: "25px",
              border: "1px solid #522",
              borderRadius: "10px",
              background: "#0b0505",
              color: "#ff7777",
            }}
          >
            {error}
          </div>
        )}

        {/* ==================================================
            LOADING
        ================================================== */}

        {loading ? (
          <div
            style={{
              padding: "60px 20px",
              border: "1px solid #222",
              borderRadius: "12px",
              textAlign: "center",
              color: "#888",
            }}
          >
            Loading VickVerse dashboard...
          </div>
        ) : (
          <>
            {/* ==================================================
                STAT CARDS
            ================================================== */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
                marginBottom: "40px",
              }}
            >
              <StatCard
                title="Total Posts"
                value={totalPosts}
                description="All VickVerse posts"
              />

              <StatCard
                title="Published"
                value={publishedPosts}
                description="Live on VickVerse"
              />

              <StatCard
                title="Drafts"
                value={draftPosts}
                description="Waiting to be published"
              />

              <StatCard
                title="Featured"
                value={featuredPosts}
                description="Featured VickVerse posts"
              />
            </div>

            {/* ==================================================
                QUICK ACTIONS
            ================================================== */}

            <section
              style={{
                marginBottom: "40px",
              }}
            >
              <div
                style={{
                  marginBottom: "18px",
                }}
              >
                <h2
                  style={{
                    fontSize: "22px",
                    margin: 0,
                  }}
                >
                  Quick Actions
                </h2>

                <p
                  style={{
                    color: "#777",
                    marginTop: "8px",
                  }}
                >
                  Manage your VickVerse content.
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "14px",
                }}
              >
                {/* POSTS */}

                <a
                  href="/admin/vickverse/posts"
                  style={actionStyle}
                >
                  <strong>Manage Posts</strong>

                  <span>
                    Create, edit and delete VickVerse
                    posts.
                  </span>
                </a>

                {/* SETTINGS */}

                <a
                  href="/admin/vickverse/settings"
                  style={actionStyle}
                >
                  <strong>VickVerse Settings</strong>

                  <span>
                    Manage VickVerse configuration.
                  </span>
                </a>
              </div>
            </section>

            {/* ==================================================
                RECENT POSTS
            ================================================== */}

            <section>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "20px",
                  marginBottom: "18px",
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: "22px",
                      margin: 0,
                    }}
                  >
                    Recent Posts
                  </h2>

                  <p
                    style={{
                      color: "#777",
                      marginTop: "8px",
                      marginBottom: 0,
                    }}
                  >
                    Latest VickVerse content.
                  </p>
                </div>

                <a
                  href="/admin/vickverse/posts"
                  style={{
                    color: "#fff",
                    textDecoration: "none",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    padding: "10px 16px",
                    fontSize: "14px",
                  }}
                >
                  View All
                </a>
              </div>

              {recentPosts.length === 0 ? (
                <div
                  style={{
                    padding: "50px 20px",
                    border: "1px solid #222",
                    borderRadius: "12px",
                    textAlign: "center",
                    color: "#777",
                  }}
                >
                  No VickVerse posts yet.
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gap: "12px",
                  }}
                >
                  {recentPosts.map((post) => (
                    <div
                      key={post.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        padding: "16px",
                        border: "1px solid #222",
                        borderRadius: "10px",
                        background: "#0a0a0a",
                      }}
                    >
                      {/* IMAGE */}

                      {post.image ? (
                        <img
                          src={post.image}
                          alt={post.title}
                          style={{
                            width: "90px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "7px",
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "90px",
                            height: "60px",
                            borderRadius: "7px",
                            background: "#151515",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#555",
                            fontSize: "12px",
                            flexShrink: 0,
                          }}
                        >
                          No Image
                        </div>
                      )}

                      {/* CONTENT */}

                      <div
                        style={{
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <h3
                          style={{
                            fontSize: "17px",
                            margin: "0 0 6px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {post.title}
                        </h3>

                        <p
                          style={{
                            margin: 0,
                            color: "#777",
                            fontSize: "13px",
                          }}
                        >
                          {post.category ||
                            "Uncategorized"}
                        </p>
                      </div>

                      {/* STATUS */}

                      <span
                        style={{
                          border: "1px solid #333",
                          borderRadius: "20px",
                          padding: "5px 10px",
                          fontSize: "11px",
                          color:
                            post.status === "published"
                              ? "#aaa"
                              : "#777",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {post.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

// ======================================================
// STAT CARD
// ======================================================

function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: number;
  description: string;
}) {
  return (
    <div
      style={{
        border: "1px solid #222",
        borderRadius: "12px",
        padding: "24px",
        background: "#0a0a0a",
      }}
    >
      <p
        style={{
          color: "#777",
          fontSize: "13px",
          margin: "0 0 12px",
        }}
      >
        {title}
      </p>

      <div
        style={{
          fontSize: "38px",
          fontWeight: 700,
          lineHeight: 1,
          marginBottom: "12px",
        }}
      >
        {value}
      </div>

      <p
        style={{
          color: "#555",
          fontSize: "12px",
          margin: 0,
        }}
      >
        {description}
      </p>
    </div>
  );
}

// ======================================================
// QUICK ACTION STYLE
// ======================================================

const actionStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "8px",
  padding: "20px",
  border: "1px solid #222",
  borderRadius: "10px",
  background: "#0a0a0a",
  color: "#fff",
  textDecoration: "none",
};
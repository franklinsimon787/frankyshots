"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function VickVerseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [loggingOut, setLoggingOut] = useState(false);

  const isDashboard = pathname === "/admin/vickverse";
  const isPosts = pathname.startsWith("/admin/vickverse/posts");

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed.");
      }

      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("VICKVERSE LOGOUT ERROR:", error);
      setLoggingOut(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "#fff",
        display: "flex",
      }}
    >
      {/* SIDEBAR */}
      <aside
        style={{
          width: "250px",
          minHeight: "100vh",
          background: "#090909",
          borderRight: "1px solid #222",
          padding: "28px 18px",
          boxSizing: "border-box",
          position: "sticky",
          top: 0,
          alignSelf: "flex-start",
        }}
      >
        {/* BRAND */}
        <div
          style={{
            padding: "8px 12px 30px",
            borderBottom: "1px solid #222",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "4px",
              color: "#777",
              marginBottom: "8px",
            }}
          >
            FRANKYSHOTS
          </div>

          <div
            style={{
              fontSize: "24px",
              fontWeight: 700,
            }}
          >
            VickVerse
          </div>

          <div
            style={{
              fontSize: "12px",
              color: "#666",
              marginTop: "6px",
            }}
          >
            Admin Panel
          </div>
        </div>

        {/* NAVIGATION */}
        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          {/* DASHBOARD */}
          <Link
            href="/admin/vickverse"
            style={{
              display: "block",
              padding: "12px 14px",
              borderRadius: "8px",
              textDecoration: "none",
              color: isDashboard ? "#fff" : "#888",
              background: isDashboard ? "#181818" : "transparent",
              border: isDashboard
                ? "1px solid #292929"
                : "1px solid transparent",
              fontSize: "14px",
              fontWeight: isDashboard ? 600 : 400,
            }}
          >
            Dashboard
          </Link>

          {/* POSTS */}
          <Link
            href="/admin/vickverse/posts"
            style={{
              display: "block",
              padding: "12px 14px",
              borderRadius: "8px",
              textDecoration: "none",
              color: isPosts ? "#fff" : "#888",
              background: isPosts ? "#181818" : "transparent",
              border: isPosts
                ? "1px solid #292929"
                : "1px solid transparent",
              fontSize: "14px",
              fontWeight: isPosts ? 600 : 400,
            }}
          >
            Posts
          </Link>
        </nav>

        {/* BOTTOM */}
        <div
          style={{
            position: "absolute",
            bottom: "25px",
            left: "18px",
            right: "18px",
          }}
        >
          <div
            style={{
              borderTop: "1px solid #222",
              paddingTop: "18px",
            }}
          >
            {/* BACK */}
            <Link
              href="/admin"
              style={{
                display: "block",
                color: "#666",
                textDecoration: "none",
                fontSize: "13px",
                marginBottom: "14px",
              }}
            >
              ← Back to Super Admin
            </Link>

            {/* LOGOUT */}
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "7px",
                border: "1px solid #292929",
                background: "transparent",
                color: loggingOut ? "#555" : "#aaa",
                cursor: loggingOut ? "not-allowed" : "pointer",
                fontSize: "13px",
                textAlign: "left",
              }}
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <section
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
        {children}
      </section>
    </div>
  );
}
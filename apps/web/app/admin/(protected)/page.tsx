"use client";

import Link from "next/link";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Section = {
  title: string;
  description: string;
  href: Route;
  status: string;
};

const sections: Section[] = [
  {
    title: "Species",
    description: "Add, edit, publish and delete wildlife species.",
    href: "/admin/species",
    status: "Active",
  },
  {
    title: "Projects",
    description: "Manage documentaries, films and other creative projects.",
    href: "/admin/projects",
    status: "Coming Next",
  },
  {
    title: "Pages",
    description: "Create and manage custom website pages.",
    href: "/admin/pages",
    status: "Coming Next",
  },
  {
    title: "Media",
    description: "Manage images and other uploaded website assets.",
    href: "/admin/media",
    status: "Coming Next",
  },
];

export default function Home() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    try {
      setLoggingOut(true);

      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed.");
      }

      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
      setLoggingOut(false);
      alert("Unable to logout. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
              Frankyshots
            </p>

            <h1 className="mt-2 text-2xl font-semibold">
              Admin Control Center
            </h1>
          </div>

          <div className="flex items-center gap-6">
            {/* Admin Info */}
            <div className="text-right">
              <p className="text-xs text-gray-500">
                Control Panel
              </p>

              <p className="mt-1 text-sm text-gray-300">
                Super Admin
              </p>
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="border border-white/10 bg-neutral-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-300 transition hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loggingOut ? "Logging Out..." : "Logout"}
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        {/* Welcome */}
        <div className="mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
            Dashboard
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight">
            Manage your website
          </h2>

          <p className="mt-4 max-w-2xl text-gray-400">
            One control center for your wildlife work, documentaries,
            projects, custom pages and future tools.
          </p>
        </div>

        {/* Management Grid */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => {
            const active = section.status === "Active";

            return (
              <div
                key={section.title}
                className="group border border-white/10 bg-neutral-950 p-7 transition hover:border-white/25"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-semibold">
                    {section.title}
                  </h3>

                  <span
                    className={`shrink-0 border px-2 py-1 text-[10px] uppercase tracking-wider ${
                      active
                        ? "border-white/20 text-white"
                        : "border-white/10 text-gray-600"
                    }`}
                  >
                    {section.status}
                  </span>
                </div>

                <p className="mt-4 min-h-[48px] text-sm leading-6 text-gray-500">
                  {section.description}
                </p>

                {active ? (
                  <Link
                    href={section.href}
                    className="mt-7 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:text-gray-400"
                  >
                    Manage →
                  </Link>
                ) : (
                  <span className="mt-7 inline-block text-xs uppercase tracking-[0.2em] text-gray-700">
                    Not available yet
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Future Architecture */}
        <div className="mt-12 border border-white/10 bg-neutral-950 p-7">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-600">
            Future Ready
          </p>

          <h3 className="mt-3 text-2xl font-semibold">
            Your website can grow with you.
          </h3>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-500">
            This panel is being designed as a central content management
            system rather than a fixed wildlife website. New sections,
            projects, creative work, AI tools and other future activities
            can be added without rebuilding the entire website.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-6">
        <div className="mx-auto flex max-w-7xl justify-between text-xs text-gray-600">
          <span>Frankyshots Admin</span>
          <span>Super Admin Control</span>
        </div>
      </footer>
    </main>
  );
}
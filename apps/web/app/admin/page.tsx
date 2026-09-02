"use client";

import Link from "next/link";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Section = {
  title: string;
  description: string;
  href: Route;
  status: string;
};

type Visit = {
  createdAt: string;
  path: string;
};

const sections: Section[] = [
  {
    title: "Species",
    description: "Add, edit, publish and delete wildlife species.",
    href: "/admin/species",
    status: "Active",
  },
  {
    title: "VickVerse",
    description:
      "Create, edit, publish and manage VickVerse stories and posts.",
    href: "/admin/vickverse",
    status: "Active",
  },
  {
    title: "Projects",
    description:
      "Manage documentaries, films and other creative projects.",
    href: "/admin/projects",
    status: "Active",
  },
  {
    title: "Knowledge",
    description:
      "Create, edit, publish and manage wildlife, nature, history and informational knowledge posts.",
    href: "/admin/knowledge",
    status: "Active",
  },
  {
    title: "Pages",
    description:
      "Create and manage custom website pages such as About, Contact, Conservation and more.",
    href: "/admin/pages",
    status: "Active",
  },
];

export default function Home() {
  const router = useRouter();

  const [loggingOut, setLoggingOut] = useState(false);

  const [visits, setVisits] = useState<Visit[]>([]);
  const [visitsLoading, setVisitsLoading] = useState(true);
  const [visitsError, setVisitsError] = useState("");

  // =====================================================
  // LOAD VISITS
  // =====================================================

  useEffect(() => {
    async function loadVisits() {
      try {
        setVisitsLoading(true);
        setVisitsError("");

        const response = await fetch("/api/visits", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Visitor data load nahi ho paaya."
          );
        }

        setVisits(data.visits || []);
      } catch (error) {
        console.error("VISITOR DATA ERROR:", error);

        setVisitsError(
          error instanceof Error
            ? error.message
            : "Visitor data load nahi ho paaya."
        );
      } finally {
        setVisitsLoading(false);
      }
    }

    loadVisits();
  }, []);

  // =====================================================
  // VISITOR STATISTICS
  // =====================================================

  const visitorStats = useMemo(() => {
    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOf7Days = new Date(now);
    startOf7Days.setDate(startOf7Days.getDate() - 6);
    startOf7Days.setHours(0, 0, 0, 0);

    const startOf30Days = new Date(now);
    startOf30Days.setDate(startOf30Days.getDate() - 29);
    startOf30Days.setHours(0, 0, 0, 0);

    const today = visits.filter(
      (visit) =>
        new Date(visit.createdAt) >= startOfToday
    ).length;

    const last7Days = visits.filter(
      (visit) =>
        new Date(visit.createdAt) >= startOf7Days
    ).length;

    const last30Days = visits.filter(
      (visit) =>
        new Date(visit.createdAt) >= startOf30Days
    ).length;

    return {
      total: visits.length,
      today,
      last7Days,
      last30Days,
    };
  }, [visits]);

  // =====================================================
  // GRAPH DATA — LAST 7 DAYS
  // =====================================================

  const graphData = useMemo(() => {
    const days: {
      date: Date;
      label: string;
      visits: number;
    }[] = [];

    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);

      date.setDate(now.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);

      const count = visits.filter((visit) => {
        const visitDate = new Date(visit.createdAt);

        return (
          visitDate >= date &&
          visitDate < nextDay
        );
      }).length;

      days.push({
        date,
        label: date.toLocaleDateString("en-IN", {
          weekday: "short",
        }),
        visits: count,
      });
    }

    return days;
  }, [visits]);

  const maxGraphValue = Math.max(
    ...graphData.map((day) => day.visits),
    1
  );

  // =====================================================
  // LOGOUT
  // =====================================================

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
      console.error("Logout failed:", error);
      setLoggingOut(false);
    }
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <main className="min-h-screen bg-black text-white">

      {/* =================================================
          HEADER
      ================================================= */}

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

            <div className="text-right">

              <p className="text-xs text-gray-500">
                Control Panel
              </p>

              <p className="mt-1 text-sm text-gray-300">
                Super Admin
              </p>

            </div>


            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-300 transition hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loggingOut
                ? "Logging Out..."
                : "Logout"}
            </button>

          </div>

        </div>

      </header>


      {/* =================================================
          MAIN
      ================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-12">

        {/* WELCOME */}

        <div className="mb-12">

          <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
            Dashboard
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight">
            Manage your website
          </h2>

          <p className="mt-4 max-w-2xl text-gray-400">
            One control center for your wildlife work,
            documentaries, projects, knowledge, custom
            pages and future tools.
          </p>

        </div>


        {/* =================================================
            MANAGEMENT GRID
        ================================================= */}

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          {sections.map((section) => {

            const active =
              section.status === "Active";

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


        {/* =================================================
            WEBSITE VISIT ANALYTICS
        ================================================= */}

        <section className="mt-16">

          <div className="mb-8">

            <p className="text-xs uppercase tracking-[0.3em] text-gray-600">
              Website Analytics
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Visitor Overview
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
              Website par record hui visits ka basic overview.
            </p>

          </div>


          {/* ERROR */}

          {visitsError && (
            <div className="mb-6 border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              {visitsError}
            </div>
          )}


          {/* STAT CARDS */}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div className="border border-white/10 bg-neutral-950 p-6">

              <p className="text-xs uppercase tracking-[0.2em] text-gray-600">
                Total Visits
              </p>

              <p className="mt-4 text-4xl font-bold">
                {visitsLoading
                  ? "—"
                  : visitorStats.total}
              </p>

            </div>


            <div className="border border-white/10 bg-neutral-950 p-6">

              <p className="text-xs uppercase tracking-[0.2em] text-gray-600">
                Today
              </p>

              <p className="mt-4 text-4xl font-bold">
                {visitsLoading
                  ? "—"
                  : visitorStats.today}
              </p>

            </div>


            <div className="border border-white/10 bg-neutral-950 p-6">

              <p className="text-xs uppercase tracking-[0.2em] text-gray-600">
                Last 7 Days
              </p>

              <p className="mt-4 text-4xl font-bold">
                {visitsLoading
                  ? "—"
                  : visitorStats.last7Days}
              </p>

            </div>


            <div className="border border-white/10 bg-neutral-950 p-6">

              <p className="text-xs uppercase tracking-[0.2em] text-gray-600">
                Last 30 Days
              </p>

              <p className="mt-4 text-4xl font-bold">
                {visitsLoading
                  ? "—"
                  : visitorStats.last30Days}
              </p>

            </div>

          </div>


          {/* =================================================
              7 DAY GRAPH
          ================================================= */}

          <div className="mt-6 border border-white/10 bg-neutral-950 p-6 md:p-8">

            <div className="mb-8 flex items-end justify-between gap-4">

              <div>

                <p className="text-xs uppercase tracking-[0.25em] text-gray-600">
                  Traffic
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  Last 7 Days
                </h3>

              </div>

              <p className="text-xs text-gray-600">
                Visits per day
              </p>

            </div>


            {visitsLoading ? (

              <div className="flex h-64 items-center justify-center border border-white/5">
                <p className="text-xs uppercase tracking-[0.3em] text-gray-700">
                  Loading Analytics...
                </p>
              </div>

            ) : (

              <div className="relative">

                {/* GRAPH AREA */}

                <div className="flex h-64 items-end gap-2 border-b border-white/10 px-2 sm:gap-4">

                  {graphData.map((day) => {

                    const height =
                      day.visits === 0
                        ? 4
                        : Math.max(
                            (day.visits /
                              maxGraphValue) *
                              100,
                            8
                          );

                    return (
                      <div
                        key={day.date.toISOString()}
                        className="flex h-full flex-1 flex-col items-center justify-end"
                      >

                        <div className="mb-2 text-[10px] text-gray-500">
                          {day.visits}
                        </div>


                        <div
                          className="w-full max-w-[70px] bg-white transition-all duration-500"
                          style={{
                            height: `${height}%`,
                          }}
                          title={`${day.visits} visits`}
                        />

                      </div>
                    );
                  })}

                </div>


                {/* DAY LABELS */}

                <div className="flex gap-2 px-2 pt-3 sm:gap-4">

                  {graphData.map((day) => (

                    <div
                      key={`label-${day.date.toISOString()}`}
                      className="flex-1 text-center text-[10px] uppercase tracking-wider text-gray-600"
                    >
                      {day.label}
                    </div>

                  ))}

                </div>

              </div>

            )}

          </div>

        </section>


        {/* =================================================
            FUTURE ARCHITECTURE
        ================================================= */}

        <div className="mt-12 border border-white/10 bg-neutral-950 p-7">

          <p className="text-xs uppercase tracking-[0.3em] text-gray-600">
            Future Ready
          </p>

          <h3 className="mt-3 text-2xl font-semibold">
            Your website can grow with you.
          </h3>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-500">
            This panel is being designed as a central
            content management system rather than a fixed
            wildlife website. New sections, projects,
            creative work, knowledge, custom pages, AI
            tools and other future activities can be added
            without rebuilding the entire website.
          </p>

        </div>

      </section>


      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="border-t border-white/10 px-6 py-6">

        <div className="mx-auto flex max-w-7xl justify-between text-xs text-gray-600">

          <span>
            Frankyshots Admin
          </span>

          <span>
            Super Admin Control
          </span>

        </div>

      </footer>

    </main>
  );
}
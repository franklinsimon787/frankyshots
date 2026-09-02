"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
};

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  // ======================================================
  // LOAD PROJECTS
  // ======================================================

  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetch("/api/projects", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load projects");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.error("Homepage projects error:", error);
        setProjects([]);
      } finally {
        setProjectsLoading(false);
      }
    }

    loadProjects();
  }, []);

  // ======================================================
  // DOCUMENTARIES
  // ======================================================

  const documentaries = projects.filter(
    (project) =>
      String(project.category).toLowerCase() ===
      "documentary".toLowerCase()
  );

  const featuredDocumentaries = documentaries
    .filter((project) => project.isFeatured)
    .slice(0, 2);

  const displayedDocumentaries =
    featuredDocumentaries.length > 0
      ? featuredDocumentaries
      : documentaries.slice(0, 2);

  // ======================================================
  // FALLBACK DOCUMENTARIES
  // Used only when no project has been added yet.
  // ======================================================

  const fallbackDocumentaries = [
    {
      title: "Eyes in the Wild",
      type: "WILDLIFE DOCUMENTARY",
      description:
        "A journey into the forests of Central India, exploring wildlife through observation, fieldwork and filmmaking.",
    },
    {
      title: "The Unbeatable Castle",
      type: "HISTORICAL DOCUMENTARY",
      description:
        "The story, history and strategic importance of Asirgarh Fort — one of the historic gateways to the Deccan.",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="group relative flex min-h-[92vh] items-center overflow-hidden">

        {/* Background */}
        <img
          src="/images/tiger-1.jpg"
          alt="Tiger in the wild"
          className="absolute inset-0 h-full w-full object-cover scale-105 transition-transform duration-[12000ms] ease-out group-hover:scale-110"
        />

        {/* Cinematic gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/20" />

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-black/60 to-transparent" />

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-32 md:px-10">

          <div className="max-w-4xl">

            <div className="mb-7 flex items-center gap-4">

              <span className="h-px w-12 bg-white/70" />

              <p className="text-xs font-medium uppercase tracking-[0.45em] text-gray-300">
                Wildlife • Conservation • Documentary
              </p>

            </div>

            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-8xl">
              FRANKYSHOTS
            </h1>

            <p className="mt-8 max-w-xl text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
              Stories from the wild, captured through photography,
              filmmaking and field documentation.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">

              <a
                href="#documentaries"
                className="group/button inline-flex items-center gap-4 bg-white px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-black transition-all duration-300 hover:bg-gray-200"
              >
                Explore Films

                <span className="text-lg transition-transform duration-300 group-hover/button:translate-x-1">
                  →
                </span>
              </a>

              <Link
                href="/wildlife"
                className="inline-flex items-center gap-4 border border-white/40 bg-black/20 px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white hover:text-black"
              >
                Enter the Wild

                <span className="text-lg">
                  →
                </span>
              </Link>

            </div>

          </div>

        </div>

        {/* Bottom information */}
        <div className="absolute bottom-8 left-6 right-6 z-10 md:left-10 md:right-10">

          <div className="mx-auto flex max-w-7xl items-end justify-between">

            <div className="hidden text-[10px] uppercase tracking-[0.3em] text-white/40 sm:block">
              Independent Wildlife & Documentary Production
            </div>

            <a
              href="#wildlife"
              className="group/scroll ml-auto flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/60 transition hover:text-white"
            >
              <span>
                Scroll to explore
              </span>

              <span className="flex h-9 w-6 items-start justify-center rounded-full border border-white/30 p-1">

                <span className="h-2 w-1 rounded-full bg-white/70 transition-transform duration-500 group-hover/scroll:translate-y-3" />

              </span>

            </a>

          </div>

        </div>

      </section>


      {/* ==================================================
          WILDLIFE
      ================================================== */}

      <section
        id="wildlife"
        className="mx-auto max-w-7xl px-8 py-24"
      >

        <div className="mb-12">

          <p className="text-sm uppercase tracking-[0.4em] text-gray-500">
            Wildlife
          </p>

          <h2 className="mt-3 text-4xl font-bold md:text-5xl">
            Life in the Wild
          </h2>

          <p className="mt-5 max-w-2xl text-gray-400">
            A collection of wildlife documented through field observation
            and photography.
          </p>

        </div>


        {/* IMAGE GRID */}

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          <img
            src="/images/bird-1.jpg"
            alt="Wildlife photography"
            className="h-80 w-full object-cover transition duration-700 hover:scale-[1.02]"
          />

          <img
            src="/images/bird-2.jpg"
            alt="Wildlife photography"
            className="h-80 w-full object-cover transition duration-700 hover:scale-[1.02]"
          />

          <img
            src="/images/owl.jpg"
            alt="Owl"
            className="h-80 w-full object-cover transition duration-700 hover:scale-[1.02]"
          />

          <img
            src="/images/tiger-2.jpg"
            alt="Tiger"
            className="h-80 w-full object-cover transition duration-700 hover:scale-[1.02]"
          />

          <img
            src="/images/bird-3.jpg"
            alt="Bird"
            className="h-80 w-full object-cover transition duration-700 hover:scale-[1.02]"
          />

          <img
            src="/images/deer-1.jpg"
            alt="Deer"
            className="h-80 w-full object-cover transition duration-700 hover:scale-[1.02]"
          />

        </div>


        <div className="mt-10">

          <Link
            href="/wildlife"
            className="inline-flex items-center gap-3 border border-white px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] transition hover:bg-white hover:text-black"
          >
            Explore Wildlife

            <span className="text-lg">
              →
            </span>
          </Link>

        </div>

      </section>


      {/* ==================================================
          DOCUMENTARIES
      ================================================== */}

      <section
        id="documentaries"
        className="border-y border-white/10 bg-neutral-950 px-8 py-24"
      >

        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

            <div>

              <p className="text-sm uppercase tracking-[0.4em] text-gray-500">
                Film
              </p>

              <h2 className="mt-3 text-4xl font-bold md:text-5xl">
                Documentaries
              </h2>

              <p className="mt-5 max-w-2xl text-gray-500">
                Stories brought to life through research, fieldwork,
                filmmaking and visual storytelling.
              </p>

            </div>

            <Link
              href="/projects"
              className="inline-flex w-fit items-center gap-3 border border-white/20 px-6 py-3 text-xs uppercase tracking-[0.2em] text-gray-300 transition hover:border-white hover:bg-white hover:text-black"
            >
              All Projects →
            </Link>

          </div>


          {/* Loading */}

          {projectsLoading && (

            <div className="mt-12 border border-white/10 p-10 text-center text-sm uppercase tracking-[0.3em] text-gray-600">
              Loading projects...
            </div>

          )}


          {/* Real projects */}

          {!projectsLoading &&
            displayedDocumentaries.length > 0 && (

              <div className="mt-12 grid gap-6 md:grid-cols-2">

                {displayedDocumentaries.map((project) => (

                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="group overflow-hidden border border-white/10 bg-black transition hover:border-white/30"
                  >

                    <div className="relative aspect-[16/9] overflow-hidden">

                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                      {project.isFeatured && (
                        <div className="absolute left-5 top-5 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black">
                          Featured
                        </div>
                      )}

                    </div>


                    <div className="p-8">

                      <p className="text-xs uppercase tracking-[0.3em] text-gray-600">
                        {project.category}
                      </p>

                      <h3 className="mt-3 text-3xl font-bold transition group-hover:text-gray-300">
                        {project.title}
                      </h3>

                      <p className="mt-5 leading-7 text-gray-400">
                        {project.description}
                      </p>

                      <div className="mt-7 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-gray-400">

                        View Documentary

                        <span className="text-lg transition-transform duration-300 group-hover:translate-x-2">
                          →
                        </span>

                      </div>

                    </div>

                  </Link>

                ))}

              </div>

            )}


          {/* No projects yet */}

          {!projectsLoading &&
            displayedDocumentaries.length === 0 && (

              <div className="mt-12 grid gap-6 md:grid-cols-2">

                {fallbackDocumentaries.map((documentary) => (

                  <div
                    key={documentary.title}
                    className="border border-white/10 p-8"
                  >

                    <p className="text-sm text-gray-500">
                      {documentary.type}
                    </p>

                    <h3 className="mt-3 text-3xl font-bold">
                      {documentary.title}
                    </h3>

                    <p className="mt-5 leading-7 text-gray-400">
                      {documentary.description}
                    </p>

                    <Link
                      href="/projects"
                      className="mt-8 inline-block border border-white px-6 py-3 text-sm uppercase tracking-wider transition hover:bg-white hover:text-black"
                    >
                      View Projects
                    </Link>

                  </div>

                ))}

              </div>

            )}

        </div>

      </section>


      {/* ==================================================
          PHOTOGRAPHY
      ================================================== */}

      <section
        id="photography"
        className="mx-auto max-w-7xl px-8 py-24"
      >

        <div className="grid items-center gap-12 md:grid-cols-2">

          <div>

            <p className="text-sm uppercase tracking-[0.4em] text-gray-500">
              Photography
            </p>

            <h2 className="mt-3 text-4xl font-bold md:text-5xl">
              Through the Lens
            </h2>

            <p className="mt-6 max-w-xl leading-8 text-gray-400">
              Wildlife photography is at the heart of Frankyshots —
              documenting animals, birds and the landscapes they inhabit.
            </p>

            <Link
              href="/wildlife"
              className="mt-8 inline-block border border-white px-7 py-4 text-sm uppercase tracking-wider transition hover:bg-white hover:text-black"
            >
              View Photography
            </Link>

          </div>


          <img
            src="/images/deer-2.jpg"
            alt="Deer in the forest"
            className="h-[500px] w-full object-cover"
          />

        </div>

      </section>


      {/* ==================================================
          KNOWLEDGE
      ================================================== */}

      <section className="border-y border-white/10 bg-neutral-950 px-8 py-24">

        <div className="mx-auto max-w-7xl">

          <div className="grid items-center gap-12 md:grid-cols-2">

            <div>

              <p className="text-sm uppercase tracking-[0.4em] text-gray-500">
                Knowledge
              </p>

              <h2 className="mt-3 text-4xl font-bold md:text-5xl">
                Explore & Learn
              </h2>

              <p className="mt-6 max-w-xl leading-8 text-gray-400">
                Wildlife facts, conservation, history, field knowledge
                and stories from the world around us.
              </p>

              <Link
                href="/knowledge"
                className="mt-8 inline-flex items-center gap-3 border border-white px-7 py-4 text-sm uppercase tracking-wider transition hover:bg-white hover:text-black"
              >
                Explore Knowledge

                <span className="text-lg">
                  →
                </span>
              </Link>

            </div>


            <div className="grid gap-4 sm:grid-cols-2">

              <div className="border border-white/10 p-7">

                <p className="text-xs uppercase tracking-[0.3em] text-gray-600">
                  Wildlife
                </p>

                <h3 className="mt-3 text-xl font-bold">
                  Species & Facts
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Learn about animals, birds and the ecosystems they
                  inhabit.
                </p>

              </div>


              <div className="border border-white/10 p-7">

                <p className="text-xs uppercase tracking-[0.3em] text-gray-600">
                  Conservation
                </p>

                <h3 className="mt-3 text-xl font-bold">
                  Our Natural World
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Discover stories and information about conservation
                  and nature.
                </p>

              </div>


              <div className="border border-white/10 p-7">

                <p className="text-xs uppercase tracking-[0.3em] text-gray-600">
                  History
                </p>

                <h3 className="mt-3 text-xl font-bold">
                  Places & Stories
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Historical stories, places and facts documented through
                  research.
                </p>

              </div>


              <div className="border border-white/10 p-7">

                <p className="text-xs uppercase tracking-[0.3em] text-gray-600">
                  VickVerse
                </p>

                <h3 className="mt-3 text-xl font-bold">
                  Latest Stories
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Read the latest articles and stories published on
                  VickVerse.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          VICKVERSE
      ================================================== */}

      <section className="mx-auto max-w-7xl px-8 py-24">

        <div className="border border-white/10 bg-neutral-950 p-8 md:p-12">

          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">

            <div>

              <p className="text-sm uppercase tracking-[0.4em] text-gray-500">
                VickVerse
              </p>

              <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                Stories Beyond the Wild
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-gray-500">
                Articles, facts, observations and stories covering
                wildlife, conservation, history and other subjects.
              </p>

            </div>


            <Link
              href="/vickverse"
              className="inline-flex w-fit shrink-0 items-center gap-3 border border-white px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] transition hover:bg-white hover:text-black"
            >
              Enter VickVerse

              <span className="text-lg">
                →
              </span>

            </Link>

          </div>

        </div>

      </section>


      {/* ==================================================
          ABOUT
      ================================================== */}

      <section
        id="about"
        className="border-t border-white/10 px-8 py-24"
      >

        <div className="mx-auto max-w-4xl text-center">

          <p className="text-sm uppercase tracking-[0.4em] text-gray-500">
            About
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            Frankyshots
          </h2>

          <p className="mt-8 leading-8 text-gray-400">
            Frankyshots is an independent wildlife and documentary
            production platform focused on wildlife conservation,
            photography, filmmaking and historical storytelling.
          </p>

        </div>

      </section>


      {/* ==================================================
          CONTACT / FOOTER
      ================================================== */}

      <footer
        id="contact"
        className="border-t border-white/10 px-8 py-12"
      >

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row">

          <div>

            <div className="font-bold tracking-widest">
              FRANKYSHOTS
            </div>

            <p className="mt-2 text-sm text-gray-500">
              Wildlife • Conservation • Documentary
            </p>

          </div>


          <div className="flex flex-wrap gap-6 text-sm text-gray-500">

            <Link
              href="/projects"
              className="transition hover:text-white"
            >
              Projects
            </Link>

            <Link
              href="/wildlife"
              className="transition hover:text-white"
            >
              Wildlife
            </Link>

            <Link
              href="/knowledge"
              className="transition hover:text-white"
            >
              Knowledge
            </Link>

            <Link
              href="/vickverse"
              className="transition hover:text-white"
            >
              VickVerse
            </Link>

          </div>


          <div className="text-sm text-gray-500">
            © 2026 Frankyshots. All rights reserved.
          </div>

        </div>

      </footer>

    </main>
  );
}
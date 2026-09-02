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
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetch("/api/projects");

        if (!response.ok) {
          throw new Error("Failed to load projects");
        }

        const data = await response.json();

        setProjects(data);
      } catch (error) {
        console.error(error);
        setError("Projects load nahi ho paaye.");
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HEADER */}
      <section className="border-b border-white/10 px-6 py-24 md:px-10">

        <div className="mx-auto max-w-7xl">

          <p className="text-xs uppercase tracking-[0.45em] text-gray-500">
            Frankyshots Production
          </p>

          <h1 className="mt-5 text-5xl font-black tracking-tight md:text-7xl">
            Projects
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-500">
            Documentaries, films, wildlife projects and other productions
            by Frankyshots.
          </p>

        </div>

      </section>


      {/* PROJECTS */}
      <section className="px-6 py-20 md:px-10">

        <div className="mx-auto max-w-7xl">

          {loading && (
            <div className="py-20 text-center text-sm uppercase tracking-[0.3em] text-gray-500">
              Loading projects...
            </div>
          )}


          {error && (
            <div className="border border-red-900/50 bg-red-950/20 p-6 text-red-400">
              {error}
            </div>
          )}


          {!loading && !error && projects.length === 0 && (
            <div className="border border-white/10 py-20 text-center">

              <p className="text-sm uppercase tracking-[0.3em] text-gray-600">
                No Projects
              </p>

              <p className="mt-4 text-gray-500">
                Abhi koi project add nahi kiya gaya hai.
              </p>

            </div>
          )}


          {!loading && !error && projects.length > 0 && (

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

              {projects.map((project) => (

                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="group block overflow-hidden border border-white/10 bg-neutral-950 transition hover:border-white/30"
                >

                  {/* IMAGE */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">

                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    {project.isFeatured && (
                      <div className="absolute left-4 top-4 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black">
                        Featured
                      </div>
                    )}

                  </div>


                  {/* CONTENT */}
                  <div className="p-7">

                    <div className="flex items-center justify-between gap-4">

                      <p className="text-[10px] uppercase tracking-[0.3em] text-gray-600">
                        {project.category}
                      </p>

                      <p className="text-xs text-gray-600">
                        {project.year}
                      </p>

                    </div>


                    <h2 className="mt-4 text-2xl font-bold tracking-tight transition group-hover:text-gray-300">
                      {project.title}
                    </h2>


                    <p className="mt-4 line-clamp-3 text-sm leading-7 text-gray-500">
                      {project.description}
                    </p>


                    <div className="mt-7 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-gray-400">

                      View Project

                      <span className="text-lg transition-transform duration-300 group-hover:translate-x-2">
                        →
                      </span>

                    </div>

                  </div>

                </Link>

              ))}

            </div>

          )}

        </div>

      </section>


      {/* FOOTER */}
      <footer className="border-t border-white/10 px-6 py-10 md:px-10">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-gray-500 md:flex-row">

          <div className="font-semibold tracking-[0.2em] text-white">
            FRANKYSHOTS
          </div>

          <div>
            Wildlife • Conservation • Documentary
          </div>

        </div>

      </footer>

    </main>
  );
}
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Documentary = {
  id: string;
  title: string;
  category: string;
  description: string;
  year: number;
  image: string;
  isFeatured: boolean;
};

export default function Documentary() {
  const [documentaries, setDocumentaries] = useState<Documentary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDocumentaries() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/projects");

        if (!response.ok) {
          throw new Error("Failed to load documentaries.");
        }

        const data = await response.json();

        const documentaryProjects = data.filter(
          (item: Documentary) =>
            item.category.toLowerCase() === "documentary"
        );

        setDocumentaries(documentaryProjects);
      } catch (error) {
        console.error("Failed to load documentaries:", error);
        setError("Unable to load documentaries.");
      } finally {
        setLoading(false);
      }
    }

    loadDocumentaries();
  }, []);

  const featured = documentaries.find(
    (item) => item.isFeatured
  );

  const archive = documentaries.filter(
    (item) => item.id !== featured?.id
  );

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}
      <section className="relative flex min-h-[72vh] items-end overflow-hidden">

        <div className="absolute inset-0 bg-neutral-950" />

        {featured?.image && (
          <img
            src={featured.image}
            alt={featured.title}
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 md:px-10">

          <p className="text-xs uppercase tracking-[0.5em] text-gray-400">
            Frankyshots / Documentary
          </p>

          <h1 className="mt-5 max-w-5xl text-6xl font-black tracking-tight md:text-8xl">
            DOCUMENTARIES
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-gray-300 md:text-lg">
            Stories of wildlife, history, conservation and the natural world,
            documented through research, fieldwork and filmmaking.
          </p>

        </div>

      </section>


      {/* INTRO */}
      <section className="border-b border-white/10 px-6 py-20 md:px-10">

        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2">

          <div>

            <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
              Film Archive
            </p>

            <h2 className="mt-4 text-4xl font-bold md:text-5xl">
              Stories From the Field
            </h2>

          </div>

          <p className="max-w-2xl leading-8 text-gray-400">
            Every documentary is built around observation, research and
            storytelling. This archive brings together the films created
            under Frankyshots.
          </p>

        </div>

      </section>


      {/* LOADING */}
      {loading && (
        <section className="px-6 py-24 md:px-10">

          <div className="mx-auto max-w-7xl border border-white/10 bg-neutral-950 p-10">

            <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
              Loading Documentary Archive...
            </p>

          </div>

        </section>
      )}


      {/* ERROR */}
      {!loading && error && (
        <section className="px-6 py-24 md:px-10">

          <div className="mx-auto max-w-7xl border border-red-500/20 bg-red-950/20 p-10">

            <p className="text-sm text-red-400">
              {error}
            </p>

          </div>

        </section>
      )}


      {/* FEATURED DOCUMENTARY */}
      {!loading && !error && featured && (
        <section className="px-6 py-24 md:px-10">

          <div className="mx-auto max-w-7xl">

            <div className="mb-10">

              <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
                Featured Film
              </p>

              <h2 className="mt-4 text-4xl font-bold md:text-5xl">
                Featured Documentary
              </h2>

            </div>


            <Link
              href={`/projects/${featured.id}`}
              className="group relative block overflow-hidden bg-neutral-950"
            >

              <div className="relative min-h-[520px] overflow-hidden md:min-h-[620px]">

                <img
                  src={featured.image}
                  alt={featured.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-1000 ease-out group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-8 md:p-14">

                  <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.3em] text-gray-400">

                    <span>
                      {featured.year}
                    </span>

                    <span className="h-px w-8 bg-white/30" />

                    <span>
                      {featured.category}
                    </span>

                  </div>

                  <h3 className="mt-5 max-w-4xl text-4xl font-black md:text-6xl">
                    {featured.title}
                  </h3>

                  <p className="mt-5 max-w-2xl text-base leading-8 text-gray-300 md:text-lg">
                    {featured.description}
                  </p>

                  <div className="mt-8 inline-flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-white/70 transition group-hover:text-white">

                    <span>
                      Explore Documentary
                    </span>

                    <span className="text-lg">
                      →
                    </span>

                  </div>

                </div>

              </div>

            </Link>

          </div>

        </section>
      )}


      {/* DOCUMENTARY ARCHIVE */}
      {!loading && !error && archive.length > 0 && (
        <section className="border-t border-white/10 px-6 py-24 md:px-10">

          <div className="mx-auto max-w-7xl">

            <div className="mb-12">

              <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
                Documentary Archive
              </p>

              <h2 className="mt-4 text-4xl font-bold md:text-5xl">
                All Films
              </h2>

            </div>


            <div className="grid gap-8 md:grid-cols-2">

              {archive.map((documentary) => (

                <Link
                  key={documentary.id}
                  href={`/projects/${documentary.id}`}
                  className="group block"
                >

                  <article className="overflow-hidden bg-neutral-950">

                    <div className="relative aspect-[16/10] overflow-hidden">

                      <img
                        src={documentary.image}
                        alt={documentary.title}
                        className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                      <div className="absolute bottom-5 left-5 text-xs uppercase tracking-[0.3em] text-gray-300">
                        {documentary.year}
                      </div>

                    </div>


                    <div className="border-x border-b border-white/10 p-7">

                      <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                        {documentary.category}
                      </p>

                      <h3 className="mt-3 text-2xl font-bold transition group-hover:text-gray-300 md:text-3xl">
                        {documentary.title}
                      </h3>

                      <p className="mt-4 line-clamp-3 text-sm leading-7 text-gray-500">
                        {documentary.description}
                      </p>

                      <div className="mt-6 text-xs uppercase tracking-[0.3em] text-white/50 transition group-hover:text-white">
                        View Documentary →
                      </div>

                    </div>

                  </article>

                </Link>

              ))}

            </div>

          </div>

        </section>
      )}


      {/* EMPTY STATE */}
      {!loading && !error && documentaries.length === 0 && (
        <section className="px-6 py-24 md:px-10">

          <div className="mx-auto max-w-4xl border border-white/10 bg-neutral-950 p-10 text-center">

            <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
              Documentary Archive
            </p>

            <h2 className="mt-4 text-3xl font-bold">
              No Documentaries Yet
            </h2>

            <p className="mx-auto mt-5 max-w-xl leading-8 text-gray-500">
              Documentaries added through the Admin Panel will automatically
              appear here.
            </p>

          </div>

        </section>
      )}


      {/* CLOSING */}
      <section className="border-t border-white/10 px-6 py-24 md:px-10">

        <div className="mx-auto max-w-4xl text-center">

          <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
            Frankyshots
          </p>

          <h2 className="mt-5 text-4xl font-bold md:text-5xl">
            Documenting Stories That Matter
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-gray-500">
            Wildlife, history, conservation and the people connected to the
            landscapes we document.
          </p>

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
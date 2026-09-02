"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Snake = {
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

export default function Snakes() {
  const [snakes, setSnakes] = useState<Snake[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSnakes() {
      try {
        const response = await fetch("/api/species");

        if (!response.ok) {
          throw new Error("Failed to load snakes.");
        }

        const data = await response.json();

        const snakeSpecies = data.filter(
          (item: Snake) =>
            item.category.toLowerCase() === "snakes"
        );

        setSnakes(snakeSpecies);
      } catch (error) {
        console.error("Failed to load snakes:", error);
      } finally {
        setLoading(false);
      }
    }

    loadSnakes();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}
      <section className="relative flex min-h-[65vh] items-end overflow-hidden">

        <div className="absolute inset-0 bg-neutral-950" />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 md:px-10">

          <p className="text-xs uppercase tracking-[0.45em] text-gray-400">
            Wildlife / Snakes
          </p>

          <h1 className="mt-5 text-6xl font-black tracking-tight md:text-8xl">
            SNAKES
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-gray-300 md:text-lg">
            A dedicated archive of snakes documented through field
            observation, photography and wildlife documentation.
          </p>

        </div>

      </section>


      {/* INTRO */}
      <section className="border-b border-white/10 px-6 py-16 md:px-10">

        <div className="mx-auto max-w-7xl">

          <p className="max-w-3xl text-xl leading-9 text-gray-300 md:text-2xl">
            Snakes play an important role in maintaining healthy ecosystems.
            This section will document the species recorded through
            Frankyshots field observations.
          </p>

        </div>

      </section>


      {/* COLLECTION */}
      <section className="px-6 py-20 md:px-10">

        <div className="mx-auto max-w-7xl">

          <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
            Species Collection
          </p>

          <h2 className="mt-4 text-4xl font-bold md:text-5xl">
            Snake Archive
          </h2>


          {/* LOADING */}
          {loading && (
            <div className="mt-14 border border-white/10 bg-neutral-950 p-8">
              <p className="text-sm text-gray-500">
                Loading snakes...
              </p>
            </div>
          )}


          {/* PHOTO GRID */}
          {!loading && snakes.length > 0 && (
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {snakes.map((snake, index) => (

                <article
                  key={snake.id}
                  className="group relative overflow-hidden bg-neutral-950"
                >

                  <div className="relative overflow-hidden">

                    <img
                      src={snake.featuredImage}
                      alt={snake.name}
                      className="h-[480px] w-full object-cover transition duration-700 ease-out group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-7">

                    <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                      Species {String(index + 1).padStart(2, "0")}
                    </p>

                    <h3 className="mt-2 text-2xl font-bold">
                      {snake.name}
                    </h3>

                    <p className="mt-2 text-sm italic text-gray-400">
                      {snake.location}
                    </p>

                    <Link
  href={`/wildlife/category/${snake.slug}`}
  className="mt-5 inline-block text-xs uppercase tracking-[0.25em] text-white/60 transition group-hover:text-white"
>
  View Species →
</Link>

                  </div>

                </article>

              ))}

            </div>
          )}


          {/* EMPTY STATE */}
          {!loading && snakes.length === 0 && (
            <div className="mt-14 border border-white/10 bg-neutral-950 p-8">
              <p className="text-gray-500">
                No published snake species available.
              </p>
            </div>
          )}

        </div>

      </section>


      {/* NOTE */}
      <section className="border-t border-white/10 px-6 py-20 md:px-10">

        <div className="mx-auto max-w-4xl text-center">

          <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
            Wildlife Archive
          </p>

          <h2 className="mt-4 text-3xl font-bold md:text-4xl">
            Species Profiles Coming Soon
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-gray-500">
            Detailed species profiles, photographs, habitat information and
            field observations will be added to the archive.
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
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Insect = {
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

export default function Insects() {
  const [insects, setInsects] = useState<Insect[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInsects() {
      try {
        const response = await fetch("/api/species");

        if (!response.ok) {
          throw new Error("Failed to load insects.");
        }

        const data = await response.json();

        const insectSpecies = data.filter(
          (item: Insect) =>
            item.category.toLowerCase() === "insects"
        );

        setInsects(insectSpecies);
      } catch (error) {
        console.error("Failed to load insects:", error);
      } finally {
        setLoading(false);
      }
    }

    loadInsects();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}
      <section className="relative flex min-h-[65vh] items-end overflow-hidden">

        <div className="absolute inset-0 bg-neutral-950" />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 md:px-10">

          <p className="text-xs uppercase tracking-[0.45em] text-gray-400">
            Wildlife / Insects
          </p>

          <h1 className="mt-5 text-6xl font-black tracking-tight md:text-8xl">
            INSECTS
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-gray-300 md:text-lg">
            A field archive documenting insects and the small forms of life
            that contribute to the balance of natural ecosystems.
          </p>

        </div>

      </section>


      {/* INTRO */}
      <section className="border-b border-white/10 px-6 py-16 md:px-10">

        <div className="mx-auto max-w-7xl">

          <p className="max-w-3xl text-xl leading-9 text-gray-300 md:text-2xl">
            Often overlooked because of their size, insects form an essential
            part of the natural world. This collection records the diversity
            encountered during field observations.
          </p>

        </div>

      </section>


      {/* COLLECTION */}
      <section className="px-6 py-20 md:px-10">

        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
                Species Collection
              </p>

              <h2 className="mt-4 text-4xl font-bold md:text-5xl">
                Insect Archive
              </h2>

            </div>

            <p className="max-w-md text-sm leading-7 text-gray-500">
              A growing photographic record of insects documented during
              field exploration.
            </p>

          </div>


          {/* LOADING */}
          {loading && (
            <div className="mt-14 border border-white/10 bg-neutral-950 p-8">
              <p className="text-sm text-gray-500">
                Loading insects...
              </p>
            </div>
          )}


          {/* SPECIES GRID */}
          {!loading && insects.length > 0 && (
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {insects.map((insect, index) => (

                <article
                  key={insect.id}
                  className="group relative overflow-hidden bg-neutral-950"
                >

                  <div className="relative overflow-hidden">

                    <img
                      src={insect.featuredImage}
                      alt={insect.name}
                      className="h-[420px] w-full object-cover transition duration-700 ease-out group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

                  </div>


                  <div className="absolute bottom-0 left-0 right-0 p-7">

                    <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                      Species {String(index + 1).padStart(2, "0")}
                    </p>

                    <h3 className="mt-2 text-2xl font-bold">
                      {insect.name}
                    </h3>

                    <p className="mt-2 text-sm italic text-gray-400">
                      {insect.location}
                    </p>

                    <Link
  href={`/wildlife/category/${insect.slug}`}
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
          {!loading && insects.length === 0 && (
            <div className="mt-14 border border-white/10 bg-neutral-950 p-8">
              <p className="text-gray-500">
                No published insect species available.
              </p>
            </div>
          )}

        </div>

      </section>


      {/* ARCHIVE */}
      <section className="border-t border-white/10 px-6 py-20 md:px-10">

        <div className="mx-auto max-w-4xl text-center">

          <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
            Frankyshots Wildlife Archive
          </p>

          <h2 className="mt-4 text-3xl font-bold md:text-4xl">
            Discover the Smaller World
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-gray-500">
            Detailed species profiles, photographs and field observations
            will be added as the archive continues to grow.
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
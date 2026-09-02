"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type OtherSpecies = {
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

export default function Other() {
  const [species, setSpecies] = useState<OtherSpecies[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadSpecies() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/species");

      if (!response.ok) {
        throw new Error("Failed to load other species.");
      }

      const data = await response.json();

      const otherSpecies = data.filter(
        (item: OtherSpecies) =>
          item.category.toLowerCase() === "other"
      );

      setSpecies(otherSpecies);
    } catch (error) {
      console.error(error);
      setError("Unable to load other species.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSpecies();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}
      <section className="relative flex min-h-[65vh] items-end overflow-hidden">

        <div className="absolute inset-0 bg-neutral-950" />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 md:px-10">

          <p className="text-xs uppercase tracking-[0.45em] text-gray-400">
            Wildlife / Other
          </p>

          <h1 className="mt-5 text-6xl font-black tracking-tight md:text-8xl">
            OTHER
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-gray-300 md:text-lg">
            A collection of wildlife and living organisms that do not fall
            within the primary categories of the archive.
          </p>

        </div>

      </section>


      {/* INTRO */}
      <section className="border-b border-white/10 px-6 py-16 md:px-10">

        <div className="mx-auto max-w-7xl">

          <p className="max-w-3xl text-xl leading-9 text-gray-300 md:text-2xl">
            Not every field observation fits neatly into a single category.
            This section provides space for species and wildlife records that
            belong outside the main groups of the Frankyshots archive.
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
                Other Wildlife
              </h2>

            </div>

            <p className="max-w-md text-sm leading-7 text-gray-500">
              A flexible archive for wildlife records that fall outside the
              primary categories.
            </p>

          </div>


          {/* LOADING */}
          {loading && (
            <div className="mt-14 border border-white/10 bg-neutral-950 p-8">

              <p className="text-sm text-gray-500">
                Loading species...
              </p>

            </div>
          )}


          {/* ERROR */}
          {!loading && error && (
            <div className="mt-14 border border-red-500/20 bg-red-950/20 p-8">

              <p className="text-sm text-red-400">
                {error}
              </p>

            </div>
          )}


          {/* EMPTY */}
          {!loading && !error && species.length === 0 && (
            <div className="mt-14 border border-white/10 bg-neutral-950 p-8">

              <p className="text-gray-400">
                No species have been added to the Other category yet.
              </p>

              <p className="mt-2 text-sm text-gray-600">
                Add a species from the Frankyshots Admin Panel and select
                Other as its category.
              </p>

            </div>
          )}


          {/* SPECIES GRID */}
          {!loading && !error && species.length > 0 && (

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {species.map((item, index) => (

                <article
                  key={item.id}
                  className="group relative overflow-hidden bg-neutral-950"
                >

                  <div className="relative overflow-hidden">

                    <img
                      src={item.featuredImage}
                      alt={item.name}
                      className="h-[420px] w-full object-cover transition duration-700 ease-out group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

                  </div>


                  <div className="absolute bottom-0 left-0 right-0 p-7">

                    <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                      Species {String(index + 1).padStart(2, "0")}
                    </p>

                    <h3 className="mt-2 text-2xl font-bold">
                      {item.name}
                    </h3>

                    <p className="mt-2 text-sm text-gray-400">
                      {item.location}
                    </p>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-400">
                      {item.summary}
                    </p>


                    {/* VIEW SPECIES */}
                    <Link
                      href={`/wildlife/category/${item.slug}`}
                      className="mt-5 inline-block text-xs uppercase tracking-[0.25em] text-white/60 transition group-hover:text-white"
                    >
                      View Species →
                    </Link>

                  </div>

                </article>

              ))}

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
            The Archive Continues to Grow
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-gray-500">
            New field observations and species records will continue to be
            added to the archive.
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
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Bird = {
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

export default function Birds() {
  const [birds, setBirds] = useState<Bird[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBirds() {
      try {
        const response = await fetch("/api/species");

        if (!response.ok) {
          throw new Error("Failed to load birds.");
        }

        const data = await response.json();

        const birdSpecies = data.filter(
          (item: Bird) =>
            item.category.toLowerCase() === "birds"
        );

        setBirds(birdSpecies);
      } catch (error) {
        console.error("Failed to load birds:", error);
      } finally {
        setLoading(false);
      }
    }

    loadBirds();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}
      <section className="relative flex min-h-[65vh] items-end overflow-hidden">

        <img
          src="/images/bird-1.jpg"
          alt="Bird in the wild"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/10" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 md:px-10">

          <p className="text-xs uppercase tracking-[0.45em] text-gray-300">
            Wildlife / Birds
          </p>

          <h1 className="mt-5 text-6xl font-black tracking-tight md:text-8xl">
            BIRDS
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-gray-300 md:text-lg">
            Birds documented through field observation, photography and
            wildlife documentation.
          </p>

        </div>

      </section>


      {/* INTRO */}
      <section className="border-b border-white/10 px-6 py-16 md:px-10">

        <div className="mx-auto max-w-7xl">

          <p className="max-w-3xl text-xl leading-9 text-gray-300 md:text-2xl">
            From the forest canopy to open landscapes, every bird offers a
            glimpse into the biodiversity of the wild.
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
                Birdlife
              </h2>

            </div>

            <p className="max-w-md text-sm leading-7 text-gray-500">
              A growing photographic archive of birds documented in the
              field.
            </p>

          </div>


          {/* LOADING */}
          {loading && (
            <div className="mt-14 border border-white/10 bg-neutral-950 p-8">
              <p className="text-sm text-gray-500">
                Loading birds...
              </p>
            </div>
          )}


          {/* PHOTO GRID */}
          {!loading && birds.length > 0 && (
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {birds.map((bird, index) => (

                <article
                  key={bird.id}
                  className="group relative overflow-hidden bg-neutral-950"
                >

                  <div className="relative overflow-hidden">

                    <img
                      src={bird.featuredImage}
                      alt={bird.name}
                      className="h-[480px] w-full object-cover transition duration-700 ease-out group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

                  </div>


                  <div className="absolute bottom-0 left-0 right-0 p-7">

                    <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                      Species {String(index + 1).padStart(2, "0")}
                    </p>

                    <h3 className="mt-2 text-2xl font-bold">
                      {bird.name}
                    </h3>

                    <p className="mt-2 text-sm italic text-gray-400">
                      {bird.location}
                    </p>

                    <Link
  href={`/wildlife/category/${bird.slug}`}
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
          {!loading && birds.length === 0 && (
            <div className="mt-14 border border-white/10 bg-neutral-950 p-8">
              <p className="text-gray-500">
                No published bird species available.
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
            The Archive Will Keep Growing
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-gray-500">
            New species and field observations will continue to be added
            to the collection.
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
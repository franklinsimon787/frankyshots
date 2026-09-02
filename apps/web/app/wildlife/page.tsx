"use client";

import { useEffect, useState } from "react";

type Species = {
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

const categories = [
  {
    name: "Animals",
    path: "/wildlife/animals",
  },
  {
    name: "Birds",
    path: "/wildlife/birds",
  },
  {
    name: "Snakes",
    path: "/wildlife/snakes",
  },
  {
    name: "Reptiles",
    path: "/wildlife/reptiles",
  },
  {
    name: "Insects",
    path: "/wildlife/insects",
  },
  {
    name: "Fish",
    path: "/wildlife/fishes",
  },
  {
    name: "Other",
    path: "/wildlife/other",
  },
];

export default function Wildlife() {
  const [wildlife, setWildlife] = useState<Species[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadRandomSpecies() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/species");

      if (!response.ok) {
        throw new Error("Failed to load wildlife.");
      }

      const data: Species[] = await response.json();

      // Database se aaye records ko randomly shuffle karo
      const shuffled = [...data].sort(() => Math.random() - 0.5);

      // Random 10 records select karo
      const randomTen = shuffled.slice(0, 9);

      setWildlife(randomTen);
    } catch (error) {
      console.error(error);
      setError("Unable to load wildlife.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRandomSpecies();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HEADER */}
      <section className="relative flex min-h-[70vh] items-end overflow-hidden">

        <img
          src="/images/tiger-2.jpg"
          alt="Wildlife"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 md:px-10">

          <p className="mb-5 text-xs uppercase tracking-[0.45em] text-gray-300">
            Field Documentation
          </p>

          <h1 className="text-6xl font-black tracking-tight md:text-8xl">
            WILDLIFE
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-gray-300 md:text-lg">
            Exploring wildlife through field observation, photography and
            documentary storytelling.
          </p>

        </div>

      </section>


      {/* INTRO */}
      <section className="border-b border-white/10 px-6 py-20 md:px-10">

        <div className="mx-auto max-w-7xl">

          <p className="max-w-3xl text-xl leading-9 text-gray-300 md:text-2xl">
            Every species has a story. This collection documents the animals,
            birds and biodiversity encountered in the field.
          </p>

        </div>

      </section>


      {/* CATEGORIES */}
      <section className="px-6 py-20 md:px-10">

        <div className="mx-auto max-w-7xl">

          <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
            Explore
          </p>

          <h2 className="mt-4 text-4xl font-bold md:text-5xl">
            Categories
          </h2>


          <div className="mt-10 grid border-l border-t border-white/10 sm:grid-cols-2 lg:grid-cols-3">

            {categories.map((category, index) => (

              <a
                key={category.name}
                href={category.path}
                className="group border-b border-r border-white/10 p-7 transition duration-300 hover:bg-white hover:text-black"
              >

                <span className="text-xs opacity-40">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3 className="mt-10 text-xl font-semibold">
                  {category.name}
                </h3>

                <div className="mt-6 text-sm opacity-50 transition-transform duration-300 group-hover:translate-x-2">
                  Explore →
                </div>

              </a>

            ))}

          </div>

        </div>

      </section>


      {/* COLLECTION */}
      <section
        id="collection"
        className="border-t border-white/10 px-6 py-20 md:px-10"
      >

        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

            <div>

              <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
                Selected Documentation
              </p>

              <h2 className="mt-4 text-4xl font-bold md:text-5xl">
                From the Wild
              </h2>

            </div>

            <p className="max-w-md text-sm leading-7 text-gray-500">
              A random selection from the wildlife archive, automatically
              updated from the field database.
            </p>

          </div>


          {/* LOADING */}
          {loading && (
            <div className="mt-14 border border-white/10 bg-neutral-950 p-8">

              <p className="text-sm text-gray-500">
                Loading wildlife archive...
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


          {/* RANDOM WILDLIFE GRID */}
          {!loading && !error && wildlife.length > 0 && (

            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              {wildlife.map((item, index) => (

                <article
                  key={item.id}
                  className="group relative overflow-hidden bg-neutral-950"
                >

                  <img
                    src={item.featuredImage}
                    alt={item.name}
                    className="h-[420px] w-full object-cover transition duration-700 ease-out group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-7">

                    <p className="text-xs uppercase tracking-[0.3em] text-gray-300">
                      {item.category}
                    </p>

                    <h3 className="mt-2 text-2xl font-semibold">
                      {item.name}
                    </h3>

                    <p className="mt-2 text-sm text-gray-400">
                      {item.location}
                    </p>

                    <div className="mt-4 text-sm text-white/60 opacity-0 transition duration-300 group-hover:opacity-100">
                      View species →
                    </div>

                  </div>

                </article>

              ))}

            </div>

          )}


          {/* NO SPECIES */}
          {!loading && !error && wildlife.length === 0 && (

            <div className="mt-14 border border-white/10 bg-neutral-950 p-8">

              <p className="text-gray-400">
                No published wildlife species found.
              </p>

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
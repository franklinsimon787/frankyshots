import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";

type SpeciesPageProps = {
  params: {
    slug: string;
  };
};

export default async function SpeciesPage({
  params,
}: SpeciesPageProps) {
  const species = await prisma.species.findUnique({
    where: {
      slug: params.slug,
    },
  });

  if (!species || species.status !== "published") {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}
      <section className="relative flex min-h-[70vh] items-end overflow-hidden">

        <img
          src={species.featuredImage}
          alt={species.name}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 md:px-10">

          <p className="text-xs uppercase tracking-[0.45em] text-gray-300">
            Wildlife / {species.category}
          </p>

          <h1 className="mt-5 max-w-5xl text-6xl font-black tracking-tight md:text-8xl">
            {species.name}
          </h1>

          <p className="mt-6 text-sm uppercase tracking-[0.3em] text-gray-400">
            Field Documentation
          </p>

        </div>

      </section>


      {/* SPECIES INFORMATION */}
      <section className="border-b border-white/10 px-6 py-20 md:px-10">

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-16 lg:grid-cols-[1fr_2fr]">

            {/* LEFT SIDE */}
            <div>

              <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
                Species Information
              </p>

              <h2 className="mt-4 text-4xl font-bold md:text-5xl">
                {species.name}
              </h2>

            </div>


            {/* RIGHT SIDE */}
            <div className="space-y-10">

              {/* CATEGORY */}
              <div className="border-b border-white/10 pb-8">

                <p className="text-xs uppercase tracking-[0.35em] text-gray-500">
                  Category
                </p>

                <p className="mt-3 text-xl text-gray-200">
                  {species.category}
                </p>

              </div>


              {/* LOCATION */}
              <div className="border-b border-white/10 pb-8">

                <p className="text-xs uppercase tracking-[0.35em] text-gray-500">
                  Location
                </p>

                <p className="mt-3 text-xl text-gray-200">
                  {species.location}
                </p>

              </div>


              {/* DESCRIPTION */}
              <div>

                <p className="text-xs uppercase tracking-[0.35em] text-gray-500">
                  Field Documentation
                </p>

                <div className="mt-5 max-w-3xl text-lg leading-9 text-gray-300">
                  {species.summary}
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* FEATURED IMAGE */}
      <section className="px-6 py-20 md:px-10">

        <div className="mx-auto max-w-7xl">

          <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
            Field Record
          </p>

          <h2 className="mt-4 text-4xl font-bold md:text-5xl">
            Documented in the Wild
          </h2>

          <div className="mt-12 overflow-hidden bg-neutral-950">

            <img
              src={species.featuredImage}
              alt={species.name}
              className="h-auto max-h-[800px] w-full object-cover"
            />

          </div>

        </div>

      </section>


      {/* DETAILS */}
      <section className="border-t border-white/10 px-6 py-20 md:px-10">

        <div className="mx-auto max-w-7xl">

          <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
            Archive Details
          </p>

          <div className="mt-10 grid border-l border-t border-white/10 sm:grid-cols-2 lg:grid-cols-3">

            {/* NAME */}
            <div className="border-b border-r border-white/10 p-7">

              <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                Species
              </p>

              <p className="mt-4 text-lg font-semibold">
                {species.name}
              </p>

            </div>


            {/* CATEGORY */}
            <div className="border-b border-r border-white/10 p-7">

              <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                Classification
              </p>

              <p className="mt-4 text-lg font-semibold">
                {species.category}
              </p>

            </div>


            {/* LOCATION */}
            <div className="border-b border-r border-white/10 p-7">

              <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                Field Location
              </p>

              <p className="mt-4 text-lg font-semibold">
                {species.location}
              </p>

            </div>

          </div>

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
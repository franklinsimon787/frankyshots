import { notFound } from "next/navigation";
import { prisma } from "../../lib/prisma";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProjectDetailPage({
  params,
}: PageProps) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: {
      id,
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}
      <section className="relative min-h-[75vh] overflow-hidden">

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("${project.image}")`,
          }}
        />

        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />

        <div className="relative z-10 flex min-h-[75vh] items-end px-6 pb-16 md:px-10 md:pb-24">

          <div className="mx-auto w-full max-w-7xl">

            <p className="text-xs uppercase tracking-[0.4em] text-gray-400">
              {project.category}
            </p>

            <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
              {project.title}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
              {project.description}
            </p>

          </div>

        </div>

      </section>


      {/* PROJECT INFORMATION */}
      <section className="border-b border-white/10 px-6 py-20 md:px-10">

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-12 lg:grid-cols-[1fr_0.7fr]">

            {/* DESCRIPTION */}
            <div>

              <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
                About The Project
              </p>

              <h2 className="mt-5 text-4xl font-bold md:text-5xl">
                {project.title}
              </h2>

              <p className="mt-8 max-w-3xl text-lg leading-9 text-gray-400">
                {project.description}
              </p>

            </div>


            {/* DETAILS */}
            <div className="border-l border-white/10 pl-8">

              <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
                Project Information
              </p>

              <div className="mt-8 space-y-6">

                <div className="border-b border-white/10 pb-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-600">
                    Category
                  </p>

                  <p className="mt-2 text-sm text-gray-300">
                    {project.category || "NA"}
                  </p>
                </div>


                <div className="border-b border-white/10 pb-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-600">
                    Year
                  </p>

                  <p className="mt-2 text-sm text-gray-300">
                    {project.year || "NA"}
                  </p>
                </div>


                <div className="border-b border-white/10 pb-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-600">
                    Production
                  </p>

                  <p className="mt-2 text-sm text-gray-300">
                    Frankyshots Production
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* IMAGE */}
      <section className="px-6 py-20 md:px-10">

        <div className="mx-auto max-w-7xl">

          <div className="overflow-hidden border border-white/10 bg-neutral-950">

            <img
              src={project.image}
              alt={project.title}
              className="w-full object-cover"
            />

          </div>

        </div>

      </section>


      {/* PRODUCTION */}
      <section className="border-t border-white/10 px-6 py-24 md:px-10">

        <div className="mx-auto max-w-5xl text-center">

          <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
            Production
          </p>

          <h2 className="mt-5 text-4xl font-bold md:text-5xl">
            Frankyshots Production
          </h2>

          <p className="mx-auto mt-7 max-w-3xl leading-8 text-gray-500">
            Wildlife, conservation, photography and documentary
            storytelling.
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
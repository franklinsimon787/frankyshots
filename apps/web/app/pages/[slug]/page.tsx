import { notFound } from "next/navigation";
import { prisma } from "../../lib/prisma";

type PageProps = {
  params: {
    slug: string;
  };
};

export default async function PublicPage({
  params,
}: PageProps) {
  const page = await prisma.page.findFirst({
    where: {
      slug: params.slug,
      status: "published",
    },
  });

  if (!page) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO / IMAGE */}

      {page.image && (
        <div className="relative h-[45vh] min-h-[320px] w-full overflow-hidden">

          <img
            src={page.image}
            alt={page.title}
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/50" />

          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-5xl px-6 pb-12 md:px-10">
              <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
                {page.title}
              </h1>
            </div>
          </div>

        </div>
      )}

      {/* CONTENT */}

      <div className="mx-auto max-w-5xl px-6 py-16 md:px-10">

        {!page.image && (
          <h1 className="mb-10 text-4xl font-bold tracking-tight md:text-6xl">
            {page.title}
          </h1>
        )}

        <article className="max-w-4xl">

          {page.content
            .split("\n")
            .map((paragraph, index) => {

              if (!paragraph.trim()) {
                return (
                  <div
                    key={index}
                    className="h-4"
                  />
                );
              }

              return (
                <p
                  key={index}
                  className="mb-6 text-base leading-8 text-gray-300 md:text-lg"
                >
                  {paragraph}
                </p>
              );
            })}

        </article>

      </div>

    </main>
  );
}
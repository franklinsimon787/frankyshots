import { notFound } from "next/navigation";

type KnowledgePost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  image: string | null;
  tags: string | null;
  status: string;
  createdAt: string;
};

async function getPost(slug: string): Promise<KnowledgePost | null> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const response = await fetch(
      `${baseUrl}/api/knowledge/${slug}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return data.post || null;
  } catch (error) {
    console.error("KNOWLEDGE PAGE ERROR:", error);
    return null;
  }
}

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function KnowledgePostPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const tags =
    post.tags
      ?.split(",")
      .map((tag) => tag.trim())
      .filter(Boolean) || [];

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HEADER */}
      <section className="border-b border-white/10 px-6 py-20 md:px-10">
        <div className="mx-auto max-w-4xl">

          <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
            Frankyshots Knowledge
          </p>

          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
            {post.title}
          </h1>

          {tags.length > 0 && (
            <div className="mt-7 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-white/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-gray-500"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

        </div>
      </section>


      {/* ARTICLE */}
      <article className="px-6 py-16 md:px-10 md:py-20">

        <div className="mx-auto max-w-4xl">

          {/* IMAGE */}
          {post.image && (
            <div className="mb-14 overflow-hidden bg-neutral-900">
              <img
                src={post.image}
                alt={post.title}
                className="h-auto max-h-[650px] w-full object-cover"
              />
            </div>
          )}


          {/* CONTENT */}
          <div className="whitespace-pre-line text-base leading-8 text-gray-300 md:text-lg md:leading-9">
            {post.content}
          </div>


          {/* BACK */}
          <div className="mt-16 border-t border-white/10 pt-8">

            <a
              href="/knowledge"
              className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-gray-500 transition hover:text-white"
            >
              <span className="text-lg">
                ←
              </span>

              Back to Knowledge
            </a>

          </div>

        </div>

      </article>


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
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../lib/prisma";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function VickVerseArticlePage({
  params,
}: PageProps) {
  const { slug } = await params;

  const post = await prisma.vickVersePost.findUnique({
    where: {
      slug,
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-5xl px-6 py-16">

        {/* Back */}
        <Link
          href="/vickverse"
          className="mb-10 inline-block text-sm text-white/60 transition hover:text-white"
        >
          ← Back to VickVerse
        </Link>

        {/* Category */}
        {post.category && (
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-white/50">
            {post.category}
          </p>
        )}

        {/* Title */}
        <h1 className="text-4xl font-bold leading-tight md:text-6xl">
          {post.title}
        </h1>

        {/* Description */}
        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/60">
          {post.description}
        </p>

        {/* Image */}
        {post.image && (
          <div className="mt-12 overflow-hidden rounded-2xl border border-white/10">
            <img
              src={post.image}
              alt={post.title}
              className="h-auto w-full object-cover"
            />
          </div>
        )}

        {/* Article Content */}
        <article className="mt-12 max-w-4xl">
          <div className="whitespace-pre-wrap text-lg leading-8 text-white/80">
            {post.content}
          </div>
        </article>

        {/* YouTube */}
        {post.youtubeUrl && (
          <div className="mt-14">
            <h2 className="mb-5 text-2xl font-semibold">
              Watch on YouTube
            </h2>

            <a
              href={post.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-lg border border-white/20 px-5 py-3 text-sm transition hover:bg-white hover:text-black"
            >
              Watch Video →
            </a>
          </div>
        )}

        {/* Tags */}
        {post.tags && (
          <div className="mt-12 border-t border-white/10 pt-8">
            <p className="text-sm text-white/40">
              Tags
            </p>

            <p className="mt-2 text-sm text-white/60">
              {post.tags}
            </p>
          </div>
        )}

        {/* Bottom Back Button */}
        <div className="mt-16 border-t border-white/10 pt-8">
          <Link
            href="/vickverse"
            className="text-sm text-white/60 transition hover:text-white"
          >
            ← Back to all VickVerse articles
          </Link>
        </div>

      </section>
    </main>
  );
}
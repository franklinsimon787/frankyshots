import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// ======================================================
// GET — SINGLE KNOWLEDGE POST BY SLUG
// ======================================================

export async function GET(
  request: Request,
  context: {
    params: Promise<{
      slug: string;
    }>;
  }
) {
  try {
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json(
        {
          error: "Slug is required.",
        },
        { status: 400 }
      );
    }

    const post = await prisma.knowledgePost.findUnique({
      where: {
        slug: String(slug),
      },
    });

    if (!post) {
      return NextResponse.json(
        {
          error: "Knowledge post not found.",
        },
        { status: 404 }
      );
    }

    // Public website par sirf published post dikhe
    if (post.status !== "published") {
      return NextResponse.json(
        {
          error: "Knowledge post not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      post,
    });
  } catch (error) {
    console.error("KNOWLEDGE SLUG GET ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to load knowledge post.",
      },
      { status: 500 }
    );
  }
}
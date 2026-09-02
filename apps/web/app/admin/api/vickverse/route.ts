import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(
      1,
      Number(searchParams.get("page") || "1")
    );

    const limit = Math.min(
      50,
      Math.max(
        1,
        Number(searchParams.get("limit") || "50")
      )
    );

    const skip = (page - 1) * limit;

    const [posts, totalPosts] = await Promise.all([
      prisma.vickVersePost.findMany({
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),

      prisma.vickVersePost.count(),
    ]);

    const totalPages = Math.max(
      1,
      Math.ceil(totalPosts / limit)
    );

    return NextResponse.json(
      {
        success: true,
        posts,
        totalPosts,
        totalPages,
        currentPage: page,
        limit,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("ADMIN VICKVERSE GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load VickVerse posts.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
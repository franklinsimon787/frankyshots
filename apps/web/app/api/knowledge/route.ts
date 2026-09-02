import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ======================================================
// GET — ALL KNOWLEDGE POSTS
// ======================================================

export async function GET() {
  try {
    const posts = await prisma.knowledgePost.findMany({
      where: {
        status: "published",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      posts,
    });
  } catch (error) {
    console.error("KNOWLEDGE GET ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to load knowledge posts.",
      },
      { status: 500 }
    );
  }
}

// ======================================================
// POST — CREATE KNOWLEDGE POST
// ======================================================

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      title,
      content,
      image,
      tags,
      status,
    } = body;

    // --------------------------------------------------
    // REQUIRED
    // --------------------------------------------------

    if (!title || !String(title).trim()) {
      return NextResponse.json(
        {
          error: "Title is required.",
        },
        { status: 400 }
      );
    }

    if (!content || !String(content).trim()) {
      return NextResponse.json(
        {
          error: "Content is required.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // SLUG
    // --------------------------------------------------

    let slug = createSlug(String(title));

    const existingPost =
      await prisma.knowledgePost.findUnique({
        where: {
          slug,
        },
      });

    if (existingPost) {
      slug = `${slug}-${Date.now()}`;
    }

    // --------------------------------------------------
    // CREATE
    // --------------------------------------------------

    const post = await prisma.knowledgePost.create({
      data: {
        title: String(title).trim(),

        slug,

        content: String(content).trim(),

        image:
          image && String(image).trim()
            ? String(image).trim()
            : null,

        tags:
          tags && String(tags).trim()
            ? String(tags).trim()
            : null,

        status:
          status === "published"
            ? "published"
            : "draft",
      },
    });

    return NextResponse.json(
      {
        success: true,
        post,
        message: "Knowledge post created successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("KNOWLEDGE POST ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create knowledge post.",
      },
      { status: 500 }
    );
  }
}

// ======================================================
// PUT — UPDATE KNOWLEDGE POST
// ======================================================

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const {
      id,
      title,
      content,
      image,
      tags,
      status,
    } = body;

    if (!id) {
      return NextResponse.json(
        {
          error: "Post ID is required.",
        },
        { status: 400 }
      );
    }

    if (!title || !String(title).trim()) {
      return NextResponse.json(
        {
          error: "Title is required.",
        },
        { status: 400 }
      );
    }

    if (!content || !String(content).trim()) {
      return NextResponse.json(
        {
          error: "Content is required.",
        },
        { status: 400 }
      );
    }

    const existingPost =
      await prisma.knowledgePost.findUnique({
        where: {
          id: String(id),
        },
      });

    if (!existingPost) {
      return NextResponse.json(
        {
          error: "Knowledge post not found.",
        },
        { status: 404 }
      );
    }

    let slug = createSlug(String(title));

    const slugOwner =
      await prisma.knowledgePost.findUnique({
        where: {
          slug,
        },
      });

    if (slugOwner && slugOwner.id !== String(id)) {
      slug = `${slug}-${Date.now()}`;
    }

    const post = await prisma.knowledgePost.update({
      where: {
        id: String(id),
      },

      data: {
        title: String(title).trim(),

        slug,

        content: String(content).trim(),

        image:
          image && String(image).trim()
            ? String(image).trim()
            : null,

        tags:
          tags && String(tags).trim()
            ? String(tags).trim()
            : null,

        status:
          status === "published"
            ? "published"
            : "draft",
      },
    });

    return NextResponse.json({
      success: true,
      post,
      message: "Knowledge post updated successfully.",
    });
  } catch (error) {
    console.error("KNOWLEDGE PUT ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update knowledge post.",
      },
      { status: 500 }
    );
  }
}

// ======================================================
// DELETE — DELETE KNOWLEDGE POST
// ======================================================

export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    const { id } = body;

    if (!id) {
      return NextResponse.json(
        {
          error: "Post ID is required.",
        },
        { status: 400 }
      );
    }

    const existingPost =
      await prisma.knowledgePost.findUnique({
        where: {
          id: String(id),
        },
      });

    if (!existingPost) {
      return NextResponse.json(
        {
          error: "Knowledge post not found.",
        },
        { status: 404 }
      );
    }

    await prisma.knowledgePost.delete({
      where: {
        id: String(id),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Knowledge post deleted successfully.",
    });
  } catch (error) {
    console.error("KNOWLEDGE DELETE ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete knowledge post.",
      },
      { status: 500 }
    );
  }
}
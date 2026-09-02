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
// GET
// GET ALL VICKVERSE POSTS
// GET SINGLE POST BY SLUG
// ======================================================

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const slug = searchParams.get("slug");
    const page = Math.max(
      1,
      Number(searchParams.get("page") || "1")
    );

    const limit = Math.min(
      50,
      Math.max(1, Number(searchParams.get("limit") || "10"))
    );

    // --------------------------------------------------
    // SINGLE POST
    // /api/vickverse?slug=my-article
    // --------------------------------------------------

    if (slug) {
      const post = await prisma.vickVersePost.findUnique({
        where: {
          slug,
        },
      });

      if (!post) {
        return NextResponse.json(
          {
            error: "VickVerse post not found.",
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        post,
      });
    }

    // --------------------------------------------------
    // PAGINATED POSTS
    // --------------------------------------------------

    const skip = (page - 1) * limit;

    const [posts, totalPosts] = await Promise.all([
      prisma.vickVersePost.findMany({
        where: {
          status: "published",
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),

      prisma.vickVersePost.count({
        where: {
          status: "published",
        },
      }),
    ]);

    const totalPages = Math.max(
      1,
      Math.ceil(totalPosts / limit)
    );

    return NextResponse.json({
      posts,
      totalPosts,
      totalPages,
      currentPage: page,
      limit,
    });
  } catch (error) {
    console.error("VICKVERSE GET ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch VickVerse posts.",
      },
      { status: 500 }
    );
  }
}

// ======================================================
// POST
// CREATE VICKVERSE POST
// ======================================================

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      title,
      slug,
      description,
      content,
      image,
      youtubeUrl,
      category,
      tags,
      isFeatured,
      status,
    } = body;

    // --------------------------------------------------
    // REQUIRED FIELDS
    // --------------------------------------------------

    if (!title || !description || !content || !image) {
      return NextResponse.json(
        {
          error:
            "Title, description, content and image are required.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // SLUG
    // --------------------------------------------------

    let finalSlug = slug
      ? createSlug(slug)
      : createSlug(title);

    const existingPost =
      await prisma.vickVersePost.findUnique({
        where: {
          slug: finalSlug,
        },
      });

    if (existingPost) {
      finalSlug = `${finalSlug}-${Date.now()}`;
    }

    // --------------------------------------------------
    // CREATE
    // --------------------------------------------------

    const post = await prisma.vickVersePost.create({
      data: {
        title: title.trim(),
        slug: finalSlug,
        description: description.trim(),
        content,
        image,
        youtubeUrl: youtubeUrl || null,
        category: category || null,
        tags: tags || null,
        isFeatured: Boolean(isFeatured),
        status: status || "draft",
      },
    });

    return NextResponse.json(
      {
        success: true,
        post,
        message: "VickVerse post created successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("VICKVERSE POST ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create VickVerse post.",
      },
      { status: 500 }
    );
  }
}

// ======================================================
// PATCH
// UPDATE VICKVERSE POST
// ======================================================

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const {
      id,
      title,
      slug,
      description,
      content,
      image,
      youtubeUrl,
      category,
      tags,
      isFeatured,
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

    const existingPost =
      await prisma.vickVersePost.findUnique({
        where: {
          id,
        },
      });

    if (!existingPost) {
      return NextResponse.json(
        {
          error: "VickVerse post not found.",
        },
        { status: 404 }
      );
    }

    // --------------------------------------------------
    // UPDATE DATA
    // --------------------------------------------------

    const data: {
      title?: string;
      slug?: string;
      description?: string;
      content?: string;
      image?: string;
      youtubeUrl?: string | null;
      category?: string | null;
      tags?: string | null;
      isFeatured?: boolean;
      status?: string;
    } = {};

    if (title !== undefined) {
      data.title = title.trim();
    }

    if (description !== undefined) {
      data.description = description.trim();
    }

    if (content !== undefined) {
      data.content = content;
    }

    if (image !== undefined) {
      data.image = image;
    }

    if (youtubeUrl !== undefined) {
      data.youtubeUrl = youtubeUrl || null;
    }

    if (category !== undefined) {
      data.category = category || null;
    }

    if (tags !== undefined) {
      data.tags = tags || null;
    }

    if (isFeatured !== undefined) {
      data.isFeatured = Boolean(isFeatured);
    }

    if (status !== undefined) {
      data.status = status;
    }

    if (slug !== undefined) {
      const newSlug = createSlug(slug);

      const slugOwner =
        await prisma.vickVersePost.findUnique({
          where: {
            slug: newSlug,
          },
        });

      if (slugOwner && slugOwner.id !== id) {
        return NextResponse.json(
          {
            error: "This slug is already being used.",
          },
          { status: 409 }
        );
      }

      data.slug = newSlug;
    }

    const post = await prisma.vickVersePost.update({
      where: {
        id,
      },
      data,
    });

    return NextResponse.json({
      success: true,
      post,
      message: "VickVerse post updated successfully.",
    });
  } catch (error) {
    console.error("VICKVERSE PATCH ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update VickVerse post.",
      },
      { status: 500 }
    );
  }
}

// ======================================================
// DELETE
// DELETE VICKVERSE POST
// ======================================================

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          error: "Post ID is required.",
        },
        { status: 400 }
      );
    }

    const existingPost =
      await prisma.vickVersePost.findUnique({
        where: {
          id,
        },
      });

    if (!existingPost) {
      return NextResponse.json(
        {
          error: "VickVerse post not found.",
        },
        { status: 404 }
      );
    }

    await prisma.vickVersePost.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "VickVerse post deleted successfully.",
    });
  } catch (error) {
    console.error("VICKVERSE DELETE ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete VickVerse post.",
      },
      { status: 500 }
    );
  }
}
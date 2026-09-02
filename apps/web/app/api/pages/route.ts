import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function GET() {
  try {
    const pages = await prisma.page.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      pages,
    });
  } catch (error) {
    console.error("PAGES GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load pages. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const slug =
      typeof body.slug === "string"
        ? body.slug.trim().toLowerCase()
        : "";

    const content =
      typeof body.content === "string"
        ? body.content.trim()
        : "";

    const image =
      typeof body.image === "string" && body.image.trim()
        ? body.image.trim()
        : null;

    const status =
      body.status === "published"
        ? "published"
        : "draft";

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          error: "Page title is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error: "Page slug is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!content) {
      return NextResponse.json(
        {
          success: false,
          error: "Page content is required.",
        },
        {
          status: 400,
        }
      );
    }

    const existingPage = await prisma.page.findUnique({
      where: {
        slug,
      },
    });

    if (existingPage) {
      return NextResponse.json(
        {
          success: false,
          error: "A page with this slug already exists.",
        },
        {
          status: 409,
        }
      );
    }

    const page = await prisma.page.create({
      data: {
        title,
        slug,
        content,
        image,
        status,
      },
    });

    return NextResponse.json(
      {
        success: true,
        page,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("PAGES POST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to create the page. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}
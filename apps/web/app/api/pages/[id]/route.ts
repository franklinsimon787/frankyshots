import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

type Context = {
  params: {
    id: string;
  };
};

export async function GET(
  request: Request,
  context: Context
) {
  try {
    const page = await prisma.page.findUnique({
      where: {
        id: context.params.id,
      },
    });

    if (!page) {
      return NextResponse.json(
        {
          success: false,
          error: "Page not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      page,
    });
  } catch (error) {
    console.error("PAGE GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load the page.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(
  request: Request,
  context: Context
) {
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
      typeof body.image === "string" &&
      body.image.trim()
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

    const existingPage = await prisma.page.findFirst({
      where: {
        slug,
        NOT: {
          id: context.params.id,
        },
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

    const page = await prisma.page.update({
      where: {
        id: context.params.id,
      },
      data: {
        title,
        slug,
        content,
        image,
        status,
      },
    });

    return NextResponse.json({
      success: true,
      page,
    });
  } catch (error) {
    console.error("PAGE UPDATE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to update the page.",
      },
      {
        status: 500,
      }
    );
  }
}
export async function DELETE(
  request: Request,
  context: Context
) {
  try {
    const page = await prisma.page.findUnique({
      where: {
        id: context.params.id,
      },
    });

    if (!page) {
      return NextResponse.json(
        {
          success: false,
          error: "Page not found.",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.page.delete({
      where: {
        id: context.params.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Page deleted successfully.",
    });
  } catch (error) {
    console.error("PAGE DELETE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to delete the page.",
      },
      {
        status: 500,
      }
    );
  }
}
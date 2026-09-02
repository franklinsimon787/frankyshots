import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function GET() {
  try {
    const species = await prisma.species.findMany({
      where: {
        status: "published",
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(species);
  } catch (error) {
    console.error("Failed to fetch species:", error);

    return NextResponse.json(
      { error: "Failed to fetch species" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      slug,
      category,
      location,
      summary,
      featuredImage,
      isFeatured,
      status,
    } = body;

    if (
      !name ||
      !slug ||
      !category ||
      !location ||
      !summary ||
      !featuredImage
    ) {
      return NextResponse.json(
        { error: "All required fields must be filled." },
        { status: 400 }
      );
    }

    const existingSpecies = await prisma.species.findUnique({
      where: {
        slug,
      },
    });

    if (existingSpecies) {
      return NextResponse.json(
        { error: "A species with this slug already exists." },
        { status: 409 }
      );
    }

    const species = await prisma.species.create({
      data: {
        name,
        slug,
        category,
        location,
        summary,
        featuredImage,
        isFeatured: Boolean(isFeatured),
        status: status || "draft",
      },
    });

    return NextResponse.json(species, { status: 201 });
  } catch (error) {
    console.error("Failed to create species:", error);

    return NextResponse.json(
      { error: "Failed to create species" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const {
      id,
      name,
      slug,
      category,
      location,
      summary,
      featuredImage,
      isFeatured,
      status,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Species ID is required." },
        { status: 400 }
      );
    }

    if (
      !name ||
      !slug ||
      !category ||
      !location ||
      !summary ||
      !featuredImage
    ) {
      return NextResponse.json(
        { error: "All required fields must be filled." },
        { status: 400 }
      );
    }

    const existingSpecies = await prisma.species.findUnique({
      where: {
        id,
      },
    });

    if (!existingSpecies) {
      return NextResponse.json(
        { error: "Species not found." },
        { status: 404 }
      );
    }

    const slugOwner = await prisma.species.findUnique({
      where: {
        slug,
      },
    });

    if (slugOwner && slugOwner.id !== id) {
      return NextResponse.json(
        { error: "A species with this slug already exists." },
        { status: 409 }
      );
    }

    const updatedSpecies = await prisma.species.update({
      where: {
        id,
      },
      data: {
        name,
        slug,
        category,
        location,
        summary,
        featuredImage,
        isFeatured: Boolean(isFeatured),
        status: status || "draft",
      },
    });

    return NextResponse.json(updatedSpecies);
  } catch (error) {
    console.error("Failed to update species:", error);

    return NextResponse.json(
      { error: "Failed to update species." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Species ID is required." },
        { status: 400 }
      );
    }

    const existingSpecies = await prisma.species.findUnique({
      where: {
        id,
      },
    });

    if (!existingSpecies) {
      return NextResponse.json(
        { error: "Species not found." },
        { status: 404 }
      );
    }

    await prisma.species.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Species deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete species:", error);

    return NextResponse.json(
      { error: "Failed to delete species." },
      { status: 500 }
    );
  }
}
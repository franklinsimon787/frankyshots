import { NextResponse } from "next/server";
import { prisma } from "@frankyshots/db";

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
        { error: "All required fields are required." },
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
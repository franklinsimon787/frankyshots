import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

// GET — all projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Failed to fetch projects:", error);

    return NextResponse.json(
      { error: "Failed to fetch projects." },
      { status: 500 }
    );
  }
}


// POST — create new project
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      title,
      category,
      description,
      year,
      image,
      isFeatured,

      // Documentary fields
      imdbUrl,
      genre,
      country,
      languages,
      releaseDate,
      production,
      director,
      writer,
      producer,
      cinematography,
      presenter,
      trailerUrl,
    } = body;


    // Basic validation
    if (!title || !category || !description || !year || !image) {
      return NextResponse.json(
        {
          error:
            "Title, category, description, year and image are required.",
        },
        { status: 400 }
      );
    }


    // IMDb is compulsory only for Documentary
    if (
      String(category) === "Documentary" &&
      !String(imdbUrl || "").trim()
    ) {
      return NextResponse.json(
        {
          error:
            "IMDb URL is required for Documentary projects.",
        },
        { status: 400 }
      );
    }


    // Create project
    const project = await prisma.project.create({
      data: {
        title: String(title),
        category: String(category),
        description: String(description),
        year: Number(year),
        image: String(image),
        isFeatured: Boolean(isFeatured),

        // Documentary information
        imdbUrl:
          String(category) === "Documentary"
            ? String(imdbUrl || "").trim()
            : null,

        genre:
          String(category) === "Documentary"
            ? String(genre || "NA").trim() || "NA"
            : null,

        country:
          String(category) === "Documentary"
            ? String(country || "NA").trim() || "NA"
            : null,

        languages:
          String(category) === "Documentary"
            ? String(languages || "NA").trim() || "NA"
            : null,

        releaseDate:
          String(category) === "Documentary"
            ? String(releaseDate || "NA").trim() || "NA"
            : null,

        production:
          String(category) === "Documentary"
            ? String(production || "NA").trim() || "NA"
            : null,

        director:
          String(category) === "Documentary"
            ? String(director || "NA").trim() || "NA"
            : null,

        writer:
          String(category) === "Documentary"
            ? String(writer || "NA").trim() || "NA"
            : null,

        producer:
          String(category) === "Documentary"
            ? String(producer || "NA").trim() || "NA"
            : null,

        cinematography:
          String(category) === "Documentary"
            ? String(cinematography || "NA").trim() || "NA"
            : null,

        presenter:
          String(category) === "Documentary"
            ? String(presenter || "NA").trim() || "NA"
            : null,

        trailerUrl:
          String(category) === "Documentary"
            ? String(trailerUrl || "").trim() || null
            : null,
      },
    });


    return NextResponse.json(project, {
      status: 201,
    });

  } catch (error) {
    console.error("Failed to create project:", error);

    return NextResponse.json(
      { error: "Failed to create project." },
      { status: 500 }
    );
  }
}


// PUT — update existing project
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const {
      id,
      title,
      category,
      description,
      year,
      image,
      isFeatured,

      // Documentary fields
      imdbUrl,
      genre,
      country,
      languages,
      releaseDate,
      production,
      director,
      writer,
      producer,
      cinematography,
      presenter,
      trailerUrl,
    } = body;


    if (!id) {
      return NextResponse.json(
        {
          error: "Project ID is required.",
        },
        { status: 400 }
      );
    }


    if (!title || !category || !description || !year || !image) {
      return NextResponse.json(
        {
          error:
            "Title, category, description, year and image are required.",
        },
        { status: 400 }
      );
    }


    // IMDb compulsory only for Documentary
    if (
      String(category) === "Documentary" &&
      !String(imdbUrl || "").trim()
    ) {
      return NextResponse.json(
        {
          error:
            "IMDb URL is required for Documentary projects.",
        },
        { status: 400 }
      );
    }


    const project = await prisma.project.update({
      where: {
        id: String(id),
      },

      data: {
        title: String(title),
        category: String(category),
        description: String(description),
        year: Number(year),
        image: String(image),
        isFeatured: Boolean(isFeatured),

        imdbUrl:
          String(category) === "Documentary"
            ? String(imdbUrl || "").trim()
            : null,

        genre:
          String(category) === "Documentary"
            ? String(genre || "NA").trim() || "NA"
            : null,

        country:
          String(category) === "Documentary"
            ? String(country || "NA").trim() || "NA"
            : null,

        languages:
          String(category) === "Documentary"
            ? String(languages || "NA").trim() || "NA"
            : null,

        releaseDate:
          String(category) === "Documentary"
            ? String(releaseDate || "NA").trim() || "NA"
            : null,

        production:
          String(category) === "Documentary"
            ? String(production || "NA").trim() || "NA"
            : null,

        director:
          String(category) === "Documentary"
            ? String(director || "NA").trim() || "NA"
            : null,

        writer:
          String(category) === "Documentary"
            ? String(writer || "NA").trim() || "NA"
            : null,

        producer:
          String(category) === "Documentary"
            ? String(producer || "NA").trim() || "NA"
            : null,

        cinematography:
          String(category) === "Documentary"
            ? String(cinematography || "NA").trim() || "NA"
            : null,

        presenter:
          String(category) === "Documentary"
            ? String(presenter || "NA").trim() || "NA"
            : null,

        trailerUrl:
          String(category) === "Documentary"
            ? String(trailerUrl || "").trim() || null
            : null,
      },
    });


    return NextResponse.json(project);

  } catch (error) {
    console.error("Failed to update project:", error);

    return NextResponse.json(
      { error: "Failed to update project." },
      { status: 500 }
    );
  }
}


// DELETE — delete project
export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    const { id } = body;

    if (!id) {
      return NextResponse.json(
        {
          error: "Project ID is required.",
        },
        { status: 400 }
      );
    }


    await prisma.project.delete({
      where: {
        id: String(id),
      },
    });


    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error("Failed to delete project:", error);

    return NextResponse.json(
      { error: "Failed to delete project." },
      { status: 500 }
    );
  }
}
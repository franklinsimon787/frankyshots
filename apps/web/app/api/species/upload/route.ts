import { NextResponse } from "next/server";
import { env } from "cloudflare:workers";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No image file received." },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed." },
        { status: 400 }
      );
    }

    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const safeName =
      file.name
        .replace(/\.[^/.]+$/, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "species";

    const fileName = `${safeName}-${Date.now()}.${extension}`;
    const objectKey = `species/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();

    await env.FRANKYSHOTS_MEDIA.put(objectKey, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
      },
    });

    const imagePath = `/api/species/media/${fileName}`;

    return NextResponse.json(
      {
        success: true,
        imagePath,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Image upload failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to upload image.",
      },
      { status: 500 }
    );
  }
}

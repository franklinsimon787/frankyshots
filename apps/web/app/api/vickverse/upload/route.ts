import { NextResponse } from "next/server";
import { env } from "cloudflare:workers";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "No image file was uploaded.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------
    // CHECK FILE TYPE
    // ---------------------------------------------

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid image type. Only JPG, PNG, WEBP and GIF are allowed.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------
    // CHECK FILE SIZE
    // ---------------------------------------------

    const maxSize = 10 * 1024 * 1024; // 10 MB

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: "Image size must be less than 10 MB.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------
    // CREATE SAFE FILE NAME
    // ---------------------------------------------

    const originalName = file.name || "image";

    const lastDot = originalName.lastIndexOf(".");
    const extension =
      lastDot >= 0
        ? originalName.substring(lastDot).toLowerCase()
        : ".jpg";

    const safeName = `vickverse-${Date.now()}-${crypto
      .randomUUID()
      .replace(/-/g, "")
      .substring(0, 8)}${extension}`;

    const objectKey = `vickverse/${safeName}`;

    // ---------------------------------------------
    // CONVERT FILE TO BUFFER
    // ---------------------------------------------

    const arrayBuffer = await file.arrayBuffer();

    // ---------------------------------------------
    // UPLOAD TO CLOUDFLARE R2
    // ---------------------------------------------

    await env.FRANKYSHOTS_MEDIA.put(objectKey, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
      },
    });

    // ---------------------------------------------
    // PUBLIC IMAGE URL
    // ---------------------------------------------

    const imageUrl = `/api/vickverse/media/${safeName}`;

    return NextResponse.json({
      success: true,
      url: imageUrl,
      image: imageUrl,
      filename: safeName,
      message: "VickVerse image uploaded successfully.",
    });
  } catch (error) {
    console.error("VICKVERSE IMAGE UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to upload VickVerse image.",
      },
      { status: 500 }
    );
  }
}
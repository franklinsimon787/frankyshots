import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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

    const extension =
      path.extname(originalName).toLowerCase() || ".jpg";

    const safeName = `vickverse-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)}${extension}`;

    // ---------------------------------------------
    // UPLOAD DIRECTORY
    // ---------------------------------------------

    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads",
      "vickverse"
    );

    await mkdir(uploadDirectory, {
      recursive: true,
    });

    // ---------------------------------------------
    // CONVERT FILE TO BUFFER
    // ---------------------------------------------

    const arrayBuffer = await file.arrayBuffer();
const bytes = new Uint8Array(arrayBuffer);

const filePath = path.join(
  uploadDirectory,
  safeName
);

await writeFile(filePath, bytes);

    // ---------------------------------------------
    // PUBLIC IMAGE URL
    // ---------------------------------------------

    const imageUrl = `/uploads/vickverse/${safeName}`;

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
import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "No image file was provided.",
        },
        {
          status: 400,
        }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          success: false,
          error: "Only image files are allowed.",
        },
        {
          status: 400,
        }
      );
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: "Image size must be under 10 MB.",
        },
        {
          status: 400,
        }
      );
    }

    const extensionMap: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
    };

    const extension = extensionMap[file.type];

    if (!extension) {
      return NextResponse.json(
        {
          success: false,
          error: "Supported formats are JPG, PNG and WEBP.",
        },
        {
          status: 400,
        }
      );
    }

    const fileName = `page-${randomUUID()}.${extension}`;

    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads",
      "pages"
    );

    await mkdir(uploadDirectory, {
      recursive: true,
    });

    const filePath = path.join(
      uploadDirectory,
      fileName
    );

    const arrayBuffer = await file.arrayBuffer();

    const imageData = new Uint8Array(arrayBuffer);

    await writeFile(filePath, imageData);

    const imageUrl = `/uploads/pages/${fileName}`;

    return NextResponse.json({
      success: true,
      url: imageUrl,
      fileName,
    });
  } catch (error) {
    console.error("IMAGE UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to upload image.",
      },
      {
        status: 500,
      }
    );
  }
}
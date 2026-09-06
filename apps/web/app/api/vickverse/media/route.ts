import { env } from "cloudflare:workers";

export async function GET(
  _request: Request,
  context: {
    params: Promise<{ filename: string }>;
  }
) {
  try {
    const { filename } = await context.params;

    if (!filename) {
      return new Response("File not found", { status: 404 });
    }

    const objectKey = `vickverse/${filename}`;

    const object = await env.FRANKYSHOTS_MEDIA.get(objectKey);

    if (!object) {
      return new Response("File not found", { status: 404 });
    }

    const headers = new Headers();

    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("cache-control", "public, max-age=31536000, immutable");

    return new Response(object.body, {
      headers,
    });
  } catch (error) {
    console.error("VICKVERSE MEDIA SERVE ERROR:", error);

    return new Response("Failed to load image", {
      status: 500,
    });
  }
}
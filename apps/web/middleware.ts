import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ======================================================
  // LOGIN PAGE
  // ======================================================

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // ======================================================
  // ONLY /admin ROUTES
  // ======================================================

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // ======================================================
  // SESSION
  // ======================================================

  const token = request.cookies.get(
    "frankyshots_admin_session"
  )?.value;

  if (!token) {
    return NextResponse.redirect(
      new URL("/admin/login", request.url)
    );
  }

  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    console.error("AUTH_SECRET is not configured.");

    return NextResponse.redirect(
      new URL("/admin/login", request.url)
    );
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );

    const role = String(payload.role || "");

    // ====================================================
    // REQUEST HEADERS
    // ====================================================

    const requestHeaders = new Headers(request.headers);

    requestHeaders.set("x-pathname", pathname);

    // ====================================================
    // VICKVERSE ADMIN
    // ====================================================

    if (role === "VICKVERSE_ADMIN") {
      /*
       * VickVerse admin can access:
       *
       * /admin/vickverse
       * /admin/vickverse/...
       *
       * AND its admin API:
       *
       * /admin/api/vickverse
       * /admin/api/vickverse/...
       */

      const isVickVersePage =
        pathname === "/admin/vickverse" ||
        pathname.startsWith("/admin/vickverse/");

      const isVickVerseApi =
        pathname === "/admin/api/vickverse" ||
        pathname.startsWith("/admin/api/vickverse/");

      if (!isVickVersePage && !isVickVerseApi) {
        return NextResponse.redirect(
          new URL("/admin/vickverse", request.url)
        );
      }
    }

    // ====================================================
    // SUPER ADMIN
    // ====================================================

    if (role === "SUPER_ADMIN") {
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    // ====================================================
    // VICKVERSE ADMIN
    // ====================================================

    if (role === "VICKVERSE_ADMIN") {
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    // ====================================================
    // UNKNOWN ROLE
    // ====================================================

    const response = NextResponse.redirect(
      new URL("/admin/login", request.url)
    );

    response.cookies.delete("frankyshots_admin_session");

    return response;
  } catch (error) {
    console.error("Invalid admin session:", error);

    const response = NextResponse.redirect(
      new URL("/admin/login", request.url)
    );

    response.cookies.delete("frankyshots_admin_session");

    return response;
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
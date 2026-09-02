import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Login page ko public rakho
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Sirf /admin ke andar ke pages protect karo
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("frankyshots_admin_session")?.value;

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
      await jwtVerify(
        token,
        new TextEncoder().encode(secret)
      );

      return NextResponse.next();
    } catch (error) {
      console.error("Invalid admin session:", error);

      const response = NextResponse.redirect(
        new URL("/admin/login", request.url)
      );

      response.cookies.delete("frankyshots_admin_session");

      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();

    cookieStore.set("frankyshots_admin_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return NextResponse.json({
      success: true,
      message: "Logout successful.",
    });
  } catch (error) {
    console.error("Admin logout failed:", error);

    return NextResponse.json(
      { error: "Unable to logout." },
      { status: 500 }
    );
  }
}
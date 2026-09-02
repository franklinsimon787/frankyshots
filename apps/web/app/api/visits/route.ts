import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";


// =====================================================
// RECORD WEBSITE VISIT
// =====================================================

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const path =
      typeof body.path === "string" && body.path.trim()
        ? body.path.trim()
        : "/";

    await prisma.websiteVisit.create({
      data: {
        path,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("VISIT TRACKING ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Visit record nahi ho paayi.",
      },
      {
        status: 500,
      }
    );
  }
}


// =====================================================
// GET VISITOR STATISTICS
// =====================================================

export async function GET() {
  try {
    const visits = await prisma.websiteVisit.findMany({
      orderBy: {
        createdAt: "asc",
      },
      select: {
        createdAt: true,
        path: true,
      },
    });

    return NextResponse.json({
      success: true,
      visits,
    });
  } catch (error) {
    console.error("VISIT STATS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Visitor data load nahi ho paaya.",
      },
      {
        status: 500,
      }
    );
  }
}
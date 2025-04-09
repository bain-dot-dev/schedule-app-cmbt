import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET a single room by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params object before accessing its properties
    const { id } = await params;

    const room = await prisma.sectionCourse.findUnique({
      where: { SectionCourseID: id },
      include: {
        section: true,
        courseProgram: true,
      },
    });

    if (!room) {
      return NextResponse.json(
        { error: "Room member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(room);
  } catch (error) {
    console.error("Error fetching room:", error);
    return NextResponse.json(
      { error: "Failed to fetch room data" },
      { status: 500 }
    );
  }
}

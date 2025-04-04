import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all faculty members
export async function GET() {
  try {
    const faculty = await prisma.faculty.findMany({
      orderBy: {
        lastName: "asc",
      },
    });

    return NextResponse.json(faculty);
  } catch (error) {
    console.error("Error fetching faculty:", error);
    return NextResponse.json(
      { error: "Failed to fetch faculty members" },
      { status: 500 }
    );
  }
}

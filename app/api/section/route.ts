import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// This would typically connect to your database
// For demo purposes, we're using an in-memory array
const sections = [
  {
    id: "1",
    sectionName: "2D",
    courseProgram: "BSHM",
  },
  {
    id: "2",
    sectionName: "1A",
    courseProgram: "BSIT",
  },
];

export async function GET() {
  const sections = await prisma.section.findMany();
  // Return all sections
  return NextResponse.json(sections);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.sectionName || !data.courseProgram) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if section name already exists
    if (
      sections.some(
        (section) =>
          section.sectionName === data.sectionName &&
          section.courseProgram === data.courseProgram
      )
    ) {
      return NextResponse.json(
        { error: "Section already exists for this course program" },
        { status: 400 }
      );
    }

    // Create a new section with a generated ID
    const newSection = {
      id: Date.now().toString(),
      sectionName: data.sectionName,
      courseProgram: data.courseProgram,
    };

    // Add to our "database"
    sections.push(newSection);

    return NextResponse.json(newSection, { status: 201 });
  } catch (error) {
    console.error("Error creating section:", error);
    return NextResponse.json(
      { error: "Failed to create section" },
      { status: 500 }
    );
  }
}

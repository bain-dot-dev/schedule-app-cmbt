import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// This would typically connect to your database
// For demo purposes, we're using an in-memory array
// const courses = [
//   {
//     id: "1",
//     courseCode: "HM",
//     courseProgram: "BSHM",
//   },
//   {
//     id: "2",
//     courseCode: "IT",
//     courseProgram: "BSIT",
//   },
// ]

export async function GET() {
  // Return all courses
  const courses = await prisma.courseProgram.findMany()
  return NextResponse.json(courses)
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.courseCode || !data.courseProgram) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if course code already exists
    const existingCourse = await prisma.courseProgram.findUnique({
      where: { courseCode: data.courseCode },
    });

    if (existingCourse) {
      return NextResponse.json(
        { error: "Course code already exists" },
        { status: 400 }
      );
    }

    // Create a new course in the database
    const newCourse = await prisma.courseProgram.create({
      data: {
        courseCode: data.courseCode,
        courseProgram: data.courseProgram,
      },
    });

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}



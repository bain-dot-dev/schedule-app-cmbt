import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Reference to the same "database" from the main route
// let courses = [
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

// export async function GET(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   const id = params.id;
//   const course = courses.find((c) => c.id === id);

//   if (!course) {
//     return NextResponse.json({ error: "Course not found" }, { status: 404 });
//   }

//   return NextResponse.json(course);
// }

// export async function PUT(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const id = params.id;
//     const data = await request.json();

//     // Find the existing course
//     const existingCourse = await prisma.courseProgram.findUnique({
//       where: { courseProgramID: id },
//     });

//     if (!existingCourse) {
//       return NextResponse.json({ error: "Course not found" }, { status: 404 });
//     }

//     // Validate required fields
//     if (!data.courseCode || !data.courseProgram) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // Check if the new course code already exists (excluding current course)
//     const duplicateCourse = await prisma.courseProgram.findFirst({
//       where: {
//         courseCode: data.courseCode,
//         NOT: { courseProgramID: id },
//       },
//     });

//     if (duplicateCourse) {
//       return NextResponse.json(
//         { error: "Course code already exists" },
//         { status: 400 }
//       );
//     }

//     // Update the course in the database
//     const updatedCourse = await prisma.courseProgram.update({
//       where: { courseProgramID: id },
//       data: {
//         courseCode: data.courseCode,
//         courseProgram: data.courseProgram,
//       },
//     });

//     return NextResponse.json(updatedCourse);
//   } catch (error) {
//     console.error("Error updating course:", error);
//     return NextResponse.json(
//       { error: "Failed to update course" },
//       { status: 500 }
//     );
//   }
// }

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params object before accessing its properties
    const { id } = await params;
    const data = await request.json();
    const { courseProgram } = data;

    // Validate required fields
    if (!courseProgram) {
      return NextResponse.json(
        { error: "Course code and program name are required" },
        { status: 400 }
      );
    }

    // Check if course exists
    const existingCourse = await prisma.courseProgram.findUnique({
      where: { courseProgramID: id },
    });

    if (!existingCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if another course with the same code or name exists
    const duplicateCourse = await prisma.courseProgram.findFirst({
      where: {
        AND: [
          { courseProgramID: { not: id } },
          {
            OR: [{ courseProgram }],
          },
        ],
      },
    });

    if (duplicateCourse) {
      return NextResponse.json(
        { error: "Another course with this code or name already exists" },
        { status: 400 }
      );
    }

    // List of words to ignore
    const wordsToIgnore = [
      "a",
      "an",
      "the",
      "of",
      "and",
      "in",
      "for",
      "on",
      "to",
      "at",
      "with",
      "by",
      "is",
      "are",
      "was",
      "were",
      "be",
      "being",
      "been",
    ];

    // Generate the course code by excluding the unwanted words
    const courseCode: string = data.courseProgram
      .split(" ")
      .filter((word: string) => !wordsToIgnore.includes(word.toLowerCase())) // Exclude the words in the list
      .map((word: string) => word.charAt(0).toUpperCase()) // Take the first letter of each word
      .join(""); // Join the letters to form the course code

    // Update course
    const updatedCourse = await prisma.courseProgram.update({
      where: { courseProgramID: id },
      data: {
        courseCode,
        courseProgram,
      },
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}

// export async function DELETE(request: Request, { params }: { params: { id: string } }) {
//   const id = params.id

//   // Find the course
//   const index = courses.findIndex((c) => c.id === id)

//   if (index === -1) {
//     return NextResponse.json({ error: "Course not found" }, { status: 404 })
//   }

//   // Remove the course
//   courses = courses.filter((c) => c.id !== id)

//   return NextResponse.json({ success: true })
// }

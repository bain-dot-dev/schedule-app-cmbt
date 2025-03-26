import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// This would typically connect to your database
// For demo purposes, we're using an in-memory array
// const sections = [
//   {
//     id: "1",
//     sectionName: "2D",
//     courseProgram: "BSHM",
//   },
//   {
//     id: "2",
//     sectionName: "1A",
//     courseProgram: "BSIT",
//   },
// ];

// export async function GET() {
//   const sections = await prisma.sectionCourse.findMany();
//   // Return all sections
//   return NextResponse.json(sections);
// }

export async function GET() {
  try {
    const sectionCourses = await prisma.sectionCourse.findMany({
      include: {
        section: true,
        courseProgram: true,
      },
      orderBy: {
        section: {
          sectionName: "asc",
        },
      },
    })

    return NextResponse.json(sectionCourses)
  } catch (error) {
    console.error("Error fetching section courses:", error)
    return NextResponse.json({ error: "Failed to fetch section courses" }, { status: 500 })
  }
}

// export async function POST(request: Request) {
//   try {
//     const data = await request.json();

//     // Validate required fields
//     if (!data.sectionName || !data.courseProgram) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // Check if section name already exists
//     if (
//       sections.some(
//         (section) =>
//           section.sectionName === data.sectionName &&
//           section.courseProgram === data.courseProgram
//       )
//     ) {
//       return NextResponse.json(
//         { error: "Section already exists for this course program" },
//         { status: 400 }
//       );
//     }

//     // Create a new section with a generated ID
//     const newSection = {
//       id: Date.now().toString(),
//       sectionName: data.sectionName,
//       courseProgram: data.courseProgram,
//     };

//     // Add to our "database"
//     sections.push(newSection);

//     return NextResponse.json(newSection, { status: 201 });
//   } catch (error) {
//     console.error("Error creating section:", error);
//     return NextResponse.json(
//       { error: "Failed to create section" },
//       { status: 500 }
//     );
//   }
// }

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { sectionName, courseProgram } = data;

    // Validate required fields
    if (!sectionName || !courseProgram) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if section exists, if not, create it
    let section = await prisma.section.findUnique({
      where: { sectionName },
    });

    if (!section) {
      section = await prisma.section.create({
        data: { sectionName },
      });
    }

    // Check if course program exists
    const course = await prisma.courseProgram.findUnique({
      where: { courseProgram },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course program does not exist" },
        { status: 400 }
      );
    }

    // Check if the SectionCourse relationship already exists
    const existingSectionCourse = await prisma.sectionCourse.findFirst({
      where: {
        sectionID: section.sectionID,
        courseProgramID: course.courseProgramID,
      },
    });

    if (existingSectionCourse) {
      return NextResponse.json(
        { error: "Section already exists for this course program" },
        { status: 400 }
      );
    }

    // Insert into SectionCourse table
    const newSectionCourse = await prisma.sectionCourse.create({
      data: {
        sectionID: section.sectionID,
        courseProgramID: course.courseProgramID,
      },
    });

    return NextResponse.json(newSectionCourse, { status: 201 });
  } catch (error) {
    console.error("Error creating section:", error);
    return NextResponse.json(
      { error: "Failed to create section" },
      { status: 500 }
    );
  }
}

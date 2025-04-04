import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// export async function GET() {
//   const sections = await prisma.sectionCourse.findMany({
//     include: {
//       section: true,
//       courseProgram: true,
//     },
//     orderBy: {
//       section: {
//         sectionName: "asc",
//       },
//     },
//   });
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
    });

    // Transform the data to include all necessary information
    const formattedSections = sectionCourses.map((sc) => ({
      sectionCourseID: sc.SectionCourseID,
      sectionID: sc.sectionID,
      courseProgramID: sc.courseProgramID,
      section: {
        sectionID: sc.section.sectionID,
        sectionName: sc.section.sectionName,
      },
      courseProgram: {
        courseProgramID: sc.courseProgram.courseProgramID,
        courseCode: sc.courseProgram.courseCode,
        courseProgram: sc.courseProgram.courseProgram,
      },
    }));

    return NextResponse.json(formattedSections);
  } catch (error) {
    console.error("Error fetching sections:", error);
    return NextResponse.json(
      { error: "Failed to fetch sections" },
      { status: 500 }
    );
  }
}

// export async function GET() {
//   try {
//     const sectionCourses = await prisma.sectionCourse.findMany({
//       include: {
//         section: true,
//         courseProgram: true,
//       },
//       orderBy: {
//         section: {
//           sectionName: "asc",
//         },
//       },
//     })

//     return NextResponse.json(sectionCourses)
//   } catch (error) {
//     console.error("Error fetching section courses:", error)
//     return NextResponse.json({ error: "Failed to fetch section courses" }, { status: 500 })
//   }
// }

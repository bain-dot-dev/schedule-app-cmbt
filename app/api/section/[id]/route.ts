import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params object before accessing its properties
    const { id } = await params;

    // Find the section
    const section = await prisma.section.findUnique({
      where: { sectionID: id },
      include: {
        sectionCourses: {
          include: {
            courseProgram: true,
          },
        },
      },
    });

    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    // Format the response
    const formattedSection = {
      id: section.sectionID,
      sectionName: section.sectionName,
      courseProgram:
        section.sectionCourses[0]?.courseProgram?.courseProgram || null,
      courseProgramID:
        section.sectionCourses[0]?.courseProgram?.courseProgramID || null,
    };

    return NextResponse.json(formattedSection);
  } catch (error) {
    console.error("Error fetching section:", error);
    return NextResponse.json(
      { error: "Failed to fetch section" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params object before accessing its properties
    const { id } = await params;
    const data = await request.json();
    const { sectionName, courseProgram } = data;

    // Validate required fields
    if (!sectionName || !courseProgram) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if section exists
    const section = await prisma.section.findUnique({
      where: { sectionID: id },
      include: {
        sectionCourses: true,
      },
    });

    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
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

    // Start a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Update section name if it changed
      if (section.sectionName !== sectionName) {
        // Check if another section with the same name exists
        const existingSection = await tx.section.findFirst({
          where: {
            sectionName,
            sectionID: { not: id },
          },
        });

        if (existingSection) {
          throw new Error("A section with this name already exists");
        }

        // Update the section name
        await tx.section.update({
          where: { sectionID: id },
          data: { sectionName },
        });
      }

      // Check if the course program changed
      const currentCourseRelation = section.sectionCourses[0];

      if (
        !currentCourseRelation ||
        currentCourseRelation.courseProgramID !== course.courseProgramID
      ) {
        // Check if the new relationship already exists for another section
        const existingSectionCourse = await tx.sectionCourse.findFirst({
          where: {
            sectionID: id,
            courseProgramID: course.courseProgramID,
          },
        });

        if (existingSectionCourse) {
          throw new Error(
            "This section is already associated with this course program"
          );
        }

        // Delete existing relationships for this section
        if (currentCourseRelation) {
          await tx.sectionCourse.deleteMany({
            where: { sectionID: id },
          });
        }

        // Create new relationship
        await tx.sectionCourse.create({
          data: {
            sectionID: id,
            courseProgramID: course.courseProgramID,
          },
        });
      }

      // Get the updated section with its relationships
      const updatedSection = await tx.section.findUnique({
        where: { sectionID: id },
        include: {
          sectionCourses: {
            include: {
              courseProgram: true,
            },
          },
        },
      });

      return updatedSection;
    });

    // Format the response
    const formattedResult = {
      id: result?.sectionID,
      sectionName: result?.sectionName,
      courseProgram:
        result?.sectionCourses[0]?.courseProgram?.courseProgram || null,
      courseProgramID:
        result?.sectionCourses[0]?.courseProgram?.courseProgramID || null,
    };

    return NextResponse.json(formattedResult);
  } catch (error) {
    console.error("Error updating section:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update section",
      },
      { status: 500 }
    );
  }
}

// export async function DELETE(request: Request, { params }: { params: { id: string } }) {
//   try {
//     const id = params.id

//     // Check if section exists
//     const section = await prisma.section.findUnique({
//       where: { sectionID: id },
//     })

//     if (!section) {
//       return NextResponse.json({ error: "Section not found" }, { status: 404 })
//     }

//     // Delete section and its relationships
//     await prisma.$transaction([
//       // First delete the relationships
//       prisma.sectionCourse.deleteMany({
//         where: { sectionID: id },
//       }),
//       // Then delete the section
//       prisma.section.delete({
//         where: { sectionID: id },
//       }),
//     ])

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("Error deleting section:", error)
//     return NextResponse.json({ error: "Failed to delete section" }, { status: 500 })
//   }
// }

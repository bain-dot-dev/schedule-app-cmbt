import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { facultyFormSchema } from "@/schemas/faculty.schema";

const prisma = new PrismaClient();

// GET a specific faculty member

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params object before accessing its properties
    const { id } = await params;

    const faculty = await prisma.faculty.findUnique({
      where: { facultyID: id },
      include: {
        CourseProgram: true,
      },
    });

    if (!faculty) {
      return NextResponse.json(
        { error: "Faculty member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(faculty);
  } catch (error) {
    console.error("Error fetching faculty:", error);
    return NextResponse.json(
      { error: "Failed to fetch faculty member" },
      { status: 500 }
    );
  }
}

// UPDATE a faculty member
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params object before accessing its properties
    const { id } = await params;
    const data = await req.json();

    // Validate the request data
    const validatedData = facultyFormSchema.parse(data);

    // Check if faculty exists
    const existingFaculty = await prisma.faculty.findUnique({
      where: { facultyID: id },
    });

    if (!existingFaculty) {
      return NextResponse.json(
        { error: "Faculty member not found" },
        { status: 404 }
      );
    }

    // Check if another faculty has the same employee number
    if (validatedData.employeeNumber !== existingFaculty.employeeNumber) {
      const duplicateEmployee = await prisma.faculty.findUnique({
        where: { employeeNumber: validatedData.employeeNumber },
      });

      if (duplicateEmployee) {
        return NextResponse.json(
          {
            error:
              "Another faculty member with this employee number already exists",
          },
          { status: 400 }
        );
      }
    }

    // Get department ID from department code
    const department = await prisma.courseProgram.findUnique({
      where: { courseCode: validatedData.department },
    });

    if (!department) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 400 }
      );
    }

    // Update the faculty member
    const updatedFaculty = await prisma.faculty.update({
      where: { facultyID: id },
      data: {
        firstName: validatedData.firstName,
        middleName: validatedData.middleName || "",
        lastName: validatedData.lastName,
        employeeNumber: validatedData.employeeNumber,
        rank: validatedData.rank,
        courseProgramID: department.courseProgramID,
      },
      include: {
        CourseProgram: true,
      },
    });

    return NextResponse.json(updatedFaculty);
  } catch (error) {
    console.error("Error updating faculty:", error);

    return NextResponse.json(
      { error: "Failed to update faculty member" },
      { status: 500 }
    );
  }
}

// DELETE a faculty member
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Check if faculty exists
    const existingFaculty = await prisma.faculty.findUnique({
      where: { facultyID: id },
    });

    if (!existingFaculty) {
      return NextResponse.json(
        { error: "Faculty member not found" },
        { status: 404 }
      );
    }

    // Delete the faculty member
    await prisma.faculty.delete({
      where: { facultyID: id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting faculty:", error);
    return NextResponse.json(
      { error: "Failed to delete faculty member" },
      { status: 500 }
    );
  }
}

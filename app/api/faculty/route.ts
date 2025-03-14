import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// This would typically connect to your database
// For demo purposes, we're using an in-memory array
// const facultyMembers = [
//   {
//     id: "1",
//     firstName: "John",
//     middleName: "Domingo",
//     lastName: "Dela Fuente",
//     employeeNumber: "2010413702099",
//     department: "CMBT",
//     rank: "Instructor 1",
//   },
//   {
//     id: "2",
//     firstName: "Maria",
//     middleName: "Santos",
//     lastName: "Cruz",
//     employeeNumber: "2011523804123",
//     department: "CICS",
//     rank: "Assistant Professor 1",
//   },
// ]

export async function GET() {
  // Return all faculty members

  const facultyMembers = await prisma.faculty.findMany({
    include: { department: true, rank: true },
  });
  return NextResponse.json(facultyMembers);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (
      !data.firstName ||
      !data.lastName ||
      !data.employeeNumber ||
      !data.department ||
      !data.rank
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find department and rank
    const department = await prisma.department.findUnique({
      where: { departmentName: data.department },
    });

    const rank = await prisma.rank.findUnique({
      where: { rankName: data.rank },
    });

    if (!department || !rank) {
      return NextResponse.json(
        { error: "Invalid department or rank" },
        { status: 400 }
      );
    }

    // Create faculty member in database
    const newFaculty = await prisma.faculty.create({
      data: {
        firstName: data.firstName,
        middleName: data.middleName || "",
        lastName: data.lastName,
        employeeNumber: data.employeeNumber,
        departmentID: department.departmentID,
        rankID: rank.rankID,
      },
    });

    return NextResponse.json(newFaculty, { status: 201 });
  } catch (error) {
    console.error("Error creating faculty:", error);
    return NextResponse.json(
      { error: "Failed to create faculty member" },
      { status: 500 }
    );
  }
}

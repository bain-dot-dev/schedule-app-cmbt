import { NextResponse } from "next/server";

// Reference to the same "database" from the main route
// In a real app, you'd import your database client here
let facultyMembers = [
  {
    id: "1",
    firstName: "John",
    middleName: "Domingo",
    lastName: "Dela Fuente",
    employeeNumber: "2010413702099",
    department: "CMBT",
    rank: "Instructor 1",
  },
  {
    id: "2",
    firstName: "Maria",
    middleName: "Santos",
    lastName: "Cruz",
    employeeNumber: "2011523804123",
    department: "CICS",
    rank: "Assistant Professor 1",
  },
];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const faculty = facultyMembers.find((f) => f.id === id);

  if (!faculty) {
    return NextResponse.json(
      { error: "Faculty member not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(faculty);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await request.json();

    // Find the faculty member
    const index = facultyMembers.findIndex((f) => f.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "Faculty member not found" },
        { status: 404 }
      );
    }

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

    // Update the faculty member
    const updatedFaculty = {
      ...facultyMembers[index],
      firstName: data.firstName,
      middleName: data.middleName || "",
      lastName: data.lastName,
      employeeNumber: data.employeeNumber,
      department: data.department,
      rank: data.rank,
    };

    facultyMembers[index] = updatedFaculty;

    return NextResponse.json(updatedFaculty);
  } catch (error) {
    console.error("Error updating faculty:", error);
    return NextResponse.json(
      { error: "Failed to update faculty member" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  // Find the faculty member
  const index = facultyMembers.findIndex((f) => f.id === id);

  if (index === -1) {
    return NextResponse.json(
      { error: "Faculty member not found" },
      { status: 404 }
    );
  }

  // Remove the faculty member
  facultyMembers = facultyMembers.filter((f) => f.id !== id);

  return NextResponse.json({ success: true });
}

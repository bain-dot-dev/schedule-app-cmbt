import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Reference to the same "database" from the main route
// let subjects = [
//   {
//     id: "1",
//     subjectName: "MATH101",
//     subjectCode: "M101",
//     numberOfUnits: "3",
//   },
//   {
//     id: "2",
//     subjectName: "ENG101",
//     subjectCode: "E101",
//     numberOfUnits: "3",
//   },
// ];

// export async function GET(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   const id = params.id;
//   const subject = subjects.find((s) => s.id === id);

//   if (!subject) {
//     return NextResponse.json({ error: "Subject not found" }, { status: 404 });
//   }

//   return NextResponse.json(subject);
// }

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await request.json();

    // Validate required fields
    if (!data.subjectName || !data.subjectCode || !data.numberOfUnits) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Convert numberOfUnits to an integer
    // const numberOfUnits = Number(data.numberOfUnits);
    // if (isNaN(numberOfUnits) || numberOfUnits <= 0) {
    //   return NextResponse.json(
    //     { error: "Invalid number of units" },
    //     { status: 400 }
    //   );
    // }

    // Check if the subject exists
    const existingSubject = await prisma.subject.findUnique({
      where: { subjectID: id },
    });

    if (!existingSubject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    // Check if the new subject code already exists (excluding current subject)
    const duplicateSubject = await prisma.subject.findFirst({
      where: {
        subjectCode: data.subjectCode,
        NOT: { subjectID: id },
      },
    });

    if (duplicateSubject) {
      return NextResponse.json(
        { error: "Subject code already exists" },
        { status: 400 }
      );
    }

    // Update the subject
    const updatedSubject = await prisma.subject.update({
      where: { subjectID: id },
      data: {
        subjectName: data.subjectName,
        subjectCode: data.subjectCode,
        numberOfUnits: data.numberOfUnits,
      },
    });

    return NextResponse.json(updatedSubject, { status: 200 });
  } catch (error) {
    console.error("Error updating subject:", error);
    return NextResponse.json(
      { error: "Failed to update subject" },
      { status: 500 }
    );
  }
}

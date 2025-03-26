import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// This would typically connect to your database
// For demo purposes, we're using an in-memory array
// const subjects = [
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
// ]

export async function GET() {
  // Return all subjects
  const subjects = await prisma.subject.findMany();
  return NextResponse.json(subjects);
}

// export async function POST(request: Request) {
//   try {
//     const data = await request.json();
//     console.log("Request Body:", request.body);
//     console.log(data);

//     // Validate required fields
//     if (!data.subjectName || !data.subjectCode || isNaN(data.numberOfUnits)) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // Check if subject name or subject code already exists
//     const existingSubject = await prisma.subject.findFirst({
//       where: {
//         OR: [
//           { subjectCode: data.subjectCode },
//           { subjectName: data.subjectName },
//         ],
//       },
//     });

//     if (existingSubject) {
//       return NextResponse.json(
//         { error: "Subject name or subject code already exists" },
//         { status: 400 }
//       );
//     }

//     // Create a new subject in the database
//     const newSubject = await prisma.subject.create({
//       data: {
//         subjectName: data.subjectName,
//         subjectCode: data.subjectCode,
//         numberOfUnits: data.numberOfUnits,
//       },
//     });

//     return NextResponse.json(newSubject, { status: 201 });
//   } catch (error) {
//     console.error("Error creating subject:", error);
//     return NextResponse.json(
//       { error: "Failed to create subject" },
//       { status: 500 }
//     );
//   }
// }

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("Request Body:", data);

    // Validate required fields
    if (!data.subjectName || isNaN(data.numberOfUnits)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate subject code from subject name
    let subjectCode = data.subjectName
      .split(" ")
      .map((word: string) => word.charAt(0).toUpperCase())
      .join("");

    // Check if subject code already exists and append a number if needed
    let existingSubject = await prisma.subject.findFirst({
      where: { subjectCode },
    });

    let counter = 1;
    while (existingSubject) {
      subjectCode = subjectCode + counter;
      existingSubject = await prisma.subject.findFirst({
        where: { subjectCode },
      });
      counter++;
    }

    // Create a new subject in the database
    const newSubject = await prisma.subject.create({
      data: {
        subjectName: data.subjectName,
        subjectCode,
        numberOfUnits: data.numberOfUnits,
      },
    });

    return NextResponse.json(newSubject, { status: 201 });
  } catch (error) {
    console.error("Error creating subject:", error);
    return NextResponse.json(
      { error: "Failed to create subject" },
      { status: 500 }
    );
  }
}
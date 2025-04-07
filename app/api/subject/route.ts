import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get pagination parameters from the URL
    const searchParams = request.nextUrl.searchParams;
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination metadata
    const totalItems = await prisma.subject.count();

    // Get paginated data
    const subjects = await prisma.subject.findMany({
      skip,
      take: limit,
      orderBy: {
        subjectName: "asc",
      },
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalItems / limit);

    // Return paginated response
    return NextResponse.json({
      data: subjects,
      meta: {
        totalItems,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json(
      { error: "Failed to fetch subjects" },
      { status: 500 }
    );
  }
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
  

    let subjectCode = data.subjectName
    .split(" ")
    .filter((word: string) => !wordsToIgnore.includes(word.toLowerCase())) 
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

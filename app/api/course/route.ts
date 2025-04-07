import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// This would typically connect to your database
// For demo purposes, we're using an in-memory array
// const courses = [
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

// export async function GET() {
//   // Return all courses
//   const courses = await prisma.courseProgram.findMany();
//   return NextResponse.json(courses);
// }

export async function GET(request: NextRequest) {
  try {
    // Get pagination parameters from the URL
    const searchParams = request.nextUrl.searchParams;
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination metadata
    const totalItems = await prisma.courseProgram.count();

    // Get paginated data
    const courses = await prisma.courseProgram.findMany({
      skip,
      take: limit,
      orderBy: {
        courseCode: "asc",
      },
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalItems / limit);

    // Return paginated response
    return NextResponse.json({
      data: courses,
      meta: {
        totalItems,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

// export async function POST(request: Request) {
//   try {
//     const data = await request.json();

//     // Validate required fields
//     if (!data.courseCode || !data.courseProgram) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // Check if course code already exists
//     const existingCourse = await prisma.courseProgram.findUnique({
//       where: { courseCode: data.courseCode },
//     });

//     if (existingCourse) {
//       return NextResponse.json(
//         { error: "Course code already exists" },
//         { status: 400 }
//       );
//     }

//     // Create a new course in the database
//     const newCourse = await prisma.courseProgram.create({
//       data: {
//         courseCode: data.courseCode,
//         courseProgram: data.courseProgram,
//       },
//     });

//     return NextResponse.json(newCourse, { status: 201 });
//   } catch (error) {
//     console.error("Error creating course:", error);
//     return NextResponse.json(
//       { error: "Failed to create course" },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: Request) {
//   try {
//     const data = await request.json();

//     // Validate required field
//     if (!data.courseProgram) {
//       return NextResponse.json(
//         { error: "Missing required field: courseProgram" },
//         { status: 400 }
//       );
//     }

//     const courseCode: string = data.courseProgram
//       .split(" ")
//       .map((word: string) => word.charAt(0).toUpperCase())
//       .join("");

//     // Check if the generated course code already exists
//     const existingCourse = await prisma.courseProgram.findUnique({
//       where: { courseCode },
//     });

//     if (existingCourse) {
//       return NextResponse.json(
//         {
//           error:
//             "Generated course code already exists. Try renaming the course program.",
//         },
//         { status: 400 }
//       );
//     }

//     // Create a new course in the database
//     const newCourse = await prisma.courseProgram.create({
//       data: {
//         courseCode,
//         courseProgram: data.courseProgram,
//       },
//     });

//     return NextResponse.json(newCourse, { status: 201 });
//   } catch (error) {
//     console.error("Error creating course:", error);
//     return NextResponse.json(
//       { error: "Failed to create course" },
//       { status: 500 }
//     );
//   }
// }

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required field
    if (!data.courseProgram) {
      return NextResponse.json(
        { error: "Missing required field: courseProgram" },
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

    // Check if the generated course code already exists
    const existingCourse = await prisma.courseProgram.findUnique({
      where: { courseCode },
    });

    if (existingCourse) {
      return NextResponse.json(
        {
          error:
            "Generated course code already exists. Try renaming the course program.",
        },
        { status: 400 }
      );
    }

    // Create a new course in the database
    const newCourse = await prisma.courseProgram.create({
      data: {
        courseCode,
        courseProgram: data.courseProgram,
      },
    });

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}

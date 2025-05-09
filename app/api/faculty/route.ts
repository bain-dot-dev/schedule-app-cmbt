import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { facultyFormSchema } from "@/schemas/faculty.schema";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";

const prisma = new PrismaClient();

// GET all faculty members
// export async function GET() {
//   try {
//     const faculty = await prisma.faculty.findMany({
//       orderBy: {
//         lastName: "asc",
//       },
//       include: {
//         CourseProgram: true,
//       },
//     });

//     return NextResponse.json(faculty);
//   } catch (error) {
//     console.error("Error fetching faculty:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch faculty members" },
//       { status: 500 }
//     );
//   }
// }

// GET all faculty members with pagination
export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const session = await getIronSession<SessionData>(req, res, sessionOptions);

    const searchParams = req.nextUrl.searchParams;
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalItems = await prisma.faculty.count({
      where: {
        courseProgramID: session.courseProgramID,

        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { employeeNumber: { contains: search, mode: "insensitive" } },
          { rank: { contains: search, mode: "insensitive" } },
          {
            CourseProgram: {
              courseCode: { contains: search, mode: "insensitive" },
            },
          },
        ],
      },
    });

    // Get paginated faculty data
    const faculty = await prisma.faculty.findMany({
      where: {
        courseProgramID: session.courseProgramID,
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { employeeNumber: { contains: search, mode: "insensitive" } },
          { rank: { contains: search, mode: "insensitive" } },
          {
            CourseProgram: {
              courseCode: { contains: search, mode: "insensitive" },
            },
          },
        ],
      },
      orderBy: {
        lastName: "asc",
      },
      include: {
        CourseProgram: true,
      },
      skip,
      take: limit,
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalItems / limit);

    return NextResponse.json({
      data: faculty,
      meta: {
        totalItems,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    });
  } catch (error) {
    console.error("Error fetching faculty:", error);
    return NextResponse.json(
      { error: "Failed to fetch faculty members" },
      { status: 500 }
    );
  }
}

// POST a new faculty member
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Validate the request data
    const validatedData = facultyFormSchema.parse(data);

    // Check if faculty with the same employee number already exists
    const existingFaculty = await prisma.faculty.findUnique({
      where: { employeeNumber: validatedData.employeeNumber },
    });

    if (existingFaculty) {
      return NextResponse.json(
        { error: "Faculty with this employee number already exists" },
        { status: 400 }
      );
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

    // Create the faculty member
    const newFaculty = await prisma.faculty.create({
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

    return NextResponse.json(newFaculty, { status: 201 });
  } catch (error) {
    console.error("Error creating faculty:", error);

    return NextResponse.json(
      { error: "Failed to create faculty member" },
      { status: 500 }
    );
  }
}

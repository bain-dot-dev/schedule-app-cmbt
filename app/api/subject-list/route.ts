import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const faculty = await prisma.subject.findMany({
      orderBy: {
        subjectCode: "asc",
      },
    });

    return NextResponse.json(faculty);
  } catch (error) {
    console.error("Error fetching faculty:", error);
    return NextResponse.json(
      { error: "Failed to fetch faculty members" },
      { status: 500 }
    );
  }
}

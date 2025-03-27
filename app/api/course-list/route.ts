import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function GET() {
  // Return all courses
  const courses = await prisma.courseProgram.findMany();
  return NextResponse.json(courses);
}
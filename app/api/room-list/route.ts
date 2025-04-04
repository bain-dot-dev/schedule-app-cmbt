import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all rooms
export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: {
        roomNumber: "asc",
      },
    })

    return NextResponse.json(rooms)
  } catch (error) {
    console.error("Error fetching rooms:", error)
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 })
  }
}
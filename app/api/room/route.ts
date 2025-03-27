import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all rooms
// export async function GET() {
//   try {
//     const rooms = await prisma.room.findMany({
//       orderBy: {
//         roomNumber: "asc",
//       },
//     })

//     return NextResponse.json(rooms)
//   } catch (error) {
//     console.error("Error fetching rooms:", error)
//     return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 })
//   }
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
    const totalItems = await prisma.room.count();

    // Get paginated data
    const rooms = await prisma.room.findMany({
      skip,
      take: limit,
      orderBy: {
        roomNumber: "asc",
      },
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalItems / limit);

    // Return paginated response
    return NextResponse.json({
      data: rooms,
      meta: {
        totalItems,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json(
      { error: "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}

// POST create a new room
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { roomNumber, type } = data;

    // Validate required fields
    if (!roomNumber || !type) {
      return NextResponse.json(
        { error: "Room number and type are required" },
        { status: 400 }
      );
    }

    // Check if room already exists
    const existingRoom = await prisma.room.findFirst({
      where: {
        roomNumber,
      },
    });

    if (existingRoom) {
      return NextResponse.json(
        { error: "Room number already exists" },
        { status: 400 }
      );
    }

    // Create new room
    const newRoom = await prisma.room.create({
      data: {
        roomNumber,
        type,
      },
    });

    return NextResponse.json(newRoom, { status: 201 });
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 }
    );
  }
}

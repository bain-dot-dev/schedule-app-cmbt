import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET a single room by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const room = await prisma.room.findUnique({
      where: { roomID: id },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json(room);
  } catch (error) {
    console.error("Error fetching room:", error);
    return NextResponse.json(
      { error: "Failed to fetch room" },
      { status: 500 }
    );
  }
}

// PUT update a room
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await request.json();
    const { roomNumber, type } = data;

    // Validate required fields
    if (!roomNumber || !type) {
      return NextResponse.json(
        { error: "Room number and type are required" },
        { status: 400 }
      );
    }

    // Check if room exists
    const room = await prisma.room.findUnique({
      where: { roomID: id },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Check if another room with the same number exists
    if (roomNumber !== room.roomNumber) {
      const existingRoom = await prisma.room.findFirst({
        where: {
          roomNumber,
          roomID: { not: id },
        },
      });

      if (existingRoom) {
        return NextResponse.json(
          { error: "Another room with this number already exists" },
          { status: 400 }
        );
      }
    }

    // Update room
    const updatedRoom = await prisma.room.update({
      where: { roomID: id },
      data: {
        roomNumber,
        type,
      },
    });

    return NextResponse.json(updatedRoom);
  } catch (error) {
    console.error("Error updating room:", error);
    return NextResponse.json(
      { error: "Failed to update room" },
      { status: 500 }
    );
  }
}

// DELETE a room
// export async function DELETE(request: Request, { params }: { params: { id: string } }) {
//   try {
//     const id = params.id

//     // Check if room exists
//     const room = await prisma.room.findUnique({
//       where: { id },
//     })

//     if (!room) {
//       return NextResponse.json({ error: "Room not found" }, { status: 404 })
//     }

//     // Delete room
//     await prisma.room.delete({
//       where: { id },
//     })

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("Error deleting room:", error)
//     return NextResponse.json({ error: "Failed to delete room" }, { status: 500 })
//   }
// }

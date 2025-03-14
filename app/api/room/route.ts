import { NextResponse } from "next/server";

// This would typically connect to your database
// For demo purposes, we're using an in-memory array
const rooms = [
  {
    id: "1",
    roomNumber: "101",
    type: "Classroom",
  },
  {
    id: "2",
    roomNumber: "102",
    type: "Laboratory",
  },
];

export async function GET() {
  // Return all rooms
  return NextResponse.json(rooms);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.roomNumber || !data.type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if room number already exists
    if (rooms.some((room) => room.roomNumber === data.roomNumber)) {
      return NextResponse.json(
        { error: "Room number already exists" },
        { status: 400 }
      );
    }

    // Create a new room with a generated ID
    const newRoom = {
      id: Date.now().toString(),
      roomNumber: data.roomNumber,
      type: data.type,
    };

    // Add to our "database"
    rooms.push(newRoom);

    return NextResponse.json(newRoom, { status: 201 });
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 }
    );
  }
}

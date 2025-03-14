import { NextResponse } from "next/server"

// Dummy data - replace with a database later
let rooms = [
  { id: "1", roomNumber: "101", type: "single" },
  { id: "2", roomNumber: "102", type: "double" },
  { id: "3", roomNumber: "201", type: "suite" },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const room = rooms.find((r) => r.id === id)

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 })
  }

  return NextResponse.json(room)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const data = await request.json()

    // Find the room
    const index = rooms.findIndex((r) => r.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    // Validate required fields
    if (!data.roomNumber || !data.type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if the new room number already exists (excluding current room)
    if (rooms.some((room) => room.roomNumber === data.roomNumber && room.id !== id)) {
      return NextResponse.json({ error: "Room number already exists" }, { status: 400 })
    }

    // Update the room
    const updatedRoom = {
      ...rooms[index],
      roomNumber: data.roomNumber,
      type: data.type,
    }

    rooms[index] = updatedRoom

    return NextResponse.json(updatedRoom)
  } catch (error) {
    console.error("Error updating room:", error)
    return NextResponse.json({ error: "Failed to update room" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Find the room
  const index = rooms.findIndex((r) => r.id === id)

  if (index === -1) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 })
  }

  // Remove the room
  rooms = rooms.filter((r) => r.id !== id)

  return NextResponse.json({ success: true })
}


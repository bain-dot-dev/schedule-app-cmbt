import { NextResponse } from "next/server"

// This would typically connect to your database
// For demo purposes, we're using an in-memory array
const schedules = [
  {
    id: 1,
    day: "MON",
    startTime: "8:00 AM",
    endTime: "12:00 PM",
    course: "HMPE 3",
    section: "BSHM 2D",
    instructor: "K.FERNANDEZ",
    room: "101 Laboratory",
    academicYear: "2023-2024", // First academic year
  },
  {
    id: 2,
    day: "WED",
    startTime: "8:00 AM",
    endTime: "12:00 PM",
    course: "HMPE 3",
    section: "BSHM 2D",
    instructor: "K.FERNANDEZ",
    room: "101 Laboratory",
    academicYear: "2023-2024",
  },
  {
    id: 3,
    day: "FRI",
    startTime: "8:00 AM",
    endTime: "12:00 PM",
    course: "HMPE 3",
    section: "BSHM 2D",
    instructor: "K.FERNANDEZ",
    room: "101 Laboratory",
    academicYear: "2024-2025", // Second academic year
  },
  {
    id: 4,
    day: "TUE",
    startTime: "1:00 PM",
    endTime: "3:00 PM",
    course: "MATH 101",
    section: "BSCS 1A",
    instructor: "J.SMITH",
    room: "102 Lecture",
    academicYear: "2024-2025",
  },
]

export async function GET(request: Request) {
  // Add a small delay to simulate network latency (remove in production)
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Get query parameters if needed
  const { searchParams } = new URL(request.url)
  const academicYear = searchParams.get("academicYear")

  // Filter by academic year if provided
  let result = schedules
  if (academicYear) {
    result = schedules.filter((schedule) => schedule.academicYear === academicYear)
  }

  return NextResponse.json(result)
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (
      !data.instructor ||
      !data.course ||
      !data.section ||
      !data.room ||
      !data.academicYear ||
      !data.day ||
      !data.startTime ||
      !data.endTime
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check for schedule conflicts
    const hasConflict = schedules.some(
      (schedule) =>
        schedule.day === data.day &&
        schedule.room === data.room &&
        ((data.startTime >= schedule.startTime && data.startTime < schedule.endTime) ||
          (data.endTime > schedule.startTime && data.endTime <= schedule.endTime)),
    )

    if (hasConflict) {
      return NextResponse.json({ error: "Schedule conflict detected" }, { status: 409 })
    }

    // Create new schedule
    const newSchedule = {
      id: schedules.length + 1,
      day: data.day,
      startTime: data.startTime,
      endTime: data.endTime,
      course: data.course,
      section: data.section,
      instructor: data.instructor,
      room: data.room,
      academicYear: data.academicYear,
    }

    schedules.push(newSchedule)

    return NextResponse.json(newSchedule, { status: 201 })
  } catch (error) {
    console.error("Error creating schedule:", error)
    return NextResponse.json({ error: "Failed to create schedule" }, { status: 500 })
  }
}


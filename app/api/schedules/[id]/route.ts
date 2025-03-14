import { NextResponse } from "next/server"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const data = await request.json()

    // Find the schedule
    const index = schedules.findIndex((s) => s.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Schedule not found" }, { status: 404 })
    }

    // Validate required fields
    if (
      !data.facultyId ||
      !data.subjectId ||
      !data.sectionId ||
      !data.roomId ||
      !data.academicYear ||
      !data.day ||
      !data.startTime ||
      !data.endTime
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check for schedule conflicts (excluding the current schedule)
    const hasConflict = schedules.some(
      (schedule) =>
        schedule.id !== id &&
        schedule.day === data.day &&
        schedule.roomId === data.roomId &&
        ((data.startTime >= schedule.startTime && data.startTime < schedule.endTime) ||
          (data.endTime > schedule.startTime && data.endTime <= schedule.endTime)),
    )

    if (hasConflict) {
      return NextResponse.json({ error: "Schedule conflict detected" }, { status: 409 })
    }

    // Update the schedule
    const updatedSchedule = {
      ...schedules[index],
      ...data,
    }

    schedules[index] = updatedSchedule

    return NextResponse.json(updatedSchedule)
  } catch (error) {
    console.error("Error updating schedule:", error)
    return NextResponse.json({ error: "Failed to update schedule" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  const index = schedules.findIndex((s) => s.id === id)

  if (index === -1) {
    return NextResponse.json({ error: "Schedule not found" }, { status: 404 })
  }

  schedules = schedules.filter((s) => s.id !== id)

  return NextResponse.json({ success: true })
}


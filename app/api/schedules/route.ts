import { NextResponse } from "next/server"
import { PrismaClient, type Schedule } from "@prisma/client"
import type { SemesterEnum } from "@prisma/client"

const prisma = new PrismaClient()

// Define types for filters and schedule data
interface ScheduleFilters {
  academicYear?: {
    academicYearName: string
  }
  semester?: SemesterEnum
  facultyID?: string
  roomID?: string
  sectionCourseID?: string
}

interface TransformedSchedule {
  id: number | string
  day: string
  startTime: string
  endTime: string
  subject: string
  sectionCourse: string
  courseCode: string
  instructor: string
  room: string
  academicYear: string
  semester: string
}

// Helper function to convert day string to number
function dayToNumber(day: string): number {
  const dayMap: Record<string, number> = {
    SUN: 0,
    MON: 1,
    TUE: 2,
    WED: 3,
    THU: 4,
    FRI: 5,
    SAT: 6,
  }
  return dayMap[day] || 0
}

// Helper function to convert number to day string
function numberToDay(day: number): string {
  const dayMap: Record<number, string> = {
    0: "SUN",
    1: "MON",
    2: "TUE",
    3: "WED",
    4: "THU",
    5: "FRI",
    6: "SAT",
  }
  return dayMap[day] || "MON"
}

// Helper function to parse time string to Date object
function parseTimeString(timeStr: string, baseDate: Date = new Date()): Date {
  const [time, period] = timeStr.split(" ")
  const [hours, minutes] = time.split(":").map(Number)

  let parsedHours = hours
  if (period === "PM" && parsedHours !== 12) {
    parsedHours += 12
  } else if (period === "AM" && parsedHours === 12) {
    parsedHours = 0
  }

  const result = new Date(baseDate)
  result.setHours(parsedHours, minutes, 0, 0)
  return result
}

// Helper function to format Date to time string
function formatTimeString(date: Date): string {
  let hours = date.getHours()
  const minutes = date.getMinutes()
  const period = hours >= 12 ? "PM" : "AM"

  if (hours > 12) {
    hours -= 12
  } else if (hours === 0) {
    hours = 12
  }

  return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`
}

// Define a type for the schedule with included relations
type ScheduleWithRelations = Schedule & {
  faculty?: {
    firstName?: string
    lastName?: string
  }
  room?: {
    roomNumber?: string
  }
  sectionCourse?: {
    section?: {
      sectionName?: string
    }
    courseProgram?: {
      courseProgram?: string
      courseCode?: string
    }
  }
  subject?: {
    subjectCode?: string
  }
  academicYear?: {
    academicYearName?: string
  }
}

// Transform database schedule to API response format
function transformSchedule(schedule: ScheduleWithRelations): TransformedSchedule {
  return {
    id: schedule.scheduleID,
    day: numberToDay(schedule.day),
    startTime: formatTimeString(schedule.timeStart),
    endTime: formatTimeString(schedule.timeEnd),
    subject: schedule.subject?.subjectCode || "",
    sectionCourse: schedule.sectionCourse?.section?.sectionName || "",
    courseCode: schedule.sectionCourse?.courseProgram?.courseCode || "",
    instructor: schedule.faculty?.firstName ? `${schedule.faculty.firstName} ${schedule.faculty.lastName}` : "",
    room: schedule.room?.roomNumber || "",
    academicYear: schedule.academicYear?.academicYearName || "",
    semester: schedule.semester,
  }
}

export async function GET(request: Request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const academicYear = searchParams.get("academicYear")
    const semester = searchParams.get("semester")
    const facultyId = searchParams.get("facultyId")
    const roomId = searchParams.get("roomId")
    const sectionId = searchParams.get("sectionId")

    // Build query filters
    const filters: ScheduleFilters = {}

    if (academicYear) {
      filters.academicYear = {
        academicYearName: academicYear,
      }
    }

    if (semester) {
      filters.semester = semester as SemesterEnum
    }

    if (facultyId) {
      filters.facultyID = facultyId
    }

    if (roomId) {
      filters.roomID = roomId
    }

    if (sectionId) {
      filters.sectionCourseID = sectionId
    }

    // Fetch schedules with related data
    const schedules = await prisma.schedule.findMany({
      where: filters,
      include: {
        faculty: true,
        room: true,
        sectionCourse: {
          include: {
            section: true,
            courseProgram: true,
          },
        },
        subject: true,
        academicYear: true,
      },
    })

    // Transform data for API response
    const transformedSchedules = schedules.map(transformSchedule)

    return NextResponse.json(transformedSchedules)
  } catch (error) {
    console.error("Error fetching schedules:", error)
    return NextResponse.json({ error: "Failed to fetch schedules" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (
      !data.faculty ||
      !data.subject ||
      !data.sectionCourse ||
      !data.room ||
      !data.academicYear ||
      !data.day ||
      !data.startTime ||
      !data.endTime ||
      !data.semester
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Convert time strings to Date objects
    const timeStart = parseTimeString(data.startTime)
    const timeEnd = parseTimeString(data.endTime)

    // Validate that end time is after start time
    if (timeEnd <= timeStart) {
      return NextResponse.json(
        {
          error: "Invalid time range",
          details: "End time must be later than start time.",
        },
        { status: 400 }
      )
    }

    // Convert day string to number
    const day = dayToNumber(data.day)

    // Time conflict condition for all conflict checks
    const timeConflictCondition = {
      day: day,
      OR: [
        {
          AND: [{ timeStart: { lte: timeStart } }, { timeEnd: { gt: timeStart } }],
        },
        {
          AND: [{ timeStart: { lt: timeEnd } }, { timeEnd: { gte: timeEnd } }],
        },
        {
          AND: [{ timeStart: { gte: timeStart } }, { timeEnd: { lte: timeEnd } }],
        },
      ],
    }

    // Check for room conflicts
    const roomConflicts = await prisma.schedule.findMany({
      where: {
        roomID: data.room,
        ...timeConflictCondition,
      },
      include: {
        room: true,
      },
    })

    if (roomConflicts.length > 0) {
      return NextResponse.json(
        {
          error: "Room schedule conflict detected",
          details: `Room ${roomConflicts[0].room?.roomNumber} is already scheduled during this time.`,
        },
        { status: 409 },
      )
    }

    // Check for faculty conflicts
    const facultyConflicts = await prisma.schedule.findMany({
      where: {
        facultyID: data.faculty,
        ...timeConflictCondition,
      },
      include: {
        faculty: true,
      },
    })

    if (facultyConflicts.length > 0) {
      return NextResponse.json(
        {
          error: "Faculty schedule conflict detected",
          details: `Faculty ${facultyConflicts[0].faculty?.firstName} ${facultyConflicts[0].faculty?.lastName} is already scheduled during this time.`,
        },
        { status: 409 },
      )
    }

    // Check for section conflicts
    const sectionConflicts = await prisma.schedule.findMany({
      where: {
        sectionCourseID: data.sectionCourse,
        ...timeConflictCondition,
      },
      include: {
        sectionCourse: {
          include: {
            section: true,
          },
        },
      },
    })

    if (sectionConflicts.length > 0) {
      return NextResponse.json(
        {
          error: "Section schedule conflict detected",
          details: `Section ${sectionConflicts[0].sectionCourse?.section?.sectionName} is already scheduled during this time.`,
        },
        { status: 409 },
      )
    }

    let academicYear = data.academicYear
    // Check if academic year exists in the database
    const existingAcademicYear = await prisma.academicYear.findUnique({
      where: {
        academicYearName: academicYear,
      },
    })

    if (!existingAcademicYear) {
      // If it doesn't exist, create a new academic year
      const newAcademicYear = await prisma.academicYear.create({
        data: {
          academicYearName: academicYear,
        },
      })
      academicYear = newAcademicYear.academicYearID
    } else {
      academicYear = existingAcademicYear.academicYearID
    }

    // Create new schedule
    const newSchedule = await prisma.schedule.create({
      data: {
        facultyID: data.faculty,
        subjectID: data.subject,
        sectionCourseID: data.sectionCourse,
        roomID: data.room,
        academicYearID: academicYear,
        semester: data.semester as SemesterEnum,
        day: day,
        timeStart: timeStart,
        timeEnd: timeEnd,
      },
      include: {
        faculty: true,
        room: true,
        sectionCourse: {
          include: {
            section: true,
            courseProgram: true,
          },
        },
        subject: true,
        academicYear: true,
      },
    })

    return NextResponse.json(transformSchedule(newSchedule), { status: 201 })
  } catch (error) {
    console.error("Error creating schedule:", error)
    return NextResponse.json({ error: "Failed to create schedule" }, { status: 500 })
  }
}

import { NextResponse } from "next/server";
import { PrismaClient, type Schedule } from "@prisma/client";
import type { SemesterEnum } from "@prisma/client";

const prisma = new PrismaClient();

// Define types for schedule data
interface TransformedSchedule {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  sectionCourse: string;
  instructor: string;
  room: string;
  academicYear: string;
  semester: string;
}

// Define a type for the schedule with included relations
type ScheduleWithRelations = Schedule & {
  faculty?: {
    firstName?: string;
    lastName?: string;
  };
  room?: {
    roomNumber?: string;
  };
  sectionCourse?: {
    section?: {
      sectionName?: string;
    };
    courseProgram?: {
      courseProgram?: string;
    };
  };
  subject?: {
    subjectCode?: string;
  };
  academicYear?: {
    academicYearName?: string;
  };
  section?: {
    sectionName?: string;
  };
};

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
  };
  return dayMap[day] || 0;
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
  };
  return dayMap[day] || "MON";
}

// Helper function to parse time string to Date object
function parseTimeString(timeStr: string, baseDate: Date = new Date()): Date {
  const [time, period] = timeStr.split(" ");
  const [hours, minutes] = time.split(":").map(Number);

  let parsedHours = hours;
  if (period === "PM" && parsedHours !== 12) {
    parsedHours += 12;
  } else if (period === "AM" && parsedHours === 12) {
    parsedHours = 0;
  }

  const result = new Date(baseDate);
  result.setHours(parsedHours, minutes, 0, 0);
  return result;
}

// Helper function to format Date to time string
function formatTimeString(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";

  if (hours > 12) {
    hours -= 12;
  } else if (hours === 0) {
    hours = 12;
  }

  return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

// Transform database schedule to API response format
function transformSchedule(
  schedule: ScheduleWithRelations
): TransformedSchedule {
  return {
    id: schedule.scheduleID,
    day: numberToDay(schedule.day),
    startTime: formatTimeString(schedule.timeStart),
    endTime: formatTimeString(schedule.timeEnd),
    subject: schedule.subject?.subjectCode || "",
    sectionCourse: schedule.sectionCourse?.section?.sectionName || "",
    instructor: schedule.faculty?.firstName
      ? `${schedule.faculty.firstName} ${schedule.faculty.lastName}`
      : "",
    room: schedule.room?.roomNumber || "",
    academicYear: schedule.academicYear?.academicYearName || "",
    semester: schedule.semester,
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params object before accessing its properties
    const { id } = await params;

    const schedule = await prisma.schedule.findUnique({
      where: { scheduleID: id },
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
    });

    if (!schedule) {
      return NextResponse.json(
        { error: "Schedule not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(transformSchedule(schedule));
  } catch (error) {
    console.error("Error fetching schedule:", error);
    return NextResponse.json(
      { error: "Failed to fetch schedule" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params object before accessing its properties
    const { id } = await params;
    const data = await request.json();

    // Check if schedule exists
    const existingSchedule = await prisma.schedule.findUnique({
      where: { scheduleID: id },
    });

    if (!existingSchedule) {
      return NextResponse.json(
        { error: "Schedule not found" },
        { status: 404 }
      );
    }

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
      console.error("Missing required fields:", {
        faculty: data.faculty,
        subject: data.subject,
        section: data.section,
        room: data.room,
        academicYear: data.academicYear,
        day: data.day,
        startTime: data.startTime,
        endTime: data.endTime,
        semester: data.semester,
      });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find or create academic year
    let academicYearID = data.academicYear;

    // If academicYear is a string in format YYYY-YYYY, find or create the record
    if (data.academicYear.includes("-")) {
      const academicYear = await prisma.academicYear.findFirst({
        where: { academicYearName: data.academicYear },
      });

      if (academicYear) {
        academicYearID = academicYear.academicYearID;
      } else {
        // Create new academic year
        const newAcademicYear = await prisma.academicYear.create({
          data: { academicYearName: data.academicYear },
        });
        academicYearID = newAcademicYear.academicYearID;
      }
    }

    // Convert time strings to Date objects
    const timeStart = parseTimeString(data.startTime);
    const timeEnd = parseTimeString(data.endTime);

    // Validate that end time is after start time
    if (timeEnd <= timeStart) {
      return NextResponse.json(
        {
          error: "Invalid time range",
          details: "End time must be later than start time.",
        },
        { status: 400 }
      );
    }

    // Convert day string to number
    const day = dayToNumber(data.day);

    // Time conflict condition for all conflict checks
    const timeConflictCondition = {
      scheduleID: { not: id }, // Exclude the current schedule
      day: day,
      OR: [
        {
          AND: [
            { timeStart: { lte: timeStart } },
            { timeEnd: { gt: timeStart } },
          ],
        },
        {
          AND: [{ timeStart: { lt: timeEnd } }, { timeEnd: { gte: timeEnd } }],
        },
        {
          AND: [
            { timeStart: { gte: timeStart } },
            { timeEnd: { lte: timeEnd } },
          ],
        },
      ],
    };

    // Check for room conflicts
    const roomConflicts = await prisma.schedule.findMany({
      where: {
        roomID: data.room,
        sectionCourseID: data.sectionCourse,
        ...timeConflictCondition,
      },
      include: {
        room: true,
      },
    });

    if (roomConflicts.length > 0) {
      return NextResponse.json(
        {
          error: "Room schedule conflict detected",
          details: `Room ${roomConflicts[0].room?.roomNumber} is already scheduled during this time.`,
        },
        { status: 409 }
      );
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
    });

    if (facultyConflicts.length > 0) {
      return NextResponse.json(
        {
          error: "Faculty schedule conflict detected",
          details: `Faculty ${facultyConflicts[0].faculty?.firstName} ${facultyConflicts[0].faculty?.lastName} is already scheduled during this time.`,
        },
        { status: 409 }
      );
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
    });

    if (sectionConflicts.length > 0) {
      return NextResponse.json(
        {
          error: "Section schedule conflict detected",
          details: `Section ${sectionConflicts[0].sectionCourse?.section?.sectionName} is already scheduled during this time.`,
        },
        { status: 409 }
      );
    }

    // Check for subject conflicts (same subject taught simultaneously by different faculty)
    const subjectConflicts = await prisma.schedule.findMany({
      where: {
        subjectID: data.subject,
        facultyID: { not: data.faculty }, // Different faculty
        ...timeConflictCondition,
      },
      include: {
        subject: true,
      },
    });

    if (subjectConflicts.length > 0) {
      return NextResponse.json(
        {
          error: "Subject schedule conflict detected",
          details: `Subject ${subjectConflicts[0].subject?.subjectCode} is already being taught during this time by another faculty.`,
        },
        { status: 409 }
      );
    }

    // Update schedule
    const updatedSchedule = await prisma.schedule.update({
      where: { scheduleID: id },
      data: {
        facultyID: data.faculty,
        subjectID: data.subject,
        sectionCourseID: data.sectionCourse,
        roomID: data.room,
        academicYearID: academicYearID,
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
    });

    return NextResponse.json(transformSchedule(updatedSchedule));
  } catch (error) {
    console.error("Error updating schedule:", error);
    return NextResponse.json(
      { error: "Failed to update schedule" },
      { status: 500 }
    );
  }
}

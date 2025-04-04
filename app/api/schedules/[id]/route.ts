// // import { NextResponse } from "next/server"

// // export async function PUT(request: Request, { params }: { params: { id: string } }) {
// //   try {
// //     const id = params.id
// //     const data = await request.json()

// //     // Find the schedule
// //     const index = schedules.findIndex((s) => s.id === id)

// //     if (index === -1) {
// //       return NextResponse.json({ error: "Schedule not found" }, { status: 404 })
// //     }

// //     // Validate required fields
// //     if (
// //       !data.facultyId ||
// //       !data.subjectId ||
// //       !data.sectionId ||
// //       !data.roomId ||
// //       !data.academicYear ||
// //       !data.day ||
// //       !data.startTime ||
// //       !data.endTime
// //     ) {
// //       return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
// //     }

// //     // Check for schedule conflicts (excluding the current schedule)
// //     const hasConflict = schedules.some(
// //       (schedule) =>
// //         schedule.id !== id &&
// //         schedule.day === data.day &&
// //         schedule.roomId === data.roomId &&
// //         ((data.startTime >= schedule.startTime && data.startTime < schedule.endTime) ||
// //           (data.endTime > schedule.startTime && data.endTime <= schedule.endTime)),
// //     )

// //     if (hasConflict) {
// //       return NextResponse.json({ error: "Schedule conflict detected" }, { status: 409 })
// //     }

// //     // Update the schedule
// //     const updatedSchedule = {
// //       ...schedules[index],
// //       ...data,
// //     }

// //     schedules[index] = updatedSchedule

// //     return NextResponse.json(updatedSchedule)
// //   } catch (error) {
// //     console.error("Error updating schedule:", error)
// //     return NextResponse.json({ error: "Failed to update schedule" }, { status: 500 })
// //   }
// // }

// // export async function DELETE(request: Request, { params }: { params: { id: string } }) {
// //   const id = params.id

// //   const index = schedules.findIndex((s) => s.id === id)

// //   if (index === -1) {
// //     return NextResponse.json({ error: "Schedule not found" }, { status: 404 })
// //   }

// //   schedules = schedules.filter((s) => s.id !== id)

// //   return NextResponse.json({ success: true })
// // }

// import { NextResponse } from "next/server"
// import { PrismaClient } from "@prisma/client";
// import type { SemesterEnum } from "@prisma/client"

// const prisma = new PrismaClient();

// // Helper function to convert day string to number
// function dayToNumber(day: string): number {
//   const dayMap: Record<string, number> = {
//     SUN: 0,
//     MON: 1,
//     TUE: 2,
//     WED: 3,
//     THU: 4,
//     FRI: 5,
//     SAT: 6,
//   }
//   return dayMap[day] || 0
// }

// // Helper function to convert number to day string
// function numberToDay(day: number): string {
//   const dayMap: Record<number, string> = {
//     0: "SUN",
//     1: "MON",
//     2: "TUE",
//     3: "WED",
//     4: "THU",
//     5: "FRI",
//     6: "SAT",
//   }
//   return dayMap[day] || "MON"
// }

// // Helper function to parse time string to Date object
// function parseTimeString(timeStr: string, baseDate: Date = new Date()): Date {
//   const [time, period] = timeStr.split(" ")
//   let [hours, minutes] = time.split(":").map(Number)

//   if (period === "PM" && hours !== 12) {
//     hours += 12
//   } else if (period === "AM" && hours === 12) {
//     hours = 0
//   }

//   const result = new Date(baseDate)
//   result.setHours(hours, minutes, 0, 0)
//   return result
// }

// // Helper function to format Date to time string
// function formatTimeString(date: Date): string {
//   let hours = date.getHours()
//   const minutes = date.getMinutes()
//   const period = hours >= 12 ? "PM" : "AM"

//   if (hours > 12) {
//     hours -= 12
//   } else if (hours === 0) {
//     hours = 12
//   }

//   return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`
// }

// // Transform database schedule to API response format
// function transformSchedule(schedule: any) {
//   return {
//     id: schedule.scheduleID,
//     day: numberToDay(schedule.day),
//     startTime: formatTimeString(schedule.timeStart),
//     endTime: formatTimeString(schedule.timeEnd),
//     subject: schedule.subject?.subjectCode || "",
//     section: schedule.sectionCourse.section?.sectionName || "",
//     course: schedule.sectionCourse.courseProgram?.courseProgram || "",
//     instructor: schedule.faculty?.firstName ? `${schedule.faculty.firstName} ${schedule.faculty.lastName}` : "",
//     room: schedule.room?.roomName || "",
//     academicYear: schedule.academicYear?.academicYear || "",
//     semester: schedule.semester,
//   }
// }

// export async function GET(request: Request, { params }: { params: { id: string } }) {
//   try {
//     const id = params.id

//     const schedule = await prisma.schedule.findUnique({
//       where: { scheduleID: id },
//       include: {
//         faculty: true,
//         room: true,
//         sectionCourse: true,
//         subject: true,
//         academicYear: true,
//       },
//     })

//     if (!schedule) {
//       return NextResponse.json({ error: "Schedule not found" }, { status: 404 })
//     }

//     return NextResponse.json(transformSchedule(schedule))
//   } catch (error) {
//     console.error("Error fetching schedule:", error)
//     return NextResponse.json({ error: "Failed to fetch schedule" }, { status: 500 })
//   }
// }

// export async function PUT(request: Request, { params }: { params: { id: string } }) {
//   try {
//     const id = params.id
//     const data = await request.json()

//     // Check if schedule exists
//     const existingSchedule = await prisma.schedule.findUnique({
//       where: { scheduleID: id },
//     })

//     if (!existingSchedule) {
//       return NextResponse.json({ error: "Schedule not found" }, { status: 404 })
//     }

//     // Validate required fields
//     if (
//       !data.faculty ||
//       !data.subject ||
//       !data.sectionCourse ||
//       !data.room ||
//       !data.academicYear ||
//       !data.day ||
//       !data.startTime ||
//       !data.endTime ||
//       !data.semester
//     ) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
//     }

//     // Convert time strings to Date objects
//     const timeStart = parseTimeString(data.startTime)
//     const timeEnd = parseTimeString(data.endTime)

//     // Convert day string to number
//     const day = dayToNumber(data.day)

//     // Check for schedule conflicts (excluding the current schedule)
//     const conflictingSchedules = await prisma.schedule.findMany({
//       where: {
//         scheduleID: { not: id },
//         roomID: data.room,
//         day: day,
//         OR: [
//           {
//             AND: [{ timeStart: { lte: timeStart } }, { timeEnd: { gt: timeStart } }],
//           },
//           {
//             AND: [{ timeStart: { lt: timeEnd } }, { timeEnd: { gte: timeEnd } }],
//           },
//           {
//             AND: [{ timeStart: { gte: timeStart } }, { timeEnd: { lte: timeEnd } }],
//           },
//         ],
//       },
//     })

//     if (conflictingSchedules.length > 0) {
//       return NextResponse.json({ error: "Schedule conflict detected" }, { status: 409 })
//     }

//     // Update schedule
//     const updatedSchedule = await prisma.schedule.update({
//       where: { scheduleID: id },
//       data: {
//         facultyID: data.faculty,
//         subjectID: data.subject,
//         sectionCourseID: data.section,
//         roomID: data.room,
//         academicYearID: data.academicYear,
//         semester: data.semester as SemesterEnum,
//         day: day,
//         timeStart: timeStart,
//         timeEnd: timeEnd,
//       },
//       include: {
//         faculty: true,
//         room: true,
//         sectionCourse: true,
//         subject: true,
//         academicYear: true,
//       },
//     })

//     return NextResponse.json(transformSchedule(updatedSchedule))
//   } catch (error) {
//     console.error("Error updating schedule:", error)
//     return NextResponse.json({ error: "Failed to update schedule" }, { status: 500 })
//   }
// }

// export async function DELETE(request: Request, { params }: { params: { id: string } }) {
//   try {
//     const id = params.id

//     // Check if schedule exists
//     const existingSchedule = await prisma.schedule.findUnique({
//       where: { scheduleID: id },
//     })

//     if (!existingSchedule) {
//       return NextResponse.json({ error: "Schedule not found" }, { status: 404 })
//     }

//     // Delete schedule
//     await prisma.schedule.delete({
//       where: { scheduleID: id },
//     })

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("Error deleting schedule:", error)
//     return NextResponse.json({ error: "Failed to delete schedule" }, { status: 500 })
//   }
// }

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import type { SemesterEnum } from "@prisma/client";

const prisma = new PrismaClient();

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
  let [hours, minutes] = time.split(":").map(Number);

  if (period === "PM" && hours !== 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }

  const result = new Date(baseDate);
  result.setHours(hours, minutes, 0, 0);
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
function transformSchedule(schedule: any) {
  return {
    id: schedule.scheduleID,
    day: numberToDay(schedule.day),
    startTime: formatTimeString(schedule.timeStart),
    endTime: formatTimeString(schedule.timeEnd),
    course: schedule.subject?.subjectCode || "",
    section: schedule.section?.sectionName || "",
    instructor: schedule.faculty?.firstName
      ? `${schedule.faculty.firstName} ${schedule.faculty.lastName}`
      : "",
    room: schedule.room?.roomName || "",
    academicYear: schedule.academicYear?.academicYear || "",
    semester: schedule.semester,
  };
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const schedule = await prisma.schedule.findUnique({
      where: { scheduleID: id },
      include: {
        faculty: true,
        room: true,
        section: true,
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
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
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
      !data.section ||
      !data.room ||
      !data.academicYear ||
      !data.day ||
      !data.startTime ||
      !data.endTime ||
      !data.semester
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get the sectionID from the sectionCourse
    let sectionID = data.section;

    // If the section is a SectionCourseID, get the actual sectionID
    if (data.section.length > 10) {
      // Assuming it's a UUID
      const sectionCourse = await prisma.sectionCourse.findUnique({
        where: { SectionCourseID: data.section },
      });

      if (sectionCourse) {
        sectionID = sectionCourse.sectionID;
      }
    }

    // Find or create academic year
    let academicYearID = data.academicYear;

    // If academicYear is a string in format YYYY-YYYY, find or create the record
    if (data.academicYear.includes("-")) {
      const academicYear = await prisma.academicYear.findFirst({
        where: { academicYear: data.academicYear },
      });

      if (academicYear) {
        academicYearID = academicYear.academicYearID;
      } else {
        // Create new academic year
        const newAcademicYear = await prisma.academicYear.create({
          data: { academicYear: data.academicYear },
        });
        academicYearID = newAcademicYear.academicYearID;
      }
    }

    // Convert time strings to Date objects
    const timeStart = parseTimeString(data.startTime);
    const timeEnd = parseTimeString(data.endTime);

    // Convert day string to number
    const day = dayToNumber(data.day);

    // Check for schedule conflicts (excluding the current schedule)
    const conflictingSchedules = await prisma.schedule.findMany({
      where: {
        scheduleID: { not: id },
        roomID: data.room,
        day: day,
        OR: [
          {
            AND: [
              { timeStart: { lte: timeStart } },
              { timeEnd: { gt: timeStart } },
            ],
          },
          {
            AND: [
              { timeStart: { lt: timeEnd } },
              { timeEnd: { gte: timeEnd } },
            ],
          },
          {
            AND: [
              { timeStart: { gte: timeStart } },
              { timeEnd: { lte: timeEnd } },
            ],
          },
        ],
      },
    });

    if (conflictingSchedules.length > 0) {
      return NextResponse.json(
        { error: "Schedule conflict detected" },
        { status: 409 }
      );
    }

    // Map semester string to enum
    let semesterEnum: SemesterEnum;
    if (data.semester === "1st Semester") {
      semesterEnum = "FIRST" as SemesterEnum;
    } else if (data.semester === "2nd Semester") {
      semesterEnum = "SECOND" as SemesterEnum;
    } else {
      semesterEnum = "SUMMER" as SemesterEnum;
    }

    // Update schedule
    const updatedSchedule = await prisma.schedule.update({
      where: { scheduleID: id },
      data: {
        facultyID: data.faculty,
        subjectID: data.subject,
        sectionID: sectionID,
        roomID: data.room,
        academicYearID: academicYearID,
        semester: semesterEnum,
        day: day,
        timeStart: timeStart,
        timeEnd: timeEnd,
      },
      include: {
        faculty: true,
        room: true,
        section: true,
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

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

    // Delete schedule
    await prisma.schedule.delete({
      where: { scheduleID: id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting schedule:", error);
    return NextResponse.json(
      { error: "Failed to delete schedule" },
      { status: 500 }
    );
  }
}

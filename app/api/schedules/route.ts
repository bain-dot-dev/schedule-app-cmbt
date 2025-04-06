// // import { NextResponse } from "next/server";

// // // This would typically connect to your database
// // // For demo purposes, we're using an in-memory array
// // const schedules = [
// //   {
// //     id: 1,
// //     day: "MON",
// //     startTime: "8:00 AM",
// //     endTime: "12:00 PM",
// //     course: "HMPE 3",
// //     section: "BSHM 2D",
// //     instructor: "K.FERNANDEZ",
// //     room: "101 Laboratory",
// //     academicYear: "2023-2024", // First academic year
// //     semester: "1st Semester",
// //   },
// //   {
// //     id: 2,
// //     day: "WED",
// //     startTime: "8:00 AM",
// //     endTime: "12:00 PM",
// //     course: "HMPE 3",
// //     section: "BSHM 2D",
// //     instructor: "K.FERNANDEZ",
// //     room: "101 Laboratory",
// //     academicYear: "2023-2024",
// //     semester: "1st Semester",
// //   },
// //   {
// //     id: 3,
// //     day: "FRI",
// //     startTime: "8:00 AM",
// //     endTime: "12:00 PM",
// //     course: "HMPE 3",
// //     section: "BSHM 2D",
// //     instructor: "K.FERNANDEZ",
// //     room: "101 Laboratory",
// //     academicYear: "2024-2025", // Second academic year
// //     semester: "2nd Semester",
// //   },
// //   {
// //     id: 4,
// //     day: "TUE",
// //     startTime: "1:00 PM",
// //     endTime: "3:00 PM",
// //     course: "MATH 101",
// //     section: "BSCS 1A",
// //     instructor: "J.SMITH",
// //     room: "102 Lecture",
// //     academicYear: "2024-2025",
// //     semester: "2nd Semester",
// //   },
// // ];

// // export async function GET(request: Request) {
// //   // Add a small delay to simulate network latency (remove in production)
// //   await new Promise((resolve) => setTimeout(resolve, 500));

// //   // Get query parameters if needed
// //   const { searchParams } = new URL(request.url);
// //   const academicYear = searchParams.get("academicYear");

// //   // Filter by academic year if provided
// //   let result = schedules;
// //   if (academicYear) {
// //     result = schedules.filter(
// //       (schedule) => schedule.academicYear === academicYear
// //     );
// //   }

// //   return NextResponse.json(result);
// // }

// // export async function POST(request: Request) {
// //   try {
// //     const data = await request.json();

// //     // Validate required fields
// //     if (
// //       !data.instructor ||
// //       !data.course ||
// //       !data.section ||
// //       !data.room ||
// //       !data.academicYear ||
// //       !data.day ||
// //       !data.startTime ||
// //       !data.endTime
// //     ) {
// //       return NextResponse.json(
// //         { error: "Missing required fields" },
// //         { status: 400 }
// //       );
// //     }

// //     // Check for schedule conflicts
// //     const hasConflict = schedules.some(
// //       (schedule) =>
// //         schedule.day === data.day &&
// //         schedule.room === data.room &&
// //         ((data.startTime >= schedule.startTime &&
// //           data.startTime < schedule.endTime) ||
// //           (data.endTime > schedule.startTime &&
// //             data.endTime <= schedule.endTime))
// //     );

// //     if (hasConflict) {
// //       return NextResponse.json(
// //         { error: "Schedule conflict detected" },
// //         { status: 409 }
// //       );
// //     }

// //     // Create new schedule
// //     const newSchedule = {
// //       id: schedules.length + 1,
// //       day: data.day,
// //       startTime: data.startTime,
// //       endTime: data.endTime,
// //       course: data.course,
// //       section: data.section,
// //       instructor: data.instructor,
// //       room: data.room,
// //       academicYear: data.academicYear,
// //     };

// //     schedules.push(newSchedule);

// //     return NextResponse.json(newSchedule, { status: 201 });
// //   } catch (error) {
// //     console.error("Error creating schedule:", error);
// //     return NextResponse.json(
// //       { error: "Failed to create schedule" },
// //       { status: 500 }
// //     );
// //   }
// // }

// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
// import type { SemesterEnum } from "@prisma/client";

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
//   };
//   return dayMap[day] || 0;
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
//   };
//   return dayMap[day] || "MON";
// }

// // Helper function to parse time string to Date object
// function parseTimeString(timeStr: string, baseDate: Date = new Date()): Date {
//   const [time, period] = timeStr.split(" ");
//   let [hours, minutes] = time.split(":").map(Number);

//   if (period === "PM" && hours !== 12) {
//     hours += 12;
//   } else if (period === "AM" && hours === 12) {
//     hours = 0;
//   }

//   const result = new Date(baseDate);
//   result.setHours(hours, minutes, 0, 0);
//   return result;
// }

// // Helper function to format Date to time string
// function formatTimeString(date: Date): string {
//   let hours = date.getHours();
//   const minutes = date.getMinutes();
//   const period = hours >= 12 ? "PM" : "AM";

//   if (hours > 12) {
//     hours -= 12;
//   } else if (hours === 0) {
//     hours = 12;
//   }

//   return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
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
//     instructor: schedule.faculty?.firstName
//       ? `${schedule.faculty.firstName} ${schedule.faculty.lastName}`
//       : "",
//     room: schedule.room?.roomName || "",
//     academicYear: schedule.academicYear?.academicYear || "",
//     semester: schedule.semester,
//   };
// }

// export async function GET(request: Request) {
//   try {
//     // Get query parameters
//     const { searchParams } = new URL(request.url);
//     const academicYear = searchParams.get("academicYear");
//     const semester = searchParams.get("semester");

//     // Build query filters
//     const filters: any = {};

//     if (academicYear) {
//       filters.academicYear = {
//         academicYear: academicYear,
//       };
//     }

//     if (semester) {
//       filters.semester = semester as SemesterEnum;
//     }

//     // Fetch schedules with related data
//     const schedules = await prisma.schedule.findMany({
//       where: filters,
//       include: {
//         faculty: true,
//         room: true,
//         sectionCourse: true,
//         subject: true,
//         academicYear: true,
//       },
//     });

//     // Transform data for API response
//     const transformedSchedules = schedules.map(transformSchedule);

//     return NextResponse.json(transformedSchedules);
//   } catch (error) {
//     console.error("Error fetching schedules:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch schedules" },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: Request) {
//   try {
//     const data = await request.json();

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
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // Convert time strings to Date objects
//     const timeStart = parseTimeString(data.startTime);
//     const timeEnd = parseTimeString(data.endTime);

//     // Convert day string to number
//     const day = dayToNumber(data.day);

//     // Check for schedule conflicts
//     const conflictingSchedules = await prisma.schedule.findMany({
//       where: {
//         roomID: data.room,
//         day: day,
//         OR: [
//           {
//             AND: [
//               { timeStart: { lte: timeStart } },
//               { timeEnd: { gt: timeStart } },
//             ],
//           },
//           {
//             AND: [
//               { timeStart: { lt: timeEnd } },
//               { timeEnd: { gte: timeEnd } },
//             ],
//           },
//           {
//             AND: [
//               { timeStart: { gte: timeStart } },
//               { timeEnd: { lte: timeEnd } },
//             ],
//           },
//         ],
//       },
//     });

//     if (conflictingSchedules.length > 0) {
//       return NextResponse.json(
//         { error: "Schedule conflict detected" },
//         { status: 409 }
//       );
//     }

//     let academicYear = data.academicYear;
//     // Check if academic year exists in the database
//     const existingAcademicYear = await prisma.academicYear.findUnique({
//       where: {
//         academicYearName: academicYear,
//       },
//     });

//     if (!existingAcademicYear) {
//       // If it doesn't exist, create a new academic year
//       const newAcademicYear = await prisma.academicYear.create({
//         data: {
//           academicYearName: academicYear,
//         },
//       });
//       academicYear = newAcademicYear.academicYearID;
//     } else {
//       academicYear = existingAcademicYear.academicYearID;
//     }

//     // Create new schedule
//     const newSchedule = await prisma.schedule.create({
//       data: {
//         facultyID: data.faculty,
//         subjectID: data.subject,
//         sectionCourseID: data.sectionCourse,
//         roomID: data.room,
//         academicYearID: academicYear,
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
//     });

//     return NextResponse.json(transformSchedule(newSchedule), { status: 201 });
//   } catch (error) {
//     console.error("Error creating schedule:", error);
//     return NextResponse.json(
//       { error: "Failed to create schedule" },
//       { status: 500 }
//     );
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
    section: schedule.sectionCourse?.section?.sectionName || "",
    instructor: schedule.faculty?.firstName
      ? `${schedule.faculty.firstName} ${schedule.faculty.lastName}`
      : "",
    room: schedule.room?.roomNumber || "",
    academicYear: schedule.academicYear?.academicYearName || "",
    semester: schedule.semester,
  };
}

export async function GET(request: Request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const academicYear = searchParams.get("academicYear");
    const semester = searchParams.get("semester");
    const facultyId = searchParams.get("facultyId");

    // Build query filters
    const filters: any = {};

    if (academicYear) {
      filters.academicYear = {
        academicYear: academicYear,
      };
    }

    if (semester) {
      filters.semester = semester as SemesterEnum;
    }

    if (facultyId) {
      filters.facultyID = facultyId;
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
    });

    // console.log("Fetched schedules:", schedules);
    // Transform data for API response
    const transformedSchedules = schedules.map(transformSchedule);

    return NextResponse.json(transformedSchedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return NextResponse.json(
      { error: "Failed to fetch schedules" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

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
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Convert time strings to Date objects
    const timeStart = parseTimeString(data.startTime);
    const timeEnd = parseTimeString(data.endTime);

    // Convert day string to number
    const day = dayToNumber(data.day);

    // Check for schedule conflicts
    const conflictingSchedules = await prisma.schedule.findMany({
      where: {
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

    let academicYear = data.academicYear;
    // Check if academic year exists in the database
    const existingAcademicYear = await prisma.academicYear.findUnique({
      where: {
        academicYearName: academicYear,
      },
    });

    if (!existingAcademicYear) {
      // If it doesn't exist, create a new academic year
      const newAcademicYear = await prisma.academicYear.create({
        data: {
          academicYearName: academicYear,
        },
      });
      academicYear = newAcademicYear.academicYearID;
    } else {
      academicYear = existingAcademicYear.academicYearID;
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
        sectionCourse: true,
        subject: true,
        academicYear: true,
      },
    });

    return NextResponse.json(transformSchedule(newSchedule), { status: 201 });
  } catch (error) {
    console.error("Error creating schedule:", error);
    return NextResponse.json(
      { error: "Failed to create schedule" },
      { status: 500 }
    );
  }
}

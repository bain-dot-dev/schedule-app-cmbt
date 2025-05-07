import { z } from "zod";

// // Define the form schema with validation
// export const scheduleFormSchema = z
//   .object({
//     faculty: z.string().min(1, { message: "Faculty is required" }),
//     subject: z.string().min(1, { message: "Subject is required" }),
//     section: z.string().min(1, { message: "Section is required" }),
//     room: z.string().min(1, { message: "Room is required" }),
//     academicYear: z.string().min(1, { message: "Academic year is required" }),
//     day: z.string().min(1, { message: "Day is required" }),
//     startTime: z.string().min(1, { message: "Start time is required" }),
//     endTime: z.string().min(1, { message: "End time is required" }),
//   })
//   .refine(
//     (data) => {
//       // Convert times to comparable format for validation
//       const formatTime = (time: string) => {
//         if (!time.includes(":")) return time; // Already in correct format

//         const [hours, minutes] = time.split(":").map(Number);
//         const period = hours >= 12 ? "PM" : "AM";
//         const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
//         return `${displayHours}:${minutes
//           .toString()
//           .padStart(2, "0")} ${period}`;
//       };

//       const start = formatTime(data.startTime);
//       const end = formatTime(data.endTime);

//       // Use the timeToMinutes function to compare times
//       const startMinutes = timeToMinutes(start);
//       const endMinutes = timeToMinutes(end);

//       return endMinutes > startMinutes;
//     },
//     {
//       message: "End time must be after start time",
//       path: ["endTime"],
//     }
//   );

//   // Helper function to convert time string to minutes (copied from ScheduleView)
// function timeToMinutes(timeStr: string): number {
//     const [time, period] = timeStr.split(" ");
//     let [hours, minutes] = time.split(":").map(Number);

//     if (period === "PM" && hours !== 12) {
//       hours += 12;
//     } else if (period === "AM" && hours === 12) {
//       hours = 0;
//     }

//     return hours * 60 + minutes;
//   }

// export type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;
// export default scheduleFormSchema;

// Define the form schema with validation
const scheduleFormSchema = z
  .object({
    day: z.string().min(1, { message: "Day is required" }),
    startTime: z.string().min(1, { message: "Start time is required" }),
    endTime: z.string().min(1, { message: "End time is required" }),
    subject: z.string().min(1, { message: "Subject is required" }),
    sectionCourse: z.string().min(1, { message: "Section is required" }),
    faculty: z.string().min(1, { message: "Faculty is required" }),
    room: z.string().min(1, { message: "Room is required" }),
    academicYear: z
      .string()
      .min(1, { message: "Academic year is required" })
      .regex(/^\d{4}-\d{4}$/, {
        message: "Format must be YYYY-YYYY (e.g., 2024-2025)",
      }),
    semester: z.string().min(1, { message: "Semester is required" }),
  })
  .refine(
    (data) => {
      // Parse time strings to compare them
      const parseTime = (timeStr: string) => {
        const [time, period] = timeStr.split(" ");
        const [hours, minutes] = time.split(":").map(Number);
        let totalHours = hours;

        if (period === "PM" && totalHours !== 12) {
          totalHours += 12;
        } else if (period === "AM" && totalHours === 12) {
          totalHours = 0;
        }

        return totalHours * 60 + minutes;
      };

      // Only validate if both times are provided
      if (data.startTime && data.endTime) {
        const startMinutes = parseTime(data.startTime);
        const endMinutes = parseTime(data.endTime);
        return endMinutes > startMinutes;
      }

      return true;
    },
    {
      message: "End time must be later than start time",
      path: ["endTime"], // This will show the error under the endTime field
    }
  );

export type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;
export default scheduleFormSchema;

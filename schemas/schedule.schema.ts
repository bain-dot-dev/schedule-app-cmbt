import { z } from "zod";

// Define the form schema with validation
export const scheduleFormSchema = z
  .object({
    faculty: z.string().min(1, { message: "Faculty is required" }),
    subject: z.string().min(1, { message: "Subject is required" }),
    section: z.string().min(1, { message: "Section is required" }),
    room: z.string().min(1, { message: "Room is required" }),
    academicYear: z.string().min(1, { message: "Academic year is required" }),
    day: z.string().min(1, { message: "Day is required" }),
    startTime: z.string().min(1, { message: "Start time is required" }),
    endTime: z.string().min(1, { message: "End time is required" }),
  })
  .refine(
    (data) => {
      // Convert times to comparable format for validation
      const formatTime = (time: string) => {
        if (!time.includes(":")) return time; // Already in correct format

        const [hours, minutes] = time.split(":").map(Number);
        const period = hours >= 12 ? "PM" : "AM";
        const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
        return `${displayHours}:${minutes
          .toString()
          .padStart(2, "0")} ${period}`;
      };

      const start = formatTime(data.startTime);
      const end = formatTime(data.endTime);

      // Use the timeToMinutes function to compare times
      const startMinutes = timeToMinutes(start);
      const endMinutes = timeToMinutes(end);

      return endMinutes > startMinutes;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );

  // Helper function to convert time string to minutes (copied from ScheduleView)
function timeToMinutes(timeStr: string): number {
    const [time, period] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
  
    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }
  
    return hours * 60 + minutes;
  }
  
export type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;
export default scheduleFormSchema;
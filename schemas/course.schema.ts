import { z } from "zod";
// Define the form schema with validation
export const courseFormSchema = z.object({
  courseCode: z.string().min(1, { message: "Course code is required" }),
  courseProgram: z.string().min(1, { message: "Course program is required" }),
});

// Define the type based on the schema
export type CourseFormValues = z.infer<typeof courseFormSchema>;

export default courseFormSchema;

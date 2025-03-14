import { z } from "zod";

const rankEnum = z.enum([
  "Instructor 1",
  "Instructor 2",
  "Instructor 3",
  "Assistant Professor 1",
  "Assistant Professor 2",
  "Assistant Professor 3",
  "Assistant Professor 4",
  "Associate Professor 1",
  "Associate Professor 2",
  "Associate Professor 3",
  "Associate Professor 4",
  "Associate Professor 5",
  "Professor 1",
  "Professor 2",
  "Professor 3",
  "Professor 4",
  "Professor 5",
  "Professor 6",
]);
// Define the form schema with validation
export const facultyFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  middleName: z.string().optional(),
  lastName: z.string().min(1, { message: "Last name is required" }),
  employeeNumber: z.string().min(1, { message: "Employee number is required" }),
  specialization: z.string().min(1, { message: "specialization is required" }),
  rank: rankEnum,
});

// Define the type based on the schema
export type FacultyFormValues = z.infer<typeof facultyFormSchema>;
export default facultyFormSchema;

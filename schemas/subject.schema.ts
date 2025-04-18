import { z } from "zod";

// const valueOfUnits = z.enum(["2", "3", "4"]);
// Define the form schema with validation
export const subjectFormSchema = z.object({
  subjectID: z.string().optional(),
  subjectName: z.string().min(1, { message: "Subject name is required" }),
  subjectCode: z.string().optional(),
  // numberOfUnits: valueOfUnits,
  numberOfUnits: z
    .string()
    .min(1, { message: "Number of units is required" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Must be a positive number",
    })
    .refine((val) => Number(val) >= 2 && Number(val) <= 4, {
      message: "Number of units must be between 2 and 4",
    }),
});

export const subjectViewSchema = z.object({
  subjectID: z.string(),
  subjectName: z.string(),
  subjectCode: z.string(),
  // numberOfUnits: valueOfUnits,
  numberOfUnits: z
    .string()
    .min(1, { message: "Number of units is required" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Must be a positive number",
    })
    .refine((val) => Number(val) >= 2 && Number(val) <= 4, {
      message: "Number of units must be between 2 and 4",
    }),
});

// Define the type based on the schema
export type SubjectFormValues = z.infer<typeof subjectFormSchema>;
export type SubjectViewValues = z.infer<typeof subjectViewSchema>;
export default subjectFormSchema;

import { z } from "zod";

// Define the form schema with validation
export const sectionFormSchema = z.object({
    sectionName: z.string().min(1, { message: "Section name is required" }),
    courseProgram: z.string().min(1, { message: "Course program is required" }),
  });
  
  // Define the type based on the schema
export type SectionFormValues = z.infer<typeof sectionFormSchema>;
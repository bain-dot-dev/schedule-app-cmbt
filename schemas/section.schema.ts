import { z } from "zod";

// Define the form schema with validation
export const sectionFormSchema = z.object({
    sectionID: z.string().optional(),
    sectionName: z.string().min(1, { message: "Section name is required" }),
    courseProgram: z.string().min(1, { message: "Course program is required" }),
  });

  export const sectionViewSchema = z.object({
    sectionID: z.string(),
    sectionName: z.string(),
    courseProgram: z.string(),
  });
  
  // Define the type based on the schema
export type SectionFormValues = z.infer<typeof sectionFormSchema>;
export type SectionViewValues = z.infer<typeof sectionViewSchema>;
export default sectionFormSchema;
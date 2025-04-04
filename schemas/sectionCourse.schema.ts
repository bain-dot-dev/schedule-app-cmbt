import { z } from "zod";

export const sectionViewSchema = z.object({
  sectionID: z.string(),
  sectionName: z.string(),
  courseProgram: z.string(),
});

export const courseViewSchema = z.object({
  courseID: z.string(),
  courseCode: z.string(),
  courseProgram: z.string(),
});

export const sectionCourseViewSchema = z.object({
  sectionCourseID: z.string(),
  section: sectionViewSchema,
  courseProgram: courseViewSchema,
});

export type SectionCourseViewValues = z.infer<typeof sectionCourseViewSchema>;
export type SectionViewValues = z.infer<typeof sectionViewSchema>;
export type CourseViewValues = z.infer<typeof courseViewSchema>;
export default sectionCourseViewSchema;

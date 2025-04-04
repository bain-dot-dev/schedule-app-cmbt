import { z } from "zod";

// Define the form schema with validation
export const roomFormSchema = z.object({
  roomID: z.string().optional(),
  roomNumber: z.string().min(1, { message: "Room number is required" }),
  type: z.string().min(1, { message: "Room type is required" }),
});

export const roomViewSchema = z.object({
  roomID: z.string(),
  roomNumber: z.string(),
  type: z.string(),
});

// Define the type based on the schema
export type RoomFormValues = z.infer<typeof roomFormSchema>;
export type RoomViewValues = z.infer<typeof roomViewSchema>;
export default roomFormSchema;
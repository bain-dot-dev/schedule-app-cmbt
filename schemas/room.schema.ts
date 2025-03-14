import { z } from "zod"

// Define the form schema with validation
export const roomFormSchema = z.object({
    roomNumber: z.string().min(1, { message: "Room number is required" }),
    type: z.string().min(1, { message: "Room type is required" }),
  });
  
  // Define the type based on the schema
export type RoomFormValues = z.infer<typeof roomFormSchema>;
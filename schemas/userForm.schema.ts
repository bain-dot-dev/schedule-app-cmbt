import { z } from "zod";
// Define the form schema with validation
export const userFormSchema = z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    middleName: z.string().optional(),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .or(z.literal("")),
    isAdmin: z.boolean().default(false),
    isActive: z.boolean().default(true),
    sendVerificationEmail: z.boolean().default(true),
  });



// Define the type based on the schema
export type UserFormValues = z.infer<typeof userFormSchema>;


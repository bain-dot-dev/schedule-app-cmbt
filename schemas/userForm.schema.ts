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
   role: z.enum(["superadmin", "admin", "faculty"], {
      errorMap: () => ({ message: "Role is required" }),
    }),
    isActive: z.boolean().default(true),
    courseProgramID: z.string().optional(),
    // sendVerificationEmail: z.boolean().default(true),
    sendVerificationEmail: z.boolean().default(false),
  });

  // just comment out the sendVerificationEmail field in the schema above 
  // to that says default(false) to enable it by default then uncomment this line
  // sendVerificationEmail: z.boolean().default(true),


// Define the type based on the schema
export type UserFormValues = z.infer<typeof userFormSchema>;


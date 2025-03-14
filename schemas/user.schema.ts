import { z } from "zod";

// Login Schema
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Email Schema
const EmailSchema = z.object({
  emailID: z.number().optional(), // Optional since it's auto-incremented
  email: z.string().email(),
});

// Password Schema
const PasswordSchema = z.object({
  passwordID: z.number().optional(), // Optional since it's auto-incremented
  password: z.string(),
});

// User Schema
export const user = z.object({
  userID: z.coerce.number().optional(), // Primary key, optional since it's auto-incremented
  firstName: z.string().max(25), // Max length of 25
  middleName: z.string().max(25).optional(), // Optional middle name
  lastName: z.string().max(25), // Required last name
  Email: z.array(EmailSchema), // Array of emails associated with the user
  Password: PasswordSchema.optional(), // Optional password association
});


export type AddUser = z.infer<typeof user>;
export type Login = z.infer<typeof loginSchema>;

export default user;

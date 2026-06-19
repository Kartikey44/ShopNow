import { z } from "zod";

export const registerSchema = z.object({
  fullname: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name cannot exceed 50 characters"),

  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .toLowerCase(),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),

  profilePic: z
    .string()
    .url("Invalid profile picture URL")
    .optional(),

  isVerified: z
    .boolean()
    .optional(),
});
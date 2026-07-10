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
    .toLowerCase()
    .email("Please enter a valid email address"),

  phonenNumber: z
    .string()
    .trim()
    .regex(
      /^[6-9]\d{9}$/,
      "Please enter a valid 10-digit Indian mobile number"
  )
  .optional(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password cannot exceed 32 characters")
    .regex(
      /^(?=.*[a-z])/,
      "Password must contain at least one lowercase letter"
    )
    .regex(
      /^(?=.*[A-Z])/,
      "Password must contain at least one uppercase letter"
    )
    .regex(
      /^(?=.*\d)/,
      "Password must contain at least one number"
    )
    .regex(
      /^(?=.*[@$!%*?&])/,
      "Password must contain at least one special character"
    ),

  profilePic: z
    .string()
    .url("Invalid profile picture URL")
    .optional(),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});
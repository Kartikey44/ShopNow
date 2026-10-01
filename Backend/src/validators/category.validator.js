import { z } from "zod";

const categoryName = z
  .string()
  .trim()
  .min(2, "Category name must be at least 2 characters")
  .max(60, "Category name cannot exceed 60 characters")
  .regex(
    /^[a-zA-Z0-9&' -]+$/,
    "Category name can contain letters, numbers, spaces, hyphens, apostrophes, and & only",
  )
  .transform((value) => value.toLowerCase());

const description = z
  .string()
  .trim()
  .max(500, "Description cannot exceed 500 characters");

const image = z
  .union([z.string().trim().url("Image must be a valid URL"), z.literal("")]);

export const createCategorySchema = z
  .object({
    categoryName,
    description: description.default(""),
    image: image.default(""),
  })
  .strict();

export const updateCategorySchema = z
  .object({
    categoryName: categoryName.optional(),
    description: description.optional(),
    image: image.optional(),
  })
  .strict()
  .refine((category) => Object.keys(category).length > 0, {
    message: "Provide at least one category field to update",
  });

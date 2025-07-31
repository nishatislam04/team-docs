import { z } from "zod";

export const PermissionSchema = z.object({
  name: z.string().min(3, "permission Name must be at least 3 characters"),
  projectScope: z
    .string()
    .trim()
    .min(3, "Permission scope must be at least 3 characters")
    .nullable()
    .or(z.literal("")),
  description: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 10, "Description must be at least 10 characters."),
  action: z.string().min(3, "permission action must be at least 3 characters"),
  resource: z.string().min(3, "permission resource must be at least 3 characters"),
});

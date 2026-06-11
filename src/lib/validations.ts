import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[0-9]/, "Must contain number"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100),
  description: z.string().max(500).optional(),
  prompt: z.string().min(10, "Please describe your website in at least 10 characters").max(2000),
  isPublic: z.boolean().optional().default(false),
});

export const generateSchema = z.object({
  prompt: z.string().min(10).max(2000),
  projectId: z.string().optional(),
  options: z
    .object({
      websiteType: z.string().optional(),
      colorPalette: z.string().optional(),
      pages: z.array(z.string()).optional(),
      features: z.array(z.string()).optional(),
      style: z.string().optional(),
    })
    .optional(),
});

export const fileUpdateSchema = z.object({
  content: z.string(),
  path: z.string(),
});

export const versionSchema = z.object({
  label: z.string().max(100).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type GenerateInput = z.infer<typeof generateSchema>;
export type FileUpdateInput = z.infer<typeof fileUpdateSchema>;

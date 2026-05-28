import { z } from "zod";

export const CreateProjectSchema = z.object({
  title: z.string().min(3, "Project title must be at least 3 characters"),
  description: z.string().optional(),
  workspaceId: z.string(),
  members: z.array(z.string()).optional(),
  dueDate: z.string().datetime(),
});

export const UpdateProjectSchema = z.object({
  title: z.string().min(3, "Project title must be at least 3 characters").optional(),
  description: z.string().optional(),
  members: z.array(z.string()).optional(),
  dueDate: z.string().datetime().optional(),
});

export const ProjectSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  workspaceId: z.string(),
  createdBy: z.string(),
  members: z.array(z.string()),
  dueDate: z.string().datetime(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
export type Project = z.infer<typeof ProjectSchema>;

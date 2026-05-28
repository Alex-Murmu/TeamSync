import { z } from "zod";

const TaskDateSchema = z.string().min(1, "Due date is required").refine(
  (value) => !Number.isNaN(Date.parse(value)),
  "Invalid date"
);

export const CreateTaskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  projectId: z.string(),
  assignedTo: z.string().optional(),
  status: z.enum(["Pending", "Progress", "Review", "Complete"]).optional(),
  priority: z.enum(["High", "Moderate", "Low"]),
  dueDate: TaskDateSchema,
});

export const UpdateTaskSchema = z.object({
  title: z.string().min(1, "Task title is required").optional(),
  description: z.string().optional(),
  assignedTo: z.string().optional(),
  status: z.enum(["Pending", "Progress", "Review", "Complete"]).optional(),
  priority: z.enum(["High", "Moderate", "Low"]).optional(),
  dueDate: TaskDateSchema.optional(),
});

export const TaskSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  projectId: z.string(),
  assignedTo: z.string().optional(),
  status: z.enum(["Pending", "Progress", "Review", "Complete"]).default("Pending"),
  priority: z.enum(["High", "Moderate", "Low"]),
  dueDate: z.string().datetime(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type Task = z.infer<typeof TaskSchema>;

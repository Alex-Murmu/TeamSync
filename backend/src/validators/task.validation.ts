import { z } from "zod";


export const CreateTaskSchema = z.object({
    body: z.object({
        title: z
            .string()
            .trim()
            .min(3, "Title must be at least 3 characters")
            .max(100, "Title must be less than 100 characters"),

        description: z
            .string()
            .trim()
            .max(500, "Description must be less than 500 characters")
            .optional(),

        projectId: z
            .string()
            .regex(/^[a-f\d]{24}$/i, "Invalid project ID format"),  // MongoDB ObjectId validation

        assignedTo: z
            .string()
            .regex(/^[a-f\d]{24}$/i, "Invalid user ID format")
            .optional(),

        status: z
            .enum(["Pending", "Complete", "Progress"])
            .default("Pending"),

        priority: z
            .enum(["High", "Low", "Moderate"]),

        dueDate: z
            .string()
            .or(z.date())
            .transform((val) => new Date(val))
            .refine((date) => date > new Date(), {
                message: "Due date must be in the future"
            })
    })
});


export const UpdateTaskSchema = z.object({
    body: z.object({
        title: z
            .string()
            .trim()
            .min(3, "Title must be at least 3 characters")
            .max(100, "Title must be less than 100 characters")
            .optional(),

        description: z
            .string()
            .trim()
            .max(500, "Description must be less than 500 characters")
            .optional(),

        assignedTo: z
            .string()
            .regex(/^[a-f\d]{24}$/i, "Invalid user ID format")
            .optional(),

        status: z
            .enum(["Pending", "Complete", "Progress"])
            .optional()
            .default("Pending"),

        priority: z
            .enum(["High", "Low", "Moderate"])
            .optional(),

        dueDate: z
            .string()
            .or(z.date())
            .transform((val) => new Date(val))
            .optional()
    })
});


export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
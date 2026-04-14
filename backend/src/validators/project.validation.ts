import z from "zod";

export const CreateProjectSchema = z.object({
    body:z.object({
        title:z
          .string()
          .trim()
          .min(5,"Atleast length should be 5"),
        description:z
          .string()
          .trim()
          .optional(),
        admin:z
          .string()
          .trim()
          .regex(/^[a-f\d]{24}$/i, "Invalid user ID format"),
        member:z
          .string()
          .regex(/^[a-f\d]{24}$/i, "Invalid user ID format")
          .optional(),
        dueDate:z
          .string()
          .or(z.date())
          .transform((val)=> new Date(val))
          .refine((date)=> date >new Date())
    })
})

export const UpdateProjectSchema = z.object({
    body:z.object({
        title:z
          .string()
          .trim()
          .min(5,"Atleast length should be 5")
          .optional(),
        description:z
          .string()
          .trim()
          .optional(),
        admin:z
          .string()
          .trim()
          .regex(/^[a-f\d]{24}$/i, "Invalid user ID format")
          .optional(),
        member:z
          .string()
          .regex(/^[a-f\d]{24}$/i, "Invalid user ID format")
          .optional(),
        dueDate:z
          .string()
          .or(z.date())
          .transform((val)=> new Date(val))
          .refine((date)=> date >new Date())
          .optional(),
    })
})

export type CreateProjectInputs = z.infer<typeof CreateProjectSchema>["body"];
export type UpdateProjectInputs = z.infer<typeof UpdateProjectSchema>["body"];

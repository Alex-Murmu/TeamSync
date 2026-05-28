import { z } from "zod";

export const CreateCommentSchema = z.object({
  body: z.object({
    content: z
      .string("Content is required")
      .trim()
      .min(1, "Comment cannot be empty")
      .max(2000, "Comment must not exceed 2000 characters"),
    entityType: z.enum(["Task", "Project"]),
    entityId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid entity ID format"),
  }),
});

export const UpdateCommentSchema = z.object({
  body: z.object({
    content: z
      .string()
      .trim()
      .min(1, "Comment cannot be empty")
      .max(2000, "Comment must not exceed 2000 characters"),
  }),
});

export type CreateCommentInputs = z.infer<typeof CreateCommentSchema>["body"];
export type UpdateCommentInputs = z.infer<typeof UpdateCommentSchema>["body"];

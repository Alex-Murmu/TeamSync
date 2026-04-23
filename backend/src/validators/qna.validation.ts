import { z } from "zod";

export const CreateQnaSchema = z.object({
  body: z.object({
    question: z
      .string()
      .min(5, "Question must be at least 5 characters")
      .max(500, "Question must be less than 500 characters"),
  }),
});

export const AnswerQnaSchema = z.object({
  body: z.object({
    answer: z
      .string()
      .min(5, "Answer must be at least 5 characters")
      .max(2000, "Answer must be less than 2000 characters"),
    status: z.enum(["pending", "answered", "closed"]).optional(),
  }),
});

export const UpdateQnaStatusSchema = z.object({
  body: z.object({
    status: z.enum(["pending", "answered", "closed"]),
  }),
});

export type CreateQnaInput = z.infer<typeof CreateQnaSchema>["body"];
export type AnswerQnaInput = z.infer<typeof AnswerQnaSchema>["body"];
export type UpdateQnaStatusInput = z.infer<typeof UpdateQnaStatusSchema>["body"];

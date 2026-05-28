import { z } from "zod";

export const CreateInvitationSchema = z.object({
  body: z.object({
    email: z
      .string("Email is required")
      .trim()
      .email("Invalid email format"),
    role: z.enum(["Admin", "Member", "Viewer"]).default("Member"),
  }),
});

export const AcceptInvitationSchema = z.object({
  params: z.object({
    token: z.string().min(1, "Token is required"),
  }),
});

export type CreateInvitationInputs = z.infer<typeof CreateInvitationSchema>["body"];
export type AcceptInvitationInputs = z.infer<typeof AcceptInvitationSchema>["params"];

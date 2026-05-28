import { z } from "zod";

export const CreateWorkspaceSchema = z.object({
  body: z.object({
    name: z
      .string("Workspace name is required")
      .trim()
      .min(3, "Workspace name must be at least 3 characters"),
    description: z
      .string()
      .trim()
      .max(500, "Description must not exceed 500 characters")
      .optional(),
  }),
});

export const UpdateWorkspaceSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(3, "Workspace name must be at least 3 characters")
      .optional(),
    description: z
      .string()
      .trim()
      .max(500, "Description must not exceed 500 characters")
      .optional(),
  }),
});

export const InviteMemberSchema = z.object({
  body: z.object({
    email: z
      .string("Email is required")
      .trim()
      .email("Invalid email format"),
    role: z.enum(["Admin", "Member", "Viewer"]).default("Member"),
  }),
});

export const UpdateMemberRoleSchema = z.object({
  body: z.object({
    role: z.enum(["Owner", "Admin", "Member", "Viewer"]),
  }),
});

export type CreateWorkspaceInputs = z.infer<typeof CreateWorkspaceSchema>["body"];
export type UpdateWorkspaceInputs = z.infer<typeof UpdateWorkspaceSchema>["body"];
export type InviteMemberInputs = z.infer<typeof InviteMemberSchema>["body"];
export type UpdateMemberRoleInputs = z.infer<typeof UpdateMemberRoleSchema>["body"];

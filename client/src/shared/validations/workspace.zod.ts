import { z } from "zod";

export const WorkspaceMemberUserSchema = z.object({
  _id: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
});

export const WorkspaceMemberSchema = z.object({
  userId: z.union([z.string(), WorkspaceMemberUserSchema]),
  role: z.enum(["Owner", "Admin", "Member", "Viewer"]),
  joinedAt: z.string().datetime().optional(),
});

export const CreateWorkspaceSchema = z.object({
  name: z.string().min(3, "Workspace name must be at least 3 characters"),
  description: z.string().max(500, "Description must not exceed 500 characters").optional(),
});

export const UpdateWorkspaceSchema = z.object({
  name: z.string().min(3, "Workspace name must be at least 3 characters").optional(),
  description: z.string().max(500, "Description must not exceed 500 characters").optional(),
});

export const InviteMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["Admin", "Member", "Viewer"]),
});

export const UpdateMemberRoleSchema = z.object({
  role: z.enum(["Owner", "Admin", "Member", "Viewer"]),
});

export const WorkspaceSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  members: z.array(WorkspaceMemberSchema),
  createdBy: z.union([z.string(), WorkspaceMemberUserSchema]),
  isActive: z.boolean().default(true),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type WorkspaceMember = z.infer<typeof WorkspaceMemberSchema>;
export type CreateWorkspaceInput = z.infer<typeof CreateWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof UpdateWorkspaceSchema>;
export type InviteMemberInput = z.infer<typeof InviteMemberSchema>;
export type UpdateMemberRoleInput = z.infer<typeof UpdateMemberRoleSchema>;
export type Workspace = z.infer<typeof WorkspaceSchema>;

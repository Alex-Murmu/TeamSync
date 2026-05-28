import { z } from "zod";

export const CreateDirectConversationSchema = z.object({
  participantId: z.string(),
  workspaceId: z.string(),
  projectId: z.string().optional(),
});

export const CreateGroupConversationSchema = z.object({
  title: z.string().min(3, "Group name must be at least 3 characters"),
  workspaceId: z.string(),
  projectId: z.string().optional(),
  memberIds: z.array(z.string()).min(2, "At least 2 members required"),
});

export const SendMessageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty").max(5000),
  contentType: z.enum(["text", "system", "file", "image", "voice-note"]).default("text"),
  replyToMessageId: z.string().optional(),
});

export const MessageSchema = z.object({
  _id: z.string(),
  conversationId: z.string(),
  senderId: z.string(),
  content: z.string(),
  contentType: z.enum(["text", "system", "file", "image", "voice-note"]),
  replyToMessageId: z.string().optional(),
  editedAt: z.string().datetime().optional(),
  deletedAt: z.string().datetime().optional(),
  seenBy: z.array(z.object({
    userId: z.string(),
    seenAt: z.string().datetime(),
  })).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const ConversationSchema = z.object({
  _id: z.string(),
  type: z.enum(["direct", "group"]),
  workspaceId: z.string(),
  projectId: z.string().optional(),
  title: z.string().optional(),
  createdBy: z.string(),
  members: z.array(z.string()),
  lastMessageAt: z.string().datetime().optional(),
  lastMessageId: z.string().optional(),
  isArchived: z.boolean().default(false),
  isLocked: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type CreateDirectConversationInput = z.infer<typeof CreateDirectConversationSchema>;
export type CreateGroupConversationInput = z.infer<typeof CreateGroupConversationSchema>;
export type SendMessageInput = z.infer<typeof SendMessageSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type Conversation = z.infer<typeof ConversationSchema>;

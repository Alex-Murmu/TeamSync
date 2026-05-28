import { z } from "zod";

const objectId = /^[a-f\d]{24}$/i;

export const CreateDirectConversationSchema = z.object({
  body: z.object({
    participantId: z.string().regex(objectId, "Invalid participantId"),
    workspaceId: z.string().regex(objectId, "Invalid workspaceId"),
    projectId: z.string().regex(objectId, "Invalid projectId").optional(),
  }),
});

export const CreateGroupConversationSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3, "title must be at least 3 chars").max(100),
    workspaceId: z.string().regex(objectId, "Invalid workspaceId"),
    projectId: z.string().regex(objectId, "Invalid projectId").optional(),
    memberIds: z.array(z.string().regex(objectId, "Invalid memberId")).min(2),
  }),
});

export const ConversationIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(objectId, "Invalid conversation id"),
  }),
});

export const SendMessageSchema = z.object({
  body: z.object({
    content: z.string().trim().min(1, "content is required").max(5000),
    contentType: z.enum(["text", "system", "file", "image", "voice-note"]).optional(),
    replyToMessageId: z.string().regex(objectId, "Invalid replyToMessageId").optional(),
  }),
  params: z.object({
    id: z.string().regex(objectId, "Invalid conversation id"),
  }),
});

export const ListMessagesSchema = z.object({
  params: z.object({
    id: z.string().regex(objectId, "Invalid conversation id"),
  }),
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

export type CreateDirectConversationInputs = z.infer<typeof CreateDirectConversationSchema>["body"];
export type CreateGroupConversationInputs = z.infer<typeof CreateGroupConversationSchema>["body"];
export type SendMessageInputs = z.infer<typeof SendMessageSchema>["body"];


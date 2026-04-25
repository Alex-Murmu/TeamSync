import { z } from "zod";

const objectId = /^[a-f\d]{24}$/i;

export const CreateCallSessionSchema = z.object({
  body: z.object({
    conversationId: z.string().regex(objectId, "Invalid conversationId"),
    type: z.enum(["voice", "video"]),
  }),
});

export const CallSessionIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(objectId, "Invalid call session id"),
  }),
});

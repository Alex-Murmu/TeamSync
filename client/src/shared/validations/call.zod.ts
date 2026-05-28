import { z } from "zod";

export const CreateCallSessionSchema = z.object({
  conversationId: z.string(),
  type: z.enum(["voice", "video"]),
});

export const JoinCallSessionSchema = z.object({
  callSessionId: z.string(),
});

export const CallSessionSchema = z.object({
  _id: z.string(),
  conversationId: z.string(),
  projectId: z.string().optional(),
  initiatorId: z.string(),
  type: z.enum(["voice", "video"]),
  status: z.enum(["ringing", "active", "ended", "missed", "rejected"]),
  participants: z.array(z.string()),
  startedAt: z.string().datetime().optional(),
  endedAt: z.string().datetime().optional(),
  endedBy: z.string().optional(),
  durationSeconds: z.number().min(0).optional(),
  rtcRoomId: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type CreateCallSessionInput = z.infer<typeof CreateCallSessionSchema>;
export type JoinCallSessionInput = z.infer<typeof JoinCallSessionSchema>;
export type CallSession = z.infer<typeof CallSessionSchema>;

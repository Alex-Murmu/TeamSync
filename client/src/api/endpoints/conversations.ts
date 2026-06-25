import api from "@/api/client";

export const listConversations = () => api.get("/conversations");
export const createDirectConversation = (payload: { participantId: string; projectId: string }) =>
  api.post("/conversations/direct", payload);
export const createGroupConversation = (payload: {
  title: string;
  projectId: string;
  workspaceId: string;
  memberIds: string[];
}) => api.post("/conversations/group", payload);

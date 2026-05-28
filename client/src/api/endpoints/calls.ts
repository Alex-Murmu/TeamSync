import api from "@/api/client";

export const createCallSession = (payload: { conversationId: string; type: "voice" | "video" }) =>
  api.post("/calls", payload);
export const joinCallSession = (id: string) => api.post(`/calls/${id}/join`);
export const leaveCallSession = (id: string) => api.post(`/calls/${id}/leave`);
export const endCallSession = (id: string) => api.post(`/calls/${id}/end`);

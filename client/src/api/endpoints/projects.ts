import api from "@/api/client";

export const getProjects = () => api.get("/projects");
export const getProject = (id: string) => api.get(`/projects/${id}`);
export const createProject = (payload: {
  title: string;
  description?: string;
  dueDate: string;
  workspaceId?: string;
}) => api.post("/projects", payload);
export const updateProject = (id: string, payload: { title?: string; description?: string; dueDate?: string }) =>
  api.patch(`/projects/${id}`, payload);
export const deleteProject = (id: string) => api.delete(`/projects/${id}`);
export const addProjectMember = (id: string, memberId: string) =>
  api.patch(`/projects/${id}/member`, { memberId });
export const removeProjectMember = (id: string, memberId: string) =>
  api.delete(`/projects/${id}/member/${memberId}`);

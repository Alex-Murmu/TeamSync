import api from "@/api/client";

export const getTasks = () => api.get("/tasks");
export const getTask = (id: string) => api.get(`/tasks/${id}`);
export const createTask = (payload: {
  title: string;
  description?: string;
  projectId: string;
  priority: "High" | "Moderate" | "Low";
  dueDate: string;
  status?: "Pending" | "Progress" | "Review" | "Complete";
  assignedTo?: string;
}) => api.post("/tasks", payload);
export const updateTask = (
  id: string,
  payload: {
    title?: string;
    description?: string;
    status?: "Pending" | "Progress" | "Review" | "Complete";
    priority?: "High" | "Moderate" | "Low";
    dueDate?: string;
  }
) => api.patch(`/tasks/${id}`, payload);
export const assignTask = (id: string, assignedTo: string) =>
  api.patch(`/tasks/${id}/assign`, { assignedTo });
export const deleteTask = (id: string) => api.delete(`/tasks/${id}`);

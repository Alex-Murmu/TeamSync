export type Role = "ADMIN" | "MEMBER";

export type TaskStatus = "Pending" | "Progress" | "Complete";
export type TaskPriority = "High" | "Moderate" | "Low";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  title: string;
  team: string;
  location: string;
  avatarUrl?: string;
  verified: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "Planning" | "Active" | "At Risk" | "Complete";
  ownerId: string;
  memberIds: string[];
  tags: string[];
  progress: number;
  dueDate: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  dueDate: string;
}

export interface Conversation {
  id: string;
  name: string;
  memberIds: string[];
  lastMessageId: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
}

export interface CallSession {
  id: string;
  projectId: string;
  title: string;
  status: "Scheduled" | "Live" | "Ended";
  startedAt: string;
  participantIds: string[];
}

import api from "@/api/client";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: "ADMIN" | "MEMBER";
}

export const login = (payload: LoginPayload) => api.post("/user/login", payload);
export const register = (payload: RegisterPayload) => api.post("/user/register", payload);
export const getMe = () => api.get("/user/me");

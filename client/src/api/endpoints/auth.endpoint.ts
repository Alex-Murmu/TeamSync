import { apiClient } from "@/api/client";
import type { AuthApiResponse } from "@/store";

interface SignUpPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

interface LogInPayload {
  email: string;
  password: string;
}

const authEndpoint = {
  signUp: async (payload: SignUpPayload): Promise<AuthApiResponse> => {
    const { data } = await apiClient.post<AuthApiResponse>("/auth/register", payload);
    return data;
  },

  logIn: async (payload: LogInPayload): Promise<AuthApiResponse> => {
    const { data } = await apiClient.post<AuthApiResponse>("/auth/login", payload);
    return data;
  },
};

export { authEndpoint };

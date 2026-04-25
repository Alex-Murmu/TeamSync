export interface UserProfile {
  id?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role?: string;
}

export interface AuthStateData {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface AuthApiResponse {
  user?: UserProfile;
  token?: string;
  message?: string;
}

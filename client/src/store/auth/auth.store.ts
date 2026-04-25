import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthStateData, UserProfile } from "@/store/types";

interface AuthStore extends AuthStateData {
  setAuthenticatedUser: (user: UserProfile, token?: string | null) => void;
  updateUser: (patch: Partial<UserProfile>) => void;
  clearAuth: () => void;
}

const initialAuthState: AuthStateData = {
  user: null,
  token: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialAuthState,
      setAuthenticatedUser: (user, token = null) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),
      updateUser: (patch) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...patch } : state.user,
        })),
      clearAuth: () => set(initialAuthState),
    }),
    {
      name: "teamsync-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

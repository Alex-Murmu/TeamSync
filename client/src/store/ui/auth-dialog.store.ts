import { create } from "zustand";

interface AuthDialogStore {
  isSignUpOpen: boolean;
  isLogInOpen: boolean;
  openSignUp: () => void;
  closeSignUp: () => void;
  openLogIn: () => void;
  closeLogIn: () => void;
  switchToLogIn: () => void;
  switchToSignUp: () => void;
}

export const useAuthDialogStore = create<AuthDialogStore>((set) => ({
  isSignUpOpen: false,
  isLogInOpen: false,
  openSignUp: () => set({ isSignUpOpen: true }),
  closeSignUp: () => set({ isSignUpOpen: false }),
  openLogIn: () => set({ isLogInOpen: true }),
  closeLogIn: () => set({ isLogInOpen: false }),
  switchToLogIn: () => set({ isSignUpOpen: false, isLogInOpen: true }),
  switchToSignUp: () => set({ isSignUpOpen: true, isLogInOpen: false }),
}));

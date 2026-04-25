import { create } from "zustand";
import type { LoginFormData } from "@/store/types";

interface LoginFormStore {
  formData: LoginFormData;
  loading: boolean;
  setField: <K extends keyof LoginFormData>(key: K, value: LoginFormData[K]) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const initialFormData: LoginFormData = {
  email: "",
  password: "",
};

export const useLogInFormStore = create<LoginFormStore>((set) => ({
  formData: initialFormData,
  loading: false,
  setField: (key, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        [key]: value,
      },
    })),
  setLoading: (loading) => set({ loading }),
  reset: () => set({ formData: initialFormData, loading: false }),
}));

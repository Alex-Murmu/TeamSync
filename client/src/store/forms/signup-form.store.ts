import { create } from "zustand";
import type { SignUpFormData } from "@/store/types";

interface SignUpFormStore {
  formData: SignUpFormData;
  loading: boolean;
  setField: <K extends keyof SignUpFormData>(key: K, value: SignUpFormData[K]) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const initialFormData: SignUpFormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "",
};

export const useSignUpFormStore = create<SignUpFormStore>((set) => ({
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

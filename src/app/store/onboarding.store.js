import { create } from "zustand";

export const useOnboardingStore = create((set) => ({
  step: 1,
  formData: {},

  nextStep: () =>
    set((state) => ({
      step: Math.min(state.step + 1, 6),
    })),

  prevStep: () =>
    set((state) => ({
      step: Math.max(state.step - 1, 1),
    })),

  setStep: (step) => set({ step }),

  updateForm: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        ...data,
      },
    })),

  reset: () =>
    set({
      step: 1,
      formData: {},
    }),
}));
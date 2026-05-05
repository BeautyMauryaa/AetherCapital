import { create } from "zustand";

export const useOnboardingStore = create((set) => ({
  step: 1,
  formData: {},
  isSubmitting: false,
  isSubmitted: false,

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

  submitApplication: () => {
    set({ isSubmitting: true });
    setTimeout(() => {
      set({ isSubmitting: false, isSubmitted: true });
    }, 3000);
  },

  reset: () =>
    set({
      step: 1,
      formData: {},
      isSubmitting: false,
      isSubmitted: false,
    }),
}));

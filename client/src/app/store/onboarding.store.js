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

  // Called on final submit — sends all formData to backend
  submitApplication: async () => {
    set({ isSubmitting: true });
    try {
      const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const state = useOnboardingStore.getState();

      const res = await fetch(`${BASE_URL}/onboarding/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state.formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submission failed");

      set({ isSubmitting: false, isSubmitted: true });
    } catch (err) {
      console.error("Submit error:", err.message);
      set({ isSubmitting: false });
    }
  },

  reset: () =>
    set({
      step: 1,
      formData: {},
      isSubmitting: false,
      isSubmitted: false,
    }),
}));
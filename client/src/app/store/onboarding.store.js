import { create } from "zustand";
import { persist } from "zustand/middleware";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const useOnboardingStore = create(
  persist(
    (set, get) => ({
      step: 1,
      reachedStep: 1, // Track the furthest step the user has reached
      formData: {},
      isSubmitting: false,
      isSubmitted: false,

      // Update reachedStep whenever moving forward
      nextStep: () => set((s) => {
  const next = Math.min(s.step + 1, 6);
  return { 
    step: next, 
    // This ensures reachedStep only grows as they successfully pass validation
    reachedStep: Math.max(s.reachedStep, next) 
  };
}),

      prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),
      
      setStep: (step) => set({ step }),

      updateForm: (data) =>
        set((s) => ({ formData: { ...s.formData, ...data } })),

      // ── Final submit ────────────────────────────────────────────────────────
      submitApplication: async () => {
        set({ isSubmitting: true });
        try {
          const { formData } = get();
          const fd = new FormData();

          // ── Attach File objects ──────────────────────────────────────────────
          if (formData.profileImage instanceof File)
            fd.append("profileImage", formData.profileImage);

          if (formData.idFront instanceof File)
            fd.append("idFront", formData.idFront);

          if (formData.idBack instanceof File)
            fd.append("idBack", formData.idBack);

          if (
            formData.documents &&
            typeof formData.documents === "object" &&
            !Array.isArray(formData.documents)
          ) {
            Object.values(formData.documents).forEach((f) => {
              if (f instanceof File) fd.append("documents", f);
            });
          }
          if (Array.isArray(formData.documents)) {
            formData.documents.forEach((f) => {
              if (f instanceof File) fd.append("documents", f);
            });
          }

          const textData = {};
          for (const [key, val] of Object.entries(formData)) {
            if (val instanceof File) continue;
            if (key === "documents") continue;
            if (
              Array.isArray(val) ||
              (typeof val === "object" && val !== null)
            ) {
              textData[key] = JSON.stringify(val);
            } else {
              textData[key] = val;
            }
          }
          fd.append("formData", JSON.stringify(textData));

          const res = await fetch(`${BASE_URL}/onboarding/submit`, {
            method: "POST",
            body: fd,
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Submission failed");

          set({ isSubmitting: false, isSubmitted: true });
        } catch (err) {
          console.error("Submit error:", err.message);
          set({ isSubmitting: false });
          alert(`Submission failed: ${err.message}`);
        }
      },

      reset: () =>
        set({
          step: 1,
          reachedStep: 1,
          formData: {},
          isSubmitting: false,
          isSubmitted: false,
        }),
    }),
    {
      name: "aether-onboarding",
      partialize: (state) => ({
        step: state.step,
        reachedStep: state.reachedStep, // Persist reachedStep
        isSubmitted: state.isSubmitted,
        formData: Object.fromEntries(
          Object.entries(state.formData).filter(
            ([, v]) =>
              !(v instanceof File) &&
              !(
                typeof v === "object" &&
                v !== null &&
                !Array.isArray(v) &&
                Object.values(v).some((x) => x instanceof File)
              ),
          ),
        ),
      }),
    },
  ),
);
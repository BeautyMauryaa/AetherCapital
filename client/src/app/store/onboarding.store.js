import { create } from "zustand";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const useOnboardingStore = create((set, get) => ({
  step: 1,
  formData: {},
  isSubmitting: false,
  isSubmitted: false,

  nextStep: () => set((s) => ({ step: Math.min(s.step + 1, 6) })),
  prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),
  setStep:  (step) => set({ step }),

  updateForm: (data) =>
    set((s) => ({ formData: { ...s.formData, ...data } })),

  // ── Final submit — called from Step6 ──────────────────────────────────────
  // Sends ALL form data + all files to backend in one request
  submitApplication: async () => {
    set({ isSubmitting: true });

    try {
      const { formData } = get();
      const fd = new FormData();

      // ── Attach files (stored as File objects in formData) ──────────────────
      if (formData.profileImage instanceof File) {
        fd.append("profileImage", formData.profileImage);
      }
      if (formData.idFront instanceof File) {
        fd.append("idFront", formData.idFront);
      }
      if (formData.idBack instanceof File) {
        fd.append("idBack", formData.idBack);
      }
      if (Array.isArray(formData.documents)) {
        formData.documents.forEach((f) => {
          if (f instanceof File) fd.append("documents", f);
        });
      }

      // ── Attach all text data as JSON string ────────────────────────────────
      // (exclude File objects — already appended above)
      const textData = Object.fromEntries(
        Object.entries(formData).filter(
          ([, v]) => !(v instanceof File) && !Array.isArray(v) || typeof v === "string"
        )
      );
      // Include roles, permissions, questionnaire as serialized JSON
      textData.roles        = JSON.stringify(formData.roles || []);
      textData.departments  = JSON.stringify(formData.departments || []);
      textData.permissions  = JSON.stringify(formData.permissions || {});
      textData.questionnaire = JSON.stringify(formData.questionnaire || {});

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

  reset: () => set({ step: 1, formData: {}, isSubmitting: false, isSubmitted: false }),
}));
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fileStore } from "./fileStore.js";

const BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "http://localhost:5000/api";

export const useOnboardingStore = create(
  persist(
    (set, get) => ({
      step: 1,
      reachedStep: 1,
      formData: {},
      isSubmitting: false,
      isSubmitted: false,

      nextStep: () =>
        set((s) => {
          const next = Math.min(s.step + 1, 6);
          return { step: next, reachedStep: Math.max(s.reachedStep, next) };
        }),

      prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),
      setStep: (step) => set({ step }),

      // ── updateForm: Files go to fileStore, everything else to formData ──────
      updateForm: (data) => {
        const textData = {};

        for (const [key, val] of Object.entries(data)) {
          // Single File fields
          if (val instanceof File) {
            fileStore.set(key, val);
            textData[`${key}__name`] = val.name;
            continue;
          }

          // "documents" field — object map of { docId: File } from Step5
          if (key === "documents") {
            if (val && typeof val === "object" && !Array.isArray(val)) {
              const files = [];
              const names = {};

              for (const [docId, entry] of Object.entries(val)) {
                if (entry instanceof File) {
                  files.push({ docId, file: entry });
                  names[docId] = entry.name;
                } else if (typeof entry === "string") {
                  names[docId] = entry;
                }
              }

              if (files.length > 0) {
                const existing = fileStore.getMany("documents__files") || [];
                const existingMap = Object.fromEntries(
                  existing.map((e) => [e.docId, e]),
                );
                files.forEach((f) => (existingMap[f.docId] = f));
                fileStore.setMany(
                  "documents__files",
                  Object.values(existingMap),
                );
              }

              const existingNames = get().formData.documents__names || {};
              textData["documents__names"] = { ...existingNames, ...names };
            }
            continue;
          }

          // Everything else — plain serializable value
          textData[key] = val;
        }

        set((s) => ({ formData: { ...s.formData, ...textData } }));
      },

      // ── submitApplication ────────────────────────────────────────────────────
      submitApplication: async () => {
        set({ isSubmitting: true });
        try {
          const { formData } = get();
          const fd = new FormData();

          // 1. Single-file fields from fileStore
          const singleFileFields = ["profileImage", "idFront", "idBack"];
          singleFileFields.forEach((key) => {
            const file = fileStore.get(key);
            if (file instanceof File) fd.append(key, file);
          });

          // 2. Compliance documents from fileStore
          const docEntries = fileStore.getMany("documents__files") || [];
          docEntries.forEach(({ file }) => {
            if (file instanceof File) fd.append("documents", file);
          });

          // 3. Build text payload — strip internal __name / __names keys
          const textData = {};
          for (const [key, val] of Object.entries(formData)) {
            if (key.endsWith("__name") || key === "documents__names") continue;
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

          // 4. POST to correct backend URL
          const res = await fetch(`${BASE_URL}/onboarding/submit`, {
            method: "POST",
            body: fd,
          });

          // 5. Handle non-JSON error responses (like 404 HTML pages)
          const contentType = res.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            throw new Error(`Server error: ${res.status} ${res.statusText}`);
          }

          const responseData = await res.json();
          if (!res.ok)
            throw new Error(responseData.message || "Submission failed");

          fileStore.clear();
          set({ isSubmitting: false, isSubmitted: true });
        } catch (err) {
          console.error("Submit error:", err.message);
          set({ isSubmitting: false });
          alert(`Submission failed: ${err.message}`);
        }
      },

      reset: () => {
        fileStore.clear();
        set({
          step: 1,
          reachedStep: 1,
          formData: {},
          isSubmitting: false,
          isSubmitted: false,
        });
      },
    }),
    {
      name: "aether-onboarding",
      partialize: (state) => ({
        step: state.step,
        reachedStep: state.reachedStep,
        isSubmitted: state.isSubmitted,
        formData: state.formData,
      }),
    },
  ),
);

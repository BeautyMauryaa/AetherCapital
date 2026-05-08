// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// export const useOnboardingStore = create(
//   persist(
//     (set, get) => ({
//       step: 1,
//       reachedStep: 1, // Track the furthest step the user has reached
//       formData: {},
//       isSubmitting: false,
//       isSubmitted: false,

//       // Update reachedStep whenever moving forward
//       nextStep: () => set((s) => {
//   const next = Math.min(s.step + 1, 6);
//   return { 
//     step: next, 
//     // This ensures reachedStep only grows as they successfully pass validation
//     reachedStep: Math.max(s.reachedStep, next) 
//   };
// }),

//       prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),
      
//       setStep: (step) => set({ step }),

//       updateForm: (data) =>
//         set((s) => ({ formData: { ...s.formData, ...data } })),

//       // ── Final submit ────────────────────────────────────────────────────────
//       submitApplication: async () => {
//         set({ isSubmitting: true });
//         try {
//           const { formData } = get();
//           const fd = new FormData();

//           // ── Attach File objects ──────────────────────────────────────────────
//           if (formData.profileImage instanceof File)
//             fd.append("profileImage", formData.profileImage);

//           if (formData.idFront instanceof File)
//             fd.append("idFront", formData.idFront);

//           if (formData.idBack instanceof File)
//             fd.append("idBack", formData.idBack);

//           if (
//             formData.documents &&
//             typeof formData.documents === "object" &&
//             !Array.isArray(formData.documents)
//           ) {
//             Object.values(formData.documents).forEach((f) => {
//               if (f instanceof File) fd.append("documents", f);
//             });
//           }
//           if (Array.isArray(formData.documents)) {
//             formData.documents.forEach((f) => {
//               if (f instanceof File) fd.append("documents", f);
//             });
//           }

//           const textData = {};
//           for (const [key, val] of Object.entries(formData)) {
//             if (val instanceof File) continue;
//             if (key === "documents") continue;
//             if (
//               Array.isArray(val) ||
//               (typeof val === "object" && val !== null)
//             ) {
//               textData[key] = JSON.stringify(val);
//             } else {
//               textData[key] = val;
//             }
//           }
//           fd.append("formData", JSON.stringify(textData));

//           const res = await fetch(`${BASE_URL}/onboarding/submit`, {
//             method: "POST",
//             body: fd,
//           });

//           const data = await res.json();
//           if (!res.ok) throw new Error(data.message || "Submission failed");

//           set({ isSubmitting: false, isSubmitted: true });
//         } catch (err) {
//           console.error("Submit error:", err.message);
//           set({ isSubmitting: false });
//           alert(`Submission failed: ${err.message}`);
//         }
//       },

//       reset: () =>
//         set({
//           step: 1,
//           reachedStep: 1,
//           formData: {},
//           isSubmitting: false,
//           isSubmitted: false,
//         }),
//     }),
//     {
//       name: "aether-onboarding",
//       partialize: (state) => ({
//         step: state.step,
//         reachedStep: state.reachedStep, // Persist reachedStep
//         isSubmitted: state.isSubmitted,
//         formData: Object.fromEntries(
//           Object.entries(state.formData).filter(
//             ([, v]) =>
//               !(v instanceof File) &&
//               !(
//                 typeof v === "object" &&
//                 v !== null &&
//                 !Array.isArray(v) &&
//                 Object.values(v).some((x) => x instanceof File)
//               ),
//           ),
//         ),
//       }),
//     },
//   ),
// );



import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fileStore } from "./fileStore.js";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
      setStep:  (step) => set({ step }),

      // ── updateForm: Files go to fileStore, everything else to formData ──────
      updateForm: (data) => {
        const textData = {};

        for (const [key, val] of Object.entries(data)) {
          // Single File fields
          if (val instanceof File) {
            fileStore.set(key, val);
            // Store metadata so UI can still show filename after navigation
            textData[`${key}__name`] = val.name;
            continue;
          }

          // "documents" field — object map of { docId: File } from Step5
          if (key === "documents") {
            if (val && typeof val === "object" && !Array.isArray(val)) {
              const files   = [];
              const names   = {};

              for (const [docId, entry] of Object.entries(val)) {
                if (entry instanceof File) {
                  files.push({ docId, file: entry });
                  names[docId] = entry.name;
                } else if (typeof entry === "string") {
                  // Already just a name string (legacy path) — keep as-is
                  names[docId] = entry;
                }
              }

              if (files.length > 0) {
                // Merge new files into existing fileStore map
                const existing = fileStore.getMany("documents__files") || [];
                const existingMap = Object.fromEntries(
                  existing.map((e) => [e.docId, e])
                );
                files.forEach((f) => (existingMap[f.docId] = f));
                fileStore.setMany("documents__files", Object.values(existingMap));
              }

              // Merge names into persisted state
              const existingNames = get().formData.documents__names || {};
              textData["documents__names"] = { ...existingNames, ...names };
            }
            continue;
          }

          // Everything else — plain serializable value
          if (Array.isArray(val) || (typeof val === "object" && val !== null)) {
            textData[key] = val; // store as-is (Zustand handles serialization)
          } else {
            textData[key] = val;
          }
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
          const docEntries = fileStore.getMany("documents__files");
          docEntries.forEach(({ file }) => {
            if (file instanceof File) fd.append("documents", file);
          });

          // 3. Build text payload — strip internal __name / __names keys
          const textData = {};
          for (const [key, val] of Object.entries(formData)) {
            if (key.endsWith("__name") || key === "documents__names") continue;

            if (Array.isArray(val) || (typeof val === "object" && val !== null)) {
              textData[key] = JSON.stringify(val);
            } else {
              textData[key] = val;
            }
          }
          fd.append("formData", JSON.stringify(textData));

          // 4. POST
          const res = await fetch(`${BASE_URL}/onboarding/submit`, {
            method: "POST",
            body: fd,
          });

          const responseData = await res.json();
          if (!res.ok) throw new Error(responseData.message || "Submission failed");

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
        step:        state.step,
        reachedStep: state.reachedStep,
        isSubmitted: state.isSubmitted,
        // Persist only serializable formData — File objects are in fileStore
        formData:    state.formData,
      }),
    }
  )
);
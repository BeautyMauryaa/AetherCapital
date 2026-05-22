import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fileStore } from "./fileStore.js";

const BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "http://localhost:5000/api";

const SIG_KEY       = "aether_signature";
const getSessionSig = () => sessionStorage.getItem(SIG_KEY) || null;

export const useOnboardingStore = create(
  persist(
    (set, get) => ({
      step: 1,
      reachedStep: 1,
      formData: {},
      isSubmitting: false,
      isSubmitted: false,
      submitError: null,
      submissionResult: null,

      nextStep: () =>
        set((s) => {
          const next = Math.min(s.step + 1, 6);
          return { step: next, reachedStep: Math.max(s.reachedStep, next) };
        }),

      prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),
      setStep:  (step) => set({ step }),
      clearSubmitError: () => set({ submitError: null }),

      // ── updateForm ──────────────────────────────────────────────────────────
     updateForm: (data) => {
  const textData = {};

  for (const [key, val] of Object.entries(data)) {

    if (val instanceof File) {
      fileStore.set(key, val);
      textData[`${key}__name`] = val.name;
      continue;
    }

    // ✅ NEW CLEAN DOCUMENTS LOGIC
    if (key === "documents") {
      textData["documents"] = val;
      continue;
    }

    textData[key] = val;
  }

  set((s) => ({
    formData: { ...s.formData, ...textData }
  }));
},
      // ── submitApplication ───────────────────────────────────────────────────
      submitApplication: async () => {
        set({ isSubmitting: true, submitError: null });

        try {
          const { formData } = get();

          const signatureData = formData.signatureData || getSessionSig();

          const fd = new FormData();

          ["profileImage", "idFront", "idBack"].forEach((key) => {
            const file = fileStore.get(key);
            if (file instanceof File) fd.append(key, file);
          });

          // const docEntries = fileStore.getMany("documents__files") || [];
          // docEntries.forEach(({ file }) => {
          //   if (file instanceof File) fd.append("documents", file);
          // });

          const toBase64 = (file) =>
            new Promise((resolve) => {
              if (!(file instanceof File)) return resolve(null);
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(file);
            });

          // ── FIX: fallback to formData __preview if fileStore is empty ──
          const profileImageB64 =
            await toBase64(fileStore.get("profileImage")) ||
            formData.profileImage__preview || null;

          const idFrontB64 =
            await toBase64(fileStore.get("idFront")) ||
            formData.idFront__preview || null;

          const idBackB64 =
            await toBase64(fileStore.get("idBack")) ||
            formData.idBack__preview || null;

          const textData = {};
          for (const [key, val] of Object.entries(formData)) {
            if (
              key.endsWith("__name") ||
              key.endsWith("__preview") ||
              key === "documents__names" ||
              key === "signatureData"
            ) continue;
            if (Array.isArray(val) || (typeof val === "object" && val !== null)) {
              textData[key] = JSON.stringify(val);
            } else {
              textData[key] = val;
            }
          }
          if (signatureData) textData.signatureData = signatureData;

          fd.append("formData", JSON.stringify(textData));

          const res = await fetch(`${BASE_URL}/onboarding/submit`, {
            method: "POST",
            body: fd,
          });

          const contentType = res.headers.get("content-type");
          if (!contentType?.includes("application/json")) {
            throw new Error(`Server error ${res.status}: ${res.statusText}`);
          }

          const responseData = await res.json();
          if (!res.ok) throw new Error(responseData.message || "Submission failed");

          const submissionResult = {
            submissionId:    responseData.data?.id || responseData._id,
            submittedAt:     new Date().toISOString(),
            applicantName:   formData.firstName
              ? `${formData.firstName} ${formData.lastName || ""}`.trim()
              : formData.companyName || formData.legalName || "Applicant",
            email:           formData.email,
            accountType:     formData.accountType,
            signatureData,
            profileImageB64,
            idFrontB64,
            idBackB64,
          };

          fileStore.clear();

          set({
            isSubmitting:    false,
            isSubmitted:     true,
            submitError:     null,
            submissionResult,
            formData: Object.fromEntries(
              Object.entries(formData).filter(
                ([k]) => k !== "signatureData" && !k.endsWith("__preview")
              )
            ),
          });
        } catch (err) {
          console.error("Submit error:", err.message);
          set({ isSubmitting: false, submitError: err.message });
        }
      },

      // ── generateReceipt ─────────────────────────────────────────────────────
      generateReceipt: async () => {
        const { submissionResult, formData } = get();
        const result = submissionResult || {};

        const { default: jsPDF }       = await import("jspdf");
        const { default: html2canvas } = await import("html2canvas");

        const signatureData = result.signatureData || getSessionSig();
        const riskScore     = Object.values(formData.answers || {}).filter(v => v === true).length * 12.5;
        const riskTier      = riskScore === 0 ? "Low" : riskScore <= 40 ? "Medium" : "High";
        const submittedAt   = result.submittedAt
          ? new Date(result.submittedAt).toLocaleString()
          : new Date().toLocaleString();

        const imgBlock = (b64, label) =>
          b64
            ? `<div style="flex:1;min-width:200px">
                <p style="font-size:10px;color:#888;margin:0 0 6px;text-transform:uppercase;letter-spacing:.08em">${label}</p>
                <img src="${b64}" style="width:100%;max-height:180px;object-fit:contain;border-radius:8px;border:1px solid #eee" />
               </div>`
            : `<p style="color:#aaa;font-size:12px;margin:0">${label}: Not available</p>`;

        const docs    = formData.documents || {};
        // ── FIX: document filename dark, only checkmark green ──
        const docRows = Object.entries(docs)
          .filter(([, d]) => d?.name)
          .map(([id, d]) => `
            <tr>
              <td style="padding:7px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;text-transform:capitalize">
                ${id.replace(/_/g, " ")}
              </td>
              <td style="padding:7px 12px;border-bottom:1px solid #f0f0f0;font-size:13px">
                <span style="color:#10b981;font-weight:600">✓ </span>
                <span style="color:#1a1a2e">${d.name}</span>
              </td>
            </tr>`).join("");

        const sigHtml = signatureData
          ? `<div style="width:260px;height:90px;border:1px solid #eee;border-radius:8px;background:#fff;
                         display:flex;align-items:center;justify-content:center;overflow:hidden;
                         padding:8px;box-sizing:border-box;">
               <img src="${signatureData}" style="max-width:100%;max-height:100%;object-fit:contain;display:block;" />
             </div>`
          : `<p style="color:#aaa;font-size:13px;margin:0">Not available</p>`;

        const wrap = document.createElement("div");
        wrap.style.cssText = [
          "position:absolute", "top:-99999px", "left:0",
          "width:794px", "padding:56px 60px", "background:#fff",
          "color:#1a1a2e",
          "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
          "font-size:14px", "line-height:1.6", "box-sizing:border-box", "z-index:-9999",
        ].join(";");

        wrap.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #7c3aed;padding-bottom:24px;margin-bottom:32px">
            <div>
              <div style="font-size:26px;font-weight:700;color:#7c3aed;margin-bottom:4px">Aether Capital</div>
              <div style="color:#888;font-size:13px">Onboarding Application — Submission Receipt</div>
            </div>
            ${result.profileImageB64
              ? `<img src="${result.profileImageB64}" style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:2px solid #7c3aed" />`
              : ""}
          </div>

          <div style="font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#888;margin-bottom:10px;font-weight:600">Submission Details</div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:28px;font-size:14px">
            <tr><td style="color:#aaa;padding:4px 0;width:180px">Submission ID</td><td style="font-weight:600;color:#7c3aed">${result.submissionId || "—"}</td></tr>
            <tr><td style="color:#aaa;padding:4px 0">Submitted At</td><td>${submittedAt}</td></tr>
            <tr><td style="color:#aaa;padding:4px 0">Status</td><td style="color:#10b981;font-weight:500">✓ Received — Under Review</td></tr>
          </table>

          <div style="font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#888;margin-bottom:10px;font-weight:600">Personal Details</div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:28px;font-size:14px">
            <tr><td style="color:#aaa;padding:4px 0;width:180px">Name</td><td>${result.applicantName || "—"}</td></tr>
            <tr><td style="color:#aaa;padding:4px 0">Account Type</td><td style="text-transform:capitalize">${formData.accountType || "—"}</td></tr>
            <tr><td style="color:#aaa;padding:4px 0">Nationality</td><td>${formData.nationality || "—"}</td></tr>
            <tr><td style="color:#aaa;padding:4px 0">Gender</td><td>${formData.gender || "—"}</td></tr>
            <tr><td style="color:#aaa;padding:4px 0">Date of Birth</td><td>${formData.dobDay ? `${formData.dobDay} ${formData.dobMonth} ${formData.dobYear}` : "—"}</td></tr>
          </table>

          <div style="font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#888;margin-bottom:10px;font-weight:600">Address</div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:28px;font-size:14px">
            <tr><td style="color:#aaa;padding:4px 0;width:180px">Address</td><td>${formData.address1 || "—"}</td></tr>
            <tr><td style="color:#aaa;padding:4px 0">City</td><td>${formData.city || "—"}</td></tr>
            <tr><td style="color:#aaa;padding:4px 0">Country</td><td>${formData.country || "—"}</td></tr>
            <tr><td style="color:#aaa;padding:4px 0">ZIP</td><td>${formData.zip || "—"}</td></tr>
            <tr><td style="color:#aaa;padding:4px 0">Timezone</td><td>${formData.timezone || "—"}</td></tr>
          </table>

          <div style="font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#888;margin-bottom:10px;font-weight:600">Compliance</div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:28px;font-size:14px">
            <tr><td style="color:#aaa;padding:4px 0;width:180px">Risk Score</td><td>${riskScore}/100 (${riskTier})</td></tr>
            <tr><td style="color:#aaa;padding:4px 0">2FA</td><td>${formData.twoFA ? `Enabled · ${formData.tfaMethod || ""}` : "Disabled"}</td></tr>
          </table>

          ${docRows ? `
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#888;margin-bottom:10px;font-weight:600">Documents Submitted</div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:28px">
            <thead><tr style="background:#f8f8f8">
              <th style="text-align:left;padding:7px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#888">Document</th>
              <th style="text-align:left;padding:7px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#888">Status</th>
            </tr></thead>
            <tbody>${docRows}</tbody>
          </table>` : ""}

          <div style="font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#888;margin-bottom:10px;font-weight:600">Identity Documents</div>
          <div style="display:flex;gap:20px;margin-bottom:28px;flex-wrap:wrap">
            ${imgBlock(result.idFrontB64, "ID — Front")}
            ${imgBlock(result.idBackB64,  "ID — Back")}
          </div>

          <div style="font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#888;margin-bottom:10px;font-weight:600">Signature</div>
          <div style="margin-bottom:40px">${sigHtml}</div>

          <div style="border-top:1px solid #eee;padding-top:20px;font-size:11px;color:#aaa">
            This receipt confirms your application was received by Aether Capital.<br/>
            Our team will review your application within 2 business days.
          </div>`;

        const pageChildren = Array.from(document.body.children);
        pageChildren.forEach((el) => { el.style.visibility = "hidden"; });
        document.body.appendChild(wrap);
        wrap.style.visibility = "visible";

        try {
          const canvas = await html2canvas(wrap, {
            scale: 2, useCORS: true, allowTaint: true,
            backgroundColor: "#ffffff", width: 794,
            height: wrap.scrollHeight, windowWidth: 794,
            scrollX: 0, scrollY: 99999,
          });

          const imgData    = canvas.toDataURL("image/jpeg", 0.92);
          const pdf        = new jsPDF({ unit: "px", format: "a4", orientation: "portrait" });
          const pdfW       = pdf.internal.pageSize.getWidth();
          const pdfH       = pdf.internal.pageSize.getHeight();
          const ratio      = pdfW / canvas.width;
          const totalH     = canvas.height * ratio;
          const totalPages = Math.ceil(totalH / pdfH);

          for (let i = 0; i < totalPages; i++) {
            if (i > 0) pdf.addPage();
            pdf.addImage(imgData, "JPEG", 0, -(i * pdfH), pdfW, totalH);
          }

          pdf.save(`aether-receipt-${result.submissionId || Date.now()}.pdf`);
        } finally {
          pageChildren.forEach((el) => { el.style.visibility = ""; });
          document.body.removeChild(wrap);
        }
      },

      reset: () => {
        fileStore.clear();
        sessionStorage.removeItem(SIG_KEY);
        set({
          step: 1, reachedStep: 1, formData: {},
          isSubmitting: false, isSubmitted: false,
          submitError: null, submissionResult: null,
        });
      },
    }),
    {
      name: "aether-onboarding",
      partialize: (state) => ({
        step:        state.step,
        reachedStep: state.reachedStep,
        isSubmitted: state.isSubmitted,
        // ── FIX: persist images so PDF works after refresh ──
        submissionResult: state.submissionResult ? {
          submissionId:    state.submissionResult.submissionId,
          submittedAt:     state.submissionResult.submittedAt,
          applicantName:   state.submissionResult.applicantName,
          email:           state.submissionResult.email,
          accountType:     state.submissionResult.accountType,
          profileImageB64: state.submissionResult.profileImageB64 || null,
          idFrontB64:      state.submissionResult.idFrontB64      || null,
          idBackB64:       state.submissionResult.idBackB64       || null,
          signatureData:   state.submissionResult.signatureData   || null,
        } : null,
        formData: Object.fromEntries(
          Object.entries(state.formData).filter(([k]) => {
            if (k === "signatureData") return false;
            // ── FIX: keep image previews for badge + PDF fallback ──
            if (["profileImage__preview", "idFront__preview", "idBack__preview"].includes(k)) return true;
            if (k.endsWith("__preview")) return false;
            return true;
          })
        ),
      }),
    },
  ),
);

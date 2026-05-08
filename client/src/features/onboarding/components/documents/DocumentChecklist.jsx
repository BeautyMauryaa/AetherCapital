import { useState } from "react";
import { useOnboardingStore } from "@/app/store/onboarding.store";
import { CheckCircle2, Upload } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const DOCS = [
  { id: "incorp_cert",  label: "Certificate of Incorporation" },
  { id: "tax_id",       label: "Tax Registration" },
  { id: "proof_addr",   label: "Proof of Address" },
  { id: "ubo_registry", label: "Beneficial Owner Declaration" },
];

const DocumentChecklist = () => {
  const { updateForm, formData } = useOnboardingStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleUpload = (docId, file) => {
    if (!file) return;
    updateForm({
      documents: {
        ...(formData.documents || {}),
        [docId]: file, // ✅ File object — store handles routing to fileStore
      },
    });
  };

  // ── Read upload status from formData (set by store after updateForm) ──────
  // After store processes it: File objects go to fileStore,
  // names go to formData.documents__names
  const getDocName = (docId) => {
    // 1. Still in formData.documents as File (same session, no refresh)
    const entry = formData.documents?.[docId];
    if (entry instanceof File) return entry.name;
    // 2. Persisted metadata after store processed it
    return formData.documents__names?.[docId] ?? null;
  };

  return (
    <div className="space-y-3">
      {DOCS.map((doc) => {
        const docName    = getDocName(doc.id);
        const isUploaded = !!docName;

        return (
          <div
            key={doc.id}
            className={`flex justify-between items-center p-4 rounded-xl border transition-all
              ${isUploaded
                ? isDark
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : "border-emerald-400/30 bg-emerald-50"
                : isDark
                  ? "border-white/10 bg-white/5"
                  : "border-slate-200 bg-white"
              }`}
          >
            <div className="flex flex-col gap-0.5">
              <span className={`text-[14px] font-medium
                ${isDark ? "text-white/80" : "text-slate-700"}`}>
                {doc.label}
              </span>
              {/* ✅ Show filename under label when uploaded */}
              {isUploaded && (
                <span className={`text-[11px] font-mono italic
                  ${isDark ? "text-white/30" : "text-slate-400"}`}>
                  {docName}
                </span>
              )}
            </div>

            {isUploaded ? (
              <div className="flex items-center gap-2 text-emerald-500">
                <CheckCircle2 size={16} />
                <span className="text-[12px] font-semibold">Uploaded</span>
              </div>
            ) : (
              <label className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer
                text-[12px] font-semibold border transition-all
                ${isDark
                  ? "border-white/10 text-white/50 hover:border-purple-500/50 hover:text-purple-400"
                  : "border-slate-200 text-slate-500 hover:border-purple-500/50 hover:text-purple-500"
                }`}>
                <Upload size={13} />
                Upload
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => handleUpload(doc.id, e.target.files[0])}
                />
              </label>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DocumentChecklist;
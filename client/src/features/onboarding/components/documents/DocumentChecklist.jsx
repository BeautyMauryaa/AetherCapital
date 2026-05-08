import { useState } from "react";
import { useOnboardingStore } from "@/app/store/onboarding.store";
import { CheckCircle2, Upload } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const DOCS = [
  "Certificate of Incorporation",
  "Tax Registration",
  "Proof of Address",
];

const DocumentChecklist = () => {
  const { updateForm, formData } = useOnboardingStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [uploaded, setUploaded] = useState({});

  const handleUpload = (doc, file) => {
    if (!file) return;

    // Store in local state for UI
    setUploaded((prev) => ({ ...prev, [doc]: file }));

    // Append to documents array in store (raw File objects)
    const existing = formData.documents || [];
    updateForm({ documents: [...existing, file] });
  };

  return (
    <div className="space-y-3">
      {DOCS.map((doc) => (
        <div
          key={doc}
          className={`flex justify-between items-center p-4 rounded-xl border transition-all
            ${uploaded[doc]
              ? isDark ? "border-emerald-500/30 bg-emerald-500/5" : "border-emerald-400/30 bg-emerald-50"
              : isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"
            }`}
        >
          <span className={`text-[14px] font-medium
            ${isDark ? "text-white/80" : "text-slate-700"}`}>
            {doc}
          </span>

          {uploaded[doc] ? (
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
                onChange={(e) => handleUpload(doc, e.target.files[0])}
              />
            </label>
          )}
        </div>
      ))}
    </div>
  );
};

export default DocumentChecklist;
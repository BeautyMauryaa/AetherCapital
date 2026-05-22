import { useState } from "react";
import { useOnboardingStore } from "@/app/store/onboarding.store";
import { CheckCircle2, Upload, Loader2, AlertCircle, X } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { uploadDocument } from "@/services/api.service";

const DOCS = [
  { id: "incorp_cert",  label: "Certificate of Incorporation" },
  { id: "tax_id",       label: "Tax Registration" },
  { id: "proof_addr",   label: "Proof of Address" },
  { id: "ubo_registry", label: "Beneficial Owner Declaration" },
];

const DocumentChecklist = () => {
  const updateForm = useOnboardingStore((s) => s.updateForm);

  // ✅ FIXED
  const documents = useOnboardingStore(
    (s) => s.formData.documents || {}
  );

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [uploadState, setUploadState] = useState({});
  const [uploadError, setUploadError] = useState({});

  const setDocState = (docId, state) =>
    setUploadState((prev) => ({ ...prev, [docId]: state }));

  const setDocError = (docId, msg) =>
    setUploadError((prev) => ({ ...prev, [docId]: msg }));

  const handleUpload = async (docId, file) => {
    if (!file) return;
    setDocState(docId, "uploading");
    setDocError(docId, null);

    try {
      const result = await uploadDocument(file);
      console.log("UPLOAD RESULT:", result);

      const latestDocs = useOnboardingStore.getState().formData.documents || {};
      const updatedDocuments = {
        ...latestDocs,
        [docId]: {
          name:          file.name,
          size:          file.size,
          mimeType:      file.type,
          fileId:        result.data.fileId,
          driveUrl:      result.data.directUrl  || result.data.fileId,
          driveViewLink: result.data.webViewLink || result.data.fileId,
        },
      };

      updateForm({
        [`${docId}__uploaded`]:     true,
        [`${docId}__uploadedName`]: file.name,
        documents: updatedDocuments,
      });

      console.log("UPDATED DOCS:", updatedDocuments);
      setDocState(docId, "done");
    } catch (err) {
      console.error(err);
      setDocState(docId, "error");
      setDocError(docId, err.message || "Upload failed. Please try again.");
    }
  };

  const handleRemove = (docId) => {
    const latestDocs = useOnboardingStore.getState().formData.documents || {};
    const updatedDocuments = { ...latestDocs };
    delete updatedDocuments[docId];

    updateForm({ documents: updatedDocuments });
    setDocState(docId, "idle");
    setDocError(docId, null);
  };

  return (
    <div className="space-y-3">
      {DOCS.map((doc) => {
        const docData     = documents?.[doc.id] ?? null;
        const isDone      = !!docData && (!!docData.driveUrl || !!docData.fileId);
        const isUploading = uploadState[doc.id] === "uploading";
        const hasError    = uploadState[doc.id] === "error";

        return (
          <div
            key={doc.id}
            className={`flex justify-between items-center p-4 rounded-xl border transition-all
              ${isDone
                ? isDark
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : "border-emerald-400/30 bg-emerald-50"
                : hasError
                  ? isDark
                    ? "border-red-500/30 bg-red-500/5"
                    : "border-red-400/30 bg-red-50"
                  : isDark
                    ? "border-white/10 bg-white/5"
                    : "border-slate-200 bg-white"
              }`}
          >
            {/* LEFT */}
            <div className="flex flex-col gap-0.5 flex-1 min-w-0 mr-3">
              <span className={`text-[14px] font-medium ${isDark ? "text-white/80" : "text-slate-700"}`}>
                {doc.label}
              </span>

              {isDone && (
                <span className={`text-[11px] font-mono italic truncate ${isDark ? "text-white/30" : "text-slate-400"}`}>
                  {docData.name}
                </span>
              )}

              {hasError && (
                <span className="flex items-center gap-1 text-[11px] text-red-400 mt-0.5">
                  <AlertCircle size={11} />
                  {uploadError[doc.id]}
                </span>
              )}
            </div>

            {/* RIGHT */}
            {isDone ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-emerald-500">
                  <CheckCircle2 size={15} />
                  <span className="text-[12px] font-semibold">Uploaded</span>
                </div>
                <button
                  onClick={() => handleRemove(doc.id)}
                  className={`p-1 rounded-lg transition-colors ml-1
                    ${isDark
                      ? "text-white/20 hover:text-red-400 hover:bg-red-500/10"
                      : "text-slate-300 hover:text-red-500 hover:bg-red-50"
                    }`}
                  title="Remove"
                >
                  <X size={13} />
                </button>
              </div>
            ) : isUploading ? (
              <div className="flex items-center gap-2 text-purple-500">
                <Loader2 size={15} className="animate-spin" />
                <span className="text-[12px] font-semibold">Uploading…</span>
              </div>
            ) : (
              <label
                className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer
                  text-[12px] font-semibold border transition-all flex-shrink-0
                  ${hasError
                    ? "border-red-400/40 text-red-400 hover:border-red-500/60"
                    : isDark
                      ? "border-white/10 text-white/50 hover:border-purple-500/50 hover:text-purple-400"
                      : "border-slate-200 text-slate-500 hover:border-purple-500/50 hover:text-purple-500"
                  }`}
              >
                <Upload size={13} />
                {hasError ? "Retry" : "Upload"}
                <input
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
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

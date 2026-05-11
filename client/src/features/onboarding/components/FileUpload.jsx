// src/features/onboarding/components/FileUpload.jsx
// FIX 3: Image files upload to /api/upload/image immediately on selection.
//         Drive URL stored in formData — submit only sends the URL, not the binary.

import React, { useRef, useState, useEffect } from "react";
import { Image as ImageIcon, CreditCard, CheckCircle2, X, Loader2, AlertCircle } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useOnboardingStore } from "@/app/store/onboarding.store";
import { fileStore } from "@/app/store/fileStore.js";
import { uploadImage, uploadDocument } from "@/services/api.service";

const FileUpload = ({
  variant   = "photo",
  sublabel  = null,
  accept    = "image/*",
  helperText = null,
  fieldName,
}) => {
  const { theme }                     = useTheme();
  const isDark                        = theme === "dark";
  const { updateForm, formData }      = useOnboardingStore();
  const fileInputRef                  = useRef(null);

  const [file,        setFile]        = useState(() => fileStore.get(fieldName) ?? null);
  const [preview,     setPreview]     = useState(formData[`${fieldName}__preview`] || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Restore preview from existing file on mount
  useEffect(() => {
    const existing = fileStore.get(fieldName);
    if (existing instanceof File && existing.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(existing);
    }
  }, [fieldName]);

  const handleFile = async (f) => {
    if (!f) return;

    // Show file + preview immediately for good UX
    setFile(f);
    setUploadError(null);

    if (f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
        updateForm({ [`${fieldName}__preview`]: e.target.result });
      };
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }

    // ── Upload to separate API immediately (FIX 3) ────────────────────────────
    setIsUploading(true);
    try {
      const isImage = f.type.startsWith("image/");
      const result  = isImage ? await uploadImage(f) : await uploadDocument(f);

      // Store Drive URL in formData — submit will use this, not the binary
      updateForm({
        [fieldName]: f,
        [`${fieldName}__name`]:      f.name,
        [`${fieldName}__driveUrl`]:  result.url,
        [`${fieldName}__viewLink`]:  result.viewLink,
        [`${fieldName}__fileId`]:    result.fileId,
      });

      // Keep file in fileStore for preview restoration on back navigation
      fileStore.set(fieldName, f);
    } catch (err) {
      setUploadError(err.message || "Upload failed. Please try again.");
      // Clear the optimistic file display on error
      setFile(null);
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
    setUploadError(null);
    fileStore.delete(fieldName);
    updateForm({
      [fieldName]:                null,
      [`${fieldName}__name`]:     null,
      [`${fieldName}__preview`]:  null,
      [`${fieldName}__driveUrl`]: null,
      [`${fieldName}__viewLink`]: null,
      [`${fieldName}__fileId`]:   null,
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onDragOver = (e) => e.preventDefault();
  const onDrop     = (e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); };

  // ── Photo variant ─────────────────────────────────────────────────────────
  if (variant === "photo") {
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        {/* Square preview box */}
        <div
          onClick={() => !isUploading && fileInputRef.current.click()}
          onDragOver={onDragOver}
          onDrop={onDrop}
          className={`relative w-24 h-24 rounded-2xl border-2 border-dashed flex-shrink-0 overflow-hidden
            ${isUploading ? "cursor-wait opacity-80" : "cursor-pointer"} transition-all duration-200
            ${file
              ? "border-purple-500/50"
              : isDark
                ? "border-white/10 hover:border-purple-500/40 bg-white/5"
                : "border-slate-200 hover:border-purple-400/50 bg-slate-50"
            }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept={accept}
            onChange={(e) => handleFile(e.target.files[0])}
          />

          {/* Uploading overlay */}
          {isUploading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 rounded-2xl">
              <Loader2 size={20} className="text-white animate-spin" />
            </div>
          )}

          {preview ? (
            <>
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              {!isUploading && (
                <button
                  onClick={handleRemove}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors z-10"
                >
                  <X size={10} className="text-white" />
                </button>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-1">
              <ImageIcon size={20} className={isDark ? "text-white/20" : "text-slate-300"} />
              <span className={`text-[9px] font-bold uppercase tracking-wider
                ${isDark ? "text-white/20" : "text-slate-300"}`}>
                Photo
              </span>
            </div>
          )}
        </div>

        {/* Right side info */}
        <div className="flex flex-col justify-center">
          {isUploading ? (
            <div className="flex items-center gap-2">
              <Loader2 size={14} className="text-purple-500 animate-spin" />
              <span className={`text-[13px] ${isDark ? "text-white/60" : "text-slate-500"}`}>
                Uploading…
              </span>
            </div>
          ) : file && !uploadError ? (
            <>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                <span className={`text-[13px] font-semibold truncate max-w-[200px]
                  ${isDark ? "text-white" : "text-slate-900"}`}>
                  {file.name}
                </span>
              </div>
              <button onClick={handleRemove}
                className={`text-[11px] text-left transition-colors w-fit
                  ${isDark ? "text-white/30 hover:text-red-400" : "text-slate-400 hover:text-red-500"}`}>
                Remove
              </button>
            </>
          ) : (
            <>
              {/* Upload error — inline UI (FIX 2) */}
              {uploadError && (
                <div className="flex items-center gap-1.5 mb-2 text-red-400">
                  <AlertCircle size={12} />
                  <span className="text-[11px]">{uploadError}</span>
                </div>
              )}
              <p className={`text-[14px] font-medium mb-1 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                {uploadError ? "Try again" : "Upload a profile photo"}
              </p>
              <p className={`text-[12px] mb-3 ${isDark ? "text-white/30" : "text-slate-400"}`}>
                {helperText || "JPG or PNG · max 5MB"}
              </p>
              <button
                onClick={() => fileInputRef.current.click()}
                className="px-4 py-1.5 rounded-lg text-[12px] font-semibold border border-purple-500/40 text-purple-500 hover:bg-purple-500/10 transition-all w-fit"
              >
                {uploadError ? "Choose different file" : "Choose file"}
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── ID / Document variant ─────────────────────────────────────────────────
  return (
    <div className={`upload-wrapper ${isDark ? "dark-theme" : ""}`}>
      <div
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={() => !isUploading && fileInputRef.current.click()}
        className={`upload-container ${variant} ${file ? "state-success" : "state-default"}
          ${isUploading ? "cursor-wait" : "cursor-pointer"}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={accept}
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={24} className="text-purple-500 animate-spin" />
            <p className="upload-subtitle">Uploading…</p>
          </div>
        ) : file && !uploadError ? (
          <div className="flex flex-col items-center">
            <CheckCircle2 size={28} className="text-[#1AD1A5] mb-2" />
            <p className={`text-[12px] font-semibold text-center px-4 truncate max-w-full
              ${isDark ? "text-white/90" : "text-slate-900"}`}>
              {file.name.length > 22 ? file.name.slice(0, 22) + "…" : file.name}
            </p>
            <p className="upload-subtitle mt-1">Click to replace</p>
          </div>
        ) : (
          <>
            {uploadError ? (
              <div className="flex flex-col items-center gap-1 px-4 text-center">
                <AlertCircle size={22} className="text-red-400 mb-1" />
                <p className="text-[12px] text-red-400 font-semibold">Upload failed</p>
                <p className="upload-subtitle text-[10px]">{uploadError}</p>
                <p className="upload-subtitle">Click to retry</p>
              </div>
            ) : (
              <>
                <div className="icon-wrapper">
                  <CreditCard size={20} className="text-purple-600" />
                </div>
                <div className="text-center px-4">
                  <p className="upload-title">{sublabel || "Upload document"}</p>
                  <p className="upload-subtitle">JPG · PNG · PDF</p>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;

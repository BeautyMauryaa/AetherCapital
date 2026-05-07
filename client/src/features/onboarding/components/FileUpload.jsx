import React, { useRef, useState } from "react";
import { Image as ImageIcon, CreditCard, CheckCircle2, Loader2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useOnboardingStore } from "@/app/store/onboarding.store";
import "./FileUpload.css";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const FileUpload = ({
  variant = "photo",
  sublabel = null,
  accept = "image/*",
  helperText = null,
  fieldName, // e.g. "profileImage", "idFront", "idBack", "document"
}) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { updateForm } = useOnboardingStore();

  const uploadToServer = async (f) => {
    if (!f) return;
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();

      // Use "image" field for photos, "document" field for IDs/docs
      const isImage = variant === "photo";
      formData.append(isImage ? "image" : "document", f);

      const endpoint = isImage ? "/upload/image" : "/upload/document";

      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Upload failed");

      // Save Drive URL to store using fieldName
      if (fieldName) {
        updateForm({ [fieldName]: data.data });
      }

      setFile(f);
    } catch (err) {
      setError(err.message);
      setFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFile = (f) => { if (f) uploadToServer(f); };
  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const getStatusClass = () => {
    if (isDragging) return "state-dragging";
    if (file) return "state-success";
    if (error) return "state-error";
    return "state-default";
  };

  return (
    <div className={`upload-wrapper ${isDark ? "dark-theme" : ""}`}>
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !isUploading && fileInputRef.current.click()}
        className={`upload-container ${variant} ${getStatusClass()}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={accept}
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {/* Uploading state */}
        {isUploading ? (
          <div className="flex flex-col items-center">
            <Loader2 size={32} className="text-purple-500 animate-spin mb-3" />
            <p className="upload-subtitle">Uploading to Drive...</p>
          </div>

        ) : file ? (
          // Success state
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <CheckCircle2 size={32} className="text-[#1AD1A5] mb-3" />
            <p className={`text-sm font-semibold text-center px-4 truncate max-w-full ${isDark ? "text-white/90" : "text-slate-900"}`}>
              {file.name}
            </p>
            <p className="upload-subtitle !tracking-widest mt-1">Click to replace</p>
          </div>

        ) : (
          // Default state
          <>
            <div className="icon-wrapper">
              {variant === "photo"
                ? <ImageIcon size={20} className="text-purple-600" />
                : <CreditCard size={20} className="text-purple-600" />
              }
            </div>
            <div className="text-center px-4">
              <p className="upload-title">
                {sublabel || (variant === "photo" ? "Drop a photo or click to upload" : "Upload document")}
              </p>
              <p className="upload-subtitle">
                {variant === "photo" ? "JPG · PNG · MAX 2MB" : "JPG · PNG · PDF"}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-2 text-xs text-red-500">{error}</p>
      )}

      {helperText && !error && (
        <p className="helper-text">{helperText}</p>
      )}
    </div>
  );
};

export default FileUpload;
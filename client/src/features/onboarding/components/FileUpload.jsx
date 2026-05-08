import React, { useRef, useState, useEffect } from "react"; // Added useEffect here
import { Image as ImageIcon, CreditCard, CheckCircle2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useOnboardingStore } from "@/app/store/onboarding.store";

const FileUpload = ({
  variant = "photo",
  sublabel = null,
  accept = "image/*",
  helperText = null,
  fieldName, // "profileImage" | "idFront" | "idBack"
}) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  // FIX: Destructure formData here so it's available for the useEffect
  const { updateForm, formData } = useOnboardingStore();

  // This syncs the local state with the global store (useful for 'Back' button)
  useEffect(() => {
    if (formData && formData[fieldName] && !file) {
      setFile(formData[fieldName]);
    }
  }, [formData, fieldName, file]);

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    if (fieldName) {
      updateForm({ [fieldName]: f });
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const onDragLeave = () => setIsDragging(false);
  
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const getStatusClass = () => {
    if (isDragging) return "state-dragging";
    if (file) return "state-success";
    return "state-default";
  };

  return (
    <div className={`upload-wrapper ${isDark ? "dark-theme" : ""}`}>
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current.click()}
        className={`upload-container ${variant} ${getStatusClass()}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={accept}
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {file ? (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <CheckCircle2 size={32} className="text-[#1AD1A5] mb-3" />
            <p className={`text-sm font-semibold text-center px-4 truncate max-w-full
              ${isDark ? "text-white/90" : "text-slate-900"}`}>
              {file.name}
            </p>
            <p className="upload-subtitle !tracking-widest mt-1">Click to replace</p>
          </div>
        ) : (
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
      {helperText && <p className="helper-text">{helperText}</p>}
    </div>
  );
};

export default FileUpload;
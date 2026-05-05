import React, { useRef, useState } from "react";
import { Image as ImageIcon, CreditCard, CheckCircle2 } from "lucide-react";
import { useTheme } from "@/context/Themecontext";

const FileUpload = ({
  variant = "photo",
  sublabel = null,
  accept = "image/*",
  helperText = null,
}) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleFile = (f) => { if (f) setFile(f); };
  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const isPhoto = variant === "photo";

  return (
    <div className="w-full">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current.click()}
        className={`relative cursor-pointer flex flex-col items-center justify-center
          rounded-2xl border-2 border-dashed transition-all duration-200
          ${isPhoto ? "min-h-[180px]" : "min-h-[160px]"}
          ${isDragging
            ? isDark
              ? "border-purple-500 bg-[#16161D]"
              : "border-purple-500 bg-purple-50"
            : file
            ? isDark
              ? "border-emerald-500/50 bg-[#0B0B0E]"
              : "border-emerald-500/50 bg-white"
            : isDark
              ? "border-white/10 bg-[#16161D] hover:border-white/20"
              : "border-black/5 bg-[#F9F9F9] hover:border-purple-500/30"
          }`}
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
            <p className={`text-[11px] mt-1 uppercase tracking-widest
              ${isDark ? "text-white/40" : "text-slate-400"}`}>
              Click to replace
            </p>
          </div>
        ) : (
          <>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-5 shadow-sm
              ${isDark
                ? "bg-[#0B0B0E] border-none"
                : "bg-white border border-black/5"
              }`}>
              {isPhoto
                ? <ImageIcon size={20} className="text-purple-600" />
                : <CreditCard size={20} className="text-purple-600" />
              }
            </div>

            <div className="text-center px-4">
              <p className={`text-[15px] sm:text-[17px] font-bold tracking-tight mb-1
                ${isDark ? "text-white" : "text-slate-900"}`}>
                {sublabel || (isPhoto ? "Drop a photo or click to upload" : "Upload document")}
              </p>
              <p className={`text-[10px] tracking-[0.15em] font-bold uppercase
                ${isDark ? "text-white/30" : "text-slate-400"}`}>
                {isPhoto ? "JPG · PNG · MAX 2MB" : "JPG · PNG · PDF"}
              </p>
            </div>
          </>
        )}
      </div>

      {helperText && (
        <p className={`mt-3 text-[11px] font-medium leading-relaxed
          ${isDark ? "text-white/30" : "text-slate-400"}`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default FileUpload;
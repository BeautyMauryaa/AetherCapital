import React, { useRef, useState } from "react";
import { ImageIcon, CreditCard, CheckCircle2 } from "lucide-react";

/**
 * FileUpload component
 * variant: "photo" | "id"
 * label: shown above the box as section label (used by parent, not inside box)
 * sublabel: "Upload front" / "Upload back" etc.
 */
const FileUpload = ({
  variant = "photo",
  sublabel = null,
  accept = "image/*",
  helperText = null,
}) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (f) => {
    if (f) setFile(f);
  };

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
          rounded-2xl border transition-all duration-200
          ${isPhoto ? 'min-h-[160px]' : 'min-h-[180px]'}
          ${isDragging
            ? 'border-purple-500/60 bg-purple-500/5'
            : file
            ? 'border-white/10 bg-[#111118]'
            : 'border-white/[0.08] bg-[#111118] hover:border-white/[0.18] hover:bg-[#131320]'
          }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={accept}
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {/* Uploaded state */}
        {file ? (
          <>
            <CheckCircle2 size={28} className="text-emerald-400 mb-3" />
            <p className="text-sm font-medium text-white/80 text-center px-4 truncate max-w-full">
              {file.name}
            </p>
            <p className="text-[11px] text-white/30 mt-1">Click to change</p>
          </>
        ) : (
          <>
            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-[#1a1a2e] border border-white/[0.08] flex items-center justify-center mb-4">
              {isPhoto
                ? <ImageIcon size={22} className="text-purple-400/80" />
                : <CreditCard size={22} className="text-purple-400/80" />
              }
            </div>

            {/* Text */}
            {sublabel ? (
              <>
                <p className="text-[15px] font-medium text-white/80">{sublabel}</p>
                <p className="text-[12px] text-white/30 mt-1.5 tracking-widest uppercase">
                  JPG · PNG · PDF
                </p>
              </>
            ) : (
              <>
                <p className="text-[15px] font-medium text-white/80">Drop a photo or click to upload</p>
                <p className="text-[12px] text-white/30 mt-1.5 tracking-widest uppercase">
                  JPG · PNG · MAX 2MB
                </p>
              </>
            )}
          </>
        )}
      </div>

      {/* Helper text below box */}
      {helperText && (
        <p className="mt-2.5 text-[12px] text-white/30">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default FileUpload;
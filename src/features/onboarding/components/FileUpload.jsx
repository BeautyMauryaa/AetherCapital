import React, { useRef, useState } from "react";
import { Image as ImageIcon, Upload } from "lucide-react";

const FileUpload = ({ label, helperText = "JPG or PNG · max 2MB" }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (uploadedFile) => {
    if (uploadedFile) {
      setFile(uploadedFile);
      console.log("File selected:", uploadedFile.name);
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
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  return (
    <div className="w-full">
      {/* Container with dashed border and glass effect */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current.click()}
        className={`relative group cursor-pointer flex flex-col items-center justify-center 
          min-h-[180px] rounded-2xl border-2 border-dashed transition-all duration-300
          ${isDragging 
            ? "border-purple-500 bg-purple-500/5" 
            : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20"
          }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
          accept="image/*"
        />

        {/* Icon with Purple Glow */}
        <div className="w-12 h-12 mb-4 rounded-xl bg-white/5 flex items-center justify-center transition-transform group-hover:scale-110">
          {file ? (
            <Upload className="text-purple-400" size={24} />
          ) : (
            <ImageIcon className="text-white/40" size={24} />
          )}
        </div>

        {/* Text Styling strictly matched to image_659d65.png */}
        <p className="text-sm font-medium text-white mb-1">
          {file ? file.name : "Drop a photo or click to upload"}
        </p>
        <p className="text-[10px] text-white/30 font-bold tracking-[0.2em] uppercase">
          {helperText}
        </p>

        {/* Success Indicator */}
        {file && (
          <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
        )}
      </div>
      
      {/* Sub-helper text below the box */}
      <p className="mt-3 text-[10px] text-white/20 tracking-wide">
        JPG or PNG · max 2MB · square crop recommended
      </p>
    </div>
  );
};

export default FileUpload;
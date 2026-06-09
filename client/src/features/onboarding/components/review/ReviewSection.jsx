import React from 'react';
import { Edit3 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const ReviewSection = ({ step, title, fields, isAddressBlock, addressLine, onEdit }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`p-8 rounded-2xl transition-colors duration-300
      ${isDark ? "bg-[#0B0B0E]" : "bg-white"}`}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-purple-600 font-bold tracking-tighter">{step}</span>
          <h3 className={`text-[11px] font-bold tracking-[0.2em] uppercase
            ${isDark ? "text-white" : "text-slate-900"}`}>{title}</h3>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold text-purple-600 uppercase transition-all hover:opacity-80 border
              ${isDark ? "bg-[#16161D] border-white/10" : "bg-slate-50 border-slate-200"}`}>
            <Edit3 size={12} />
            Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-y-6">
        {fields.map((field, idx) => (
          <div key={idx}>
            <p className={`text-[9px] font-mono tracking-[0.15em] uppercase mb-1.5
              ${isDark ? "text-white/35" : "text-slate-400"}`}>
              {field.label}
            </p>
            <p className={`text-[13px] font-medium
              ${field.value?.startsWith?.("✓")
                ? "text-emerald-500"
                : isDark ? "text-white" : "text-slate-900"
              }`}>
              {field.value || "—"}
            </p>
          </div>
        ))}
      </div>

      {isAddressBlock && (
        <div className={`mt-6 p-5 rounded-xl flex items-start gap-4 border
          ${isDark ? "bg-[#16161D] border-white/10" : "bg-slate-50 border-slate-200"}`}>
          <div className="mt-1.5 w-2 h-2 rounded-full bg-purple-600 flex-shrink-0" />
          <p className={`text-[12px] leading-relaxed font-medium
            ${isDark ? "text-white/70" : "text-slate-600"}`}>
            {addressLine || "No address provided"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;

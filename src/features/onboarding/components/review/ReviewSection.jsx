import React from 'react';
import { Edit3 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import "./ReviewSection.css";

const ReviewSection = ({ step, title, fields, isAddressBlock }) => {
  const { isDark } = useTheme();

  return (
    <div className="review-card">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-purple-500 font-bold tracking-tighter">
            {step}
          </span>
          <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-main">
            {title}
          </h3>
        </div>
        <button className="edit-button">
          <Edit3 size={12} />
          Edit
        </button>
      </div>

      <div className="grid grid-cols-2 gap-y-6">
        {fields.map((field, idx) => (
          <div key={idx}>
            <p className="review-label">
              {field.label}
            </p>
            {field.isBadge ? (
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded border border-amber-500 text-amber-500 text-[9px] font-bold">
                  MEDIUM
                </span>
                <span className="review-value">
                  {field.value.split(' ')[1]}
                </span>
              </div>
            ) : (
              <p className="review-value">
                {field.value || "—"}
              </p>
            )}
          </div>
        ))}
      </div>

      {isAddressBlock && (
        <div className="address-block">
          <div className="mt-1.5 w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.2)] flex-shrink-0" />
          <div className="text-[12px] leading-relaxed font-medium text-main opacity-70">
            <p>Near Satyam pg, Shyam enclave , Chak hakim Chak hakim , Near satyam pg, Phagwara jalandhar</p>
            <p>United States</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
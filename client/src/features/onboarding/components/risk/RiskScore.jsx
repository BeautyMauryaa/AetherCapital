import React from "react";
import { useOnboardingStore } from "@/app/store/onboarding.store";
import { useTheme } from "@/context/ThemeContext";

const RiskScore = () => {
  const { formData } = useOnboardingStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const answers = formData.answers || {};
  const score = Object.values(answers).filter((v) => v === true).length * 12.5;

  const getRiskLabel = (s) => {
    if (s === 0) return { text: "Low risk", color: "text-[#10b981]", bar: "bg-[#10b981]" };
    if (s <= 40) return { text: "Medium risk", color: "text-[#f59e0b]", bar: "bg-gradient-to-r from-[#10b981] to-[#f59e0b]" };
    return { text: "High risk", color: "text-[#ef4444]", bar: "bg-gradient-to-r from-[#10b981] via-[#f59e0b] to-[#ef4444]" };
  };

  const risk = getRiskLabel(score);

  return (
    <div className={`border rounded-[20px] p-8 shadow-sm
      ${isDark ? "bg-[#16161D] border-white/10" : "bg-white border-slate-200"}`}>
      <div className="flex justify-between items-start mb-10">
        <div>
          <p className={`text-[10px] font-mono tracking-[0.2em] uppercase mb-2
            ${isDark ? "text-white/40" : "text-slate-400"}`}>
            Live Risk Score
          </p>
          <p className={`${risk.color} font-bold text-[18px] transition-colors duration-500`}>
            {risk.text}
          </p>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`text-[44px] leading-none font-bold tracking-tight
            ${isDark ? "text-white" : "text-slate-900"}`}>{score}</span>
          <span className={`text-[14px] font-medium
            ${isDark ? "text-white/40" : "text-slate-400"}`}>/100</span>
        </div>
      </div>

      <div className="relative pt-2">
        <div className={`h-[5px] w-full rounded-full overflow-hidden
          ${isDark ? "bg-white/10" : "bg-slate-200"}`}>
          <div
            className={`h-full ${risk.bar} transition-all duration-700 ease-out rounded-full`}
            style={{ width: `${Math.max(score, 2)}%` }}
          />
        </div>
        <div className={`flex justify-between mt-5 text-[9px] font-mono tracking-[0.2em] uppercase
          ${isDark ? "text-white/30" : "text-slate-400"}`}>
          <span>0 Low</span>
          <span className="opacity-50">30</span>
          <span className="opacity-50">60</span>
          <span>100 Critical</span>
        </div>
      </div>
    </div>
  );
};

export default RiskScore;
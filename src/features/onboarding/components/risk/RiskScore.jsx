import React from 'react';
import { useOnboardingStore } from "@/app/store/onboarding.store";

const RiskScore = () => {
  const { formData } = useOnboardingStore();
  const answers = formData.answers || {};
  
  // Calculate score based on 'Yes' answers
  const score = Object.values(answers).filter(val => val === true).length * 12.5; 
  
  const getRiskLabel = (s) => {
    if (s === 0) return { text: "Low risk", color: "text-[#10b981]", bar: "bg-[#10b981]" };
    if (s <= 40) return { text: "Medium risk", color: "text-[#f59e0b]", bar: "bg-gradient-to-r from-[#10b981] to-[#f59e0b]" };
    return { text: "High risk", color: "text-[#ef4444]", bar: "bg-gradient-to-r from-[#10b981] via-[#f59e0b] to-[#ef4444]" };
  };

  const risk = getRiskLabel(score);

  return (
    <div className="bg-[#13131A] border border-white/[0.05] rounded-[20px] p-8 shadow-xl">
      <div className="flex justify-between items-start mb-10">
        <div>
          <p className="text-[10px] font-mono tracking-[0.2em] text-white/30 uppercase mb-2">
            Live Risk Score
          </p>
          <p className={`${risk.color} font-bold text-[18px] transition-colors duration-500`}>
            {risk.text}
          </p>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-[44px] leading-none font-bold text-white tracking-tight">{score}</span>
          <span className="text-[14px] font-medium text-white/20">/100</span>
        </div>
      </div>

      <div className="relative pt-2">
        {/* Track */}
        <div className="h-[5px] w-full bg-white/[0.03] rounded-full overflow-hidden">
          <div 
            className={`h-full ${risk.bar} transition-all duration-700 ease-out rounded-full`} 
            style={{ width: `${Math.max(score, 2)}%` }} 
          />
        </div>
        
        {/* Notches & Labels */}
        <div className="flex justify-between mt-5 text-[9px] font-mono tracking-[0.2em] text-white/20 uppercase">
          <div className="flex flex-col items-start gap-2">
            <span>0 Low</span>
          </div>
          <span className="opacity-50">30</span>
          <span className="opacity-50">60</span>
          <div className="flex flex-col items-end gap-2 text-right">
            <span>100 Critical</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskScore;
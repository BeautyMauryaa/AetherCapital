import React from "react";
import { useOnboardingStore } from "@/app/store/onboarding.store";
import "./RiskScore.css";

const RiskScore = () => {
  const { formData } = useOnboardingStore();
  const answers = formData.answers || {};
  const score = Object.values(answers).filter((v) => v === true).length * 12.5;

  const getRiskDetails = (s) => {
    if (s === 0) return { 
        text: "Low risk", 
        textColor: "risk-text-low", 
        barColor: "risk-bar-low" 
    };
    if (s <= 40) return { 
        text: "Medium risk", 
        textColor: "risk-text-medium", 
        barColor: "risk-bar-medium" 
    };
    return { 
        text: "High risk", 
        textColor: "risk-text-high", 
        barColor: "risk-bar-high" 
    };
  };

  const risk = getRiskDetails(score);

  return (
    <div className="risk-card">
      <div className="flex justify-between items-start mb-10">
        <div>
          <p className="text-[10px] font-mono tracking-[0.2em] uppercase mb-2 text-main opacity-40">
            Live Risk Score
          </p>
          <p className={`${risk.textColor} font-bold text-[18px] transition-colors duration-500 uppercase tracking-tight`}>
            {risk.text}
          </p>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-[44px] leading-none font-bold tracking-tight text-main">
            {score}
          </span>
          <span className="text-[14px] font-medium text-main opacity-40">/100</span>
        </div>
      </div>

      <div className="relative pt-2">
        <div className="risk-track">
          <div
            className={`h-full ${risk.barColor} transition-all duration-700 ease-out rounded-full`}
            style={{ width: `${Math.max(score, 2)}%` }}
          />
        </div>
        
        <div className="risk-label-group">
          <span>0 Low</span>
          <span className="opacity-30">30</span>
          <span className="opacity-30">60</span>
          <span>100 Critical</span>
        </div>
      </div>
    </div>
  );
};

export default RiskScore;
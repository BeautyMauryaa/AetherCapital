import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useOnboardingStore } from "@/app/store/onboarding.store";
import "./TwoFactor.css";

const METHODS = ["SMS", "Authenticator App", "Hardware Key"];

const TwoFactor = () => {
  const { formData, updateForm } = useOnboardingStore();

  const enabled = formData.twoFA ?? true; 
  const selectedMethod = formData.twoFAMethod || "Authenticator App";

  const handleToggle = () => updateForm({ twoFA: !enabled });
  const setMethod = (m) => updateForm({ twoFAMethod: m });

  return (
    <div className="mt-8 w-full space-y-8">
      <div className="tfa-container">
        <div className="flex items-center gap-4">
          <div className={`tfa-icon-box ${enabled ? "tfa-icon-active" : "tfa-icon-inactive"}`}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-main">Two-factor authentication</p>
            <p className="text-[11px] text-main opacity-30 mt-0.5">Strongly recommended for all accounts</p>
          </div>
        </div>
        <button
          onClick={handleToggle}
          className={`tfa-toggle ${enabled ? "tfa-toggle-active" : "tfa-toggle-inactive"}`}
        >
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm
            ${enabled ? "left-6" : "left-1 opacity-40"}`} 
          />
        </button>
      </div>
      <div className={`space-y-4 transition-all duration-500 ${enabled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
        <p className="text-[10px] text-main opacity-40 font-bold tracking-[0.2em] uppercase">
          Secondary Verification Method <span className="text-purple-500">*</span>
        </p>

        <div className="flex flex-wrap gap-3">
          {METHODS.map((m) => {
            const isActive = selectedMethod === m;
            return (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`method-chip ${isActive ? "method-chip-active" : "method-chip-inactive"}`}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TwoFactor;
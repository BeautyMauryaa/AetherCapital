import React from 'react';
import { useOnboardingStore } from "@/app/store/onboarding.store";
import { useTheme } from "@/context/ThemeContext";

const Terms = () => {
  const { formData, updateForm } = useOnboardingStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const hasAgreed = formData.agreedToTerms || false;

  const toggleAgreement = () => updateForm({ agreedToTerms: !hasAgreed });

  return (
    <div className="mt-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <h3 className={`text-[11px] font-bold tracking-[0.25em] uppercase whitespace-nowrap
          ${isDark ? "text-white/40" : "text-slate-400"}`}>
          Terms & Conditions
        </h3>
        <div className={`w-full h-[1px] ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
      </div>

      {/* Scrollbox */}
      <div className={`rounded-2xl overflow-hidden mb-6 border
        ${isDark ? "bg-[#16161D] border-white/10" : "bg-white border-slate-200"}`}>
        <div className="h-48 overflow-y-auto p-8 custom-scrollbar">
          <div className={`space-y-6 text-[13px] leading-relaxed
            ${isDark ? "text-white/60" : "text-slate-500"}`}>
            <section>
              <h4 className={`text-[10px] font-bold tracking-[0.1em] uppercase mb-3 flex gap-2
                ${isDark ? "text-white" : "text-slate-900"}`}>
                <span className="text-purple-600">1 ·</span> Application of Terms
              </h4>
              <p>By submitting this application, you ("the Applicant") agree to be bound by Aether Capital's
                Master Services Agreement, Privacy Notice, and any product-specific terms referenced therein.
                These documents together constitute the complete agreement between you and Aether Capital
                and supersede any prior negotiations or representations.</p>
            </section>
            <section>
              <h4 className={`text-[10px] font-bold tracking-[0.1em] uppercase mb-3 flex gap-2
                ${isDark ? "text-white" : "text-slate-900"}`}>
                <span className="text-purple-600">2 ·</span> Information Accuracy
              </h4>
              <p>You certify that all information provided in this onboarding process is true, complete, and
                accurate. Providing false information may lead to the immediate suspension of your account
                and potential legal action as required by financial regulatory authorities.</p>
            </section>
            <section>
              <h4 className={`text-[10px] font-bold tracking-[0.1em] uppercase mb-3 flex gap-2
                ${isDark ? "text-white" : "text-slate-900"}`}>
                <span className="text-purple-600">3 ·</span> Data & Privacy
              </h4>
              <p>Your personal data will be processed in accordance with applicable data protection laws.
                Aether Capital may share data with regulated third parties solely for compliance, identity
                verification, and fraud prevention purposes.</p>
            </section>
          </div>
        </div>
      </div>

      {/* Checkbox */}
      <label className="flex items-center gap-3 cursor-pointer group select-none">
        <div
          onClick={toggleAgreement}
          className={`w-5 h-5 rounded transition-all flex items-center justify-center flex-shrink-0 border
            ${hasAgreed
              ? "bg-purple-500 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.3)]"
              : isDark ? "bg-[#16161D] border-white/10" : "bg-white border-slate-300"
            }`}
        >
          {hasAgreed && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
        <span className={`text-[12px] ${isDark ? "text-white/50" : "text-slate-500"}`}>
          I have read and agree to the{' '}
          <span className={`underline ${isDark ? "text-white/80" : "text-slate-700"}`}>Terms of Service</span>
          {' '}and{' '}
          <span className={`underline ${isDark ? "text-white/80" : "text-slate-700"}`}>Privacy Policy</span>.
        </span>
      </label>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: ${isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}; }
      `}</style>
    </div>
  );
};

export default Terms;
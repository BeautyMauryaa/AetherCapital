import React from 'react';
import { useOnboardingStore } from "@/app/store/onboarding.store";

const Terms = () => {
  const { formData, updateForm } = useOnboardingStore();
  const hasAgreed = formData.agreedToTerms || false;

  const toggleAgreement = () => {
    updateForm({ agreedToTerms: !hasAgreed });
  };

  return (
    <div className="mt-12">
      {/* Section Header */}
      <div className="flex items-center gap-4 mb-8">
        <h3 className="text-[11px] font-bold tracking-[0.25em] text-white/40 uppercase whitespace-nowrap">
          Terms & Conditions
        </h3>
        <div className="w-full h-[1px] bg-white/5" />
      </div>

      {/* Terms Scrollbox */}
      <div className="bg-[#13131A] border border-white/[0.05] rounded-2xl overflow-hidden mb-6">
        <div className="h-48 overflow-y-auto p-8 custom-scrollbar">
          <div className="space-y-6 text-[13px] leading-relaxed text-white/50">
            <section>
              <h4 className="text-[10px] font-bold tracking-[0.1em] text-white uppercase mb-3 flex gap-2">
                <span className="text-[#a855f7]">1 ·</span> Application of Terms
              </h4>
              <p>
                By submitting this application, you ("the Applicant") agree to be bound by Aether Capital's 
                Master Services Agreement, Privacy Notice, and any product-specific terms referenced therein. 
                These documents together constitute the complete agreement between you and Aether Capital 
                and supersede any prior negotiations or representations.
              </p>
            </section>

            <section>
              <h4 className="text-[10px] font-bold tracking-[0.1em] text-white uppercase mb-3 flex gap-2">
                <span className="text-[#a855f7]">2 ·</span> Information Accuracy
              </h4>
              <p>
                You certify that all information provided in this onboarding process is true, complete, and 
                accurate. Providing false information may lead to the immediate suspension of your account 
                and potential legal action as required by financial regulatory authorities.
              </p>
            </section>
          </div>
        </div>
      </div>

      {/* Custom Checkbox Agreement */}
      <label className="flex items-center gap-3 cursor-pointer group select-none">
        <div 
          onClick={toggleAgreement}
          className={`w-5 h-5 rounded border transition-all flex items-center justify-center
            ${hasAgreed 
              ? "bg-[#a855f7] border-[#a855f7] shadow-[0_0_10px_rgba(168,85,247,0.3)]" 
              : "bg-white/[0.03] border-white/10 group-hover:border-white/20"
            }`}
        >
          {hasAgreed && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
        <span className="text-[12px] text-white/40 group-hover:text-white/60 transition-colors">
          I have read and agree to the <span className="text-white/60 underline decoration-white/10">Terms of Service</span> and <span className="text-white/60 underline decoration-white/10">Privacy Policy</span>.
        </span>
      </label>

      {/* Custom Scrollbar CSS (Add to global CSS or as a style tag) */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default Terms;
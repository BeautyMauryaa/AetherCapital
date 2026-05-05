import React from 'react';
import { useOnboardingStore } from "@/app/store/onboarding.store";
import { useTheme } from "@/context/ThemeContext";
import "./Terms.css";

const Terms = () => {
  const { formData, updateForm } = useOnboardingStore();
  const hasAgreed = formData.agreedToTerms || false;

  const toggleAgreement = () => updateForm({ agreedToTerms: !hasAgreed });

  return (
    <div className="mt-12">
      <div className="flex items-center gap-4 mb-8">
        <h3 className="text-[11px] font-bold tracking-[0.25em] uppercase whitespace-nowrap text-main opacity-40">
          Terms & Conditions
        </h3>
        <div className="w-full h-[1px] bg-border" style={{ backgroundColor: 'var(--border-color)' }} />
      </div>

      <div className="terms-scrollbox mb-6">
        <div className="space-y-6 text-[13px] leading-relaxed text-main opacity-60">
          <section>
            <h4 className="terms-section-title">
              <span className="text-purple-500">1 ·</span> Application of Terms
            </h4>
            <p>By submitting this application, you ("the Applicant") agree to be bound by Aether Capital's 
               Master Services Agreement, Privacy Notice, and any product-specific terms. These documents 
               constitute the complete agreement between you and Aether Capital.</p>
          </section>

          <section>
            <h4 className="terms-section-title">
              <span className="text-purple-500">2 ·</span> Information Accuracy
            </h4>
            <p>You certify that all information provided in this onboarding process is true, complete, and accurate. 
               Providing false information may lead to account suspension and potential regulatory legal action.</p>
          </section>

          <section>
            <h4 className="terms-section-title">
              <span className="text-purple-500">3 ·</span> Data & Privacy
            </h4>
            <p>Your personal data will be processed in accordance with applicable data protection laws. 
               Aether Capital may share data with regulated third parties solely for identity verification and fraud prevention.</p>
          </section>
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer group select-none">
        <div
          onClick={toggleAgreement}
          className={`checkbox-custom ${hasAgreed ? "checkbox-active" : "group-hover:border-purple-500/50"}`}
        >
          {hasAgreed && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
        <span className="text-[12px] text-main opacity-50">
          I have read and agree to the{' '}
          <span className="underline opacity-100 text-main">Terms of Service</span>
          {' '}and{' '}
          <span className="underline opacity-100 text-main">Privacy Policy</span>.
        </span>
      </label>
    </div>
  );
};

export default Terms;
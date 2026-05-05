import React from 'react';
import { useOnboardingStore } from "@/app/store/onboarding.store";
import NavigationButtons from "../components/common/NavigationButtons";
import StepHeader from "../components/StepHeader";
import ReviewSection from "../components/review/ReviewSection";
import Terms from "../components/review/Terms";
import Signature from "../components/review/Signature";
import { Building2, User, ShieldCheck } from "lucide-react";

const Step6Review = () => {
  const prevStep = useOnboardingStore((s) => s.prevStep);
  const signatureData = useOnboardingStore((s) => s.formData.signatureData);
  const agreedToTerms = useOnboardingStore((s) => s.formData.agreedToTerms);
  const formData = useOnboardingStore((s) => s.formData);
  const submitApplication = useOnboardingStore((s) => s.submitApplication);
  const isSubmitting = useOnboardingStore((s) => s.isSubmitting);

  const isSignatureCaptured = !!signatureData;
  const isTermsAccepted = !!agreedToTerms;
  const canSubmit = isSignatureCaptured && isTermsAccepted;

  const isBusiness = formData.accountType?.toLowerCase() === 'business' || formData.accountType?.toLowerCase() === 'corporate';

  const handleSubmit = () => {
    if (!canSubmit || isSubmitting) return;
    submitApplication();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-10 pb-28 font-sans">
      <StepHeader
        step={6}
        title="Review &"
        highlight="submit."
        subtitle="Final review. Confirm details, sign, and submit your application."
      />

      <div
        className="mt-12 overflow-hidden rounded-[32px] shadow-sm transition-all duration-300"
        style={{ border: '1px solid var(--border-color)' }}
      >
        {/* ── TOP HEADER ── */}
        <div
          className="p-8 md:p-12 flex items-center gap-6 transition-colors duration-300"
          style={{ backgroundColor: 'var(--card-bg)' }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)' }}
          >
            {isBusiness ? <Building2 className="text-purple-600" size={24} /> : <User className="text-purple-600" size={24} />}
          </div>
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-semibold leading-tight" style={{ color: 'var(--text-main)' }}>
              {isBusiness
                ? (formData.legalName || 'Legal Entity Name')
                : (formData.firstName ? `${formData.firstName} ${formData.lastName || ''}` : 'Applicant Profile')
              }
            </h2>
            <div className="flex items-center gap-3 mt-1 text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--text-main)', opacity: 0.4 }}>
              <span>{formData.accountType || "Individual"}</span>
              <span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--text-main)', opacity: 0.3 }} />
              <span>App-Pending</span>
            </div>
          </div>
        </div>

        {/* ── SECTIONS ── */}
        <div className="p-2 md:p-4 space-y-2 transition-colors duration-300" style={{ backgroundColor: 'var(--bg-main)' }}>
          <ReviewSection
            step="01"
            title="ACCOUNT & IDENTITY"
            fields={[
              { label: "ACCOUNT TYPE", value: formData.accountType || "Individual" },
              { label: "PROFILE PHOTO", value: "Not uploaded" },
              { label: "ID FRONT", value: "Not uploaded" },
              { label: "ID BACK", value: "Not uploaded" },
            ]}
          />
          <ReviewSection
            step="02"
            title="PERSONAL INFO"
            fields={[
              { label: "FULL NAME", value: formData.firstName ? `${formData.firstName} ${formData.lastName || ''}` : "Not provided" },
              { label: "DATE OF BIRTH", value: formData.dob || "—" },
              { label: "GENDER", value: formData.gender || "—" },
              { label: "NATIONALITY", value: formData.nationality || "—" },
            ]}
          />
          <ReviewSection
            step="03"
            title="ADDRESS & LOCATION"
            isAddressBlock={true}
            fields={[
              { label: "COUNTRY", value: formData.country || "United States" },
              { label: "TIME ZONE", value: "America/New_York" },
            ]}
          />
        </div>
      </div>

      {/* ── LEGAL SECTIONS ── */}
      <div className="mt-12 space-y-8">
        <Terms />
        <Signature />
      </div>

      {/* ── NAVIGATION ── */}
      <div className="mt-12 pt-8 flex flex-col items-center" style={{ borderTop: '1px solid var(--border-color)' }}>
        <NavigationButtons
          onNext={handleSubmit}
          onBack={prevStep}
          nextLabel={isSubmitting ? "Processing..." : "Submit application"}
          disabled={!canSubmit}
          isSubmitting={isSubmitting}
        />

        {!canSubmit && !isSubmitting && (
          <div className="flex items-center gap-2 mt-6 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            <ShieldCheck size={14} className="text-orange-400" />
            <span>Verification Required: Signature & Terms</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step6Review;
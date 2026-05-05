import React from 'react';
import { useOnboardingStore } from "@/app/store/onboarding.store";
import NavigationButtons from "../components/common/NavigationButtons";
import StepHeader from "../components/StepHeader";
import ReviewSection from "../components/review/ReviewSection";
import Terms from "../components/review/Terms";
import Signature from "../components/review/Signature";
import { Building2, User, ShieldCheck } from "lucide-react";
import "./Step6Review.css";

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

  const isBusiness = formData.accountType?.toLowerCase() === 'business' || 
                     formData.accountType?.toLowerCase() === 'corporate';

  const handleSubmit = () => {
    if (!canSubmit || isSubmitting) return;
    submitApplication();
  };

  return (
    <div className="s6-container">
      <StepHeader
        step={6}
        title="Review &"
        highlight="submit."
        subtitle="Final review. Confirm details, sign, and submit your application."
      />

      <div className="s6-review-card">
        {/* ── TOP HEADER ── */}
        <div className="s6-card-header">
          <div className="s6-icon-wrapper">
            {isBusiness ? 
              <Building2 className="text-purple-600" size={24} /> : 
              <User className="text-purple-600" size={24} />
            }
          </div>
          <div className="flex-1">
            <h2 className="s6-profile-name">
              {isBusiness
                ? (formData.legalName || 'Legal Entity Name')
                : (formData.firstName ? `${formData.firstName} ${formData.lastName || ''}` : 'Applicant Profile')
              }
            </h2>
            <div className="s6-meta-row">
              <span>{formData.accountType || "Individual"}</span>
              <span className="s6-dot" />
              <span>App-Pending</span>
            </div>
          </div>
        </div>

        {/* ── SECTIONS ── */}
        <div className="s6-sections-body">
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
      <div className="s6-footer-nav">
        <NavigationButtons
          onNext={handleSubmit}
          onBack={prevStep}
          nextLabel={isSubmitting ? "Processing..." : "Submit application"}
          disabled={!canSubmit}
          isSubmitting={isSubmitting}
        />

        {!canSubmit && !isSubmitting && (
          <div className="s6-validation-warning">
            <ShieldCheck size={14} className="text-orange-400" />
            <span>Verification Required: Signature & Terms</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step6Review;
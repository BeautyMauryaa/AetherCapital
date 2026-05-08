import React from 'react';
import { useOnboardingStore } from "@/app/store/onboarding.store";
import NavigationButtons from "../components/common/NavigationButtons";
import StepHeader from "../components/StepHeader";
import ReviewSection from "../components/review/ReviewSection";
import Terms from "../components/review/Terms";
import Signature from "../components/review/Signature";
import { Building2, User, ShieldCheck } from "lucide-react";

const Step6Review = () => {
  const setStep = useOnboardingStore((s) => s.setStep);
  
const handleEdit = (targetStep) => {
  setStep(targetStep); // This moves the user without clearing completedSteps
};
  const prevStep = useOnboardingStore((s) => s.prevStep);
  const formData = useOnboardingStore((s) => s.formData);
  const signatureData = useOnboardingStore((s) => s.formData.signatureData);
  const agreedToTerms = useOnboardingStore((s) => s.formData.agreedToTerms);
  const submitApplication = useOnboardingStore((s) => s.submitApplication);
  const isSubmitting = useOnboardingStore((s) => s.isSubmitting);

  const isSignatureCaptured = !!signatureData;
  const isTermsAccepted = !!agreedToTerms;
  const canSubmit = isSignatureCaptured && isTermsAccepted;

  

  const isBusiness = ["business", "corporate", "enterprise"].includes(
    formData.accountType?.toLowerCase()
  );

  // ── Helper to show file status ─────────────────────────────────────────────
  const fileLabel = (field) => {
    const val = formData[field];
    if (!val) return "Not uploaded";
    if (val instanceof File) return `✓ ${val.name}`;
    if (val?.name) return `✓ ${val.name}`;
    if (val?.fileName) return `✓ ${val.fileName}`;
    return "Uploaded";
  };

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
            {isBusiness
              ? <Building2 className="text-purple-600" size={24} />
              : <User className="text-purple-600" size={24} />
            }
          </div>
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-semibold leading-tight" style={{ color: 'var(--text-main)' }}>
              {isBusiness
                ? (formData.legalName || formData.companyName || 'Legal Entity Name')
                : (formData.firstName ? `${formData.firstName} ${formData.lastName || ''}` : 'Applicant Profile')
              }
            </h2>
            <div className="flex items-center gap-3 mt-1 text-[10px] font-bold tracking-widest uppercase"
              style={{ color: 'var(--text-main)', opacity: 0.4 }}>
              <span>{formData.accountType || "Individual"}</span>
              <span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--text-main)', opacity: 0.3 }} />
              <span>App-Pending</span>
            </div>
          </div>
        </div>

        {/* ── REVIEW SECTIONS ── */}
        <div className="p-2 md:p-4 space-y-2 transition-colors duration-300"
          style={{ backgroundColor: 'var(--bg-main)' }}>

          {/* Step 1 — Account & Identity */}
          <ReviewSection
            step="01"
            title="ACCOUNT & IDENTITY"
            onEdit={() => setStep(1)}
            fields={[
              { label: "ACCOUNT TYPE",  value: formData.accountType || "Individual" },
              { label: "PROFILE PHOTO", value: fileLabel("profileImage") },
              { label: "ID FRONT",      value: fileLabel("idFront") },
              { label: "ID BACK",       value: fileLabel("idBack") },
            ]}
          />

          {/* Step 2 — Personal / Business Info */}
          {!isBusiness ? (
            <ReviewSection
              step="02"
              title="PERSONAL INFO"
              onEdit={() => setStep(2)}
              fields={[
                { label: "FULL NAME",      value: formData.firstName ? `${formData.firstName} ${formData.lastName || ''}` : "Not provided" },
                { label: "DATE OF BIRTH",  value: formData.dobDay ? `${formData.dobDay} ${formData.dobMonth} ${formData.dobYear}` : "—" },
                { label: "GENDER",         value: formData.gender || "—" },
                { label: "NATIONALITY",    value: formData.nationality || "—" },
              ]}
            />
          ) : (
            <ReviewSection
              step="02"
              title="BUSINESS INFO"
              onEdit={() => setStep(2)}
              fields={[
                { label: "COMPANY NAME",   value: formData.companyName || formData.legalName || "—" },
                { label: "TRADE NAME",     value: formData.tradeName || "—" },
                { label: "REGISTRATION",   value: formData.regNumber || "—" },
                { label: "INDUSTRY",       value: formData.industry || "—" },
              ]}
            />
          )}

          {/* Step 3 — Address */}
          <ReviewSection
            step="03"
            title="ADDRESS & LOCATION"
            onEdit={() => setStep(3)}
            isAddressBlock={true}
            fields={[
              { label: "COUNTRY",   value: formData.country || "—" },
              { label: "TIME ZONE", value: formData.timezone || "—" },
            ]}
            addressLine={[formData.address1, formData.city, formData.state, formData.zip].filter(Boolean).join(", ")}
          />

          {/* Step 4 — Roles */}
          <ReviewSection
            step="04"
            title="ROLES & PERMISSIONS"
            onEdit={() => setStep(4)}
            fields={[
              { label: "ROLES",   value: Array.isArray(formData.roles) ? formData.roles.join(", ") : (formData.roles || "—") },
              { label: "2FA",     value: formData.twoFA ? `Enabled · ${formData.tfaMethod || ""}` : "Disabled" },
            ]}
          />

          {/* Step 5 — Compliance */}
          <ReviewSection
            step="05"
            title="COMPLIANCE & RISK"
            onEdit={() => setStep(5)}
            fields={[
              { label: "RISK SCORE", value: formData.answers ? `${Object.values(formData.answers || {}).filter(v => v === true).length * 12.5}/100` : "0/100" },
              { label: "DOCUMENTS",  value: formData.documents
                  ? `${Object.keys(formData.documents).length} file(s) attached`
                  : "None uploaded" },
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
      <div className="mt-12 pt-8 flex flex-col items-center"
        style={{ borderTop: '1px solid var(--border-color)' }}>
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
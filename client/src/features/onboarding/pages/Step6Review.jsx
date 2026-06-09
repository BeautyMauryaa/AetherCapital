
import React from "react";
import { useOnboardingStore } from "@/app/store/onboarding.store";
import { fileStore } from "@/app/store/fileStore.js";
import NavigationButtons from "../components/common/NavigationButtons";
import StepHeader from "../components/StepHeader";
import ReviewSection from "../components/review/ReviewSection";
import Terms from "../components/review/Terms";
import Signature from "../components/review/Signature";
import { Building2, User, AlertCircle, Download, X } from "lucide-react";

const Step6Review = () => {
  const prevStep          = useOnboardingStore((s) => s.prevStep);
  const setStep           = useOnboardingStore((s) => s.setStep);
  const signatureData     = useOnboardingStore((s) => s.formData.signatureData);
  const agreedToTerms     = useOnboardingStore((s) => s.formData.agreedToTerms);
  const formData          = useOnboardingStore((s) => s.formData);
  const submitApplication = useOnboardingStore((s) => s.submitApplication);
  const generateReceipt   = useOnboardingStore((s) => s.generateReceipt);
  const isSubmitting      = useOnboardingStore((s) => s.isSubmitting);
  const isSubmitted       = useOnboardingStore((s) => s.isSubmitted);
  const submitError       = useOnboardingStore((s) => s.submitError);
  const clearSubmitError  = useOnboardingStore((s) => s.clearSubmitError);

  const isSignatureCaptured = !!signatureData;
  const isTermsAccepted     = !!agreedToTerms;
  const canSubmit           = isSignatureCaptured && isTermsAccepted;

  const isBusiness = ["business", "corporate", "enterprise"].includes(
    formData.accountType?.toLowerCase()
  );

  // ── File label — checks fileStore first, then formData __name ─────────────
  const fileLabel = (fieldName) => {
    const file = fileStore.get(fieldName);
    if (file instanceof File) return `✓ ${file.name}`;
    const name = formData[`${fieldName}__name`];
    if (name) return `✓ ${name}`;
    return "Not uploaded";
  };

  // ── Documents count — checks fileStore first, then formData __names ───────
 const getDocumentsLabel = () => {
  // Check new documents object format first {docId: {name, driveUrl...}}
  const docs = formData.documents || {};
  const uploadedCount = Object.values(docs).filter(
    (d) => d && (d.driveUrl || d.fileId)
  ).length;
  if (uploadedCount > 0) return `${uploadedCount} file(s) attached`;

  // Fallback: fileStore (before submission)
  const docFiles = fileStore.getMany("documents__files") || [];
  if (docFiles.length > 0) return `${docFiles.length} file(s) attached`;

  // Fallback: old __names format
  const names = formData.documents__names || {};
  const count = Object.keys(names).length;
  if (count > 0) return `${count} file(s) attached`;

  return "None uploaded";
};
  // ── Profile photo preview from fileStore ──────────────────────────────────
const profileFile       = fileStore.get("profileImage");
const submissionResult  = useOnboardingStore((s) => s.submissionResult);

const profilePreviewUrl =
  profileFile instanceof File
    ? URL.createObjectURL(profileFile)
    : formData.profileImage__preview        // base64 from FileUpload ✓
    || submissionResult?.profileImageB64    // after submission ✓
    || null;

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

      <div className="mt-12 overflow-hidden rounded-[32px] shadow-sm"
        style={{ border: '1px solid var(--border-color)' }}>

        {/* TOP HEADER */}
        <div className="p-8 md:p-12 flex items-center gap-6"
          style={{ backgroundColor: 'var(--card-bg)' }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
            style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)' }}>
            {profilePreviewUrl ? (
              <img src={profilePreviewUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : isBusiness ? (
              <Building2 className="text-purple-600" size={24} />
            ) : (
              <User className="text-purple-600" size={24} />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-semibold leading-tight"
              style={{ color: 'var(--text-main)' }}>
              {isBusiness
                ? (formData.legalName || formData.companyName || 'Legal Entity Name')
                : (formData.firstName
                    ? `${formData.firstName} ${formData.lastName || ''}`
                    : 'Applicant Profile')}
            </h2>
            <div className="flex items-center gap-3 mt-1 text-[10px] font-bold tracking-widest uppercase"
              style={{ color: 'var(--text-main)', opacity: 0.4 }}>
              <span>{formData.accountType || "Individual"}</span>
              <span className="w-1 h-1 rounded-full"
                style={{ backgroundColor: 'var(--text-main)', opacity: 0.3 }} />
              <span>App-Pending</span>
            </div>
          </div>
        </div>

        {/* REVIEW SECTIONS */}
        <div className="p-2 md:p-4 space-y-2" style={{ backgroundColor: 'var(--bg-main)' }}>

          <ReviewSection
            step="01" title="ACCOUNT & IDENTITY" onEdit={() => setStep(1)}
            fields={[
              { label: "ACCOUNT TYPE",  value: formData.accountType || "Individual" },
              { label: "PROFILE PHOTO", value: fileLabel("profileImage") },
              { label: "ID FRONT",      value: fileLabel("idFront") },
              { label: "ID BACK",       value: fileLabel("idBack") },
            ]}
          />

          {!isBusiness ? (
            <ReviewSection
              step="02" title="PERSONAL INFO" onEdit={() => setStep(2)}
              fields={[
                { label: "FULL NAME",     value: formData.firstName ? `${formData.firstName} ${formData.lastName || ''}` : "Not provided" },
                { label: "DATE OF BIRTH", value: formData.dobDay ? `${formData.dobDay} ${formData.dobMonth} ${formData.dobYear}` : "—" },
                { label: "GENDER",        value: formData.gender || "—" },
                { label: "NATIONALITY",   value: formData.nationality || "—" },
              ]}
            />
          ) : (
            <ReviewSection
              step="02" title="BUSINESS INFO" onEdit={() => setStep(2)}
              fields={[
                { label: "COMPANY NAME", value: formData.companyName || formData.legalName || "—" },
                { label: "TRADE NAME",   value: formData.tradeName   || "—" },
                { label: "REGISTRATION", value: formData.regNumber   || "—" },
                { label: "INDUSTRY",     value: formData.industry    || "—" },
              ]}
            />
          )}

          <ReviewSection
            step="03" title="ADDRESS & LOCATION" onEdit={() => setStep(3)}
            isAddressBlock={true}
            addressLine={[formData.address1, formData.city, formData.state, formData.zip].filter(Boolean).join(", ")}
            fields={[
              { label: "COUNTRY",   value: formData.country  || "—" },
              { label: "TIME ZONE", value: formData.timezone || "—" },
            ]}
          />

          <ReviewSection
            step="04" title="ROLES & PERMISSIONS" onEdit={() => setStep(4)}
            fields={[
              { label: "ROLES", value: Array.isArray(formData.roles) ? formData.roles.join(", ") : (formData.roles || "—") },
              { label: "2FA",   value: formData.twoFA ? `Enabled · ${formData.tfaMethod || ""}` : "Disabled" },
            ]}
          />

          <ReviewSection
            step="05" title="COMPLIANCE & RISK" onEdit={() => setStep(5)}
            fields={[
              { label: "RISK SCORE", value: `${Object.values(formData.answers || {}).filter(v => v === true).length * 12.5}/100` },
              { label: "DOCUMENTS",  value: getDocumentsLabel() },
            ]}
          />
        </div>
      </div>

      {/* SIGNATURE PREVIEW */}
      {signatureData && (
        <div className="mt-8 p-6 rounded-2xl border"
          style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4"
            style={{ color: 'var(--text-main)', opacity: 0.4 }}>
            Signature Preview
          </p>
          <div className="rounded-xl overflow-hidden border p-4"
            style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)' }}>
            <img src={signatureData} alt="Your signature" className="max-h-24 object-contain" />
          </div>
          <p className="text-[11px] mt-2" style={{ color: 'var(--text-main)', opacity: 0.3 }}>
            ✓ Signature captured and ready for submission
          </p>
        </div>
      )}

      {/* LEGAL SECTIONS */}
      <div className="mt-12 space-y-8">
        <Terms />
        <Signature />
      </div>

      {/* NAVIGATION */}
      <div className="mt-12 pt-8 flex flex-col items-center"
        style={{ borderTop: '1px solid var(--border-color)' }}>

        {/* Validation warning */}
        {!canSubmit && !isSubmitting && (
          <div className="flex items-center gap-3 mb-6 px-5 py-3 rounded-xl border border-orange-500/30 bg-orange-500/5 w-full">
            <AlertCircle size={16} className="text-orange-400 flex-shrink-0" />
            <p className="text-[12px] text-orange-400">
              {!isTermsAccepted && !isSignatureCaptured
                ? "Please accept the terms and add your signature to continue."
                : !isTermsAccepted
                  ? "Please accept the Terms of Service to continue."
                  : "Please add your signature to continue."}
            </p>
          </div>
        )}

        {/* Submit error — inline, never alert() */}
        {submitError && (
          <div className="flex items-start gap-3 mb-6 px-5 py-4 rounded-xl border border-red-500/30 bg-red-500/5 w-full">
            <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-red-400 mb-0.5">Submission failed</p>
              <p className="text-[12px] text-red-400/80">{submitError}</p>
            </div>
            <button onClick={clearSubmitError} className="text-red-400/50 hover:text-red-400 transition-colors">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Download receipt after submit */}
        {isSubmitted && (
          <button
            onClick={generateReceipt}
            className="mb-4 flex items-center gap-2 px-5 py-2.5 rounded-xl border border-purple-500/30 bg-purple-500/5 text-purple-500 text-[12px] font-semibold hover:bg-purple-500/10 transition-all"
          >
            <Download size={14} />
            Download submission receipt
          </button>
        )}

        <NavigationButtons
          onNext={handleSubmit}
          onBack={prevStep}
          nextLabel={isSubmitting ? "Processing…" : "Submit application"}
          disabled={!canSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default Step6Review;

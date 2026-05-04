import React from 'react';
import { useOnboardingStore } from "@/app/store/onboarding.store";
import NavigationButtons from "../components/common/NavigationButtons";
import ReviewSection from "../components/review/ReviewSection";
import Terms from "../components/review/Terms";
import Signature from "../components/review/Signature";
import { Building2, User } from "lucide-react";

const Step6Review = () => {
  const { formData, prevStep } = useOnboardingStore();

  // Logic: Check if signature is present and terms are agreed
  // (Assuming your Terms component updates formData.agreedToTerms)
  const isSignatureCaptured = !!formData.signatureData;
  const isTermsAccepted = !!formData.agreedToTerms;
  const canSubmit = isSignatureCaptured && isTermsAccepted;

  const isBusiness = formData.accountType?.toLowerCase() === 'business' || formData.accountType?.toLowerCase() === 'corporate';

  const handleSubmit = () => {
    if (!canSubmit) return;
    
    console.log("Final Submission Payload:", formData);
    // Add your API call here: 
    // await api.submitApplication(formData);
  };

  return (
    <div className="max-w-3xl pb-20">
      {/* Header */}
      <div className="mb-10">
        <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-[#a855f7] uppercase mb-3 before:content-[''] before:w-6 before:h-[1px] before:bg-[#a855f7]">
          STEP 06 / 06
        </p>
        <h1 className="text-3xl font-semibold text-white mb-3">
          Review & <span className="text-[#a855f7]">submit</span>.
        </h1>
        <p className="text-[14px] text-white/50">
          Final review. Confirm details, sign, and submit your application.
        </p>
      </div>

      {/* Profile Summary Header */}
      <div className="bg-[#13131A] border border-white/[0.05] rounded-t-[20px] p-8 flex items-center gap-6 border-b-0">
        <div className="w-16 h-16 rounded-2xl bg-[#1C1C22] border border-white/[0.1] flex items-center justify-center">
          {isBusiness ? (
            <Building2 className="text-[#a855f7]" size={28} />
          ) : (
            <User className="text-[#a855f7]" size={28} />
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white uppercase tracking-tight">
            {isBusiness ? formData.legalName : `${formData.firstName} ${formData.lastName}`}
          </h2>
          <div className="flex gap-3 mt-1 text-[10px] font-mono tracking-widest uppercase">
            <span className="text-white/40">{formData.accountType || "Account"}</span>
            <span className="text-[#f59e0b] flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-[#f59e0b] animate-pulse" />
              App-Pending
            </span>
          </div>
        </div>
      </div>

      {/* Review Sections */}
      <div className="space-y-[1px] bg-white/[0.05] border border-white/[0.05] rounded-b-[20px] overflow-hidden mb-12">
        <ReviewSection step="01" title="Account & Identity" fields={[
          { label: "Account Type", value: formData.accountType },
          { label: isBusiness ? "Registration No." : "ID Type", value: isBusiness ? formData.registrationNumber : "Passport" },
        ]} />
        
        {isBusiness ? (
          <ReviewSection step="02" title="Business Info" fields={[
            { label: "Legal Entity Name", value: formData.legalName },
            { label: "Industry", value: formData.industry },
            { label: "Employees", value: formData.employeeCount },
            { label: "Registration Date", value: formData.registrationDate }
          ]} />
        ) : (
          <ReviewSection step="02" title="Personal Info" fields={[
            { label: "Full Name", value: `${formData.firstName} ${formData.lastName}` },
            { label: "Date of Birth", value: formData.dob },
            { label: "Gender", value: formData.gender },
            { label: "Nationality", value: formData.nationality }
          ]} />
        )}

        <ReviewSection step="03" title="Address & Location" fields={[
          { label: "Primary Address", value: `${formData.address1 || ""}, ${formData.city || ""}` },
          { label: "Country", value: formData.country },
          { label: "Time Zone", value: formData.timezone },
          ...(isBusiness ? [{ label: "Operating Hours", value: "Mon - Fri (09:00 - 17:00)" }] : [])
        ]} isAddressBlock />

        <ReviewSection step="05" title="Compliance & Risk" fields={[
          { label: "Risk Tier", value: "MEDIUM 32/100", isBadge: true },
          { label: "Documentation", value: isBusiness ? "4/4 Files Uploaded" : "Verified" }
        ]} />
      </div>

      {/* Input Sections */}
      <div className="space-y-6">
        <Terms />
        <Signature />
      </div>

      {/* Navigation & Submit */}
      <div className="mt-10 pt-10 border-t border-white/5">
        <NavigationButtons 
          onNext={handleSubmit} 
          onBack={prevStep}
          nextLabel="Submit application"
          // Crucial: Pass the signature state to the buttons
          disabled={!canSubmit} 
        />
        
        {!canSubmit && (
          <p className="text-center mt-4 text-[10px] text-white/20 uppercase tracking-widest">
            {!isTermsAccepted ? "Accept terms" : "Provide signature"} to continue
          </p>
        )}
      </div>
    </div>
  );
};

export default Step6Review;
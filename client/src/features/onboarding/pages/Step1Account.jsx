import React, { useState } from "react";
import { useOnboardingStore } from "@/app/store/onboarding.store";
import AccountTypeCard from "../components/AccountTypeCard";
import FileUpload from "../components/FileUpload";
import NavigationButtons from "../components/common/NavigationButtons";
import { useTheme } from "@/context/ThemeContext";
import "./Step1Account.css";

const Step1Account = () => {
  const { nextStep, updateForm, formData } = useOnboardingStore();
  const [accountType, setAccountType] = useState(formData.accountType || "individual");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleContinue = () => {
    updateForm({ accountType });
    nextStep();
  };

  const textClass = isDark ? "text-white" : "text-slate-900";
  const subTextClass = isDark ? "text-white/60" : "text-slate-500";
  const labelClass = isDark ? "text-white/40" : "text-slate-400";

  return (
    <div className="step-container sm:px-6 lg:px-2 pt-6 sm:pt-10 pb-24 sm:pb-28">

      {/* Step indicator */}
      <div className="step-indicator-box">
        <div className="step-line" />
        <span className="step-text">Step 01 / 06</span>
      </div>

      {/* Heading */}
      <h1 className={`account-title ${textClass}`}>
        Set up your{" "}
        <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
          account.
        </span>
      </h1>

      {/* Subtitle */}
      <p className={`account-subtitle ${subTextClass}`}>
        Tell us who you are. We'll tailor the rest of the application to fit.
      </p>

      {/* Account Type */}
      <div className="mb-10">
        <p className={`section-label ${labelClass}`}>
          Account Type <span className="text-purple-500">*</span>
        </p>
        <div className="account-grid">
          <AccountTypeCard
            type="individual"
            title="Individual"
            description="Personal account for solo traders, founders, and self-employed individuals."
            active={accountType === "individual"}
            onClick={() => setAccountType("individual")}
          />
          <AccountTypeCard
            type="business"
            title="Business"
            description="Registered companies, LLCs, and partnerships up to 200 employees."
            active={accountType === "business"}
            onClick={() => setAccountType("business")}
          />
          <AccountTypeCard
            type="enterprise"
            title="Enterprise"
            description="Public companies, multi-entity organizations, and regulated institutions."
            active={accountType === "enterprise"}
            onClick={() => setAccountType("enterprise")}
          />
        </div>
      </div>

      {/* Profile Photo — uploads to Drive, saves URL as formData.profileImage */}
      <div className="mb-8">
        <p className={`section-label ${labelClass}`}>Profile Photo</p>
        <FileUpload
          variant="photo"
          fieldName="profileImage"
          helperText="JPG or PNG · max 2MB · square crop recommended"
        />
      </div>

      {/* Government ID — uploads to Drive, saves URLs as formData.idFront / idBack */}
      <div className="mb-8">
        <p className={`section-label ${labelClass}`}>Government ID</p>
        <div className="id-grid">
          <div>
            <p className={`sub-label ${isDark ? "text-white/30" : "text-slate-400"}`}>
              Front of ID
            </p>
            <FileUpload
              variant="id"
              fieldName="idFront"
              sublabel="Upload front"
              accept="image/*,.pdf"
            />
          </div>
          <div>
            <p className={`sub-label ${isDark ? "text-white/30" : "text-slate-400"}`}>
              Back of ID
            </p>
            <FileUpload
              variant="id"
              fieldName="idBack"
              sublabel="Upload back"
              accept="image/*,.pdf"
            />
          </div>
        </div>
        <p className={`mt-4 text-[12px] ${labelClass}`}>
          Required for KYC verification · JPG, PNG, or PDF
        </p>
      </div>

      <NavigationButtons onNext={handleContinue} />
    </div>
  );
};

export default Step1Account;
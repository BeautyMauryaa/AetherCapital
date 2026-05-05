import { useState } from "react";
import { useOnboardingStore } from "@/app/store/onboarding.store";
import AccountTypeCard from "../components/AccountTypeCard";
import FileUpload from "../components/FileUpload";
import NavigationButtons from "../components/common/NavigationButtons";
import { useTheme } from "@/context/Themecontext";

const Step1Account = () => {
  const { nextStep, updateForm, formData } = useOnboardingStore();
  const [accountType, setAccountType] = useState(formData.accountType || "individual");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleContinue = () => {
    updateForm({ accountType });
    nextStep();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-2 pt-6 sm:pt-10 pb-24 sm:pb-28">

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="w-6 sm:w-8 h-[1.5px] bg-purple-500 rounded-full" />
        <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.2em] text-purple-500 uppercase font-bold">
          Step 01 / 06
        </span>
      </div>

      {/* Heading */}
      <h1 className={`text-[28px] sm:text-[36px] lg:text-[42px] font-bold leading-tight tracking-tight mb-2 sm:mb-3
        ${isDark ? "text-white" : "text-slate-900"}`}>
        Set up your{" "}
        <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
          account.
        </span>
      </h1>

      {/* Subtitle */}
      <p className={`text-[13px] sm:text-[15px] mb-7 sm:mb-10
        ${isDark ? "text-white/60" : "text-slate-500"}`}>
        Tell us who you are. We'll tailor the rest of the application to fit.
      </p>

      {/* Account Type Section */}
      <div className="mb-8 sm:mb-10">
        <p className={`text-[10px] font-bold tracking-[0.22em] uppercase mb-3 sm:mb-4
          ${isDark ? "text-white/40" : "text-slate-400"}`}>
          Account Type <span className="text-purple-500">*</span>
        </p>

        {/* 1 col on mobile, 3 col on md+ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
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

      {/* Profile Photo */}
      <div className="mb-6 sm:mb-8">
        <p className={`text-[10px] font-bold tracking-[0.22em] uppercase mb-3 sm:mb-4
          ${isDark ? "text-white/40" : "text-slate-400"}`}>
          Profile Photo
        </p>
        <FileUpload
          variant="photo"
          helperText="JPG or PNG · max 2MB · square crop recommended"
        />
      </div>

      {/* Government ID */}
      <div className="mb-6 sm:mb-8">
        <p className={`text-[10px] font-bold tracking-[0.22em] uppercase mb-3 sm:mb-4
          ${isDark ? "text-white/40" : "text-slate-400"}`}>
          Government ID
        </p>

        {/* 1 col on mobile, 2 col on sm+ */}
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <p className={`text-[10px] font-bold tracking-[0.18em] uppercase mb-2 sm:mb-3
              ${isDark ? "text-white/30" : "text-slate-400"}`}>
              Front of ID
            </p>
            <FileUpload
              variant="id"
              sublabel="Upload front"
              accept="image/*,.pdf"
            />
          </div>
          <div>
            <p className={`text-[10px] font-bold tracking-[0.18em] uppercase mb-2 sm:mb-3
              ${isDark ? "text-white/30" : "text-slate-400"}`}>
              Back of ID
            </p>
            <FileUpload
              variant="id"
              sublabel="Upload back"
              accept="image/*,.pdf"
            />
          </div>
        </div>

        <p className={`mt-2.5 text-[11px] sm:text-[12px]
          ${isDark ? "text-white/40" : "text-slate-400"}`}>
          Required for KYC verification · JPG, PNG, or PDF
        </p>
      </div>

      <NavigationButtons onNext={handleContinue} />
    </div>
  );
};

export default Step1Account;
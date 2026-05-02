import { useState } from "react";
import { useOnboardingStore } from "@/app/store/onboarding.store";
import AccountTypeCard from "../components/AccountTypeCard";
import FileUpload from "../components/FileUpload";
import NavigationButtons from "../components/common/NavigationButtons";

const Step1Account = () => {
  const { nextStep, updateForm, formData } = useOnboardingStore();
  const [accountType, setAccountType] = useState(formData.accountType || "individual");

  const handleContinue = () => {
    updateForm({ accountType });
    nextStep();
  };

  return (
    /* pb-24 ensures content doesn't hide behind fixed nav bar */
    <div className="max-w-4xl mx-auto px-2 pt-10 pb-28">

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-[1.5px] bg-purple-500 rounded-full" />
        <span className="font-mono text-[11px] tracking-[0.2em] text-purple-500 uppercase font-bold">
          Step 01 / 06
        </span>
      </div>

      {/* Heading */}
      <h1 className="text-[42px] font-bold leading-tight tracking-tight mb-3">
        Set up your{" "}
        <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
          account.
        </span>
      </h1>
      <p className="text-[15px] text-white/45 mb-10">
        Tell us who you are. We'll tailor the rest of the application to fit.
      </p>

      {/* Account Type Section */}
      <div className="mb-10">
        {/* Section label */}
        <p className="text-[10px] font-bold tracking-[0.22em] text-white/40 uppercase mb-4">
          Account Type <span className="text-purple-500">*</span>
        </p>

        {/* Cards grid */}
        <div className="grid grid-cols-3 gap-4">
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
      <div className="mb-8">
        <p className="text-[10px] font-bold tracking-[0.22em] text-white/40 uppercase mb-4">
          Profile Photo
        </p>
        <FileUpload
          variant="photo"
          helperText="JPG or PNG · max 2MB · square crop recommended"
        />
      </div>

      {/* Government ID */}
      <div className="mb-8">
        <p className="text-[10px] font-bold tracking-[0.22em] text-white/40 uppercase mb-4">
          Government ID
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] font-bold tracking-[0.18em] text-white/25 uppercase mb-3">
              Front of ID
            </p>
            <FileUpload
              variant="id"
              sublabel="Upload front"
              accept="image/*,.pdf"
            />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-[0.18em] text-white/25 uppercase mb-3">
              Back of ID
            </p>
            <FileUpload
              variant="id"
              sublabel="Upload back"
              accept="image/*,.pdf"
            />
          </div>
        </div>
        <p className="mt-2.5 text-[12px] text-white/30">
          Required for KYC verification · JPG, PNG, or PDF
        </p>
      </div>

      {/* Fixed bottom nav */}
      <NavigationButtons onNext={handleContinue} />
    </div>
  );
};

export default Step1Account;
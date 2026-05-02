import { useState } from "react";
import { useOnboardingStore } from "@/app/store/onboarding.store";

import AccountTypeCard from "../components/AccountTypeCard";
import FileUpload from "../components/FileUpload";
import NavigationButtons from "../components/common/NavigationButtons";

const Step1Account = () => {
 const { setStep, updateForm, formData } = useOnboardingStore();

  const [accountType, setAccountType] = useState(
    formData.accountType || "business"
  );

  
const handleContinue = () => {
  updateForm({ accountType });

  if (accountType === "individual") {
    setStep(2);
  } 
  else if (accountType === "business") {
    setStep(3);
  } 
  else if (accountType === "enterprise") {
    setStep(4);
  }
};

  return (
    <div className="max-w-5xl mx-auto px-8 py-12">

  {/* Header */}
  <div className="mb-12">
   <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-purple-500 uppercase mb-3.5 before:content-[''] before:w-6 before:h-[1.5px] before:bg-current before:rounded-full">
  STEP 01 / 06
</p>
    <h1 className="text-4xl font-semibold leading-tight">
      Set up your{" "}
      <span className="bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
        account.
      </span>
    </h1>

    <p className="text-gray-400 mt-3 max-w-lg">
      Tell us who you are. We'll tailor the rest of the application to fit.
    </p>
  </div>

  {/* Account Type Grid */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
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

  {/* Upload Section */}
  <div className="space-y-6 mb-12">
    <FileUpload label="Profile Photo" />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FileUpload label="ID Front" />
      <FileUpload label="ID Back" />
    </div>
  </div>

  {/* Navigation */}
  <NavigationButtons onNext={handleContinue} />
</div>
  );
};

export default Step1Account;
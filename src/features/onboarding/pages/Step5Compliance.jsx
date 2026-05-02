import { useOnboardingStore } from "@/app/store/onboarding.store";
import NavigationButtons from "../components/common/NavigationButtons";
import Questionnaire from "../components/questionnaire/Questionnaire";

import RiskScore from "../components/risk/RiskScore";
import ComplianceForm from "../components/compliance/ComplianceForm.jsx";
// import ComplianceForm from "../components/compliance/ComplianceForm";
import DocumentChecklist from "../components/documents/DocumentChecklist";

const Step5Compliance = () => {
  const { nextStep } = useOnboardingStore();

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-10">
        <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-purple-500 uppercase mb-3.5 before:content-[''] before:w-6 before:h-[1.5px] before:bg-current before:rounded-full">
  STEP 05 / 06
</p>
        <h1 className="text-3xl font-semibold">
          Compliance & <span className="text-purple-400">risk</span>.
        </h1>
      </div>

      <RiskScore />
      <Questionnaire />
      <ComplianceForm />
      <DocumentChecklist />

      <div className="mt-10">
        <NavigationButtons onNext={nextStep} />
      </div>
    </div>
  );
};

export default Step5Compliance;
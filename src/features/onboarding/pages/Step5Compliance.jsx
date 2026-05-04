import { useOnboardingStore } from "@/app/store/onboarding.store";
import NavigationButtons from "../components/common/NavigationButtons";
import Questionnaire from "../components/questionnaire/Questionnaire";
import RiskScore from "../components/risk/RiskScore";

const Step5Compliance = () => {
  const { nextStep } = useOnboardingStore();

  return (
    <div className="max-w-3xl pb-24">
      
      {/* Header */}
      <div className="mb-10">
        <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-[#a855f7] uppercase mb-3 before:content-[''] before:w-6 before:h-[1px] before:bg-[#a855f7]">
          STEP 05 / 06
        </p>
        <h1 className="text-3xl font-semibold text-white mb-3">
          Compliance & <span className="text-[#a855f7]">risk</span>.
        </h1>
        <p className="text-[14px] text-white/50">
          Help us assess your regulatory exposure with a few yes/no questions.
        </p>
      </div>

      <div className="space-y-10">
        <RiskScore />
        <Questionnaire />
      </div>

      <NavigationButtons onNext={nextStep} />
    </div>
  );
};

export default Step5Compliance;
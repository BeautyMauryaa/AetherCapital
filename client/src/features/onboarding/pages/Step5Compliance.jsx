import { useOnboardingStore } from "@/app/store/onboarding.store";
import NavigationButtons from "../components/common/NavigationButtons";
import Questionnaire from "../components/questionnaire/Questionnaire";
import RiskScore from "../components/risk/RiskScore";
import { useTheme } from "@/context/ThemeContext";

const Step5Compliance = () => {
  const { nextStep } = useOnboardingStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-2 pt-6 sm:pt-10 pb-24 sm:pb-28">

      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-6 sm:w-8 h-[1.5px] bg-purple-500 rounded-full" />
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.2em] text-purple-500 uppercase font-bold">
            Step 05 / 06
          </span>
        </div>

        <h1 className={`text-[28px] sm:text-[36px] lg:text-[42px] font-bold leading-tight tracking-tight mb-2 sm:mb-3
          ${isDark ? "text-white" : "text-slate-900"}`}>
          Compliance &{" "}
          <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
            risk.
          </span>
        </h1>

        <p className={`text-[13px] sm:text-[15px]
          ${isDark ? "text-white/50" : "text-slate-500"}`}>
          Help us assess your regulatory exposure with a few yes/no questions.
        </p>
      </div>

      <div className="space-y-8 sm:space-y-10">
        <RiskScore />
        <Questionnaire />
      </div>

      <NavigationButtons onNext={nextStep} />
    </div>
  );
};

export default Step5Compliance;
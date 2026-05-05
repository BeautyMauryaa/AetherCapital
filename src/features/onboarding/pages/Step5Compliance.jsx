import { useOnboardingStore } from "@/app/store/onboarding.store";
import NavigationButtons from "../components/common/NavigationButtons";
import Questionnaire from "../components/questionnaire/Questionnaire";
import RiskScore from "../components/risk/RiskScore";
import { useTheme } from "@/context/ThemeContext";
import "./Step5Compliance.css";

const Step5Compliance = () => {
  const { nextStep } = useOnboardingStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="s5-container">
      {/* Header */}
      <div className="s5-header">
        <div className="s5-step-indicator-row">
          <div className="s5-accent-line" />
          <span className="s5-step-label">
            Step 05 / 06
          </span>
        </div>

        <h1 className={`s5-title ${isDark ? "s5-text-dark" : "s5-text-light"}`}>
          Compliance &{" "}
          <span className="s5-title-highlight">
            risk.
          </span>
        </h1>

        <p className={`s5-description ${isDark ? "s5-subtext-dark" : "s5-subtext-light"}`}>
          Help us assess your regulatory exposure with a few yes/no questions.
        </p>
      </div>

      <div className="s5-content-stack">
        <RiskScore />
        <Questionnaire />
      </div>

      <NavigationButtons onNext={nextStep} />
    </div>
  );
};

export default Step5Compliance;
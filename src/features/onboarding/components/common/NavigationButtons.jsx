import { ChevronLeft, ChevronRight } from "lucide-react";
import { useOnboardingStore } from "@/app/store/onboarding.store";
import "./NavigationButtons.css";

const NavigationButtons = ({
  onNext,
  nextLabel = "Continue",
  disabled = false,
}) => {
  const { prevStep, step } = useOnboardingStore();

  return (
    <div className="nav-container">
      
      {step > 1 && (
        <button
          type="button"
          onClick={prevStep}
          className="btn-back"
        >
          <ChevronLeft size={16} />
          Back
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={disabled}
        className={`flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
          ${disabled
            ? "btn-next-disabled"
            : "bg-purple-500 hover:bg-purple-600 text-white shadow-[0_4px_20px_rgba(168,85,247,0.3)] active:scale-[0.98]"
          }`}
      >
        {nextLabel}
        {!disabled && <ChevronRight size={16} />}
      </button>
    </div>
  );
};

export default NavigationButtons;
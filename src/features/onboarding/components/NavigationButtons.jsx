import React from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useOnboardingStore } from "@/app/store/onboarding.store";
import "./NavigationButtons.css";

const NavigationButtons = ({
  onNext,
  nextLabel = "Continue",
  disabled = false,
  isSubmitting = false,
}) => {
  const { prevStep, step } = useOnboardingStore();

  const getPrimaryButtonClass = () => {
    let classes = "nav-btn-primary ";
    
    if (disabled && !isSubmitting) {
      classes += "nav-btn-primary-disabled";
    } else if (isSubmitting) {
      classes += "nav-btn-primary-active nav-btn-primary-loading";
    } else {
      classes += "nav-btn-primary-active nav-btn-primary-hover";
    }
    
    return classes;
  };

  return (
    <div className="nav-container">
      {step > 1 && (
        <button
          type="button"
          onClick={prevStep}
          className="nav-btn-back"
        >
          <ChevronLeft size={16} />
          Back
        </button>
      )}

      <button
        type="button"
        onClick={onNext}
        disabled={disabled || isSubmitting}
        className={getPrimaryButtonClass()}
      >
        {isSubmitting && <Loader2 size={15} className="animate-spin" />}
        {nextLabel}
        {!disabled && !isSubmitting && <ChevronRight size={16} />}
      </button>
    </div>
  );
};

export default NavigationButtons;
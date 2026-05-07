import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useOnboardingStore } from "@/app/store/onboarding.store";

const NavigationButtons = ({
  onNext,
  nextLabel = "Continue",
  disabled = false,
  isSubmitting = false,
}) => {
  const { prevStep, step } = useOnboardingStore();

  return (
    <div
      className="fixed bottom-0 left-[300px] right-0 z-50 flex items-center justify-end gap-4 px-12 py-5 backdrop-blur-md"
      style={{
        backgroundColor: 'var(--bg-main)',
        borderTop: '1px solid var(--border-color)',
      }}
    >
      {step > 1 && (
        <button
          type="button"
          onClick={prevStep}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:opacity-80"
          style={{
            color: 'var(--text-main)',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--card-bg)',
          }}
        >
          <ChevronLeft size={16} />
          Back
        </button>
      )}

      <button
        type="button"
        onClick={onNext}
        disabled={disabled || isSubmitting}
        className={`flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
          ${disabled && !isSubmitting
            ? "cursor-not-allowed opacity-40"
            : isSubmitting
              ? "cursor-not-allowed bg-[#a855f7] text-white opacity-80"
              : "bg-[#a855f7] hover:bg-[#9333ea] text-white shadow-[0_4px_20px_rgba(168,85,247,0.3)] active:scale-[0.98]"
          }`}
        style={disabled && !isSubmitting ? {
          backgroundColor: 'var(--card-bg)',
          color: 'var(--text-main)',
          border: '1px solid var(--border-color)',
        } : {}}
      >
        {isSubmitting && <Loader2 size={15} className="animate-spin" />}
        {nextLabel}
        {!disabled && !isSubmitting && <ChevronRight size={16} />}
      </button>
    </div>
  );
};

export default NavigationButtons;
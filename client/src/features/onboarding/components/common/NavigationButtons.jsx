import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useOnboardingStore } from "@/app/store/onboarding.store";

const NavigationButtons = ({
  onNext,
  nextLabel = "Continue",
  disabled = false,
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
      {/* Back button */}
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

      {/* Continue / Submit */}
      <button
        type="button"
        onClick={onNext}
        disabled={disabled}
        className={`flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
          ${disabled
            ? "cursor-not-allowed opacity-40"
            : "bg-[#a855f7] hover:bg-[#9333ea] text-white shadow-[0_4px_20px_rgba(168,85,247,0.3)] active:scale-[0.98]"
          }`}
        style={disabled ? {
          backgroundColor: 'var(--card-bg)',
          color: 'var(--text-main)',
          border: '1px solid var(--border-color)',
        } : {}}
      >
        {nextLabel}
        {!disabled && <ChevronRight size={16} />}
      </button>
    </div>
  );
};

export default NavigationButtons;
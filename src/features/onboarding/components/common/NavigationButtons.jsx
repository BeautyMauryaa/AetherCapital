import { ChevronLeft, ChevronRight } from "lucide-react";
import { useOnboardingStore } from "@/app/store/onboarding.store";

const NavigationButtons = ({ onNext, nextLabel = "Continue" }) => {
  const { prevStep, step } = useOnboardingStore();

  return (
    /* Fixed bar pinned to bottom of viewport, right-aligned */
    <div className="fixed bottom-0 left-[300px] right-0 z-50 flex items-center justify-end gap-3 px-12 py-5 bg-[#0B0B0F]/90 backdrop-blur-sm border-t border-white/[0.05]">
      {/* Back button */}
      <button
        onClick={prevStep}
        disabled={step === 1}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
          ${step === 1
            ? 'text-white/20 cursor-not-allowed'
            : 'text-white/60 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/[0.1]'
          }`}
      >
        <ChevronLeft size={16} />
        Back
      </button>

      {/* Continue button */}
      <button
        onClick={onNext}
        className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-semibold
          bg-gradient-to-r from-purple-600 to-violet-600
          hover:from-purple-500 hover:to-violet-500
          text-white shadow-[0_4px_24px_rgba(139,92,246,0.35)]
          hover:shadow-[0_4px_28px_rgba(139,92,246,0.5)]
          transition-all duration-200 active:scale-[0.98]"
      >
        {nextLabel}
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default NavigationButtons;
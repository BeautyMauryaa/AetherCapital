import { ChevronLeft, ChevronRight } from "lucide-react";
import { useOnboardingStore } from "@/app/store/onboarding.store";

const NavigationButtons = ({ onNext, nextLabel = "Continue" }) => {
  const { prevStep, step } = useOnboardingStore();

  return (
    <div className="fixed bottom-0 left-[300px] right-0 z-50 flex items-center justify-end gap-4 px-12 py-5 bg-[#0B0B0F]/95 backdrop-blur-md border-t border-white/[0.06]">
      
      {/* Back button */}
      <button
        onClick={prevStep}
        disabled={step === 1}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
          ${step === 1
            ? 'text-white/20 cursor-not-allowed hidden' // Usually hidden or highly dimmed on step 1
            : 'text-white/50 hover:text-white bg-transparent border border-white/[0.1] hover:bg-white/[0.04]'
          }`}
      >
        <ChevronLeft size={16} />
        Back
      </button>

      {/* Continue button */}
      <button
        onClick={onNext}
        className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-semibold
          bg-[#a855f7] hover:bg-[#9333ea]
          text-white shadow-[0_4px_20px_rgba(168,85,247,0.3)]
          transition-all duration-200 active:scale-[0.98]"
      >
        {nextLabel}
        <ChevronRight size={16} />
      </button>
      
    </div>
  );
};

export default NavigationButtons;
import { useOnboardingStore } from "@/app/store/onboarding.store";

const NavigationButtons = ({ onNext }) => {
  const { prevStep } = useOnboardingStore();

  return (
    <div className="flex justify-between">
      <button
        onClick={prevStep}
        className="px-5 py-2 rounded-lg border border-white/20"
      >
        Back
      </button>

      <button
        onClick={onNext}
        className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500"
      >
        Continue
      </button>
    </div>
  );
};

export default NavigationButtons;
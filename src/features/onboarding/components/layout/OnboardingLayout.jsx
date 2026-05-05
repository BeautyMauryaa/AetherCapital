import { useOnboardingStore } from "@/app/store/onboarding.store";
import StepSidebar from "@/features/onboarding/components/layout/StepSidebar";

const OnboardingLayout = ({ children }) => {
  // Pull the current step from your global store
  const currentStep = useOnboardingStore((state) => state.step);

  return (
    <div className="flex min-h-screen bg-[#08080C] text-white font-sans selection:bg-purple-500/30">
      
      {/* Sidebar: Now receives the reactive step from the store */}
      <StepSidebar currentStep={currentStep} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto px-12 py-10 custom-scrollbar">
          <div className="max-w-4xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>

    </div>
  );
};

export default OnboardingLayout;
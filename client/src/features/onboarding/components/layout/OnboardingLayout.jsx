// import { useOnboardingStore } from "@/app/store/onboarding.store";
// import StepSidebar from "@/features/onboarding/components/layout/StepSidebar";

// const OnboardingLayout = ({ children }) => {
//   const currentStep = useOnboardingStore((state) => state.step);

//   return (
//     <div className="flex min-h-screen bg-[#08080C] text-white font-sans selection:bg-purple-500/30">
//       <StepSidebar currentStep={currentStep} />

//       <main className="flex-1 flex flex-col h-screen overflow-hidden">
//         <div className="flex-1 overflow-y-auto px-12 py-10 custom-scrollbar">
//           <div className="max-w-4xl mx-auto w-full">
//             {children}
//           </div>
//         </div>
//       </main>

//     </div>
//   );
// };

// export default OnboardingLayout;

import { useOnboardingStore } from "@/app/store/onboarding.store";
import StepSidebar from "@/features/onboarding/components/layout/StepSidebar";

const OnboardingLayout = ({ children }) => {
  const currentStep = useOnboardingStore((state) => state.step);

  return (
    /* Changed flex to flex-col on mobile, flex-row on desktop */
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#08080C] text-white font-sans selection:bg-purple-500/30">
      
      {/* 1. Sidebar/Header */}
      <StepSidebar currentStep={currentStep} />

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Added h-full and removed fixed h-screen to allow proper scrolling */}
        <div className="flex-1 overflow-y-auto px-6 md:px-12 py-6 md:py-10 custom-scrollbar">
          <div className="max-w-4xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>

    </div>
  );
};

export default OnboardingLayout;
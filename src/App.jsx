import AppLayout from "@/features/onboarding/components/layout/AppLayout";
import { useOnboardingStore } from "@/app/store/onboarding.store";

import Step1 from "@/features/onboarding/pages/Step1Account";
import Step2 from "@/features/onboarding/pages/Step2Personal";
import Step3 from "@/features/onboarding/pages/Step3Address";
import Step4 from "@/features/onboarding/pages/Step4Roles";
import Step5 from "@/features/onboarding/pages/Step5Compliance";
import Step6Review from "@/features/onboarding/pages/Step6Review";


function App() {
  const step = useOnboardingStore((s) => s.step);

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
      case 4:
        return <Step4 />;
      case 5:
        return <Step5 />;
      case 6:
        return <Step6Review />;
      default:
        return <Step1 />;
    }
  };

  return (
    <AppLayout>
      {renderStep()}
    </AppLayout>
  );
}

export default App;
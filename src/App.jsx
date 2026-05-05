import AppLayout from "@/features/onboarding/components/layout/AppLayout";
import { useOnboardingStore } from "@/app/store/onboarding.store";
import { ThemeProvider } from "@/context/ThemeContext";
import Success from "@/features/onboarding/pages/Success";

// Step 1: Shared
import Step1 from "@/features/onboarding/pages/Step1Account";

// Step 2: Branched
import Step2Personal from "@/features/onboarding/pages/Step2Personal"; 
import Step2Org from "@/features/onboarding/pages/corporate/Step2Org"; 
import Step2Enterprise from "@/features/onboarding/pages/corporate/Step2EnterpriseInfo"; 

// Step 3: Branched
import Step3Individual from "@/features/onboarding/pages/Step3Address";
import Step3Business from "@/features/onboarding/pages/corporate/Step3BusinessAddress";
// CRITICAL: Ensure this matches your filename exactly (Step3EnterPriseAdd vs Step3EnterpriseAdd)
import Step3EnterpriseAddr from "@/features/onboarding/pages/corporate/Step3EnterPriseAdd"; 

// Step 4: Shared
import Step4 from "@/features/onboarding/pages/Step4Roles";

// Step 5: Branched
import Step5Compliance from "@/features/onboarding/pages/Step5Compliance"; 
import Step5CorporateCompliance from "@/features/onboarding/pages/corporate/Step5CorpCompliance";

// Step 6: Shared
import Step6Review from "@/features/onboarding/pages/Step6Review";

function App() {
  const step = useOnboardingStore((s) => s.step);
  const isSubmitted = useOnboardingStore((s) => s.isSubmitted);
  const formData = useOnboardingStore((s) => s.formData);
  const accountType = formData?.accountType?.toLowerCase() || "";
  
  if (isSubmitted) {
    return (
      <ThemeProvider>
        <Success />
      </ThemeProvider>
    );
  }

  console.log("Current State -> Step:", step, "Type:", accountType);

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1 />;
      case 2:
        if (accountType === "enterprise") return <Step2Enterprise />;
        if (accountType === "business") return <Step2Org />;
        return <Step2Personal />;
      case 3:
        if (accountType === "enterprise") return <Step3EnterpriseAddr />;
        if (accountType === "business") return <Step3Business />;
        return <Step3Individual />;
      case 4: return <Step4 />;
      case 5:
        return accountType === "individual" ? <Step5Compliance /> : <Step5CorporateCompliance />;
      case 6: return <Step6Review />;
      default: return <Step1 />;
    }
  };

 return (
    <ThemeProvider>
      <AppLayout>
        {renderStep()}
      </AppLayout>
    </ThemeProvider>
  );
}

export default App;
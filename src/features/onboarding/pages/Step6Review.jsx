import { useOnboardingStore } from "@/app/store/onboarding.store";
import NavigationButtons from "../components/common/NavigationButtons";

import ReviewSection from "../components/review/ReviewSection";
import Terms from "../components/review/Terms";
import Signature from "../components/review/Signature";

const Step6Review = () => {
  const { formData, nextStep } = useOnboardingStore();

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-10">
     <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-purple-500 uppercase mb-3.5 before:content-[''] before:w-6 before:h-[1.5px] before:bg-current before:rounded-full">
  STEP 06 / 06
</p>
        <h1 className="text-3xl font-semibold">
          Review & <span className="text-purple-400">submit</span>.
        </h1>
      </div>

      <ReviewSection title="Account & Identity" data={formData} />
      <ReviewSection title="Organization Info" data={formData} />
      <ReviewSection title="Address" data={formData} />
      <ReviewSection title="Roles & Permissions" data={formData} />
      <ReviewSection title="Compliance" data={formData} />

      <Terms />
      <Signature />

      <div className="mt-10">
        <button
          onClick={nextStep}
          className="px-6 py-3 bg-purple-500 rounded-lg"
        >
          Submit Application
        </button>
      </div>
    </div>
  );
};

export default Step6Review;
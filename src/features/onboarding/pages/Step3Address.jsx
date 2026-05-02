import { useOnboardingStore } from "@/app/store/onboarding.store";
import NavigationButtons from "../components/common/NavigationButtons";

import AddressForm from "../components/address/AddressForm";
import MapPreview from "../components/address/MapPreview";
import TimezoneSelect from "../components/address/TimezoneSelect";
import OperatingHours from "../components/schedule/OperatingHours";

const Step3Address = () => {
  const { nextStep } = useOnboardingStore();

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-10">
       <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-purple-500 uppercase mb-3.5 before:content-[''] before:w-6 before:h-[1.5px] before:bg-current before:rounded-full">
  STEP 03 / 06
</p>
        <h1 className="text-3xl font-semibold">
          Address & <span className="text-purple-400">location</span>.
        </h1>
        <p className="text-gray-400 mt-2">
          Where you operate and how we can reach you.
        </p>
      </div>

      {/* Address */}
      <AddressForm />

      {/* Map */}
      <MapPreview />

      {/* Timezone */}
      <TimezoneSelect />

      {/* Operating Hours */}
      <OperatingHours />

      {/* Navigation */}
      <div className="mt-10">
        <NavigationButtons onNext={nextStep} />
      </div>
    </div>
  );
};

export default Step3Address;
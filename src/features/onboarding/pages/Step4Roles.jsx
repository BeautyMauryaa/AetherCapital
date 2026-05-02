import { useOnboardingStore } from "@/app/store/onboarding.store";
import NavigationButtons from "../components/common/NavigationButtons";

import RoleSelector from "@/features/onboarding/roles/RoleSelector.jsx";
//import DepartmentList from "../components/departments/DepartmentList";
import PermissionMatrix from "../components/permission/PermissionMatrix";
import TwoFactor from "../components/security/TwoFactor";

const Step4Roles = () => {
  const { nextStep } = useOnboardingStore();

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-10">
    <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-purple-500 uppercase mb-3.5 before:content-[''] before:w-6 before:h-[1.5px] before:bg-current before:rounded-full">
  STEP 04 / 06
</p>
        <h1 className="text-3xl font-semibold">
          Roles & <span className="text-purple-400">permissions</span>.
        </h1>
        <p className="text-gray-400 mt-2">
          Define access levels and authentication preferences.
        </p>
      </div>

      <RoleSelector />
      <PermissionMatrix />
      <TwoFactor />

      <div className="mt-10">
        <NavigationButtons onNext={nextStep} />
      </div>
    </div>
  );
};

export default Step4Roles;
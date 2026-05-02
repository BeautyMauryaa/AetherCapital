import { useOnboardingStore } from "@/app/store/onboarding.store";
import NavigationButtons from "../components/common/NavigationButtons";
// import IndividualForm from "../components/forms/IndividualForm";
// import BusinessForm from "../components/forms/BusinessForm";
// import EnterpriseForm from "../components/forms/EnterpriseForm";
import TextInput from "../components/form/TextInput";
import SelectInput from "../components/form/SelectInput";
import SliderInput from "../components/form/SliderInput";
import ToggleSwitch from "../components/form/ToggleSwitch";

const Step2Personal = () => {
  const { formData, updateForm, nextStep, prevStep } = useOnboardingStore();

  const handleChange = (key, value) => {
    updateForm({ [key]: value });
  };

  return (
    <div className="max-w-4xl mx-auto">

      {/* Header */}
      <div className="mb-10">
     <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-purple-500 uppercase mb-3.5 before:content-[''] before:w-6 before:h-[1.5px] before:bg-current before:rounded-full">
  STEP 02 / 06
</p>
        <h1 className="text-3xl font-semibold">
          A bit about <span className="text-purple-400">you</span>.
        </h1>
        <p className="text-gray-400 mt-2">
          Personal details we'll use for verification and compliance.
        </p>
      </div>

      {/* Company Name */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <TextInput
          label="Legal name"
          value={formData.legalName || ""}
          onChange={(v) => handleChange("legalName", v)}
        />
        <TextInput
          label="Trade name"
          value={formData.tradeName || ""}
          onChange={(v) => handleChange("tradeName", v)}
        />
      </div>

      {/* Registration */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <TextInput
          label="Registration number"
          value={formData.registration || ""}
          onChange={(v) => handleChange("registration", v)}
        />
        <TextInput
          label="Date"
          value={formData.registrationDate || ""}
          onChange={(v) => handleChange("registrationDate", v)}
        />
      </div>

      {/* Industry */}
      <div className="mb-6">
        <SelectInput
          label="Industry"
          value={formData.industry || ""}
          options={["Fintech", "Biotech", "E-commerce", "SaaS"]}
          onChange={(v) => handleChange("industry", v)}
        />
      </div>

      {/* Employees */}
      <div className="mb-10">
        <SliderInput
          label="Number of employees"
          value={formData.employees || 10}
          onChange={(v) => handleChange("employees", v)}
        />
      </div>

      {/* Enterprise Section */}
      <div className="border-t border-white/10 pt-6 space-y-6">

        <h3 className="text-sm text-gray-400">Enterprise details</h3>

        <div className="grid grid-cols-2 gap-4">
          <TextInput
            label="Subsidiary count"
            value={formData.subsidiaries || ""}
            onChange={(v) => handleChange("subsidiaries", v)}
          />
          <TextInput
            label="Parent company"
            value={formData.parentCompany || ""}
            onChange={(v) => handleChange("parentCompany", v)}
          />
        </div>

        <ToggleSwitch
          label="Listed company?"
          checked={formData.isListed || false}
          onChange={(v) => handleChange("isListed", v)}
        />
      </div>

      {/* Navigation */}
      <div className="mt-10">
        <NavigationButtons onNext={nextStep} />
      </div>
    </div>
  );
};

export default Step2Personal;
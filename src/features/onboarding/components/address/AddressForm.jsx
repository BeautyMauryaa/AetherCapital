import { useOnboardingStore } from "@/app/store/onboarding.store";

const AddressForm = () => {
  const { formData, updateForm } = useOnboardingStore();

  const handle = (key, value) => {
    updateForm({ [key]: value });
  };

  return (
    <div className="space-y-4 mb-6">

      <input
        placeholder="Country"
        value={formData.country || ""}
        onChange={(e) => handle("country", e.target.value)}
        className="input"
      />

      <input
        placeholder="Address line 1"
        value={formData.address1 || ""}
        onChange={(e) => handle("address1", e.target.value)}
        className="input"
      />

      <input
        placeholder="Address line 2"
        value={formData.address2 || ""}
        onChange={(e) => handle("address2", e.target.value)}
        className="input"
      />

      <div className="grid grid-cols-3 gap-4">
        <input placeholder="City" className="input" />
        <input placeholder="State" className="input" />
        <input placeholder="ZIP" className="input" />
      </div>

    </div>
  );
};

export default AddressForm;
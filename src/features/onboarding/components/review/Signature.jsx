import { useOnboardingStore } from "@/app/store/onboarding.store";

const Signature = () => {
  const { formData, updateForm } = useOnboardingStore();

  return (
    <div className="mb-6">
      <p className="mb-2">E-Signature</p>

      <input
        placeholder="Type your full name"
        value={formData.signature || ""}
        onChange={(e) =>
          updateForm({ signature: e.target.value })
        }
        className="input"
      />
    </div>
  );
};

export default Signature;
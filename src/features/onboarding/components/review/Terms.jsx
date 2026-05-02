import { useOnboardingStore } from "@/app/store/onboarding.store";

const Terms = () => {
  const { formData, updateForm } = useOnboardingStore();

  return (
    <div className="mb-6">
      <label className="flex gap-2 items-center">
        <input
          type="checkbox"
          checked={formData.terms || false}
          onChange={(e) =>
            updateForm({ terms: e.target.checked })
          }
        />
        <span>I agree to Terms & Conditions</span>
      </label>
    </div>
  );
};

export default Terms;
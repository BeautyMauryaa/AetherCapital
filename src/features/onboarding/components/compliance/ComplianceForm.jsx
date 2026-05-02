import { useOnboardingStore } from "@/app/store/onboarding.store";

const ComplianceForm = () => {
  const { formData, updateForm } = useOnboardingStore();
  const score = formData.answers?.regulated ? 70 : 20;

  if (score < 50) return null;

  return (
    <div className="mb-8 p-4 bg-white/10 rounded">
      <p className="mb-3">Risk Review Required</p>
    
      <input
        placeholder="Compliance Officer"
        value={formData.officer || ""}
        onChange={(e) => updateForm({ officer: e.target.value })}
        className="input mb-3"
      />

      <input
        placeholder="Regulatory Body"
        value={formData.regulator || ""}
        onChange={(e) => updateForm({ regulator: e.target.value })}
        className="input"
      />
    </div>
  );
};

export default ComplianceForm;
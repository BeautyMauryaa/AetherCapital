import { useOnboardingStore } from "@/app/store/onboarding.store";
import "./ComplianceForm.css";

const ComplianceForm = () => {
  const { formData, updateForm } = useOnboardingStore();
  
  const score = formData.answers?.regulated ? 70 : 20;
  if (score < 50) return null;

  return (
    <div className="compliance-container">
      <div className="compliance-title">
        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
        Risk Review Required
      </div>
    
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
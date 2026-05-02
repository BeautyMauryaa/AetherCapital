import { useOnboardingStore } from "@/app/store/onboarding.store";

const RiskScore = () => {
  const { formData } = useOnboardingStore();
  const answers = formData.answers || {};

  let score = 0;

  if (answers.regulated) score += 20;
  if (answers.pii) score += 15;
  if (answers.payments) score += 20;

  const level =
    score > 60 ? "High" : score > 30 ? "Medium" : "Low";

  return (
    <div className="mb-6 p-4 bg-white/10 rounded">
      <p className="text-sm">Risk Score</p>
      <h2 className="text-xl">{score} / 100</h2>
      <p>{level} risk</p>
    </div>
  );
};

export default RiskScore;
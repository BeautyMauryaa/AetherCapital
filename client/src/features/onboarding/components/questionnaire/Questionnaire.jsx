import { useOnboardingStore } from "@/app/store/onboarding.store";

const questions = [
  {
    id: "regulated",
    text: "Operate in regulated industry?",
    weight: 20,
  },
  {
    id: "pii",
    text: "Handle PII data?",
    weight: 15,
  },
  {
    id: "payments",
    text: "Process international payments?",
    weight: 20,
  },
  {
    id: "minors_pii",
    text: "Do you handle PII data of minors?",
    weight: 15,
  },
  {
    id: "soc2",
    text: "Are you subject to SOC 2 compliance?",
    weight: 10,
  },
  {
    id: "crypto",
    text: "Do you accept or hold crypto-assets?",
    weight: 25,
  },
  {
    id: "sanctioned_regions",
    text: "Operate in or with sanctioned regions?",
    weight: 30,
  },
  {
    id: "pep_services",
    text: "Provide services to politically-exposed persons?",
    weight: 20,
  },
];

const Questionnaire = () => {
  const { formData, updateForm } = useOnboardingStore();
  const answers = formData.answers || {};

  const setAnswer = (id, value) => {
    updateForm({
      answers: {
        ...answers,
        [id]: value,
      },
    });
  };

  return (
    <div className="mb-8 space-y-4">
      {questions.map((q) => (
        <div key={q.id} className="flex justify-between p-4 bg-white/10 rounded">
          <span>{q.text}</span>

          <div className="flex gap-2">
            <button
              onClick={() => setAnswer(q.id, false)}
              className={`px-3 py-1 rounded ${
                answers[q.id] === false ? "bg-purple-500" : "bg-white/10"
              }`}
            >
              NO
            </button>

            <button
              onClick={() => setAnswer(q.id, true)}
              className={`px-3 py-1 rounded ${
                answers[q.id] === true ? "bg-purple-500" : "bg-white/10"
              }`}
            >
              YES
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Questionnaire;

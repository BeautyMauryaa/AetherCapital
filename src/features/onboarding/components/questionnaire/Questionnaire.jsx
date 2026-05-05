import React from "react";
import { useOnboardingStore } from "@/app/store/onboarding.store";
import "./Questionnaire.css";

const questions = [
  { id: "regulated", text: "Operate in regulated industry?", weight: 20 },
  { id: "pii", text: "Handle PII data?", weight: 15 },
  { id: "payments", text: "Process international payments?", weight: 20 },
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
        <div key={q.id} className="question-row">
          <span className="question-text opacity-80">{q.text}</span>

          <div className="flex gap-2">
            <button
              onClick={() => setAnswer(q.id, false)}
              className={`toggle-btn ${
                answers[q.id] === false ? "toggle-btn-on" : "toggle-btn-off"
              }`}
            >
              NO
            </button>

            <button
              onClick={() => setAnswer(q.id, true)}
              className={`toggle-btn ${
                answers[q.id] === true ? "toggle-btn-on" : "toggle-btn-off"
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
import { Info } from "lucide-react";
import { useOnboardingStore } from "@/app/store/onboarding.store";

const questions = [
  { id: "regulated", text: "Do you operate in a regulated industry?" },
  { id: "pii", text: "Do you handle PII data of minors?" },
  { id: "payments", text: "Do you process international payments?" },
  { id: "soc2", text: "Are you subject to SOC 2 compliance?" },
  { id: "crypto", text: "Do you accept or hold crypto-assets?" },
  { id: "sanctions", text: "Operate in or with sanctioned regions?" },
  { id: "pep", text: "Provide services to politically-exposed persons?" },
  { id: "jurisdiction", text: "Store data outside primary jurisdiction?" },
];

const Questionnaire = () => {
  const { formData, updateForm } = useOnboardingStore();
  const answers = formData.answers || {};

  const setAnswer = (id, value) => {
    updateForm({ answers: { ...answers, [id]: value } });
  };

  return (
    <div className="mt-12">
      <div className="flex items-center gap-4 mb-8">
        <h3 className="text-[11px] font-bold tracking-[0.25em] text-white/40 uppercase whitespace-nowrap">
          Risk Questionnaire
        </h3>
        <div className="w-full h-[1px] bg-white/5" />
      </div>

      <div className="space-y-3">
        {questions.map((q) => (
          <div key={q.id} className="group flex items-center justify-between p-5 bg-[#13131A] border border-white/[0.04] rounded-2xl transition-all hover:border-white/10 hover:bg-[#16161F]">
            <div className="flex items-center gap-3">
              <span className="text-[14px] text-white/80 font-medium group-hover:text-white transition-colors">{q.text}</span>
              <Info size={14} className="text-white/10 group-hover:text-white/30 transition-colors cursor-help" />
            </div>

            <div className="flex bg-[#0B0B0F] p-1 rounded-xl border border-white/[0.05]">
              <button
                onClick={() => setAnswer(q.id, false)}
                className={`px-5 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all
                  ${answers[q.id] === false ? "bg-white/10 text-white" : "text-white/20 hover:text-white/40"}`}
              >
                No
              </button>
              <button
                onClick={() => setAnswer(q.id, true)}
                className={`px-5 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all
                  ${answers[q.id] === true ? "bg-[#a855f7] text-white shadow-lg shadow-purple-500/20" : "text-white/20 hover:text-white/40"}`}
              >
                Yes
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Questionnaire;
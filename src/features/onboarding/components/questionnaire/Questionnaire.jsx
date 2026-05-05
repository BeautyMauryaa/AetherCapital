import { Info } from "lucide-react";
import { useOnboardingStore } from "@/app/store/onboarding.store";
import { useTheme } from "@/context/ThemeContext";

const questions = [
  { id: "regulated",   text: "Do you operate in a regulated industry?" },
  { id: "pii",         text: "Do you handle PII data of minors?" },
  { id: "payments",    text: "Do you process international payments?" },
  { id: "soc2",        text: "Are you subject to SOC 2 compliance?" },
  { id: "crypto",      text: "Do you accept or hold crypto-assets?" },
  { id: "sanctions",   text: "Operate in or with sanctioned regions?" },
  { id: "pep",         text: "Provide services to politically-exposed persons?" },
  { id: "jurisdiction",text: "Store data outside primary jurisdiction?" },
];

const Questionnaire = () => {
  const { formData, updateForm } = useOnboardingStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const answers = formData.answers || {};

  const setAnswer = (id, value) => {
    updateForm({ answers: { ...answers, [id]: value } });
  };

  return (
    <div className="mt-12">
      <div className="flex items-center gap-4 mb-8">
        <h3 className={`text-[11px] font-bold tracking-[0.25em] uppercase whitespace-nowrap
          ${isDark ? "text-white/40" : "text-slate-400"}`}>
          Risk Questionnaire
        </h3>
        <div className={`w-full h-[1px] ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
      </div>

      <div className="space-y-3">
        {questions.map((q) => (
          <div
            key={q.id}
            className={`group flex items-center justify-between p-5 border rounded-2xl transition-all
              ${isDark
                ? "bg-[#16161D] border-white/10 hover:border-white/20"
                : "bg-white border-slate-200 hover:border-slate-300"
              }`}
          >
            <div className="flex items-center gap-3">
              <span className={`text-[14px] font-medium transition-colors
                ${isDark ? "text-white/80 group-hover:text-white" : "text-slate-700 group-hover:text-slate-900"}`}>
                {q.text}
              </span>
              <Info size={14} className={`cursor-help transition-colors
                ${isDark ? "text-white/20 group-hover:text-white/40" : "text-slate-300 group-hover:text-slate-400"}`} />
            </div>

            <div className={`flex p-1 rounded-xl border
              ${isDark ? "bg-[#0B0B0E] border-white/10" : "bg-slate-100 border-slate-200"}`}>
              <button
                onClick={() => setAnswer(q.id, false)}
                className={`px-5 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all
                  ${answers[q.id] === false
                    ? isDark ? "bg-[#16161D] text-white" : "bg-white text-slate-900 shadow-sm"
                    : isDark ? "text-white/30 hover:text-white/60" : "text-slate-400 hover:text-slate-600"
                  }`}
              >
                No
              </button>
              <button
                onClick={() => setAnswer(q.id, true)}
                className={`px-5 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all
                  ${answers[q.id] === true
                    ? "bg-[#a855f7] text-white shadow-lg shadow-purple-500/20"
                    : isDark ? "text-white/30 hover:text-white/60" : "text-slate-400 hover:text-slate-600"
                  }`}
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
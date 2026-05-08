import React, { useState, useEffect } from 'react';
import { useOnboardingStore } from "@/app/store/onboarding.store";
import NavigationButtons from "../components/common/NavigationButtons";
import RiskScore from "../components/risk/RiskScore";
import Questionnaire from "../components/questionnaire/Questionnaire";
import DocumentChecklist from "../components/documents/DocumentChecklist";

function useIsDark() {
  const [isDark, setIsDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );
  useEffect(() => {
    const el = document.documentElement;
    const observer = new MutationObserver(() => {
      setIsDark(el.classList.contains('dark'));
    });
    observer.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

const Step5CorpCompliance = () => {
  const { formData, nextStep, prevStep } = useOnboardingStore();
  const isDark = useIsDark();
const handleContinue = () => {
  const requiredDocs = ['incorp_cert', 'tax_id', 'proof_addr', 'ubo_registry'];

  const missing = requiredDocs.filter((id) => {
    // File object still in formData (same session)
    const entry = formData.documents?.[id];
    if (entry instanceof File) return false; // ✅ present

    // Persisted metadata name written by store
    const persistedName = formData.documents__names?.[id];
    if (persistedName) return false; // ✅ present

    return true; // ❌ missing
  });

  if (missing.length > 0) {
    alert(`Please upload all required documents before continuing.\nMissing: ${missing.length} document(s).`);
    return;
  }

  nextStep();
};

  return (
    <div className="max-w-3xl pb-20 transition-colors duration-300">

      {/* Header */}
      <div className="mb-10">
        <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-purple-600 dark:text-purple-400 uppercase mb-3 before:content-[''] before:w-6 before:h-[1px] before:bg-purple-600 dark:before:bg-purple-400">
          STEP 05 / 06
        </p>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white mb-3">
          Compliance &amp; <span className="text-purple-600 dark:text-purple-400">risk</span>.
        </h1>
        <p className="text-[14px] text-slate-500 dark:text-slate-400">
          Upload entity documents and complete the regulatory assessment.
        </p>
      </div>

      {/* Risk Score + Questionnaire */}
      <div className="space-y-10 mb-12">
        <RiskScore />
        <Questionnaire />
      </div>

      {/* Document Checklist */}
      <div className="mb-5 border-t border-slate-200 dark:border-white/5 pt-10">
        <p className="text-[11px] font-bold tracking-[0.25em] text-slate-400 dark:text-slate-500 uppercase mb-6">
          Document Checklist
        </p>
        <DocumentChecklist />
      </div>

      {/* Navigation */}
      <div className="mt-16 pt-8 border-t border-slate-200 dark:border-white/5">
        <NavigationButtons onNext={handleContinue} onBack={prevStep} />
      </div>
    </div>
  );
};

export default Step5CorpCompliance;
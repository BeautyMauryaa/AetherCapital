// src/features/onboarding/pages/corporate/Step5CorpCompliance.jsx
//
// FIXES:
// 1. handleContinue now checks the correct shape — { name, driveUrl, fileId }
//    objects stored by the updated DocumentChecklist, not File instances or __names.
// 2. Validation error uses inline UI state instead of alert().
// 3. Shows exactly which document labels are missing, not just a count.

import React, { useState, useEffect } from "react";
import { useOnboardingStore } from "@/app/store/onboarding.store";
import NavigationButtons from "../../components/common/NavigationButtons";
import RiskScore from "../../components/risk/RiskScore";
import Questionnaire from "../../components/questionnaire/Questionnaire";
import DocumentChecklist from "../../components/documents/DocumentChecklist";
import { AlertCircle } from "lucide-react";

// Doc ID → human-readable label (matches DocumentChecklist DOCS array)
const DOC_LABELS = {
  incorp_cert: "Certificate of Incorporation",
  tax_id: "Tax Registration",
  proof_addr: "Proof of Address",
  ubo_registry: "Beneficial Owner Declaration",
};

const REQUIRED_DOCS = Object.keys(DOC_LABELS);

function useIsDark() {
  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark"),
  );
  useEffect(() => {
    const el = document.documentElement;
    const observer = new MutationObserver(() => {
      setIsDark(el.classList.contains("dark"));
    });
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

const Step5CorpCompliance = () => {
  const { formData, nextStep, prevStep } = useOnboardingStore();
  const isDark = useIsDark();
  const [docError, setDocError] = useState(null);

  // FIX 1: check the shape that DocumentChecklist actually writes:
  //   formData.documents[id] = { name, driveUrl, fileId, ... }
  //   A doc is "uploaded" only when driveUrl exists (real API call succeeded).
  const isDocUploaded = (id) => {
    const doc = formData.documents?.[id];
    // New shape from fixed DocumentChecklist — has driveUrl after real upload
    if (doc?.driveUrl) return true;
    // Legacy fallback: old shape stored name string directly
    if (typeof doc === "string" && doc.length > 0) return true;
    // Legacy fallback: __names written by old store logic
    if (formData.documents__names?.[id]) return true;
    return false;
  };

  const handleContinue = () => {
    const missing = REQUIRED_DOCS.filter((id) => !isDocUploaded(id));
    console.log("FORM DATA DOCS:", formData.documents);

    if (missing.length > 0) {
      // FIX 2+3: inline error state, no alert(), shows specific doc names
      setDocError(missing.map((id) => DOC_LABELS[id]));
      // Scroll to the document checklist so the user sees the error
      document
        .getElementById("doc-checklist")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setDocError(null);
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
          Compliance &amp;{" "}
          <span className="text-purple-600 dark:text-purple-400">risk</span>.
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
      <div
        id="doc-checklist"
        className="mb-5 border-t border-slate-200 dark:border-white/5 pt-10"
      >
        <p className="text-[11px] font-bold tracking-[0.25em] text-slate-400 dark:text-slate-500 uppercase mb-6">
          Document Checklist
        </p>

        <DocumentChecklist />

        {/* FIX 2+3: Inline validation error — no alert() */}
        {docError && (
          <div className="mt-4 flex items-start gap-3 px-4 py-3.5 rounded-xl border border-orange-500/30 bg-orange-500/5">
            <AlertCircle
              size={15}
              className="text-orange-400 flex-shrink-0 mt-0.5"
            />
            <div>
              <p className="text-[12px] font-semibold text-orange-400 mb-1">
                Please upload all required documents before continuing.
              </p>
              <ul className="space-y-0.5">
                {docError.map((label) => (
                  <li
                    key={label}
                    className="text-[11px] text-orange-400/80 flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-orange-400/60 flex-shrink-0" />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-16 pt-8 border-t border-slate-200 dark:border-white/5">
        <NavigationButtons onNext={handleContinue} onBack={prevStep} />
      </div>
    </div>
  );
};

export default Step5CorpCompliance;

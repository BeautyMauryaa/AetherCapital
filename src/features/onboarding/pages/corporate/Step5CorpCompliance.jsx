import React from 'react';
import { useOnboardingStore } from "@/app/store/onboarding.store";
import NavigationButtons from "../../components/common/NavigationButtons";
import { Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";

// Updated paths based on your file explorer (image_b7c095.png)
import RiskScore from "../../components/risk/RiskScore"; 
import Questionnaire from "../../components/questionnaire/Questionnaire";

const Step5CorpCompliance = () => {
  const { formData, nextStep, prevStep } = useOnboardingStore();

  const requiredDocs = [
    { id: 'incorp_cert', label: 'Certificate of Incorporation', desc: 'Official government-issued registration.' },
    { id: 'bylaws', label: 'Articles of Association', desc: 'Company bylaws and constitutional documents.' },
    { id: 'ubo_registry', label: 'UBO Declaration', desc: 'Proof of ultimate beneficial ownership (over 25%).' },
    { id: 'tax_id', label: 'Tax Identification Proof', desc: 'EIN, VAT, or local tax registration letter.' },
  ];

  return (
    <div className="max-w-3xl pb-20">
      {/* 1. Header */}
      <div className="mb-10">
        <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-[#a855f7] uppercase mb-3 before:content-[''] before:w-6 before:h-[1px] before:bg-[#a855f7]">
          STEP 05 / 06
        </p>
        <h1 className="text-3xl font-semibold text-white mb-3">
          Compliance & <span className="text-[#a855f7]">risk</span>.
        </h1>
        <p className="text-[14px] text-white/50">
          Upload entity documents and complete the regulatory assessment.
        </p>
      </div>

      {/* 2. Risk & Questionnaire Sections */}
      <div className="space-y-10 mb-12">
        <RiskScore />
        <Questionnaire />
      </div>

      {/* 3. Document Section Header */}
      <div className="flex items-center gap-4 mb-8 border-t border-white/5 pt-10">
        <h3 className="text-[10px] font-bold tracking-[0.25em] text-white/40 uppercase whitespace-nowrap">
          Entity Documentation
        </h3>
        <div className="w-full h-[1px] bg-white/5" />
      </div>

      {/* 4. Verification Notice */}
      <div className="bg-[#a855f7]/5 border border-[#a855f7]/20 rounded-2xl p-5 mb-10 flex gap-4 items-start">
        <div className="p-2 bg-[#a855f7]/10 rounded-lg">
          <AlertCircle size={18} className="text-[#a855f7]" />
        </div>
        <div>
          <h4 className="text-[13px] font-bold text-white mb-1">Upload Requirements</h4>
          <p className="text-[12px] text-white/40 leading-relaxed">
            All documents must be clear, high-resolution PDF or JPG files. Max file size 10MB per document.
          </p>
        </div>
      </div>

      {/* 5. Document Grid */}
      <div className="space-y-4">
        {requiredDocs.map((doc) => (
          <div 
            key={doc.id}
            className="group relative flex items-center justify-between p-5 bg-[#13131A] border border-white/[0.05] rounded-2xl transition-all hover:border-white/10"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/[0.03] rounded-xl flex items-center justify-center text-white/20 group-hover:text-[#a855f7] transition-colors">
                <FileText size={22} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white mb-0.5">{doc.label}</p>
                <p className="text-[11px] text-white/30">{doc.desc}</p>
              </div>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] hover:bg-white/[0.08] rounded-xl border border-white/[0.05] transition-all group/btn">
              <Upload size={14} className="text-white/40 group-hover/btn:text-white" />
              <span className="text-[11px] font-bold text-white/60 uppercase tracking-wider group-hover/btn:text-white">
                Upload
              </span>
            </button>
          </div>
        ))}
      </div>

      {/* 6. Navigation Buttons */}
      <div className="mt-16 pt-8 border-t border-white/5">
        <NavigationButtons onNext={nextStep} onBack={prevStep} />
      </div>
    </div>
  );
};

export default Step5CorpCompliance;
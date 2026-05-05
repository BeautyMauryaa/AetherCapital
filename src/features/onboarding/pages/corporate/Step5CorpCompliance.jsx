import React, { useRef, useState } from 'react';
import { useOnboardingStore } from "@/app/store/onboarding.store";
import NavigationButtons from "../../components/common/NavigationButtons";
import { Upload, CheckCircle2, Loader2 } from "lucide-react";
import RiskScore from "../../components/risk/RiskScore";
import Questionnaire from "../../components/questionnaire/Questionnaire";

import "./Step5CorpCompliance.css";

const Step5CorpCompliance = () => {
  const { formData, nextStep, prevStep, setFormData } = useOnboardingStore();
  const fileInputRefs = useRef({});
  const [uploadingId, setUploadingId] = useState(null);

  const requiredDocs = [
    { id: 'incorp_cert',  label: 'Certificate of Incorporation' },
    { id: 'tax_id',       label: 'Tax Registration'             },
    { id: 'proof_addr',   label: 'Proof of Address'             },
    { id: 'ubo_registry', label: 'Beneficial Owner Declaration' },
  ];

  const handleUploadClick = (docId) => {
    fileInputRefs.current[docId]?.click();
  };

  const handleFileChange = async (event, docId) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploadingId(docId);
    
    // Simulate API upload
    setTimeout(() => {
      setFormData({
        ...formData,
        documents: { ...(formData.documents || {}), [docId]: file.name },
      });
      setUploadingId(null);
    }, 1000);
  };

  return (
    <div className="compliance-container transition-colors duration-300">

      {/* Header */}
      <div className="mb-10">
        <p className="step-tag text-purple-600 dark:text-purple-400">
          STEP 05 / 06
        </p>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-beige-100 mb-3">
          Compliance & <span className="text-purple-600 dark:text-purple-400">risk</span>.
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

      {/* Document Checklist heading */}
      <div className="mb-5 border-t border-slate-200 dark:border-white/5 pt-10">
        <p className="text-[11px] font-bold tracking-[0.25em] text-slate-400 dark:text-slate-500 uppercase">
          Document Checklist
        </p>
      </div>

      {/* Document rows */}
      <div className="doc-list">
        {requiredDocs.map((doc) => {
          const isUploaded = !!formData.documents?.[doc.id];
          const isUploading = uploadingId === doc.id;

          return (
            <div
              key={doc.id}
              className={`doc-row ${isUploaded ? 'is-uploaded' : ''}`}
            >
              <input
                type="file"
                className="hidden"
                ref={(el) => (fileInputRefs.current[doc.id] = el)}
                onChange={(e) => handleFileChange(e, doc.id)}
                accept=".pdf,.jpg,.jpeg,.png"
              />

              {/* Label */}
              <span className="doc-label">
                {doc.label}
              </span>

              {/* Controls */}
              <div className="flex items-center gap-[10px]">
                {/* Status pill */}
                <span className="status-pill">
                  {isUploaded ? 'Uploaded' : 'Pending'}
                </span>

                {/* Upload button */}
                <button
                  onClick={() => handleUploadClick(doc.id)}
                  disabled={isUploading || isUploaded}
                  className={`upload-btn ${isUploaded ? 'is-uploaded' : ''}`}
                  style={{ opacity: isUploading ? 0.6 : 1 }}
                >
                  {isUploading ? (
                    <Loader2 size={13} className="animate-spin-custom text-purple-600" />
                  ) : isUploaded ? (
                    <CheckCircle2 size={13} />
                  ) : (
                    <Upload size={13} />
                  )}
                  <span>
                    {isUploading ? 'Uploading…' : isUploaded ? 'Uploaded' : 'Upload'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="mt-16 pt-8 border-t border-slate-200 dark:border-white/5">
        <NavigationButtons onNext={nextStep} onBack={prevStep} />
      </div>
    </div>
  );
};

export default Step5CorpCompliance;
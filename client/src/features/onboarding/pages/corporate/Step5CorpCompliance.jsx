import React, { useRef, useState, useEffect } from 'react';
import { useOnboardingStore } from "@/app/store/onboarding.store";
import NavigationButtons from "../../components/common/NavigationButtons";
import { Upload, CheckCircle2, Loader2 } from "lucide-react";
import RiskScore from "../../components/risk/RiskScore";
import Questionnaire from "../../components/questionnaire/Questionnaire";

function useIsDark() {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const el = document.documentElement;
    const observer = new MutationObserver(() => setIsDark(el.classList.contains('dark')));
    observer.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

const requiredDocs = [
  { id: 'incorp_cert',  label: 'Certificate of Incorporation' },
  { id: 'tax_id',       label: 'Tax Registration'             },
  { id: 'proof_addr',   label: 'Proof of Address'             },
  { id: 'ubo_registry', label: 'Beneficial Owner Declaration' },
];

const Step5CorpCompliance = () => {
  const { formData, nextStep, prevStep, updateForm } = useOnboardingStore();
  const fileInputRefs = useRef({});
  const [uploadingId, setUploadingId] = useState(null);
  const isDark = useIsDark();

  const handleUploadClick = (docId) => fileInputRefs.current[docId]?.click();

  const handleFileChange = (event, docId) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingId(docId);
    setTimeout(() => {
      // ✅ Store the actual File object, NOT file.name
      updateForm({
        documents: {
          ...(formData.documents || {}),
          [docId]: file,  // <-- File object goes here
        },
      });
      setUploadingId(null);
    }, 1200);
  };

  // ── Helper: get display name for a doc slot ──────────────────────────────
  // After our store fix, documents[docId] is a File object.
  // We also check documents__names[docId] for the persisted metadata name.
  const getDocName = (docId) => {
    const entry = formData.documents?.[docId];
    if (entry instanceof File) return entry.name;
    if (typeof entry === 'string') return entry; // fallback
    // Check persisted metadata written by new updateForm
    return formData.documents__names?.[docId] ?? null;
  };

  const handleNext = () => {
    const uploaded = requiredDocs.filter(
      (doc) => !!getDocName(doc.id)
    );
    if (uploaded.length < requiredDocs.length) {
      alert(`Please upload all required compliance documents to continue.`);
      return;
    }
    nextStep();
  };

  const tokens = isDark
    ? {
        row:         { background: 'rgba(30, 30, 46, 0.5)', border: '1px solid rgba(255,255,255,0.05)' },
        rowUploaded: { background: 'rgba(168, 85, 247, 0.05)', border: '1px solid rgba(168, 85, 247, 0.3)' },
        label:         { color: '#94a3b8' },
        labelUploaded: { color: '#e2e8f0' },
        pill:         { background: 'rgba(255,255,255,0.03)', color: '#64748b' },
        pillUploaded: { background: 'rgba(168, 85, 247, 0.2)', color: '#a855f7' },
      }
    : {
        row:         { background: '#ffffff', border: '1px solid #e2e8f0' },
        rowUploaded: { background: '#f5f3ff', border: '1px solid #ddd6fe' },
        label:         { color: '#64748b' },
        labelUploaded: { color: '#581c87' },
        pill:         { background: '#f1f5f9', color: '#94a3b8' },
        pillUploaded: { background: '#ede9fe', color: '#7c3aed' },
      };

  return (
    <div className="max-w-3xl pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <style>{`
        @keyframes custom-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: custom-spin 1s linear infinite; }
      `}</style>

      {/* Header */}
      <div className="mb-10">
        <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-[#a855f7] uppercase mb-4 before:content-[''] before:w-8 before:h-[1px] before:bg-[#a855f7]">
          STEP 05 / 06
        </p>
        <h1 className="text-[40px] font-bold leading-tight tracking-tight mb-4" style={{ color: 'var(--text-main)' }}>
          Compliance & <span className="text-[#a855f7]">risk.</span>
        </h1>
        <p className="text-[15px] opacity-50" style={{ color: 'var(--text-main)' }}>
          Regulatory verification and entity documentation.
        </p>
      </div>

      {/* Risk & Questionnaire */}
      <div className="space-y-12 mb-16">
        <RiskScore />
        <Questionnaire />
      </div>

      {/* Document Upload Rows */}
      <div className="mb-6">
        <h3 className="text-[11px] font-bold tracking-[0.25em] uppercase opacity-40 mb-6"
          style={{ color: 'var(--text-main)' }}>
          Required Documentation
        </h3>

        <div className="flex flex-col gap-3">
          {requiredDocs.map((doc) => {
            const docName    = getDocName(doc.id);
            const isUploaded = !!docName;
            const isUploading = uploadingId === doc.id;

            return (
              <div
                key={doc.id}
                className="group flex items-center justify-between px-6 h-[72px] rounded-2xl transition-all duration-300"
                style={isUploaded ? tokens.rowUploaded : tokens.row}
              >
                <input
                  type="file"
                  className="hidden"
                  ref={(el) => (fileInputRefs.current[doc.id] = el)}
                  onChange={(e) => handleFileChange(e, doc.id)}
                  accept=".pdf,.jpg,.jpeg,.png"
                />

                <div className="flex flex-col">
                  <span className="text-sm font-semibold transition-colors"
                    style={isUploaded ? tokens.labelUploaded : tokens.label}>
                    {doc.label}
                  </span>
                  {/* ✅ Shows filename whether File object or persisted name */}
                  {isUploaded && (
                    <span className="text-[10px] opacity-50 font-mono italic"
                      style={{ color: 'var(--text-main)' }}>
                      {docName}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className="px-3 py-1 rounded-full text-[10px] font-bold tracking-tighter uppercase"
                    style={isUploaded ? tokens.pillUploaded : tokens.pill}
                  >
                    {isUploaded ? 'Verified' : 'Required'}
                  </span>

                  <button
                    onClick={() => handleUploadClick(doc.id)}
                    disabled={isUploading || isUploaded}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                      isUploaded
                        ? 'bg-transparent text-[#a855f7] cursor-default'
                        : 'bg-[#a855f7] text-white hover:bg-[#9333ea] shadow-lg shadow-purple-500/20 active:scale-95'
                    }`}
                  >
                    {isUploading  ? <Loader2 size={14} className="animate-spin-slow" />
                     : isUploaded ? <CheckCircle2 size={14} />
                     :              <Upload size={14} />}
                    {isUploading ? 'Syncing...' : isUploaded ? 'Uploaded' : 'Upload PDF'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-20">
        <NavigationButtons onNext={handleNext} onBack={prevStep} />
      </div>
    </div>
  );
};

export default Step5CorpCompliance;
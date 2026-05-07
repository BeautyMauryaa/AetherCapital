import React, { useRef, useState, useEffect } from 'react';
import { useOnboardingStore } from "@/app/store/onboarding.store";
import NavigationButtons from "../../components/common/NavigationButtons";
import { Upload, CheckCircle2, Loader2 } from "lucide-react";

import RiskScore from "../../components/risk/RiskScore";
import Questionnaire from "../../components/questionnaire/Questionnaire";

/* ─── Detect dark mode by reading the <html> class ─── */
function useIsDark() {
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains('dark')
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
  const { formData, nextStep, prevStep, setFormData } = useOnboardingStore();
  const fileInputRefs = useRef({});
  const [uploadingId, setUploadingId] = useState(null);
  const isDark = useIsDark();

  const requiredDocs = [
    { id: 'incorp_cert',  label: 'Certificate of Incorporation' },
    { id: 'tax_id',       label: 'Tax Registration'             },
    { id: 'proof_addr',   label: 'Proof of Address'             },
    { id: 'ubo_registry', label: 'Beneficial Owner Declaration' },
  ];

  const handleUploadClick = (docId) => {
    fileInputRefs.current[docId]?.click();
  };

  const handleFileChange = async (event, docId) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploadingId(docId);
    setTimeout(() => {
      setFormData({
        ...formData,
        documents: { ...(formData.documents || {}), [docId]: file.name },
      });
      setUploadingId(null);
    }, 1000);
  };

  /* ── Inline style tokens based on actual dark/light state ── */
  const tokens = isDark
    ? {
        row:         { background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.08)' },
        rowUploaded: { background: '#052e16', border: '1px solid #166534' },
        label:       { color: '#e2e8f0' },
        labelUploaded: { color: '#86efac' },
        pill:        { background: '#334155', border: '1px solid #475569', color: '#94a3b8' },
        pillUploaded:{ background: '#14532d', border: '1px solid #166534', color: '#4ade80' },
        btn:         { background: '#334155', border: '1px solid #475569', color: '#e2e8f0', cursor: 'pointer' },
        btnUploaded: { background: '#14532d', border: '1px solid #166534', color: '#4ade80', cursor: 'default' },
      }
    : {
        row:         { background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
        rowUploaded: { background: '#f0fdf4', border: '1px solid #bbf7d0' },
        label:       { color: '#1e293b' },
        labelUploaded: { color: '#166534' },
        pill:        { background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#64748b' },
        pillUploaded:{ background: '#dcfce7', border: '1px solid #86efac', color: '#16a34a' },
        btn:         { background: '#ffffff', border: '1px solid #cbd5e1', color: '#374151', cursor: 'pointer' },
        btnUploaded: { background: '#dcfce7', border: '1px solid #86efac', color: '#16a34a', cursor: 'default' },
      };

  return (
    <div className="max-w-3xl pb-20 transition-colors duration-300">

      {/* ── Header ── */}
      <div className="mb-10">
        <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-purple-600 dark:text-purple-400 uppercase mb-3 before:content-[''] before:w-6 before:h-[1px] before:bg-purple-600 dark:before:bg-purple-400">
          STEP 05 / 06
        </p>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-beinge-100 mb-3">
          Compliance &amp; <span className="text-purple-600 dark:text-purple-400">risk</span>.
        </h1>
        <p className="text-[14px] text-slate-500 dark:text-slate-400">
          Upload entity documents and complete the regulatory assessment.
        </p>
      </div>

      {/* ── Risk Score + Questionnaire ── */}
      <div className="space-y-10 mb-12">
        <RiskScore />
        <Questionnaire />
      </div>

      {/* ── Document Checklist heading ── */}
      <div className="mb-5 border-t border-slate-200 dark:border-white/5 pt-10">
        <p className="text-[11px] font-bold tracking-[0.25em] text-slate-400 dark:text-slate-500 uppercase">
          Document Checklist
        </p>
      </div>

      {/* ── Document rows ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {requiredDocs.map((doc) => {
          const isUploaded  = !!formData.documents?.[doc.id];
          const isUploading = uploadingId === doc.id;

          return (
            <div
              key={doc.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 20px',
                height: '64px',
                borderRadius: '12px',
                transition: 'all 0.2s',
                ...(isUploaded ? tokens.rowUploaded : tokens.row),
              }}
            >
              <input
                type="file"
                style={{ display: 'none' }}
                ref={(el) => (fileInputRefs.current[doc.id] = el)}
                onChange={(e) => handleFileChange(e, doc.id)}
                accept=".pdf,.jpg,.jpeg,.png"
              />

              {/* Label */}
              <span style={{
                fontSize: '14px',
                fontWeight: 500,
                ...(isUploaded ? tokens.labelUploaded : tokens.label),
              }}>
                {doc.label}
              </span>

              {/* Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

                {/* Status pill */}
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '3px 12px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  ...(isUploaded ? tokens.pillUploaded : tokens.pill),
                }}>
                  {isUploaded ? 'Uploaded' : 'Pending'}
                </span>

                {/* Upload button */}
                <button
                  onClick={() => handleUploadClick(doc.id)}
                  disabled={isUploading || isUploaded}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 500,
                    transition: 'all 0.15s',
                    opacity: isUploading ? 0.6 : 1,
                    ...(isUploaded ? tokens.btnUploaded : tokens.btn),
                  }}
                >
                  {isUploading ? (
                    <Loader2 size={13} style={{ animation: 'spin 1s linear infinite', color: '#9333ea' }} />
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

      {/* ── Navigation ── */}
      <div className="mt-16 pt-8 border-t border-slate-200 dark:border-white/5">
        <NavigationButtons onNext={nextStep} onBack={prevStep} />
      </div>

    </div>
  );
};

export default Step5CorpCompliance;
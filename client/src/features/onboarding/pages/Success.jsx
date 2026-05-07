import { useOnboardingStore } from "@/app/store/onboarding.store";
import { CheckCircle, Download, RotateCcw } from "lucide-react";

const Success = () => {
  const reset = useOnboardingStore((s) => s.reset);
  const formData = useOnboardingStore((s) => s.formData);

  const referenceId = `AETH-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const submittedAt = new Date().toLocaleString();
  const applicantName = formData.firstName
    ? `${formData.firstName} ${formData.lastName || ''}`
    : formData.legalName || "Applicant";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ backgroundColor: 'var(--bg-main)' }}
    >
      {/* Icon */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-purple-500 flex items-center justify-center shadow-[0_0_60px_rgba(168,85,247,0.4)]">
          <CheckCircle size={44} className="text-white" strokeWidth={2.5} />
        </div>
        <div className="absolute inset-0 rounded-full bg-purple-400/20 scale-150 blur-xl" />
      </div>

      {/* Heading */}
      <h1
        className="text-4xl md:text-5xl font-bold mb-3 text-center"
        style={{ color: 'var(--text-main)' }}
      >
        Application submitted.
      </h1>
      <p
        className="text-[15px] text-center mb-12"
        style={{ color: 'var(--text-main)', opacity: 0.45 }}
      >
        We've received your information. Our team will reach out within 2 business days.
      </p>

      {/* Receipt Card */}
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden mb-10"
        style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
        }}
      >
        {[
          { label: "REFERENCE", value: referenceId },
          { label: "APPLICANT", value: applicantName },
          { label: "TYPE", value: formData.accountType || "Individual" },
          { label: "SUBMITTED", value: submittedAt },
          { label: "RISK TIER", value: "Low" },
        ].map((row, i) => (
          <div
            key={i}
            className="flex justify-between items-center px-8 py-5"
            style={{
              borderBottom: i < 4 ? '1px solid var(--border-color)' : 'none',
            }}
          >
            <span
              className="text-[11px] font-bold tracking-[0.15em] uppercase"
              style={{ color: 'var(--text-main)', opacity: 0.35 }}
            >
              {row.label}
            </span>
            <span
              className="text-[14px] font-medium"
              style={{ color: 'var(--text-main)' }}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-4">
        <button
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
          style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
          }}
        >
          <Download size={15} />
          Download receipt
        </button>

        <button
          onClick={reset}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#a855f7] hover:bg-[#9333ea] shadow-[0_4px_20px_rgba(168,85,247,0.3)] transition-all active:scale-[0.98]"
        >
          <RotateCcw size={15} />
          Start over
        </button>
      </div>
    </div>
  );
};

export default Success;
import { useOnboardingStore } from "@/app/store/onboarding.store";
import { CheckCircle, Download, RotateCcw } from "lucide-react";
import "./Success.css";

const Success = () => {
  const reset = useOnboardingStore((s) => s.reset);
  const formData = useOnboardingStore((s) => s.formData);

  // Generate reference and timestamp
  const referenceId = `AETH-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const submittedAt = new Date().toLocaleString();
  const applicantName = formData.firstName
    ? `${formData.firstName} ${formData.lastName || ''}`
    : formData.legalName || "Applicant";

  const receiptData = [
    { label: "REFERENCE", value: referenceId },
    { label: "APPLICANT", value: applicantName },
    { label: "TYPE", value: formData.accountType || "Individual" },
    { label: "SUBMITTED", value: submittedAt },
    { label: "RISK TIER", value: "Low" },
  ];

  return (
    <div className="suc-container">
      {/* Success Icon */}
      <div className="suc-icon-container">
        <div className="suc-icon-circle">
          <CheckCircle size={44} className="text-white" strokeWidth={2.5} />
        </div>
        <div className="suc-icon-glow" />
      </div>

      <h1 className="suc-title">Application submitted.</h1>
      <p className="suc-subtitle">
        We've received your information. Our team will reach out within 2 business days.
      </p>

      {/* Receipt Card */}
      <div className="suc-receipt-card">
        {receiptData.map((row, i) => (
          <div
            key={row.label}
            className="suc-receipt-row"
            style={{
              borderBottom: i < receiptData.length - 1 ? '1px solid var(--border-color)' : 'none',
            }}
          >
            <span className="suc-label">{row.label}</span>
            <span className="suc-value">{row.value}</span>
          </div>
        ))}
      </div>

      {/* Action Group */}
      <div className="suc-btn-group">
        <button className="suc-btn-secondary">
          <Download size={15} />
          Download receipt
        </button>

        <button onClick={reset} className="suc-btn-primary">
          <RotateCcw size={15} />
          Start over
        </button>
      </div>
    </div>
  );
};

export default Success;
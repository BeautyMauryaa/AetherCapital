// src/features/onboarding/pages/Success.jsx
//
// FIXES applied:
// 1. referenceId + submittedAt are now stable — generated once via useRef,
//    never recreated on re-render (previously changed every render).
// 2. Signature preview reads from submissionResult.signatureData (persisted
//    in the store by submitApplication) so it survives even after formData
//    is partially cleared. Falls back to formData.signatureData.
// 3. Download receipt now also embeds the Drive view link for the signature
//    when available, and appends document upload links.
// 4. Download <a> now gets appended + removed cleanly (no memory leak on
//    rapid clicks).

import { useOnboardingStore } from "@/app/store/onboarding.store";
import { CheckCircle, Download, RotateCcw } from "lucide-react";
import { useRef, useMemo } from "react";

const Success = () => {
  const reset            = useOnboardingStore((s) => s.reset);
  const formData         = useOnboardingStore((s) => s.formData);
  const submissionResult = useOnboardingStore((s) => s.submissionResult);  // set by submitApplication

  // ── FIX 1: stable values — generated once, never on re-render ─────────────
  const referenceId = useRef(
    submissionResult?.submissionId ||
    `AETH-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
  ).current;

  const submittedAt = useRef(
    submissionResult?.submittedAt
      ? new Date(submissionResult.submittedAt).toLocaleString()
      : new Date().toLocaleString()
  ).current;

  
  // ── FIX 2: signature from submissionResult (persists after partial reset) ──
  const signatureData =
    submissionResult?.signatureData ||
    formData.signatureData ||
    null;

  const signatureDriveUrl =
    submissionResult?.signatureDriveUrl ||
    formData.signatureDriveUrl ||
    null;

  const applicantName =
    submissionResult?.applicantName ||
    (formData.firstName
      ? `${formData.firstName} ${formData.lastName || ""}`.trim()
      : formData.legalName || formData.companyName || "Applicant");

  const riskScore = Object.values(formData.answers || {}).filter((v) => v === true).length * 12.5;
  const riskTier  = riskScore === 0 ? "Low" : riskScore <= 40 ? "Medium" : "High";

  const rows = [
    { label: "REFERENCE",  value: referenceId },
    { label: "APPLICANT",  value: applicantName },
    { label: "TYPE",       value: formData.accountType || submissionResult?.accountType || "Individual" },
    { label: "SUBMITTED",  value: submittedAt },
    { label: "RISK TIER",  value: riskTier },
  ];

  // ── Document upload links for receipt ─────────────────────────────────────
  const uploadedDocs = useMemo(() => {
    const docs = formData.documents || {};
    return Object.entries(docs)
      .filter(([, d]) => d?.name)
      .map(([id, d]) => ({ id, name: d.name, viewLink: d.driveViewLink || null }));
  }, [formData.documents]);

  // ── FIX 3+4: Download receipt ──────────────────────────────────────────────
  // const handleDownload = () => {
  //   const docLines = uploadedDocs.length
  //     ? [
  //         "",
  //         "───────────────────────────────────────",
  //         "DOCUMENTS SUBMITTED",
  //         "───────────────────────────────────────",
  //         ...uploadedDocs.map((d) =>
  //           `${d.id.replace(/_/g, " ").padEnd(20)} ✓ ${d.name}${d.viewLink ? `\n${"".padEnd(22)}${d.viewLink}` : ""}`
  //         ),
  //       ]
  //     : [];

  //   const sigLines = signatureDriveUrl
  //     ? [
  //         "",
  //         "───────────────────────────────────────",
  //         "SIGNATURE",
  //         "───────────────────────────────────────",
  //         `View online    ${signatureDriveUrl}`,
  //       ]
  //     : signatureData
  //       ? [
  //           "",
  //           "───────────────────────────────────────",
  //           "SIGNATURE",
  //           "───────────────────────────────────────",
  //           "(Embedded in submission — view in portal)",
  //         ]
  //       : [];

  //   const lines = [
  //     "═══════════════════════════════════════",
  //     "         AETHER CAPITAL",
  //     "      Application Receipt",
  //     "═══════════════════════════════════════",
  //     "",
  //     ...rows.map((r) => `${r.label.padEnd(14)} ${r.value}`),
  //     "",
  //     "───────────────────────────────────────",
  //     "PERSONAL DETAILS",
  //     "───────────────────────────────────────",
  //     `Name           ${applicantName}`,
  //     `Account Type   ${formData.accountType || "—"}`,
  //     `Nationality    ${formData.nationality || "—"}`,
  //     `Gender         ${formData.gender || "—"}`,
  //     "",
  //     "───────────────────────────────────────",
  //     "ADDRESS",
  //     "───────────────────────────────────────",
  //     `Address        ${formData.address1 || "—"}`,
  //     `City           ${formData.city || "—"}`,
  //     `Country        ${formData.country || "—"}`,
  //     `ZIP            ${formData.zip || "—"}`,
  //     `Timezone       ${formData.timezone || "—"}`,
  //     "",
  //     "───────────────────────────────────────",
  //     "COMPLIANCE",
  //     "───────────────────────────────────────",
  //     `Risk Score     ${riskScore}/100 (${riskTier})`,
  //     `2FA            ${formData.twoFA ? `Enabled · ${formData.tfaMethod || ""}` : "Disabled"}`,
  //     ...docLines,
  //     ...sigLines,
  //     "",
  //     "═══════════════════════════════════════",
  //     "Thank you for choosing Aether Capital.",
  //     "Our team will review your application",
  //     "within 2 business days.",
  //     "═══════════════════════════════════════",
  //   ];

  //   const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  //   const url  = URL.createObjectURL(blob);
  //   const a    = document.createElement("a");
  //   a.href     = url;
  //   a.download = `aether-receipt-${referenceId}.txt`;
  //   // FIX 4: append → click → remove immediately (no leak on rapid clicks)
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  //   URL.revokeObjectURL(url);
  // };

  const generateReceipt = useOnboardingStore((s) => s.generateReceipt);
const handleDownload  = () => generateReceipt();


  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ backgroundColor: "var(--bg-main)" }}
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
        style={{ color: "var(--text-main)" }}
      >
        Application submitted.
      </h1>
      <p
        className="text-[15px] text-center mb-12"
        style={{ color: "var(--text-main)", opacity: 0.45 }}
      >
        We've received your information. Our team will reach out within 2 business days.
      </p>

      {/* Receipt Card */}
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden mb-10"
        style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)" }}
      >
        {rows.map((row, i) => (
          <div
            key={i}
            className="flex justify-between items-center px-8 py-5"
            style={{ borderBottom: i < rows.length - 1 ? "1px solid var(--border-color)" : "none" }}
          >
            <span
              className="text-[11px] font-bold tracking-[0.15em] uppercase"
              style={{ color: "var(--text-main)", opacity: 0.35 }}
            >
              {row.label}
            </span>
            <span className="text-[14px] font-medium" style={{ color: "var(--text-main)" }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* FIX 2: Signature preview — stable, survives re-renders */}
      {signatureData && (
        <div
          className="w-full max-w-lg rounded-2xl overflow-hidden mb-10 p-6"
          style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)" }}
        >
          <p
            className="text-[10px] font-bold tracking-widest uppercase mb-4"
            style={{ color: "var(--text-main)", opacity: 0.35 }}
          >
            Authorized Signature
          </p>
          <img
            src={signatureData}
            alt="Signature"
            className="max-h-20 object-contain"
          />
          {signatureDriveUrl && (
            <a
              href={signatureDriveUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-[11px] text-purple-500 hover:underline"
            >
              View in Google Drive ↗
            </a>
          )}
        </div>
      )}

      {/* Buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--border-color)",
            color: "var(--text-main)",
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

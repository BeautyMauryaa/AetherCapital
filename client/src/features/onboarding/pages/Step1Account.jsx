import React, { useState } from "react";
import { useOnboardingStore } from "@/app/store/onboarding.store";
import { fileStore } from "@/app/store/fileStore.js";
import AccountTypeCard from "../components/AccountTypeCard";
import FileUpload from "../components/FileUpload";
import NavigationButtons from "../components/common/NavigationButtons";
import { useTheme } from "@/context/ThemeContext";
import { AlertCircle, TriangleAlert } from "lucide-react";

const Step1Account = () => {
  const { nextStep, updateForm, formData, reachedStep, reset } = useOnboardingStore();
  const [accountType, setAccountType] = useState(formData.accountType || "individual");
  const [error, setError] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [pendingType, setPendingType] = useState(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // ── Account type change handler ────────────────────────────────────────────
  const handleAccountTypeClick = (type) => {
    if (type === accountType) return; // same type, do nothing

    // If user has already gone past step 1, warn them
    if (reachedStep > 1) {
      setPendingType(type);
      setShowWarning(true);
      return;
    }

    setAccountType(type);
    updateForm({ accountType: type });
  };

  // User confirms account type change — reset everything
  const confirmTypeChange = () => {
    fileStore.clear();
    reset(); // clears all formData and steps
    setAccountType(pendingType);
    updateForm({ accountType: pendingType });
    setShowWarning(false);
    setPendingType(null);
  };

  const cancelTypeChange = () => {
    setShowWarning(false);
    setPendingType(null);
  };

  // ── Continue handler ───────────────────────────────────────────────────────
  const handleContinue = () => {
    const missingFields = [];
    if (!formData.profileImage__name && !fileStore.has("profileImage"))
      missingFields.push("Profile Photo");
    if (!formData.idFront__name && !fileStore.has("idFront"))
      missingFields.push("Front of ID");
    if (!formData.idBack__name && !fileStore.has("idBack"))
      missingFields.push("Back of ID");

    if (missingFields.length > 0) {
      setError(`Please upload: ${missingFields.join(", ")}`);
      setTimeout(() => setError(""), 4000);
      return;
    }

    setError("");
    updateForm({ accountType });
    nextStep();
  };

  const isDark2 = isDark;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-2 pt-6 sm:pt-10 pb-24 sm:pb-28">

      {/* ── Inline error toast ── */}
      {error && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-2xl shadow-xl animate-in slide-in-from-top-4 duration-300">
          <AlertCircle size={16} />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {/* ── Account type change warning modal ── */}
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-md mx-4 p-8 rounded-3xl shadow-2xl border
            ${isDark ? "bg-[#111116] border-white/10" : "bg-white border-slate-200"}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                <TriangleAlert size={20} className="text-orange-400" />
              </div>
              <h3 className={`text-[17px] font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                Change account type?
              </h3>
            </div>
            <p className={`text-[14px] mb-6 leading-relaxed ${isDark ? "text-white/60" : "text-slate-500"}`}>
              You've already filled in details for <strong>{accountType}</strong> account.
              Switching to <strong>{pendingType}</strong> will <span className="text-orange-400 font-semibold">clear all your progress</span> and start from Step 1.
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelTypeChange}
                className={`flex-1 py-3 rounded-xl text-[14px] font-semibold border transition-all
                  ${isDark
                    ? "border-white/10 text-white/70 hover:bg-white/5"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
              >
                Keep {accountType}
              </button>
              <button
                onClick={confirmTypeChange}
                className="flex-1 py-3 rounded-xl text-[14px] font-semibold bg-orange-500 hover:bg-orange-600 text-white transition-all"
              >
                Yes, switch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-[1.5px] bg-purple-500 rounded-full" />
        <span className="font-mono text-[11px] tracking-[0.2em] text-purple-500 uppercase font-bold">
          Step 01 / 06
        </span>
      </div>

      {/* Heading */}
      <h1 className={`text-[42px] font-bold leading-tight tracking-tight mb-3
        ${isDark ? "text-white" : "text-slate-900"}`}>
        Set up your{" "}
        <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
          account.
        </span>
      </h1>
      <p className={`text-[15px] mb-10 ${isDark ? "text-white/60" : "text-slate-500"}`}>
        Tell us who you are. We'll tailor the rest of the application to fit.
      </p>

      {/* Account Type */}
      <div className="mb-10">
        <p className={`text-[10px] font-bold tracking-[0.22em] uppercase mb-4
          ${isDark ? "text-white/40" : "text-slate-400"}`}>
          Account Type <span className="text-purple-500">*</span>
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <AccountTypeCard
            type="individual" title="Individual"
            description="Personal account for solo traders, founders, and self-employed individuals."
            active={accountType === "individual"}
            onClick={() => handleAccountTypeClick("individual")}
          />
          <AccountTypeCard
            type="business" title="Business"
            description="Registered companies, LLCs, and partnerships up to 200 employees."
            active={accountType === "business"}
            onClick={() => handleAccountTypeClick("business")}
          />
          <AccountTypeCard
            type="enterprise" title="Enterprise"
            description="Public companies, multi-entity organizations, and regulated institutions."
            active={accountType === "enterprise"}
            onClick={() => handleAccountTypeClick("enterprise")}
          />
        </div>

        {/* Lock indicator once user has progressed */}
        {reachedStep > 1 && (
          <p className={`mt-3 text-[11px] flex items-center gap-1.5
            ${isDark ? "text-white/25" : "text-slate-400"}`}>
            <span>🔒</span>
            Account type is locked after Step 1 — changing it will reset all progress.
          </p>
        )}
      </div>

      {/* Profile Photo */}
      <div className="mb-10">
        <p className={`text-[10px] font-bold tracking-[0.22em] uppercase mb-4
          ${isDark ? "text-white/40" : "text-slate-400"}`}>
          Profile Photo <span className="text-purple-500">*</span>
        </p>
        <div className={`p-4 rounded-2xl border-2 border-dashed transition-colors duration-200
          ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50/50"}`}>
          <FileUpload
            fieldName="profileImage"
            variant="photo"
            helperText="JPG or PNG · max 2MB · square crop recommended"
          />
        </div>
      </div>

      {/* Government ID */}
      <div className="mb-8">
        <p className={`text-[10px] font-bold tracking-[0.22em] uppercase mb-4
          ${isDark ? "text-white/40" : "text-slate-400"}`}>
          Government ID <span className="text-purple-500">*</span>
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <p className={`text-[10px] font-bold tracking-[0.18em] uppercase mb-3
              ${isDark ? "text-white/30" : "text-slate-400"}`}>
              Front of ID
            </p>
            <div className={`p-4 rounded-2xl border-2 border-dashed transition-colors duration-200
              ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50/50"}`}>
              <FileUpload fieldName="idFront" variant="id" sublabel="Upload front" accept="image/*,.pdf" />
            </div>
          </div>
          <div>
            <p className={`text-[10px] font-bold tracking-[0.18em] uppercase mb-3
              ${isDark ? "text-white/30" : "text-slate-400"}`}>
              Back of ID
            </p>
            <div className={`p-4 rounded-2xl border-2 border-dashed transition-colors duration-200
              ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50/50"}`}>
              <FileUpload fieldName="idBack" variant="id" sublabel="Upload back" accept="image/*,.pdf" />
            </div>
          </div>
        </div>
      </div>

      <NavigationButtons onNext={handleContinue} />
    </div>
  );
};

export default Step1Account;

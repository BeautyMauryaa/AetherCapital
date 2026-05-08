import React, { useState } from "react";
import { useOnboardingStore } from "@/app/store/onboarding.store";
import AccountTypeCard from "../components/AccountTypeCard";
import FileUpload from "../components/FileUpload";
import NavigationButtons from "../components/common/NavigationButtons";
import { useTheme } from "@/context/ThemeContext";
import { AlertCircle } from "lucide-react"; 

const Step1Account = () => {
  const { nextStep, updateForm, formData } = useOnboardingStore();
  const [accountType, setAccountType] = useState(formData.accountType || "individual");
  const [error, setError] = useState(""); 
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleContinue = () => {
    const missingFields = [];
    if (!formData.profileImage) missingFields.push("Profile Photo");
    if (!formData.idFront) missingFields.push("Front of ID");
    if (!formData.idBack) missingFields.push("Back of ID");

    if (missingFields.length > 0) {
      setError(`Please upload: ${missingFields.join(", ")}`);
      setTimeout(() => setError(""), 3000);
      return;
    }

    setError("");
    updateForm({ accountType });
    nextStep();
  };

  const styles = {
    stepContainer: {
      width: "100%",
      maxWidth: "56rem",
      marginLeft: "auto",
      marginRight: "auto",
      padding: "2.5rem 1rem 7rem 1rem",
    },
    stepIndicatorBox: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      marginBottom: "1.5rem",
    },
    stepLine: {
      width: "2rem",
      height: "1.5px",
      backgroundColor: "#a855f7",
      borderRadius: "9999px",
    },
    stepText: {
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
      fontSize: "11px",
      letterSpacing: "0.2em",
      color: "#a855f7",
      textTransform: "uppercase",
      fontWeight: "700",
    },
    accountTitle: {
      fontSize: "42px",
      fontWeight: "700",
      lineHeight: "1.1",
      letterSpacing: "-0.025em",
      marginBottom: "0.75rem",
    },
    accountSubtitle: {
      fontSize: "15px",
      marginBottom: "2.5rem",
      opacity: 0.6,
    },
    sectionLabel: {
      fontSize: "10px",
      fontWeight: "700",
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      marginBottom: "1rem",
    },
    subLabel: {
      fontSize: "10px",
      fontWeight: "700",
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      marginBottom: "0.75rem",
      opacity: 0.4,
    },
    // --- NEW BORDER STYLE ---
    uploadBorder: `p-4 rounded-2xl border-2 border-dashed transition-colors duration-200 ${
      isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50/50"
    }`,
  };

  return (
    <div style={styles.stepContainer} className="sm:px-6 lg:px-2 pt-6 sm:pt-10 pb-24 sm:pb-28">
      
      {error && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-2xl shadow-xl animate-in slide-in-from-top-4 duration-300">
          <AlertCircle size={18} />
          <span className="text-sm font-bold tracking-wide">{error}</span>
        </div>
      )}

      <div style={styles.stepIndicatorBox}>
        <div style={styles.stepLine} />
        <span style={styles.stepText}>Step 01 / 06</span>
      </div>

      <h1 style={styles.accountTitle} className={isDark ? "text-white" : "text-slate-900"}>
        Set up your{" "}
        <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
          account.
        </span>
      </h1>

      <p style={styles.accountSubtitle} className={isDark ? "text-white/60" : "text-slate-500"}>
        Tell us who you are. We'll tailor the rest of the application to fit.
      </p>

      {/* Account Type Section */}
      <div className="mb-10">
        <p style={styles.sectionLabel} className={isDark ? "text-white/40" : "text-slate-400"}>
          Account Type <span className="text-purple-500">*</span>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <AccountTypeCard type="individual" title="Individual" active={accountType === "individual"} onClick={() => setAccountType("individual")} />
          <AccountTypeCard type="business" title="Business" active={accountType === "business"} onClick={() => setAccountType("business")} />
          <AccountTypeCard type="enterprise" title="Enterprise" active={accountType === "enterprise"} onClick={() => setAccountType("enterprise")} />
        </div>
      </div>

      {/* Profile Photo Section with Border */}
      <div className="mb-10">
        <p style={styles.sectionLabel} className={isDark ? "text-white/40" : "text-slate-400"}>
          Profile Photo <span className="text-purple-500">*</span>
        </p>
        <div className={styles.uploadBorder}>
          <FileUpload
            fieldName="profileImage"
            variant="photo"
            helperText="JPG or PNG · max 2MB · square crop recommended"
          />
        </div>
      </div>

      {/* Government ID Section with Borders */}
      <div className="mb-8">
        <p style={styles.sectionLabel} className={isDark ? "text-white/40" : "text-slate-400"}>
          Government ID <span className="text-purple-500">*</span>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <p style={styles.subLabel} className={isDark ? "text-white/30" : "text-slate-400"}>Front of ID</p>
            <div className={styles.uploadBorder}>
              <FileUpload fieldName="idFront" variant="id" sublabel="Upload front" />
            </div>
          </div>
          <div>
            <p style={styles.subLabel} className={isDark ? "text-white/30" : "text-slate-400"}>Back of ID</p>
            <div className={styles.uploadBorder}>
              <FileUpload fieldName="idBack" variant="id" sublabel="Upload back" />
            </div>
          </div>
        </div>
      </div>

      <NavigationButtons onNext={handleContinue} />
    </div>
  );
};

export default Step1Account;
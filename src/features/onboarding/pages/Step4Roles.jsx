import { useState } from "react";
import { useOnboardingStore } from "@/app/store/onboarding.store";
import NavigationButtons from "../components/common/NavigationButtons";
import StepHeader from "../components/StepHeader";
import { useTheme } from "@/context/ThemeContext";
import { X, Plus, ShieldCheck } from "lucide-react";
import "./Step4Roles.css";

const SUGGESTIONS = ["Viewer", "Editor", "Billing", "Support", "Developer", "Compliance"];
const MODULES     = ["Dashboard", "Reports", "Users", "Billing", "Settings", "API"];
const LEVELS      = ["NONE", "READ", "WRITE", "ADMIN"];
const TFA_METHODS = ["SMS", "Authenticator App", "Hardware Key"];

const Step4Roles = () => {
  const { nextStep, updateForm, formData } = useOnboardingStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [roles, setRoles] = useState(formData.roles || ["Admin"]);
  const [roleInput, setRoleInput] = useState("");
  const [permissions, setPermissions] = useState(
    formData.permissions || { Dashboard: "READ", Reports: "READ" }
  );
  const [twoFA, setTwoFA] = useState(formData.twoFA ?? true);
  const [tfaMethod, setTfaMethod] = useState(formData.tfaMethod || "Authenticator App");

  const addRole = (r) => {
    const trimmed = r.trim();
    if (trimmed && !roles.includes(trimmed)) setRoles([...roles, trimmed]);
  };
  const removeRole = (r) => setRoles(roles.filter((x) => x !== r));
  const cyclePermission = (mod, level) => {
    setPermissions((prev) => ({ ...prev, [mod]: level }));
  };

  const handleContinue = () => {
    updateForm({ roles, permissions, twoFA, tfaMethod });
    nextStep();
  };

  return (
    <div className="s4-container">
      <StepHeader
        step={4}
        title="Roles &"
        highlight="permissions."
        subtitle="Define team access, permissions, and authentication preferences."
      />

      {/* ROLE ASSIGNMENT */}
      <div className="mb-12">
        <p className={`${styles.label} ${isDark ? "text-white/40" : "text-slate-400"}`}>
          Role Assignment <span className="text-purple-500">*</span>
        </p>
        <div className={`s4-role-container ${isDark ? "s4-dark-bg" : "s4-light-bg"}`}>
          {roles.map((r) => (
            <span key={r} className="s4-role-pill">
              {r}
              <button onClick={() => removeRole(r)} className="hover:text-purple-400 transition-colors">
                <X size={13} />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={roleInput}
            onChange={(e) => setRoleInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { addRole(roleInput); setRoleInput(""); }}}
            className={`flex-1 bg-transparent outline-none text-[14px] ${isDark ? "text-white placeholder:text-white/25" : "text-slate-900 placeholder:text-slate-400"}`}
            placeholder={roles.length === 0 ? "Type to add roles..." : ""}
          />
        </div>

        <div className="flex flex-wrap gap-2.5 mt-4">
          {SUGGESTIONS.filter(s => !roles.includes(s)).map(s => (
            <button
              key={s}
              onClick={() => addRole(s)}
              className={`s4-suggestion-pill ${isDark ? "border-white/10 bg-white/5 text-white/40 hover:text-purple-500 hover:border-purple-500/50" : "border-slate-300 bg-white text-slate-400 hover:text-purple-500 hover:border-purple-500/50"}`}
            >
              <Plus size={11} /> {s}
            </button>
          ))}
        </div>
      </div>

      {/* ACCESS LEVEL MATRIX */}
      <div className="mb-12">
        <p className={`s4-label ${isDark ? "text-white/40" : "text-slate-400"}`}>Access Level Matrix</p>
        <div className={`s4-matrix-card ${isDark ? "s4-dark-bg" : "s4-light-bg"}`}>
          <div className={`s4-matrix-header ${isDark ? "border-white/10 bg-white/[0.02]" : "border-slate-100 bg-slate-50"}`}>
            <span className={isDark ? "text-white/40" : "text-slate-400"}>Module</span>
            {LEVELS.map(l => (
              <span key={l} className={`text-center text-[10px] font-bold tracking-[0.18em] uppercase ${isDark ? "text-white/40" : "text-slate-400"}`}>{l}</span>
            ))}
          </div>

          {MODULES.map((mod, idx) => (
            <div key={mod} className={`s4-matrix-row ${idx < MODULES.length - 1 ? (isDark ? "border-b border-white/[0.05]" : "border-b border-slate-100") : ""} ${isDark ? "hover:bg-white/[0.01]" : "hover:bg-slate-50"}`}>
              <span className={`text-[14px] font-semibold ${isDark ? "text-white/80" : "text-slate-700"}`}>{mod}</span>
              {LEVELS.map(lvl => {
                const isActive = permissions[mod] === lvl;
                return (
                  <div key={lvl} className="flex justify-center">
                    <button
                      onClick={() => cyclePermission(mod, lvl)}
                      className={`s4-matrix-cell-btn ${isActive ? "bg-purple-600 text-white" : (isDark ? "text-white/30 hover:text-white/60" : "text-slate-300 hover:text-slate-600")}`}
                    >
                      {lvl}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* TWO-FACTOR AUTH */}
      <div className="mb-6">
        <div className={`s4-2fa-card ${isDark ? "s4-dark-bg" : "s4-light-bg"}`}>
          <div className="flex items-center gap-4">
            <div className={`s4-icon-box ${twoFA ? "bg-purple-500/10 text-purple-500" : (isDark ? "bg-white/5 text-white/20" : "bg-slate-100 text-slate-300")}`}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className={`text-[15px] font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Two-factor authentication</p>
              <p className={`text-[13px] mt-0.5 ${isDark ? "text-white/40" : "text-slate-400"}`}>Protect your workspace with extra security</p>
            </div>
          </div>
          <button
            onClick={() => setTwoFA(!twoFA)}
            className={`s4-toggle-bg ${twoFA ? "bg-purple-600" : (isDark ? "bg-white/10" : "bg-slate-200")}`}
          >
            <div className={`s4-toggle-knob ${twoFA ? "translate-x-7" : "translate-x-1"}`} />
          </button>
        </div>

        {twoFA && (
          <div className="mt-8 animate-in fade-in slide-in-from-top-2 duration-400">
            <p className={`s4-label ${isDark ? "text-white/40" : "text-slate-400"}`}>2FA Method <span className="text-purple-500">*</span></p>
            <div className="flex flex-wrap gap-3">
              {TFA_METHODS.map(m => (
                <button
                  key={m}
                  onClick={() => setTfaMethod(m)}
                  className={`s4-method-btn ${tfaMethod === m ? "bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-500/20 scale-[1.02]" : (isDark ? "s4-dark-bg text-white/60 hover:border-purple-500/50 hover:text-purple-500" : "bg-white border-slate-200 text-slate-500 hover:border-purple-500/50 hover:text-purple-500")}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <NavigationButtons onNext={handleContinue} />
    </div>
  );
};

export default Step4Roles;
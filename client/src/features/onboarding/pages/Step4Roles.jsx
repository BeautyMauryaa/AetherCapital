import { useState } from "react";
import { useOnboardingStore } from "@/app/store/onboarding.store";
import NavigationButtons from "../components/common/NavigationButtons";
import StepHeader from "../components/StepHeader";
import { useTheme } from "@/context/ThemeContext";
import { X, Plus, ShieldCheck } from "lucide-react";

const SUGGESTIONS = ["Viewer", "Editor", "Billing", "Support", "Developer", "Compliance"];
const MODULES     = ["Dashboard", "Reports", "Users", "Billing", "Settings", "API"];
const LEVELS      = ["NONE", "READ", "WRITE", "ADMIN"];
const TFA_METHODS = ["SMS", "Authenticator App", "Hardware Key"];

const Step4Roles = () => {
//   const { nextStep, updateForm, formData } = useOnboardingStore();
const {
  nextStep,
  updateForm,
  formData,
  currentStep,
} = useOnboardingStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [roles, setRoles]         = useState(formData.roles || ["Admin"]);
  const [roleInput, setRoleInput] = useState("");
  const [departments, setDepartments] = useState(formData.departments || []);
  const [permissions, setPermissions] = useState(
    formData.permissions || { Dashboard: "READ", Reports: "READ" }
  );
  const [twoFA, setTwoFA]         = useState(formData.twoFA ?? true);
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
    updateForm({ roles, permissions, twoFA, tfaMethod, departments });
    nextStep();
  };

  const labelClass = `text-[10px] font-bold tracking-[0.22em] uppercase mb-4
    ${isDark ? "text-white/40" : "text-slate-400"}`;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-2 pt-6 sm:pt-10 pb-24 sm:pb-28">

      <StepHeader
        step={4}
        title="Roles &"
        highlight="permissions."
        subtitle="Define team access, permissions, and authentication preferences."
      />

      {/* ROLE ASSIGNMENT */}
      <div className="mb-12">
        <p className={labelClass}>Role Assignment <span className="text-purple-500">*</span></p>
        <div className={`w-full min-h-[56px] px-3 py-2.5 rounded-xl border flex flex-wrap gap-2 items-center focus-within:border-purple-500/50 transition-all cursor-text
          ${isDark
            ? "bg-[#16161D] border-white/10"
            : "bg-white border-slate-200"
          }`}>
          {roles.map((r) => (
            <span key={r} className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-500 text-[12px] font-semibold">
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
            className={`flex-1 bg-transparent outline-none text-[14px]
              ${isDark ? "text-white placeholder:text-white/25" : "text-slate-900 placeholder:text-slate-400"}`}
            placeholder={roles.length === 0 ? "Type to add roles..." : ""}
          />
        </div>

        {/* Suggestion pills */}
        <div className="flex flex-wrap gap-2.5 mt-4">
          {SUGGESTIONS.filter(s => !roles.includes(s)).map(s => (
            <button
              key={s}
              onClick={() => addRole(s)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-dashed text-[11px] transition-all
                ${isDark
                  ? "border-white/10 bg-white/5 text-white/40 hover:text-purple-500 hover:border-purple-500/50"
                  : "border-slate-300 bg-white text-slate-400 hover:text-purple-500 hover:border-purple-500/50"
                }`}>
              <Plus size={11} /> {s}
            </button>
          ))}
        </div>
      </div>

      {/* ACCESS LEVEL MATRIX */}
      <div className="mb-12">
        <p className={labelClass}>Access Level Matrix</p>
        <div className={`w-full rounded-2xl border overflow-hidden shadow-sm
          ${isDark ? "bg-[#16161D] border-white/10" : "bg-white border-slate-200"}`}>

          {/* Header */}
          <div className={`grid grid-cols-5 px-6 py-3.5 border-b
            ${isDark ? "border-white/10 bg-white/[0.02]" : "border-slate-100 bg-slate-50"}`}>
            <span className={`text-[10px] font-bold tracking-[0.18em] uppercase
              ${isDark ? "text-white/40" : "text-slate-400"}`}>Module</span>
            {LEVELS.map(l => (
              <span key={l} className={`text-center text-[10px] font-bold tracking-[0.18em] uppercase
                ${isDark ? "text-white/40" : "text-slate-400"}`}>{l}</span>
            ))}
          </div>

          {/* Rows */}
          {MODULES.map((mod, idx) => (
            <div
              key={mod}
              className={`grid grid-cols-5 items-center px-6 py-4 transition-colors
                ${idx < MODULES.length - 1
                  ? isDark ? "border-b border-white/[0.05]" : "border-b border-slate-100"
                  : ""}
                ${isDark ? "hover:bg-white/[0.01]" : "hover:bg-slate-50"}`}
            >
              <span className={`text-[14px] font-semibold
                ${isDark ? "text-white/80" : "text-slate-700"}`}>{mod}</span>
              {LEVELS.map(lvl => {
                const isActive = permissions[mod] === lvl;
                return (
                  <div key={lvl} className="flex justify-center">
                    <button
                      onClick={() => cyclePermission(mod, lvl)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider transition-all
                        ${isActive
                          ? "bg-purple-600 text-white"
                          : isDark
                            ? "text-white/30 hover:text-white/60"
                            : "text-slate-300 hover:text-slate-600"
                        }`}
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
        <div className={`flex items-center justify-between px-6 py-5 border rounded-2xl transition-all
          ${isDark ? "bg-[#16161D] border-white/10" : "bg-white border-slate-200"}`}>
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-lg transition-colors
              ${twoFA
                ? "bg-purple-500/10 text-purple-500"
                : isDark ? "bg-white/5 text-white/20" : "bg-slate-100 text-slate-300"
              }`}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className={`text-[15px] font-semibold
                ${isDark ? "text-white" : "text-slate-900"}`}>
                Two-factor authentication
              </p>
              <p className={`text-[13px] mt-0.5
                ${isDark ? "text-white/40" : "text-slate-400"}`}>
                Protect your workspace with extra security
              </p>
            </div>
          </div>

          <button
            onClick={() => setTwoFA(!twoFA)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200
              ${twoFA ? "bg-purple-600" : isDark ? "bg-white/10" : "bg-slate-200"}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200
              ${twoFA ? "translate-x-7" : "translate-x-1"}`}
            />
          </button>
        </div>

        {twoFA && (
          <div className="mt-8 animate-in fade-in slide-in-from-top-2 duration-400">
            <p className={labelClass}>2FA Method <span className="text-purple-500">*</span></p>
            <div className="flex flex-wrap gap-3">
              {TFA_METHODS.map(m => (
                <button
                  key={m}
                  onClick={() => setTfaMethod(m)}
                  className={`px-6 py-3 rounded-xl text-[14px] font-semibold border transition-all
                    ${tfaMethod === m
                      ? "bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-500/20 scale-[1.02]"
                      : isDark
                        ? "bg-[#16161D] border-white/10 text-white/60 hover:border-purple-500/50 hover:text-purple-500"
                        : "bg-white border-slate-200 text-slate-500 hover:border-purple-500/50 hover:text-purple-500"
                    }`}
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

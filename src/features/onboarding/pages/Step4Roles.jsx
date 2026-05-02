import { useState } from "react";
import { useOnboardingStore } from "@/app/store/onboarding.store";
import NavigationButtons from "../components/common/NavigationButtons";
import { X, Plus, ShieldCheck } from "lucide-react";

/* ─── constants ─────────────────────────────────────── */
const SUGGESTIONS = ["Viewer", "Editor", "Billing", "Support", "Developer", "Compliance"];
const MODULES     = ["Dashboard", "Reports", "Users", "Billing", "Settings", "API"];
const LEVELS      = ["NONE", "READ", "WRITE", "ADMIN"];
const TFA_METHODS = ["SMS", "Authenticator App", "Hardware Key"];

/* ─── section label ─────────────────────────────────── */
const SectionLabel = ({ children, required }) => (
  <p className="text-[10px] font-bold tracking-[0.22em] text-white/40 uppercase mb-4">
    {children}{required && <span className="text-purple-500 ml-1">*</span>}
  </p>
);

/* ─── component ─────────────────────────────────────── */
const Step4Roles = () => {
  const { nextStep, updateForm, formData } = useOnboardingStore();

  /* role tags */
  const [roles, setRoles]         = useState(formData.roles       || ["Admin"]);
  const [roleInput, setRoleInput] = useState("");

  /* permissions — default Dashboard & Reports to READ */
  const [permissions, setPermissions] = useState(
    formData.permissions || { Dashboard: "READ", Reports: "READ" }
  );

  /* 2FA */
  const [twoFA, setTwoFA]           = useState(formData.twoFA       ?? true);
  const [tfaMethod, setTfaMethod]   = useState(formData.tfaMethod   || "Authenticator App");

  /* draft-saved flash */
  const [draftSaved, setDraftSaved] = useState(false);

  /* ── role helpers ── */
  const addRole = (r) => {
    const trimmed = r.trim();
    if (trimmed && !roles.includes(trimmed)) setRoles([...roles, trimmed]);
  };
  const removeRole   = (r) => setRoles(roles.filter((x) => x !== r));
  const handleRoleKey = (e) => {
    if ((e.key === "Enter" || e.key === ",") && roleInput.trim()) {
      e.preventDefault();
      addRole(roleInput);
      setRoleInput("");
    }
  };

  /* ── permission cycle ── */
  const cyclePermission = (mod, level) => {
    setPermissions((prev) => ({ ...prev, [mod]: level }));
  };

  /* ── continue ── */
  const handleContinue = () => {
    updateForm({ roles, permissions, twoFA, tfaMethod });
    nextStep();
  };

  /* draft save simulation */
  const handleDraftSave = () => {
    updateForm({ roles, permissions, twoFA, tfaMethod });
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-2 pt-10 pb-28">

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-[1.5px] bg-purple-500 rounded-full" />
        <span className="font-mono text-[11px] tracking-[0.2em] text-purple-500 uppercase font-bold">
          Step 04 / 06
        </span>
      </div>

      {/* Heading */}
      <h1 className="text-[42px] font-bold leading-tight tracking-tight mb-3">
        Roles &{" "}
        <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
          permissions.
        </span>
      </h1>
      <p className="text-[15px] text-white/45 mb-10">
        Define team access, permissions, and authentication preferences.
      </p>

      {/* ── ROLE ASSIGNMENT ── */}
      <div className="mb-10">
        <SectionLabel required>Role Assignment</SectionLabel>

        {/* Tag input box */}
        <div
          className="w-full min-h-[52px] px-3 py-2.5 rounded-xl bg-[#111118] border border-white/[0.08]
            flex flex-wrap gap-2 items-center
            focus-within:border-purple-500/50 transition-all duration-200 cursor-text"
          onClick={() => document.getElementById("role-input").focus()}
        >
          {roles.map((r) => (
            <span
              key={r}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg
                bg-purple-500/20 border border-purple-500/30 text-purple-300
                text-[12px] font-medium"
            >
              {r}
              <button
                onClick={(e) => { e.stopPropagation(); removeRole(r); }}
                className="hover:text-white transition-colors"
              >
                <X size={13} />
              </button>
            </span>
          ))}
          <input
            id="role-input"
            type="text"
            value={roleInput}
            onChange={(e) => setRoleInput(e.target.value)}
            onKeyDown={handleRoleKey}
            placeholder={roles.length === 0 ? "Type to add roles..." : ""}
            className="flex-1 min-w-[120px] bg-transparent border-none outline-none
              text-[14px] text-white placeholder:text-white/20"
          />
        </div>

        {/* Suggestion pills */}
        <div className="flex flex-wrap gap-2.5 mt-4">
          {SUGGESTIONS.filter((s) => !roles.includes(s)).map((s) => (
            <button
              key={s}
              onClick={() => addRole(s)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full
                border border-dashed border-white/[0.12] text-white/40
                hover:border-white/30 hover:text-white/70
                text-[11px] font-medium transition-all duration-200"
            >
              <Plus size={11} className="text-white/30" />
              {s}
            </button>
          ))}
        </div>
        <p className="text-[12px] text-white/25 mt-3">
          Type to add a custom role or pick from suggestions below
        </p>
      </div>

      {/* ── ACCESS LEVEL MATRIX ── */}
      <div className="mb-8">
        <SectionLabel>Access Level Matrix</SectionLabel>

        <div className="w-full rounded-2xl border border-white/[0.07] overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-5 px-6 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
            <span className="text-[10px] font-bold tracking-[0.18em] text-white/25 uppercase">Module</span>
            {LEVELS.map((l) => (
              <span key={l} className="text-center text-[10px] font-bold tracking-[0.18em] text-white/25 uppercase">
                {l}
              </span>
            ))}
          </div>

          {/* Data rows */}
          {MODULES.map((mod, idx) => {
            const active = permissions[mod] || "NONE";
            return (
              <div
                key={mod}
                className={`grid grid-cols-5 items-center px-6 py-4
                  ${idx < MODULES.length - 1 ? "border-b border-white/[0.04]" : ""}
                  hover:bg-white/[0.01] transition-colors`}
              >
                {/* Module name */}
                <span className="text-[14px] font-medium text-white/80">{mod}</span>

                {/* Permission cells */}
                {LEVELS.map((lvl) => {
                  const isActive = active === lvl;
                  /* teal/cyan for READ when active, dark for NONE when active, subtle for others */
                  const activeStyle =
                    lvl === "READ"
                      ? "bg-[#0d3d3d] text-teal-300 border border-teal-500/40 shadow-[0_0_12px_rgba(45,212,191,0.12)]"
                      : lvl === "NONE"
                      ? "bg-[#1a1a2a] text-white/60 border border-white/10"
                      : lvl === "WRITE"
                      ? "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                      : "bg-purple-500/15 text-purple-300 border border-purple-500/30";

                  return (
                    <div key={lvl} className="flex justify-center">
                      <button
                        onClick={() => cyclePermission(mod, lvl)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider transition-all duration-200
                          ${isActive
                            ? activeStyle
                            : "text-white/15 hover:text-white/35 border border-transparent"
                          }`}
                      >
                        {lvl}
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        <p className="text-[12px] text-white/25 mt-3">
          Click each cell to cycle through permission levels
        </p>
      </div>

      {/* ── TWO-FACTOR AUTH ── */}
      <div className="mb-6">
        {/* 2FA toggle card */}
        <div className="flex items-center justify-between px-5 py-4
          bg-[#111118] border border-white/[0.07] rounded-2xl">
          <div className="flex items-center gap-3">
            <ShieldCheck
              size={20}
              className={`flex-shrink-0 transition-colors ${twoFA ? "text-purple-400" : "text-white/20"}`}
            />
            <div>
              <p className="text-[14px] font-medium text-white/90">Two-factor authentication</p>
              <p className="text-[12px] text-white/35 mt-0.5">Strongly recommended for all accounts</p>
            </div>
          </div>

          {/* Toggle switch */}
          <button
            onClick={() => setTwoFA(!twoFA)}
            className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none flex-shrink-0
              ${twoFA
                ? "bg-purple-600 shadow-[0_0_12px_rgba(139,92,246,0.4)]"
                : "bg-white/10"
              }`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm
              transition-all duration-300
              ${twoFA ? "left-7" : "left-1 opacity-50"}`}
            />
          </button>
        </div>

        {/* 2FA Method (only when enabled) */}
        {twoFA && (
          <div className="mt-6">
            <SectionLabel required>2FA Method</SectionLabel>
            <div className="flex flex-wrap gap-3">
              {TFA_METHODS.map((m) => (
                <button
                  key={m}
                  onClick={() => setTfaMethod(m)}
                  className={`px-5 py-2.5 rounded-full text-[13px] font-medium border transition-all duration-200
                    ${tfaMethod === m
                      ? "bg-gradient-to-r from-purple-600 to-violet-600 border-transparent text-white shadow-[0_0_16px_rgba(139,92,246,0.35)]"
                      : "bg-transparent border-white/[0.12] text-white/55 hover:border-white/25 hover:text-white/80"
                    }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fixed bottom nav — overrides base NavigationButtons to add "Draft saved" */}
      <div className="fixed bottom-0 left-[300px] right-0 z-50 flex items-center justify-between
        px-12 py-5 bg-[#0B0B0F]/90 backdrop-blur-sm border-t border-white/[0.05]">
        {/* Draft saved indicator */}
        <div className={`flex items-center gap-2 text-[13px] transition-all duration-300
          ${draftSaved ? "opacity-100" : "opacity-0"}`}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7L5.5 10.5L12 3" stroke="#a78bfa" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-purple-400 font-medium">Draft saved</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Save draft button — subtle */}
          <button
            onClick={handleDraftSave}
            className="px-4 py-2 text-[13px] text-white/40 hover:text-white/70 transition-colors"
          >
            Save draft
          </button>

          {/* Back */}
          <button
            onClick={() => useOnboardingStore.getState().prevStep()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
              text-white/60 hover:text-white hover:bg-white/[0.06]
              border border-transparent hover:border-white/[0.1] transition-all duration-200"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>

          {/* Continue */}
          <button
            onClick={handleContinue}
            className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-semibold
              bg-gradient-to-r from-purple-600 to-violet-600
              hover:from-purple-500 hover:to-violet-500
              text-white shadow-[0_4px_24px_rgba(139,92,246,0.35)]
              hover:shadow-[0_4px_28px_rgba(139,92,246,0.5)]
              transition-all duration-200 active:scale-[0.98]"
          >
            Continue
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step4Roles;
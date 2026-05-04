import { useState } from "react";
import { useOnboardingStore } from "@/app/store/onboarding.store";
import { X, Plus, ShieldCheck, Trash2 } from "lucide-react";

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
  
  // Identify if this is an enterprise flow
  const isEnterprise = formData?.accountType?.toLowerCase() === "enterprise";

  /* role tags */
  const [roles, setRoles]         = useState(formData.roles || ["Admin"]);
  const [roleInput, setRoleInput] = useState("");

  /* Enterprise Departments */
  const [departments, setDepartments] = useState(formData.departments || []);
  const [isAddingDept, setIsAddingDept] = useState(false);
  const [newDept, setNewDept] = useState({ name: "", head: "", size: 1 });

  /* permissions */
  const [permissions, setPermissions] = useState(
    formData.permissions || { Dashboard: "READ", Reports: "READ" }
  );

  /* 2FA */
  const [twoFA, setTwoFA]           = useState(formData.twoFA ?? true);
  const [tfaMethod, setTfaMethod]   = useState(formData.tfaMethod || "Authenticator App");

  const [draftSaved, setDraftSaved] = useState(false);

  /* ── department helpers ── */
  const addDepartment = () => {
    if (newDept.name.trim()) {
      setDepartments([...departments, newDept]);
      setNewDept({ name: "", head: "", size: 1 });
      setIsAddingDept(false);
    }
  };

  const removeDepartment = (index) => {
    setDepartments(departments.filter((_, i) => i !== index));
  };

  /* ── role helpers ── */
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

  const handleDraftSave = () => {
    updateForm({ roles, permissions, twoFA, tfaMethod, departments });
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
      <div className="mb-12">
        <SectionLabel required>Role Assignment</SectionLabel>
        <div className="w-full min-h-[52px] px-3 py-2.5 rounded-xl bg-[#111118] border border-white/[0.08] flex flex-wrap gap-2 items-center focus-within:border-purple-500/50 transition-all cursor-text">
          {roles.map((r) => (
            <span key={r} className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[12px] font-medium">
              {r}
              <button onClick={() => removeRole(r)} className="hover:text-white"><X size={13} /></button>
            </span>
          ))}
          <input 
            type="text" value={roleInput} 
            onChange={(e) => setRoleInput(e.target.value)} 
            onKeyDown={(e) => { if(e.key === 'Enter') { addRole(roleInput); setRoleInput(""); }}}
            className="flex-1 bg-transparent outline-none text-[14px] text-white placeholder:text-white/20"
            placeholder={roles.length === 0 ? "Type to add roles..." : ""}
          />
        </div>
        <div className="flex flex-wrap gap-2.5 mt-4">
          {SUGGESTIONS.filter(s => !roles.includes(s)).map(s => (
            <button key={s} onClick={() => addRole(s)} className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-dashed border-white/[0.12] text-white/40 hover:text-white/70 text-[11px] transition-all">
              <Plus size={11} /> {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── DEPARTMENT HIERARCHY (Enterprise Only) ── */}
      {isEnterprise && (
        <div className="mb-12 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-6">
            <SectionLabel>Department Hierarchy</SectionLabel>
            <button 
              onClick={() => setIsAddingDept(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg transition-all"
            >
              <Plus size={14} className="text-purple-400" />
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">Add Department</span>
            </button>
          </div>

          {isAddingDept && (
            <div className="grid grid-cols-[2fr_1.5fr_0.5fr_auto] gap-4 p-5 bg-[#111118] border border-purple-500/30 rounded-2xl mb-6 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
              <input 
                placeholder="e.g. Risk & Compliance" 
                value={newDept.name}
                onChange={(e) => setNewDept({...newDept, name: e.target.value})}
                className="bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-purple-500/50 outline-none" 
              />
              <input 
                placeholder="Head Name" 
                value={newDept.head}
                onChange={(e) => setNewDept({...newDept, head: e.target.value})}
                className="bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-purple-500/50 outline-none" 
              />
              <input 
                type="number" 
                value={newDept.size}
                onChange={(e) => setNewDept({...newDept, size: parseInt(e.target.value) || 1})}
                className="bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-purple-500/50 outline-none" 
              />
              <div className="flex gap-2">
                <button onClick={addDepartment} className="bg-purple-600 hover:bg-purple-500 text-white px-4 rounded-xl text-[10px] font-bold uppercase transition-colors">Add</button>
                <button onClick={() => setIsAddingDept(false)} className="text-white/40 hover:text-white px-2 text-[10px] font-bold uppercase">Cancel</button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {departments.map((dept, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl group hover:border-white/10 transition-all">
                <div className="flex gap-8">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/30 uppercase font-bold tracking-tighter">Dept Name</span>
                    <span className="text-sm text-white font-medium">{dept.name}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/30 uppercase font-bold tracking-tighter">Head</span>
                    <span className="text-sm text-white/70">{dept.head || "Not assigned"}</span>
                  </div>
                </div>
                <button onClick={() => removeDepartment(idx)} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 rounded-lg transition-all">
                  <Trash2 size={16} className="text-red-400/60 hover:text-red-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ACCESS LEVEL MATRIX ── */}
      <div className="mb-12">
        <SectionLabel>Access Level Matrix</SectionLabel>
        <div className="w-full rounded-2xl border border-white/[0.07] overflow-hidden">
          <div className="grid grid-cols-5 px-6 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
            <span className="text-[10px] font-bold tracking-[0.18em] text-white/25 uppercase">Module</span>
            {LEVELS.map(l => <span key={l} className="text-center text-[10px] font-bold tracking-[0.18em] text-white/25 uppercase">{l}</span>)}
          </div>
          {MODULES.map((mod, idx) => (
            <div key={mod} className={`grid grid-cols-5 items-center px-6 py-4 ${idx < MODULES.length - 1 ? "border-b border-white/[0.04]" : ""} hover:bg-white/[0.01] transition-colors`}>
              <span className="text-[14px] font-medium text-white/80">{mod}</span>
              {LEVELS.map(lvl => {
                const isActive = permissions[mod] === lvl;
                return (
                  <div key={lvl} className="flex justify-center">
                    <button 
                      onClick={() => cyclePermission(mod, lvl)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider transition-all ${isActive ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "text-white/15 hover:text-white/35"}`}
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

      {/* ── TWO-FACTOR AUTH ── */}
      <div className="mb-6">
        <div className="flex items-center justify-between px-5 py-4 bg-[#111118] border border-white/[0.07] rounded-2xl">
          <div className="flex items-center gap-3">
            <ShieldCheck size={20} className={twoFA ? "text-purple-400" : "text-white/20"} />
            <div>
              <p className="text-[14px] font-medium text-white/90">Two-factor authentication</p>
              <p className="text-[12px] text-white/35 mt-0.5">Strongly recommended for all accounts</p>
            </div>
          </div>
          <button onClick={() => setTwoFA(!twoFA)} className={`relative w-12 h-6 rounded-full transition-all ${twoFA ? "bg-purple-600 shadow-[0_0_12px_rgba(139,92,246,0.4)]" : "bg-white/10"}`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${twoFA ? "left-7" : "left-1 opacity-50"}`} />
          </button>
        </div>
        {twoFA && (
          <div className="mt-6">
            <SectionLabel required>2FA Method</SectionLabel>
            <div className="flex flex-wrap gap-3">
              {TFA_METHODS.map(m => (
                <button key={m} onClick={() => setTfaMethod(m)} className={`px-5 py-2.5 rounded-full text-[13px] font-medium border transition-all ${tfaMethod === m ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-[0_0_16px_rgba(139,92,246,0.35)]" : "border-white/[0.12] text-white/55"}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-[300px] right-0 z-50 flex items-center justify-between px-12 py-5 bg-[#0B0B0F]/90 backdrop-blur-sm border-t border-white/[0.05]">
        <div className={`flex items-center gap-2 text-[13px] transition-all ${draftSaved ? "opacity-100" : "opacity-0"}`}>
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-purple-400 font-medium">Draft saved</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleDraftSave} className="px-4 py-2 text-[13px] text-white/40 hover:text-white/70 transition-colors">Save draft</button>
          <button onClick={() => useOnboardingStore.getState().prevStep()} className="px-5 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/[0.1] transition-all">Back</button>
          <button onClick={handleContinue} className="px-7 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white shadow-[0_4px_24px_rgba(139,92,246,0.35)] transition-all">Continue</button>
        </div>
      </div>
    </div>
  );
};

export default Step4Roles;
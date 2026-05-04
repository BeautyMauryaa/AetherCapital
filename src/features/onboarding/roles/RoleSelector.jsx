import React from 'react';
import { X, Plus } from 'lucide-react';
import { useOnboardingStore } from "@/app/store/onboarding.store";

const SUGGESTIONS = ["Viewer", "Editor", "Billing", "Support", "Developer", "Compliance"];

const RoleSelector = () => {
  const { formData, updateForm } = useOnboardingStore();
  const selectedRoles = formData.roles || ["Admin"]; // Defaulting to Admin as seen in image

  const toggleRole = (role) => {
    const updated = selectedRoles.includes(role)
      ? selectedRoles.filter((r) => r !== role)
      : [...selectedRoles, role];
    updateForm({ roles: updated });
  };

  return (
    <div className="mb-10 w-full">
      {/* Label Styling matched to Aether Capital */}
      <p className="text-[10px] text-white/40 font-bold tracking-[0.2em] uppercase mb-4">
        Role AsOnboardment <span className="text-purple-500">*</span>
      </p>

      {/* Role Input Area */}
      <div className="w-full min-h-[56px] bg-white/[0.03] border border-white/10 rounded-xl p-3 flex flex-wrap gap-2 items-center focus-within:border-purple-500/50 transition-colors">
        {selectedRoles.map((role) => (
          <div 
            key={role}
            className="flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 text-purple-300 px-3 py-1.5 rounded-lg text-xs font-medium animate-in fade-in zoom-in duration-200"
          >
            {role}
            <button onClick={() => toggleRole(role)} className="hover:text-white">
              <X size={14} />
            </button>
          </div>
        ))}
        <input 
          type="text"
          placeholder={selectedRoles.length === 0 ? "Type to add roles..." : ""}
          className="bg-transparent border-none outline-none text-sm text-white flex-1 min-w-[120px] placeholder:text-white/20"
        />
      </div>

      {/* Suggestions Pills (Dashed style from image) */}
      <div className="flex flex-wrap gap-3 mt-4">
        {SUGGESTIONS.map((role) => {
          const isSelected = selectedRoles.includes(role);
          if (isSelected) return null;

          return (
            <button
              key={role}
              onClick={() => toggleRole(role)}
              className="group flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-dashed border-white/10 text-white/40 hover:border-white/30 hover:text-white/60 transition-all text-[11px] font-medium"
            >
              <Plus size={12} className="text-white/20 group-hover:text-white/40" />
              {role}
            </button>
          );
        })}
      </div>
      
      <p className="text-[10px] text-white/20 mt-3 tracking-wide">
        Type to add a custom role or pick from suggestions below
      </p>
    </div>
  );
};

export default RoleSelector;
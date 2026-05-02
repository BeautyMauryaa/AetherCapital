import React from 'react';
import { useOnboardingStore } from "@/app/store/onboarding.store";

const MODULES = ["Dashboard", "Reports", "Users", "Billing", "Settings", "API"];
const LEVELS = ["NONE", "READ", "WRITE", "ADMIN"];

const PermissionMatrix = () => {
  const { formData, updateForm } = useOnboardingStore();
  
  // Defaulting to "READ" for some modules to match the image precisely
  const permissions = formData.permissions || {
    Dashboard: "READ",
    Reports: "READ"
  };

  const setPermission = (module, level) => {
    updateForm({
      permissions: { ...permissions, [module]: level },
    });
  };

  return (
    <div className="mt-10 w-full">
      <h3 className="text-[10px] text-white/40 font-bold tracking-[0.2em] uppercase mb-6">
        Access Level Matrix
      </h3>

      <div className="w-full bg-white/2 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        {/* Table Header */}
        <div className="grid grid-cols-5 border-b border-white/5 bg-white/2 px-6 py-4">
          <div className="text-[10px] text-white/20 font-bold tracking-widest uppercase">Module</div>
          {LEVELS.map((level) => (
            <div key={level} className="text-center text-[10px] text-white/20 font-bold tracking-widest uppercase">
              {level}
            </div>
          ))}
        </div>

        {/* Table Body */}
        <div className="divide-y divide-white/5">
          {MODULES.map((mod) => (
            <div key={mod} className="grid grid-cols-5 items-center px-6 py-4 hover:bg-white/1 transition-colors">
              {/* Module Name */}
              <div className="text-sm font-medium text-white/70">{mod}</div>

              {/* Permission Buttons */}
              {LEVELS.map((lvl) => {
                const isActive = permissions[mod] === lvl;
                return (
                  <div key={lvl} className="flex justify-center">
                    <button
                      onClick={() => setPermission(mod, lvl)}
                      className={`relative min-w-17.5 py-1.5 rounded-lg text-[10px] font-bold tracking-tighter transition-all duration-300
                        ${isActive 
                          ? "text-blue-400 bg-blue-500/10 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]" 
                          : "text-white/10 hover:text-white/30"}`}
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
      
      <p className="text-[9px] text-white/20 mt-4 text-center italic tracking-wide">
        Click each cell to cycle through permission levels
      </p>
    </div>
  );
};

export default PermissionMatrix;
import React from "react";
import { useOnboardingStore } from "@/app/store/onboarding.store";

const MODULES = ["Dashboard", "Reports", "Users", "Billing", "Settings", "API"];
const LEVELS = ["NONE", "READ", "WRITE", "ADMIN"];

const PermissionMatrix = () => {
  const { formData, updateForm } = useOnboardingStore();
  const permissions = formData.permissions || { Dashboard: "READ", Reports: "READ" };

  const setPermission = (module, level) => {
    updateForm({ permissions: { ...permissions, [module]: level } });
  };

  return (
    <div className="mt-10 w-full">
      <h3 className="text-[10px] text-muted font-bold tracking-[0.2em] uppercase mb-6">
        Access Level Matrix
      </h3>

      <div className="w-full bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
        <div className="grid grid-cols-5 border-b border-border bg-card/50 px-6 py-4">
          <div className="text-[10px] text-muted font-bold tracking-widest uppercase">Module</div>
          {LEVELS.map((level) => (
            <div key={level} className="text-center text-[10px] text-muted font-bold tracking-widest uppercase">
              {level}
            </div>
          ))}
        </div>

        <div className="divide-y divide-border">
          {MODULES.map((mod) => (
            <div key={mod} className="grid grid-cols-5 items-center px-6 py-4 hover:bg-card/50 transition-colors">
              <div className="text-sm font-medium text-foreground/70">{mod}</div>
              {LEVELS.map((lvl) => {
                const isActive = permissions[mod] === lvl;
                return (
                  <div key={lvl} className="flex justify-center">
                    <button
                      onClick={() => setPermission(mod, lvl)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-tighter transition-all duration-300
                        ${isActive
                          ? "text-blue-400 bg-blue-500/10 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                          : "text-muted/40 hover:text-muted"}`}
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

      <p className="text-[9px] text-muted/50 mt-4 text-center italic tracking-wide">
        Click each cell to cycle through permission levels
      </p>
    </div>
  );
};

export default PermissionMatrix;
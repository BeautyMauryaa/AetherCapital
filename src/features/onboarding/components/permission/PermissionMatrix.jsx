import React from "react";
import { useOnboardingStore } from "@/app/store/onboarding.store";
import "./PermissionMatrix.css";

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
      <h3 className="text-[10px] text-main font-bold tracking-[0.2em] uppercase mb-6 opacity-40">
        Access Level Matrix
      </h3>

      <div className="matrix-container">
        {/* Header */}
        <div className="matrix-header">
          <div className="text-[10px] text-main font-bold tracking-widest uppercase opacity-40">Module</div>
          {LEVELS.map((level) => (
            <div key={level} className="text-center text-[10px] text-main font-bold tracking-widest uppercase opacity-40">
              {level}
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-border" style={{ borderColor: 'var(--border-color)' }}>
          {MODULES.map((mod) => (
            <div key={mod} className="matrix-row">
              <div className="text-sm font-medium text-main opacity-70">{mod}</div>
              {LEVELS.map((lvl) => {
                const isActive = permissions[mod] === lvl;
                return (
                  <div key={lvl} className="flex justify-center">
                    <button
                      onClick={() => setPermission(mod, lvl)}
                      className={`permission-btn ${
                        isActive ? "permission-btn-active" : "permission-btn-inactive"
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

      <p className="text-[9px] text-main opacity-30 mt-4 text-center italic tracking-wide">
        Select a cell to update access rights per module
      </p>
    </div>
  );
};

export default PermissionMatrix;
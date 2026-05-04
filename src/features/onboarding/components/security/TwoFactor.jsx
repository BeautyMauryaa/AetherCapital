import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useOnboardingStore } from "@/app/store/onboarding.store";

const METHODS = ["SMS", "Authenticator App", "Hardware Key"];

const TwoFactor = () => {
  const { formData, updateForm } = useOnboardingStore();

  const enabled = formData.twoFA ?? true; // Defaulting to true as seen in image
  const selectedMethod = formData.twoFAMethod || "Authenticator App";

  const handleToggle = () => updateForm({ twoFA: !enabled });
  const setMethod = (m) => updateForm({ twoFAMethod: m });

  return (
    <div className="mt-8 w-full space-y-8">
      
      {/* 2FA Toggle Container */}
      <div className="group flex items-center justify-between p-5 bg-white/2 border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all">
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-lg transition-colors ${enabled ? "text-purple-400 bg-purple-500/10" : "text-white/20 bg-white/5"}`}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-white/90">Two-factor authentication</p>
            <p className="text-[11px] text-white/30 mt-0.5">Strongly recommended for all accounts</p>
          </div>
        </div>

        {/* Custom Toggle Switch */}
        <button
          onClick={handleToggle}
          className={`relative w-11 h-6 rounded-full transition-all duration-300 focus:outline-none
            ${enabled ? "bg-purple-600 shadow-[0_0_10px_rgba(168,85,247,0.4)]" : "bg-white/10"}`}
        >
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm
            ${enabled ? "left-6" : "left-1 opacity-40"}`} 
          />
        </button>
      </div>

      {/* 2FA Method Selection (Only visible if enabled) */}
      <div className={`space-y-4 transition-all duration-500 ${enabled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
        <p className="text-[10px] text-white/40 font-bold tracking-[0.2em] uppercase">
          2FA Method <span className="text-purple-500">*</span>
        </p>

        <div className="flex flex-wrap gap-3">
          {METHODS.map((m) => {
            const isActive = selectedMethod === m;
            return (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 border
                  ${isActive 
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 border-purple-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] scale-105" 
                    : "bg-white/[0.03] border-white/5 text-white/40 hover:border-white/20 hover:text-white/60"}`}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TwoFactor;
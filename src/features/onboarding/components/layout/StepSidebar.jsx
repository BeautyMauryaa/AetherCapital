import React from 'react';
import { Check } from 'lucide-react';
import { useOnboardingStore } from "@/app/store/onboarding.store";
import { STEPS } from "@/features/onboarding/utils/stepConfig";

const StepSidebar = () => {
  const currentStep = useOnboardingStore((s) => s.step);
  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <aside className="w-[300px] min-h-screen bg-[#0B0B0F] border-r border-white/[0.06] p-8 flex flex-col text-white flex-shrink-0">

      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L17 6V14L10 18L3 14V6L10 2Z" fill="white" fillOpacity="0.9"/>
          </svg>
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-wide text-white">Aether Capital</h1>
          <p className="text-[10px] text-white/30 mt-0.5 font-medium tracking-[0.15em] uppercase">Onboarding · 2026</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <p className="text-[10px] text-white/40 font-bold tracking-[0.2em] uppercase">Application</p>
          <p className="text-[10px] text-white/50 font-mono">{Math.round(progress)}%</p>
        </div>
        <div className="h-[2px] w-full bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <nav className="flex flex-col gap-1">
        {STEPS.map((s) => {
          const isActive = currentStep === s.id;
          const isCompleted = currentStep > s.id;
          const isUpcoming = currentStep < s.id;

          return (
            <div
              key={s.id}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                ${isActive
                  ? 'bg-white/[0.07] border border-white/[0.08]'
                  : 'border border-transparent'
                }`}
            >
              {/* Left accent bar for active */}
              {isActive && (
                <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-purple-500 rounded-r-full shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
              )}

              {/* Step number / check circle */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300
                  ${isCompleted
                    ? 'bg-emerald-500 text-black'
                    : isActive
                    ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                    : 'bg-white/[0.06] text-white/25 border border-white/[0.08]'
                  }`}
              >
                {isCompleted ? <Check size={14} strokeWidth={3} /> : s.id < 10 ? `0${s.id}` : s.id}
              </div>

              {/* Labels */}
              <div className={`flex flex-col transition-opacity duration-300 ${isUpcoming ? 'opacity-35' : 'opacity-100'}`}>
                <span className={`text-[9px] font-bold tracking-[0.18em] uppercase mb-0.5
                  ${isActive ? 'text-purple-400' : 'text-white/30'}`}>
                  Step 0{s.id}
                </span>
                <span className={`text-[13px] font-medium leading-tight
                  ${isActive ? 'text-white' : isCompleted ? 'text-white/70' : 'text-white/40'}`}>
                  {s.title}
                </span>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-white/[0.06]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]" />
            <p className="text-[11px] text-white/30">
              Need help?{' '}
              <span className="text-white/70 font-medium">hello@aether.cap</span>
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default StepSidebar;
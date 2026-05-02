import React from 'react';
import { Check, Sun, Moon } from 'lucide-react';
import { useOnboardingStore } from "@/app/store/onboarding.store";
import { STEPS } from "@/features/onboarding/utils/stepConfig";

const StepSidebar = () => {
  const currentStep = useOnboardingStore((s) => s.step);
  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <aside className="w-[300px] min-h-screen bg-[#0B0B0F] border-r border-white/[0.06] p-8 flex flex-col text-white flex-shrink-0 font-sans">

      {/* Logo Area */}
      <div className="flex items-center gap-4 mb-12">
        <div className="w-10 h-10 bg-[#a855f7] rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M12 4L4 20H20L12 4Z" fill="#0B0B0F" stroke="#0B0B0F" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <h1 className="text-[15px] font-semibold tracking-wide text-white">Aether Capital</h1>
          <p className="text-[10px] text-white/40 mt-0.5 font-semibold tracking-[0.15em] uppercase">Onboarding · 2026</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-3">
          <p className="text-[10px] text-white/40 font-bold tracking-[0.2em] uppercase">Application</p>
          <p className="text-[11px] text-white font-bold">{Math.round(progress)}%</p>
        </div>
        <div className="h-[3px] w-full bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#a855f7] rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps List */}
      <nav className="flex flex-col gap-1.5">
        {STEPS.map((s) => {
          const isActive = currentStep === s.id;
          const isCompleted = currentStep > s.id;
          const isUpcoming = currentStep < s.id;

          return (
            <div
              key={s.id}
              className={`relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300
                ${isActive ? 'bg-[#181824] shadow-sm' : 'bg-transparent'}`}
            >
              {/* Left accent bar for active */}
              {isActive && (
                <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-[#a855f7] rounded-r-full shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
              )}

              {/* Step number / check circle - WITH DOUBLE LAYER FIX */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-all duration-300
                  ${isCompleted
                    ? 'bg-[#10b981] text-[#0B0B0F]'
                    : isActive
                    ? 'bg-[#a855f7] text-white ring-[1px] ring-[#a855f7] ring-offset-[3px] ring-offset-[#181824]' // Double layer effect
                    : 'border border-white/[0.08] text-white/30 bg-transparent'
                  }`}
              >
                {isCompleted ? <Check size={16} strokeWidth={3.5} /> : s.id < 10 ? `0${s.id}` : s.id}
              </div>

              {/* Labels - WITH FONT WEIGHT & COLOR FIX */}
              <div className="flex flex-col">
                <span className={`text-[10px] font-bold tracking-[0.15em] uppercase mb-0.5
                  ${isActive ? 'text-[#a855f7]' : isCompleted ? 'text-white/40' : 'text-white/20'}`}>
                  Step 0{s.id}
                </span>
                <span className={`text-[13px] leading-tight
                  ${isActive ? 'text-white font-medium' : isCompleted ? 'text-white/50 font-normal' : 'text-white/30 font-normal'}`}>
                  {s.title}
                </span>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer / Help & Theme Toggle */}
      <div className="mt-auto pt-6">
        <div className="flex items-center justify-between">
          
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_6px_#10b981]" />
            <p className="text-[12px] text-white/40">
              Need help?{' '}
              <span className="text-white/60 hover:text-white transition-colors cursor-pointer">hello@aether.cap</span>
            </p>
          </div>

          {/* Theme Toggle Component */}
          <div className="flex items-center gap-1 bg-[#15151A] p-1 rounded-full border border-white/[0.03]">
            <button className="p-1.5 rounded-full text-white/30 hover:text-white transition-colors">
              <Sun size={14} />
            </button>
            <button className="p-1.5 rounded-full bg-[#a855f7] text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]">
              <Moon size={14} fill="currentColor" />
            </button>
          </div>

        </div>
      </div>
      
    </aside>
  );
};

export default StepSidebar;
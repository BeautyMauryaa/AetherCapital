import React from 'react';
import { Check, Sun, Moon } from 'lucide-react';
import { useOnboardingStore } from "@/app/store/onboarding.store";
import { STEPS } from "@/features/onboarding/utils/stepConfig";
import { useTheme } from "@/context/ThemeContext";

const StepSidebar = () => {
  // Destructure setStep from the store to make handleStepClick work
  const { 
    step: currentStep, 
    reachedStep, 
    setStep 
  } = useOnboardingStore();
  
  const { theme, toggleTheme } = useTheme(); 
  const isDark = theme === 'dark';

  // Progress calculation
  const progress = ((reachedStep - 1) / (STEPS.length - 1)) * 100;

  const handleStepClick = (targetId) => {
    // Only allow clicking if the target step has been unlocked (reached)
    if (targetId <= reachedStep) {
      setStep(targetId);
    }
  };

  return (
    <aside className={`w-[300px] min-h-screen border-r transition-colors duration-300 p-8 flex flex-col flex-shrink-0 font-sans
      ${isDark 
        ? 'bg-[#0B0B0F] border-white/[0.06] text-white' 
        : 'bg-[#F9FAFB] border-black/[0.06] text-slate-900'}`} 
    >
      {/* Logo Area */}
      <div className="flex items-center gap-4 mb-12">
        <div className="w-10 h-10 bg-[#a855f7] rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M12 4L4 20H20L12 4Z" fill={isDark ? "#0B0B0F" : "#FFF"} stroke={isDark ? "#0B0B0F" : "#FFF"} strokeWidth="2" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <h1 className={`text-[15px] font-semibold tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>Aether Capital</h1>
          <p className={`text-[10px] mt-0.5 font-semibold tracking-[0.15em] uppercase ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Onboarding · 2026</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-3">
          <p className={`text-[10px] font-bold tracking-[0.2em] uppercase ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Application</p>
          <p className={`text-[11px] font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{Math.round(progress)}%</p>
        </div>
        <div className={`h-[3px] w-full rounded-full overflow-hidden ${isDark ? 'bg-white/[0.06]' : 'bg-slate-200'}`}>
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
          const isUnlocked = s.id <= reachedStep;
          const isCompleted = reachedStep > s.id && !isActive;

          return (
            <div
              key={s.id}
              onClick={() => handleStepClick(s.id)}
              className={`relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300
                ${isActive 
                  ? (isDark ? 'bg-[#181824]' : 'bg-white shadow-md border border-slate-100') 
                  : 'bg-transparent'
                }
                ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'}
              `}
            >
              {isActive && (
                <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-[#a855f7] rounded-r-full" />
              )}

              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-all duration-300
                  ${isCompleted
                    ? 'bg-[#10b981] text-white'
                    : isActive
                    ? 'bg-[#a855f7] text-white'
                    : (isDark ? 'border border-white/[0.08] text-white/30' : 'border border-slate-200 text-slate-400')
                  }`}
              >
                {isCompleted ? <Check size={16} strokeWidth={3.5} /> : s.id < 10 ? `0${s.id}` : s.id}
              </div>

              <div className="flex flex-col">
                <span className={`text-[10px] font-bold tracking-[0.15em] uppercase mb-0.5
                  ${isActive ? 'text-[#a855f7]' : (isDark ? 'text-white/40' : 'text-slate-400')}`}>
                  Step 0{s.id}
                </span>
                <span className={`text-[13px] leading-tight
                  ${isActive 
                    ? (isDark ? 'text-white' : 'text-slate-900 font-semibold') 
                    : (isDark ? 'text-white/50' : 'text-slate-500')}`}>
                  {s.title}
                </span>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer / Theme Toggle */}
      <div className="mt-auto pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
            <p className={`text-[12px] ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
              Need help?{' '}
              <span className={`transition-colors cursor-pointer ${isDark ? 'text-white/60 hover:text-white' : 'text-slate-900 hover:text-purple-600'}`}>hello@aether.cap</span>
            </p>
          </div>

          <div className={`flex items-center gap-1 p-1 rounded-full border transition-colors
            ${isDark ? 'bg-[#15151A] border-white/[0.03]' : 'bg-slate-200 border-slate-300'}`}>
            
            <button 
              type="button"
              onClick={() => theme !== 'light' && toggleTheme()}
              className={`p-1.5 rounded-full transition-all duration-300 ${
                theme === 'light' 
                ? 'bg-white text-orange-500 shadow-sm' 
                : 'text-white/30 hover:text-white'
              }`}
            >
              <Sun size={14} fill={theme === 'light' ? "currentColor" : "none"} />
            </button>

            <button 
              type="button"
              onClick={() => theme !== 'dark' && toggleTheme()}
              className={`p-1.5 rounded-full transition-all duration-300 ${
                isDark 
                ? 'bg-[#a855f7] text-white shadow-lg' 
                : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Moon size={14} fill={isDark ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default StepSidebar;
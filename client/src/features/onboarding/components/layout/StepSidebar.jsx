import React, { useState } from 'react';
import { Check, Sun, Moon, ChevronDown, Menu, X } from 'lucide-react';
import { useOnboardingStore } from "@/app/store/onboarding.store";
import { STEPS } from "@/features/onboarding/utils/stepConfig";
import { useTheme } from "@/context/ThemeContext";

const StepSidebar = () => {
  const { step: currentStep, reachedStep, setStep } = useOnboardingStore();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  
  // Mobile Menu State
  const [isOpen, setIsOpen] = useState(false);

  const progress = ((reachedStep - 1) / (STEPS.length - 1)) * 100;

  const handleStepClick = (targetId) => {
    if (targetId <= reachedStep) {
      setStep(targetId);
      setIsOpen(false); // Close mobile menu on select
    }
  };

  return (
    <>
      {/* --- MOBILE/TABLET HEADER --- */}
      <header className={`lg:hidden sticky top-0 z-[100] w-full border-b transition-colors duration-300 px-4 py-3 flex items-center justify-between
        ${isDark ? 'bg-[#0B0B0F]/80 border-white/[0.06]' : 'bg-white/80 border-black/[0.06]'} backdrop-blur-md`}>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#a855f7] rounded-lg flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
               <path d="M12 4L4 20H20L12 4Z" fill={isDark ? "#0B0B0F" : "#FFF"} stroke={isDark ? "#0B0B0F" : "#FFF"} strokeWidth="2" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 className={`text-[13px] font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Aether</h1>
            <p className="text-[9px] uppercase tracking-wider text-[#a855f7] font-bold">Step 0{currentStep}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Progress Circle (Mobile Only) */}
          <div className="relative w-8 h-8 flex items-center justify-center mr-2">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" fill="transparent" className={isDark ? 'text-white/5' : 'text-slate-100'} />
              <circle cx="16" cy="16" r="14" stroke="#a855f7" strokeWidth="2" fill="transparent" strokeDasharray={88} strokeDashoffset={88 - (88 * progress) / 100} strokeLinecap="round" className="transition-all duration-700" />
            </svg>
            <span className={`absolute text-[8px] font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{Math.round(progress)}%</span>
          </div>
          
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 rounded-xl border ${isDark ? 'border-white/10 text-white' : 'border-slate-200 text-slate-900'}`}
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* --- SIDEBAR / MOBILE DRAWER --- */}
      <aside className={`
        /* Desktop Logic */
        lg:w-[300px] lg:min-h-screen lg:border-r lg:sticky lg:top-0 lg:flex
        
        /* Mobile Overlay Logic */
        max-lg:fixed max-lg:inset-0 max-lg:z-[90] max-lg:transition-transform max-lg:duration-300
        ${isOpen ? 'max-lg:translate-y-0' : 'max-lg:-translate-y-full lg:translate-y-0'}
        
        p-8 flex-col flex-shrink-0 font-sans transition-colors duration-300
        ${isDark ? 'bg-[#0B0B0F] border-white/[0.06] text-white' : 'bg-[#F9FAFB] border-black/[0.06] text-slate-900'}
      `}>
        
        {/* Hide Logo on Mobile Overlay (it's already in the sticky header) */}
        <div className="hidden lg:flex items-center gap-4 mb-12">
          <div className="w-10 h-10 bg-[#a855f7] rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 4L4 20H20L12 4Z" fill={isDark ? "#0B0B0F" : "#FFF"} stroke={isDark ? "#0B0B0F" : "#FFF"} strokeWidth="2" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 className="text-[15px] font-semibold tracking-wide">Aether Capital</h1>
            <p className={`text-[10px] mt-0.5 font-semibold tracking-[0.15em] uppercase ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Onboarding · 2026</p>
          </div>
        </div>

        {/* Progress Bar (Desktop Only) */}
        <div className="hidden lg:block mb-10">
          <div className="flex justify-between items-center mb-3">
            <p className={`text-[10px] font-bold tracking-[0.2em] uppercase ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Application</p>
            <p className="text-[11px] font-bold">{Math.round(progress)}%</p>
          </div>
          <div className={`h-[3px] w-full rounded-full overflow-hidden ${isDark ? 'bg-white/[0.06]' : 'bg-slate-200'}`}>
            <div className="h-full bg-[#a855f7] transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Steps List (Scrollable on Mobile if many steps exist) */}
        <nav className="flex flex-col gap-1.5 overflow-y-auto max-lg:mt-16">
          {STEPS.map((s) => {
            const isActive = currentStep === s.id;
            const isUnlocked = s.id <= reachedStep;
            const isCompleted = reachedStep > s.id && !isActive;

            return (
              <div
                key={s.id}
                onClick={() => handleStepClick(s.id)}
                className={`relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300
                  ${isActive ? (isDark ? 'bg-[#181824]' : 'bg-white shadow-md border border-slate-100') : 'bg-transparent'}
                  ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'}
                `}
              >
                {isActive && <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-[#a855f7] rounded-r-full" />}

                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300
                    ${isCompleted ? 'bg-[#10b981] text-white' : isActive ? 'bg-[#a855f7] text-white' : (isDark ? 'border border-white/[0.08] text-white/30' : 'border border-slate-200 text-slate-400')}
                `}>
                  {isCompleted ? <Check size={14} strokeWidth={4} /> : s.id}
                </div>

                <div className="flex flex-col min-w-0">
                  <span className={`text-[9px] font-bold tracking-[0.15em] uppercase ${isActive ? 'text-[#a855f7]' : (isDark ? 'text-white/40' : 'text-slate-400')}`}>
                    Step 0{s.id}
                  </span>
                  <span className={`text-[13px] leading-tight truncate ${isActive ? (isDark ? 'text-white' : 'text-slate-900 font-semibold') : (isDark ? 'text-white/50' : 'text-slate-500')}`}>
                    {s.title}
                  </span>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto pt-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
              <p className={`text-[11px] ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
                Support: <span className="hover:text-[#a855f7] cursor-pointer">hello@aether.cap</span>
              </p>
            </div>

            <div className={`flex items-center gap-1 p-1 rounded-full border ${isDark ? 'bg-[#15151A] border-white/[0.03]' : 'bg-slate-200 border-slate-300'}`}>
              <button type="button" onClick={() => theme !== 'light' && toggleTheme()} className={`p-1.5 rounded-full transition-all ${theme === 'light' ? 'bg-white text-orange-500 shadow-sm' : 'text-white/30'}`}>
                <Sun size={12} fill={theme === 'light' ? "currentColor" : "none"} />
              </button>
              <button type="button" onClick={() => theme !== 'dark' && toggleTheme()} className={`p-1.5 rounded-full transition-all ${isDark ? 'bg-[#a855f7] text-white' : 'text-slate-500'}`}>
                <Moon size={12} fill={isDark ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default StepSidebar;
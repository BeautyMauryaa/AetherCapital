import React from 'react';
import { Check, Sun, Moon } from 'lucide-react';
import { useOnboardingStore } from "@/app/store/onboarding.store";
import { STEPS } from "@/features/onboarding/utils/stepConfig";
import { useTheme } from "@/context/ThemeContext";
import "./StepSidebar.css";

const StepSidebar = () => {
  const currentStep = useOnboardingStore((s) => s.step);
  const { theme, toggleTheme, isDark } = useTheme(); 
  
  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <aside className="sidebar-container">

      <div className="flex items-center gap-4 mb-12">
        <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
             <path d="M12 4L4 20H20L12 4Z" fill={isDark ? "#0B0B0F" : "#FFF"} />
          </svg>
        </div>
        <div>
          <h1 className="text-[15px] font-semibold tracking-wide text-main">Aether Capital</h1>
          <p className="text-[10px] mt-0.5 font-semibold tracking-[0.15em] uppercase opacity-40">Onboarding · 2026</p>
        </div>
      </div>

      
      <div className="mb-10">
        <div className="flex justify-between items-center mb-3">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40">Application</p>
          <p className="text-[11px] font-bold text-main">{Math.round(progress)}%</p>
        </div>
        <div className="h-[3px] w-full rounded-full overflow-hidden bg-main/10">
          <div className="h-full bg-purple-500 rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
        </div>
      </div>

      
      <nav className="flex flex-col gap-1.5">
        {STEPS.map((s) => {
          const isActive = currentStep === s.id;
          const isCompleted = currentStep > s.id;

          return (
            <div key={s.id} className={`step-item ${isActive ? 'step-item-active' : ''}`}>
              {isActive && <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-purple-500 rounded-r-full" />}

              <div className={`step-number ${
                  isCompleted ? 'bg-emerald-500 text-white' : 
                  isActive ? 'bg-purple-500 text-white' : 
                  'border border-main/10 text-main/30'
                }`}>
                {isCompleted ? <Check size={16} strokeWidth={3.5} /> : s.id.toString().padStart(2, '0')}
              </div>

              <div className="flex flex-col">
                <span className={`text-[10px] font-bold tracking-[0.15em] uppercase mb-0.5 ${isActive ? 'text-purple-500' : 'text-main/40'}`}>
                  Step 0{s.id}
                </span>
                <span className={`text-[13px] leading-tight ${isActive ? 'text-main font-semibold' : 'text-main/50'}`}>
                  {s.title}
                </span>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-[12px] text-main/40">
            Need help? <span className="text-main/60 hover:text-purple-500 cursor-pointer">hello@aether.cap</span>
          </p>
        </div>
        <div className="theme-toggle-wrapper">
          <button onClick={toggleTheme} className={`p-1.5 rounded-full transition-all ${!isDark ? 'bg-white text-orange-500 shadow-sm' : 'text-main/30'}`}>
            <Sun size={14} />
          </button>
          <button onClick={toggleTheme} className={`p-1.5 rounded-full transition-all ${isDark ? 'bg-purple-500 text-white shadow-lg' : 'text-main/30'}`}>
            <Moon size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default StepSidebar;
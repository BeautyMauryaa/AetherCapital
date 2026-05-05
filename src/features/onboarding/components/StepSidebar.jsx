import React from "react";
import { Check, Sun, Moon } from "lucide-react";
import { useOnboardingStore } from "@/app/store/onboarding.store";
import { STEPS } from "@/features/onboarding/utils/stepConfig";
import { useTheme } from "@/context/ThemeContext";

const StepSidebar = () => {
  const currentStep = useOnboardingStore((s) => s.step);
  const { isDark, toggleTheme } = useTheme();
  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <aside className="w-[300px] min-h-screen bg-sidebar border-r border-border p-8 flex flex-col text-foreground flex-shrink-0 font-sans transition-colors duration-300">

      {/* Logo */}
      <div className="flex items-center gap-4 mb-12">
       <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/10 bg-gradient-to-r from-[#9C75E6] to-[#E95CDB]">
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    {/* This specific path creates the bezeled/rounded triangle effect from the image */}
    <path
      d="M10.875 3.375C11.375 2.5 12.625 2.5 13.125 3.375L21.375 18.375C21.875 19.25 21.25 20.375 20.25 20.375H3.75C2.75 20.375 2.125 19.25 2.625 18.375L10.875 3.375Z"
      fill="#0B0B0E"
      className="mix-blend-multiply opacity-90"
    />
  </svg>
</div>
        <div>
        <h1 className="text-[15px] font-bold tracking-wide font-aether">
  Aether Capital
</h1>
         <p className="text-[5px] text-foreground/40 font-light tracking-[0.15em] uppercase mt-0.5">
  Onboarding · 2026
</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-3">
          <p className="text-[10px] text-foreground/40 font-bold tracking-[0.2em] uppercase">Application</p>
          <p className="text-[11px] font-bold text-purple-500">{Math.round(progress)}%</p>
        </div>
        {/* Progress rail uses border color for subtle contrast */}
        <div className="h-[3px] w-full bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(168,85,247,0.4)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <nav className="flex flex-col gap-1.5">
        {STEPS.map((s) => {
          const isActive = currentStep === s.id;
          const isCompleted = currentStep > s.id;

          return (
            <div
              key={s.id}
              className={`relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300
                ${isActive ? "bg-card shadow-sm border border-border" : "bg-transparent border border-transparent"}`}
            >
              {isActive && (
                <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-purple-500 rounded-r-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
              )}

              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-all duration-300
                  ${isCompleted
                    ? "bg-emerald-500 text-white"
                    : isActive
                    ? "bg-purple-600 text-white ring-4 ring-purple-500/10"
                    : "border border-border text-foreground/30 bg-transparent"
                  }`}
              >
                {isCompleted ? <Check size={16} strokeWidth={3} /> : `0${s.id}`}
              </div>

              <div className="flex flex-col">
                <span className={`text-[10px] font-bold tracking-[0.15em] uppercase mb-0.5
                  ${isActive ? "text-purple-500" : isCompleted ? "text-foreground/40" : "text-foreground/20"}`}>
                  Step 0{s.id}
                </span>
                <span className={`text-[13px] leading-tight
                  ${isActive ? "font-bold text-foreground" : "text-foreground/50 font-medium"}`}>
                  {s.title}
                </span>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[11px] text-foreground/40 font-medium">System Status: Active</p>
            </div>
            <p className="text-[11px] text-foreground/60 hover:text-purple-500 transition-colors cursor-pointer font-medium">
              hello@aether.cap
            </p>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center gap-1 bg-card p-1 rounded-full border border-border shadow-inner">
            <button
              onClick={toggleTheme}
              className={`p-1.5 rounded-full transition-all ${
                !isDark ? "bg-purple-600 text-white shadow-md" : "text-foreground/40 hover:text-foreground"
              }`}
            >
              <Sun size={14} />
            </button>
            <button
              onClick={toggleTheme}
              className={`p-1.5 rounded-full transition-all ${
                isDark ? "bg-purple-600 text-white shadow-md" : "text-foreground/40 hover:text-foreground"
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
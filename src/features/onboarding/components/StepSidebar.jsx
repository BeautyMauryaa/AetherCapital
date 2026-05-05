import React from "react";
import { Check, Sun, Moon } from "lucide-react";
import { useOnboardingStore } from "@/app/store/onboarding.store";
import { STEPS } from "@/features/onboarding/utils/stepConfig";
import { useTheme } from "@/context/ThemeContext";
import "./StepSidebar.css";

const StepSidebar = () => {
  const currentStep = useOnboardingStore((s) => s.step);
  const { isDark, toggleTheme } = useTheme();
  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <aside className="sidebar-aside">
      {/* Logo */}
      <div className="logo-container">
        <div className="logo-icon-bg">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M10.875 3.375C11.375 2.5 12.625 2.5 13.125 3.375L21.375 18.375C21.875 19.25 21.25 20.375 20.25 20.375H3.75C2.75 20.375 2.125 19.25 2.625 18.375L10.875 3.375Z"
              fill="#0B0B0E"
              className="mix-blend-multiply opacity-90"
            />
          </svg>
        </div>
        <div>
          <h1 className="logo-text">Aether Capital</h1>
          <p className="logo-subtext">Onboarding · 2026</p>
        </div>
      </div>

      <div className="progress-section">
        <div className="flex justify-between items-center mb-3">
          <p className="progress-label">Application</p>
          <p className="progress-percent">{Math.round(progress)}%</p>
        </div>
        <div className="progress-rail">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <nav className="flex flex-col gap-1.5">
        {STEPS.map((s) => {
          const isActive = currentStep === s.id;
          const isCompleted = currentStep > s.id;

          return (
            <div
              key={s.id}
              className={`step-item ${isActive ? "step-item-active" : ""}`}
            >
              {isActive && <div className="active-indicator" />}

              <div className={`step-number-circle 
                ${isCompleted ? "step-num-completed" : isActive ? "step-num-active" : "step-num-upcoming"}`}
              >
                {isCompleted ? <Check size={16} strokeWidth={3} /> : `0${s.id}`}
              </div>

              <div className="flex flex-col">
                <span className={`step-label
                  ${isActive ? "text-purple-500" : isCompleted ? "text-foreground/40" : "text-foreground/20"}`}>
                  Step 0{s.id}
                </span>
                <span className={`step-title
                  ${isActive ? "font-bold text-foreground" : "text-foreground/50 font-medium"}`}>
                  {s.title}
                </span>
              </div>
            </div>
          );
        })}
      </nav>

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

          <div className="theme-toggle-wrapper">
            <button
              onClick={toggleTheme}
              className={`theme-toggle-btn ${!isDark ? "theme-toggle-btn-active" : "theme-toggle-btn-inactive"}`}
            >
              <Sun size={14} />
            </button>
            <button
              onClick={toggleTheme}
              className={`theme-toggle-btn ${isDark ? "theme-toggle-btn-active" : "theme-toggle-btn-inactive"}`}
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
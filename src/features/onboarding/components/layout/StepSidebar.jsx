import React from 'react';
import { Check } from 'lucide-react';
import { useOnboardingStore } from "@/app/store/onboarding.store";
import { STEPS } from "@/features/onboarding/utils/stepConfig";

const StepSidebar = () => {
  // Pull dynamic step from store
  const currentStep = useOnboardingStore((s) => s.step);
  const progress = (currentStep / STEPS.length) * 100;

  return (
    <aside className="w-[300px] min-h-screen bg-[#08080C] border-r border-white/5 p-8 flex flex-col text-white">
      
      {/* Logo & Application Progress */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
             <div className="w-5 h-5 bg-white rounded-sm rotate-45" />
          </div>
          <div>
            <h1 className="text-sm font-bold uppercase leading-none">Aether Capital</h1>
            <p className="text-[10px] text-white/30 mt-1 font-medium tracking-widest uppercase">Onboarding · 2026</p>
          </div>
        </div>

        <div className="flex justify-between items-end mb-3">
          <p className="text-[10px] text-white/40 font-bold tracking-[0.2em] uppercase">Application</p>
          <p className="text-[10px] text-white/60 font-mono">{Math.round(progress)}%</p>
        </div>
        <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Navigation Steps */}
      <nav className="flex flex-col gap-6">
        {STEPS.map((s) => {
  const isActive = currentStep === s.id;
  const isCompleted = currentStep > s.id;

  return (
    <div
      key={s.id}
      className={`relative flex items-start gap-4 transition-all duration-300
      ${isActive ? "scale-105 origin-left" : ""}`}
    >
      {/* 1. Active Indicator Line - Always full opacity */}
      {isActive && (
        <div className="absolute -left-8 top-0 bottom-0 w-1 bg-purple-500 rounded-r-full shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
      )}

      {/* 2. Status Icon - Keep this outside the opacity logic */}
      <div
        className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border transition-all duration-500
        ${isCompleted 
          ? "bg-[#10B981] border-[#10B981] text-black opacity-100" // Force full opacity here
          : isActive 
          ? "bg-purple-600/20 border-purple-500 text-purple-400 opacity-100" 
          : "bg-white/5 border-white/10 text-white/20 opacity-40" // Only dim upcoming steps
        }`}
      >
        {isCompleted ? <Check size={16} strokeWidth={3} /> : <span className="text-[11px] font-bold">{s.id}</span>}
      </div>

      {/* 3. Text Labels - Apply the dimming logic ONLY here */}
      <div className={`flex flex-col transition-opacity duration-300 ${
        isActive ? "opacity-100" : "opacity-40"
      }`}>
        <span className={`text-[9px] font-bold tracking-[0.15em] uppercase mb-0.5 ${isActive ? "text-purple-400" : "text-white/30"}`}>
          Step 0{s.id}
        </span>
        <span className={`text-sm font-medium ${isActive ? "text-white" : "text-white/60"}`}>
          {s.title}
        </span>
      </div>
    </div>
  );
})}
      </nav>

      {/* Footer (Matches image exactly) */}
      <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-[11px] text-white/40">Need help? <span className="text-white/80">hello@aether.cap</span></p>
        </div>
      </div>
    </aside>
  );
};

export default StepSidebar;
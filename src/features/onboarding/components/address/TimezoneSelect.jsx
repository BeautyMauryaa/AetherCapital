import React from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useOnboardingStore } from "@/app/store/onboarding.store";

const TimezoneSelect = () => {
  const { formData, updateForm } = useOnboardingStore();
  
  // Default to London to match image_5a383b.png
  const selectedTimezone = formData.timezone || "Europe/London";

  return (
    <div className="w-full mb-10">
      {/* Label Styling */}
      <label className="text-[10px] text-white/40 font-bold tracking-[0.2em] uppercase mb-4 block">
        Time Zone
      </label>

      <div className="relative group">
        {/* Custom Dropdown Trigger */}
        <div className="w-full h-[56px] bg-white/[0.03] border border-white/10 rounded-xl px-5 flex items-center justify-between cursor-pointer group-hover:border-white/20 transition-all focus-within:border-purple-500/50">
          <div className="flex items-center gap-3">
            <Globe size={18} className="text-white/20" />
            <span className="text-sm font-medium text-white/90">
              {selectedTimezone}
            </span>
          </div>
          <ChevronDown size={18} className="text-white/20 group-hover:text-white/40 transition-colors" />
        </div>

        {/* This is a hidden real select for accessibility/form submission if needed */}
        <select
          value={selectedTimezone}
          onChange={(e) => updateForm({ timezone: e.target.value })}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer appearance-none"
        >
          <option value="America/New_York">America/New_York</option>
          <option value="Europe/London">Europe/London</option>
          <option value="Europe/Berlin">Europe/Berlin</option>
          <option value="Asia/Kolkata">Asia/Kolkata</option>
        </select>
      </div>

      <p className="text-[10px] text-white/20 mt-3 tracking-wide">
        Auto-detected from country — <span className="italic">editable</span>
      </p>
    </div>
  );
};

export default TimezoneSelect;
import React from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useOnboardingStore } from "@/app/store/onboarding.store";
import "./TimezoneSelect.css";

const TimezoneSelect = () => {
  const { formData, updateForm } = useOnboardingStore();
  
  // Default to London
  const selectedTimezone = formData.timezone || "Europe/London";

  return (
    <div className="w-full mb-10">
      <label className="timezone-label">
        Time Zone
      </label>

      <div className="relative group">
        {/* Custom Dropdown Trigger */}
        <div className="timezone-trigger group-hover:border-purple-500/50">
          <div className="flex items-center gap-3">
            <Globe size={18} className="opacity-20" />
            <span className="text-sm font-medium opacity-90">
              {selectedTimezone}
            </span>
          </div>
          <ChevronDown size={18} className="opacity-20 group-hover:opacity-40 transition-opacity" />
        </div>

        {/* Hidden native select for functionality */}
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

      <p className="timezone-footer">
        Auto-detected from country — <span className="italic">editable</span>
      </p>
    </div>
  );
};

export default TimezoneSelect;
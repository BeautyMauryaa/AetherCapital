import React from 'react';
import { useTheme } from "@/context/ThemeContext"; // Assuming this is your path

const ToggleSwitch = ({ label, checked, onChange }) => {
  const { theme } = useTheme();

  return (
    <div className="flex justify-between items-center py-2">
      <p className={`text-sm font-medium transition-colors ${
        theme === 'dark' ? 'text-white/70' : 'text-slate-600'
      }`}>
        {label}
      </p>
      
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
          checked 
            ? "bg-purple-600" 
            : (theme === 'dark' ? "bg-white/10" : "bg-slate-200")
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

export default ToggleSwitch;
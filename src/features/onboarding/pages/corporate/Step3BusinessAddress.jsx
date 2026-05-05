import React, { useState } from 'react';
import { useOnboardingStore } from "@/app/store/onboarding.store";
import NavigationButtons from "../../components/common/NavigationButtons";
import { useTheme } from "@/context/ThemeContext";
import { MapPin, Clock, ChevronDown, Plus, Minus } from "lucide-react";
import styles from "./Step3BusinessAddress.module.css";

const COUNTRIES_WITH_FLAGS = [
  { code: "US", flag: "🇺🇸", name: "United States" },
  { code: "GB", flag: "🇬🇧", name: "United Kingdom" },
  { code: "CA", flag: "🇨🇦", name: "Canada" },
  { code: "AU", flag: "🇦🇺", name: "Australia" },
  { code: "IN", flag: "🇮🇳", name: "India" },
  { code: "DE", flag: "🇩🇪", name: "Germany" },
  { code: "FR", flag: "🇫🇷", name: "France" },
  { code: "JP", flag: "🇯🇵", name: "Japan" },
  { code: "CN", flag: "🇨🇳", name: "China" },
  { code: "BR", flag: "🇧🇷", name: "Brazil" },
  { code: "MX", flag: "🇲🇽", name: "Mexico" },
  { code: "SG", flag: "🇸🇬", name: "Singapore" },
  { code: "AE", flag: "🇦🇪", name: "United Arab Emirates" },
  { code: "ZA", flag: "🇿🇦", name: "South Africa" },
  { code: "NG", flag: "🇳🇬", name: "Nigeria" },
  { code: "KE", flag: "🇰🇪", name: "Kenya" },
  { code: "PK", flag: "🇵🇰", name: "Pakistan" },
  { code: "BD", flag: "🇧🇩", name: "Bangladesh" },
  { code: "PH", flag: "🇵🇭", name: "Philippines" },
  { code: "ID", flag: "🇮🇩", name: "Indonesia" },
  { code: "NL", flag: "🇳🇱", name: "Netherlands" },
  { code: "IT", flag: "🇮🇹", name: "Italy" },
  { code: "ES", flag: "🇪🇸", name: "Spain" },
  { code: "KR", flag: "🇰🇷", name: "South Korea" },
  { code: "SA", flag: "🇸🇦", name: "Saudi Arabia" },
];

const TIMEZONE_BY_COUNTRY = {
  US: "America/New_York", GB: "Europe/London", CA: "America/Toronto",
  AU: "Australia/Sydney", IN: "Asia/Kolkata", DE: "Europe/Berlin",
  FR: "Europe/Paris", JP: "Asia/Tokyo", CN: "Asia/Shanghai",
  BR: "America/Sao_Paulo", MX: "America/Mexico_City", SG: "Asia/Singapore",
  AE: "Asia/Dubai", ZA: "Africa/Johannesburg", NG: "Africa/Lagos",
  KE: "Africa/Nairobi", PK: "Asia/Karachi", BD: "Asia/Dhaka",
  PH: "Asia/Manila", ID: "Asia/Jakarta", NL: "Europe/Amsterdam",
  IT: "Europe/Rome", ES: "Europe/Madrid", KR: "Asia/Seoul", SA: "Asia/Riyadh",
};
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const TimeControl = ({ value, onChange, isDark }) => {
  const toMinutes = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const toTime = (mins) => {
    const h = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const adjust = (delta) => {
    const mins = toMinutes(value) + delta * 60;
    const clamped = Math.max(0, Math.min(mins, 23 * 60));
    onChange(toTime(clamped));
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border
      ${isDark ? "bg-[#0B0B0E] border-white/10" : "bg-slate-100 border-slate-200"}`}>
      <button onClick={() => adjust(-1)} className={isDark ? "text-white/40 hover:text-white" : "text-slate-400 hover:text-slate-700"}>
        <Minus size={12} />
      </button>
      <span className={`text-[12px] font-mono w-12 text-center ${isDark ? "text-white/80" : "text-slate-700"}`}>{value}</span>
      <button onClick={() => adjust(1)} className={isDark ? "text-white/40 hover:text-white" : "text-slate-400 hover:text-slate-700"}>
        <Plus size={12} />
      </button>
    </div>
  );
};

const Step3BusinessAddress = () => {
  const { formData, updateForm, nextStep, prevStep } = useOnboardingStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [showCountryDrop, setShowCountryDrop] = useState(false);

  const hours = formData.operatingHours || DAYS.reduce((acc, day) => ({
    ...acc,
    [day]: { active: day !== "Saturday" && day !== "Sunday", open: "09:00", close: "17:00" }
  }), {});

  const selectedCountry = COUNTRIES_WITH_FLAGS.find((c) => c.code === (formData.country || "US"));
  const handleFieldChange = (name, value) => updateForm({ [name]: value });

  const toggleDay = (day) => {
    updateForm({ operatingHours: { ...hours, [day]: { ...hours[day], active: !hours[day].active } } });
  };

  return (
    <div className={`onboarding-container ${isDark ? "dark-theme" : "light-theme"}`}>
      {/* Header Section */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-6 sm:w-8 h-[1.5px] bg-purple-500 rounded-full" />
          <span className="step-label">Step 03 / 06</span>
        </div>
        <h1 className="main-heading">
          Address & <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">location.</span>
        </h1>
        <p className={`text-[13px] sm:text-[15px] ${isDark ? "text-white/50" : "text-slate-500"}`}>
          Where your business operates and your availability.
        </p>
      </div>

      <div className="space-y-12">
        {/* Address Inputs */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h3 className="field-label !mb-0">Primary Business Address</h3>
            <div className={`flex-1 h-[1px] ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <p className="field-label">Country <span className="text-purple-500">*</span></p>
              <button 
                onClick={() => setShowCountryDrop(!showCountryDrop)}
                className="base-input flex items-center justify-between text-left"
              >
                <span className="flex items-center gap-3">
                  <span>{selectedCountry?.flag}</span>
                  <span>{selectedCountry?.name}</span>
                </span>
                <ChevronDown size={16} />
              </button>
            </div>

            <div>
              <p className="field-label">Address Line 1 <span className="text-purple-500">*</span></p>
              <input 
                className="base-input" 
                placeholder="Street number and name"
                value={formData.address1 || ""} 
                onChange={(e) => handleFieldChange("address1", e.target.value)} 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {["City", "State", "Zip"].map((field) => (
                <div key={field}>
                  <p className="field-label">{field}</p>
                  <input 
                    className="base-input" 
                    value={formData[field.toLowerCase()] || ""} 
                    onChange={(e) => handleFieldChange(field.toLowerCase(), e.target.value)} 
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Operating Hours */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h3 className="field-label !mb-0 flex items-center gap-2">
              <Clock size={14} className="text-[#a855f7]" />
              Operating Hours
            </h3>
            <div className={`flex-1 h-[1px] ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {DAYS.map((day) => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`day-toggle ${hours[day].active ? 'day-toggle-active' : (isDark ? 'border-white/10 text-white/30' : 'border-slate-200 text-slate-400')}`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>

          <div className="space-y-2.5">
            {DAYS.filter(day => hours[day].active).map((day) => (
              <div key={day} className={`flex items-center justify-between p-4 px-6 rounded-2xl border ${isDark ? "bg-[#16161D] border-white/10" : "bg-white border-slate-200"}`}>
                <span className={`text-[14px] font-medium w-28 ${isDark ? "text-white/80" : "text-slate-700"}`}>{day}</span>
                <div className="flex items-center gap-3">
                  <TimeControl value={hours[day].open} isDark={isDark} onChange={(v) => updateForm({ operatingHours: { ...hours, [day]: { ...hours[day], open: v } } })} />
                  <span className={isDark ? "text-white/20" : "text-slate-300"}>—</span>
                  <TimeControl value={hours[day].close} isDark={isDark} onChange={(v) => updateForm({ operatingHours: { ...hours, [day]: { ...hours[day], close: v } } })} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-16">
        <NavigationButtons onNext={nextStep} onBack={prevStep} />
      </div>
    </div>
  );
};

export default Step3BusinessAddress;
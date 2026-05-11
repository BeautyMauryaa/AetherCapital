import React, { useState } from 'react';
import { useOnboardingStore } from "@/app/store/onboarding.store";
import NavigationButtons from "../../components/common/NavigationButtons";
import { useTheme } from "@/context/ThemeContext";
import { MapPin, Clock, ChevronDown, Plus, Minus } from "lucide-react";

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

const toMinutes = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
const toTime = (mins) => {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

// ── Zip validation ──────────────────────────────────────────────────────────
const ZIP_PATTERNS = {
  US: { pattern: /^\d{5}(-\d{4})?$/, hint: "e.g. 10001 or 10001-1234" },
  CA: { pattern: /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/, hint: "e.g. K1A 0B1" },
  GB: { pattern: /^[A-Za-z]{1,2}\d[A-Za-z\d]? ?\d[A-Za-z]{2}$/, hint: "e.g. SW1A 1AA" },
  IN: { pattern: /^\d{6}$/, hint: "e.g. 110001" },
  AU: { pattern: /^\d{4}$/, hint: "e.g. 2000" },
  DE: { pattern: /^\d{5}$/, hint: "e.g. 10115" },
  FR: { pattern: /^\d{5}$/, hint: "e.g. 75001" },
  JP: { pattern: /^\d{3}-?\d{4}$/, hint: "e.g. 100-0001" },
  CN: { pattern: /^\d{6}$/, hint: "e.g. 100000" },
  BR: { pattern: /^\d{5}-?\d{3}$/, hint: "e.g. 01310-100" },
  PK: { pattern: /^\d{5}$/, hint: "e.g. 44000" },
  SG: { pattern: /^\d{6}$/, hint: "e.g. 018989" },
};

const validateZip = (value, countryCode) => {
  if (!value?.trim()) return "ZIP / Postal code is required";
  const rule = ZIP_PATTERNS[countryCode];
  if (rule && !rule.pattern.test(value.trim())) {
    return `Invalid format — ${rule.hint}`;
  }
  return "";
};

const TimeControl = ({ value, onChange, isDark }) => {
  const adjust = (delta) => {
    const mins = toMinutes(value) + delta * 60;
    onChange(toTime(Math.max(0, Math.min(mins, 23 * 60))));
  };
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border
      ${isDark ? "bg-[#0B0B0E] border-white/10" : "bg-slate-100 border-slate-200"}`}>
      <button onClick={() => adjust(-1)}
        className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all
          ${isDark ? "hover:bg-white/10 text-white/40 hover:text-white" : "hover:bg-slate-200 text-slate-400 hover:text-slate-700"}`}>
        <Minus size={12} />
      </button>
      <span className={`text-[12px] font-mono w-12 text-center ${isDark ? "text-white/80" : "text-slate-700"}`}>
        {value}
      </span>
      <button onClick={() => adjust(1)}
        className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all
          ${isDark ? "hover:bg-white/10 text-white/40 hover:text-white" : "hover:bg-slate-200 text-slate-400 hover:text-slate-700"}`}>
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
  const [errors, setErrors] = useState({ zip: "" });

  const hours = formData.operatingHours || DAYS.reduce((acc, day) => ({
    ...acc,
    [day]: { active: day !== "Saturday" && day !== "Sunday", open: "09:00", close: "17:00" }
  }), {});

  const selectedCountry = COUNTRIES_WITH_FLAGS.find((c) => c.code === (formData.country || "US"));
  const handleFieldChange = (name, value) => updateForm({ [name]: value });

  const handleCountryChange = (code) => {
    updateForm({ country: code, timezone: TIMEZONE_BY_COUNTRY[code] || "UTC" });
    setShowCountryDrop(false);
    // Re-validate zip with new country
    if (formData.zip) {
      setErrors((prev) => ({ ...prev, zip: validateZip(formData.zip, code) }));
    }
  };

  const toggleDay = (day) => {
    updateForm({ operatingHours: { ...hours, [day]: { ...hours[day], active: !hours[day].active } } });
  };

  const updateHour = (day, field, value) => {
    updateForm({ operatingHours: { ...hours, [day]: { ...hours[day], [field]: value } } });
  };

  const inputClass = `w-full h-[52px] px-4 rounded-xl border text-[14px] transition-all
    focus:outline-none focus:ring-1 focus:ring-purple-500/50
    ${isDark
      ? "bg-[#16161D] border-white/10 text-white placeholder:text-white/25"
      : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
    }`;

  const labelClass = `text-[10px] font-bold tracking-[0.22em] uppercase mb-3
    ${isDark ? "text-white/40" : "text-slate-400"}`;

  const dividerClass = `w-full h-[1px] ${isDark ? "bg-white/10" : "bg-slate-200"}`;

  const sectionTitleClass = `text-[10px] font-bold tracking-[0.25em] uppercase whitespace-nowrap
    ${isDark ? "text-white/40" : "text-slate-400"}`;

  const hasAddress = formData.address1?.trim();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-2 pt-6 sm:pt-10 pb-24 sm:pb-28">

      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-6 sm:w-8 h-[1.5px] bg-purple-500 rounded-full" />
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.2em] text-purple-500 uppercase font-bold">
            Step 03 / 06
          </span>
        </div>
        <h1 className={`text-[28px] sm:text-[36px] lg:text-[42px] font-bold leading-tight tracking-tight mb-2
          ${isDark ? "text-white" : "text-slate-900"}`}>
          Address &{" "}
          <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
            location.
          </span>
        </h1>
        <p className={`text-[13px] sm:text-[15px] ${isDark ? "text-white/50" : "text-slate-500"}`}>
          Where your business operates and your availability.
        </p>
      </div>

      <div className="space-y-12">

        {/* PRIMARY ADDRESS */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h3 className={sectionTitleClass}>Primary Business Address</h3>
            <div className={dividerClass} />
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Country */}
            <div>
              <p className={labelClass}>Country <span className="text-purple-500">*</span></p>
              <div className="relative">
                <button
                  onClick={() => setShowCountryDrop(!showCountryDrop)}
                  className={`w-full h-[52px] px-4 rounded-xl border flex items-center justify-between transition-all
                    ${isDark ? "bg-[#16161D] border-white/10" : "bg-white border-slate-200"}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-lg">{selectedCountry?.flag}</span>
                    <span className={isDark ? "text-white" : "text-slate-900"}>{selectedCountry?.name}</span>
                  </span>
                  <ChevronDown size={16} className={isDark ? "text-white/30" : "text-slate-400"} />
                </button>
                {showCountryDrop && (
                  <div className={`absolute z-50 top-full mt-1 w-full rounded-xl overflow-hidden shadow-2xl max-h-64 overflow-y-auto border
                    ${isDark ? "bg-[#16161D] border-white/10" : "bg-white border-slate-200"}`}>
                    {COUNTRIES_WITH_FLAGS.map((c) => (
                      <div key={c.code} onClick={() => handleCountryChange(c.code)}
                        className={`px-4 py-3 cursor-pointer flex items-center gap-3 transition-colors text-[13px]
                          ${isDark ? "text-white/70 hover:bg-white/5 hover:text-white" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
                        <span>{c.flag}</span>{c.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Address Line 1 */}
            <div>
              <p className={labelClass}>Address Line 1 <span className="text-purple-500">*</span></p>
              <input className={inputClass} placeholder="Street number and name"
                value={formData.address1 || ""} onChange={(e) => handleFieldChange("address1", e.target.value)} />
            </div>

            {/* Address Line 2 */}
            <div>
              <p className={labelClass}>Address Line 2</p>
              <input className={inputClass} placeholder="Apt, suite, unit, building (optional)"
                value={formData.address2 || ""} onChange={(e) => handleFieldChange("address2", e.target.value)} />
            </div>

            {/* City / State / Zip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className={labelClass}>City <span className="text-purple-500">*</span></p>
                <input className={inputClass} value={formData.city || ""}
                  onChange={(e) => handleFieldChange("city", e.target.value)} />
              </div>
              <div>
                <p className={labelClass}>State</p>
                <input className={inputClass} value={formData.state || ""}
                  onChange={(e) => handleFieldChange("state", e.target.value)} />
              </div>

              {/* ── ZIP with validation ── */}
              <div>
                <p className={labelClass}>Zip <span className="text-purple-500">*</span></p>
                <input
                  className={`${inputClass} ${errors.zip ? "!border-red-500 focus:!ring-red-500/40" : ""}`}
                  value={formData.zip || ""}
                  onChange={(e) => {
                    handleFieldChange("zip", e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      zip: validateZip(e.target.value, formData.country || "US"),
                    }));
                  }}
                  onBlur={() => {
                    setErrors((prev) => ({
                      ...prev,
                      zip: validateZip(formData.zip || "", formData.country || "US"),
                    }));
                  }}
                />
                {errors.zip && (
                  <p className="mt-1.5 text-[11px] text-red-400 font-medium">{errors.zip}</p>
                )}
                {/* Show format hint for known countries */}
                {!errors.zip && ZIP_PATTERNS[formData.country] && (
                  <p className={`mt-1.5 text-[10px] italic ${isDark ? "text-white/20" : "text-slate-400"}`}>
                    Format: {ZIP_PATTERNS[formData.country].hint}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Map Preview */}
        <div className={`rounded-2xl overflow-hidden flex h-32 border
          ${isDark ? "bg-[#16161D] border-white/10" : "bg-white border-slate-200"}`}>
          <div className={`w-1/3 flex items-center justify-center relative border-r
            ${isDark ? "border-white/10" : "border-slate-200"}`}>
            <div className="absolute inset-0 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
            <MapPin size={24} className={hasAddress ? "text-[#a855f7] animate-pulse" : isDark ? "text-white/10" : "text-slate-300"} />
          </div>
          <div className="p-6 flex flex-col justify-center">
            <h4 className="text-[10px] font-bold text-[#a855f7] uppercase tracking-widest mb-1">Location Preview</h4>
            <p className={`text-[12px] ${isDark ? "text-white/40" : "text-slate-400"}`}>
              {hasAddress ? `${formData.address1}, ${formData.city || ""}` : "Waiting for address input..."}
            </p>
          </div>
        </div>

        {/* Mailing Toggle */}
        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            onClick={() => handleFieldChange("sameAsPrimary", !formData.sameAsPrimary)}
            className={`w-5 h-5 rounded flex items-center justify-center transition-all border
              ${formData.sameAsPrimary !== false
                ? "bg-purple-500 border-purple-500"
                : isDark ? "border-white/10" : "border-slate-300"
              }`}
          >
            {formData.sameAsPrimary !== false && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
          </div>
          <span className={`text-[12px] ${isDark ? "text-white/40" : "text-slate-500"}`}>
            Mailing address is the same as primary
          </span>
        </label>

        {/* Timezone */}
        <div>
          <p className={labelClass}>Time Zone <span className="text-purple-500">*</span></p>
          <div className="relative">
            <select
              value={formData.timezone || TIMEZONE_BY_COUNTRY[formData.country || "US"]}
              onChange={(e) => handleFieldChange("timezone", e.target.value)}
              className={`w-full h-[52px] px-4 pr-10 rounded-xl border text-[14px] appearance-none cursor-pointer
                focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all
                ${isDark ? "bg-[#16161D] border-white/10 text-white" : "bg-white border-slate-200 text-slate-900"}`}
            >
              <option value="America/New_York">Eastern Standard Time (EST)</option>
              <option value="America/Chicago">Central Standard Time (CST)</option>
              <option value="America/Denver">Mountain Standard Time (MST)</option>
              <option value="America/Los_Angeles">Pacific Standard Time (PST)</option>
              <option value="Europe/London">Greenwich Mean Time (GMT)</option>
              <option value="Asia/Kolkata">India Standard Time (IST)</option>
              <option value="Asia/Dubai">Gulf Standard Time (GST)</option>
              <option value="Asia/Singapore">Singapore Standard Time (SGT)</option>
            </select>
            <ChevronDown size={16} className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none
              ${isDark ? "text-white/30" : "text-slate-400"}`} />
          </div>
          <p className={`mt-2 text-[11px] italic uppercase tracking-tighter
            ${isDark ? "text-white/20" : "text-slate-400"}`}>
            Auto-detected from country
          </p>
        </div>

        {/* Operating Hours */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h3 className={`${sectionTitleClass} flex items-center gap-2`}>
              <Clock size={14} className="text-[#a855f7]" />
              Operating Hours
            </h3>
            <div className={dividerClass} />
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {DAYS.map((day) => (
              <button key={day} onClick={() => toggleDay(day)}
                className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all
                  ${hours[day].active
                    ? "bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg shadow-purple-500/20"
                    : isDark
                      ? "bg-[#16161D] border border-white/10 text-white/30 hover:text-white/60"
                      : "bg-white border border-slate-200 text-slate-400 hover:text-slate-600"
                  }`}>
                {day.slice(0, 3)}
              </button>
            ))}
          </div>

          <div className="space-y-2.5">
            {DAYS.filter(day => hours[day].active).map((day) => (
              <div key={day}
                className={`flex items-center justify-between p-4 px-6 rounded-2xl border transition-all
                  ${isDark ? "bg-[#16161D] border-white/10" : "bg-white border-slate-200"}`}>
                <span className={`text-[14px] font-medium w-28 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                  {day}
                </span>
                <div className="flex items-center gap-3">
                  <TimeControl value={hours[day].open} onChange={(v) => updateHour(day, "open", v)} isDark={isDark} />
                  <span className={isDark ? "text-white/20" : "text-slate-300"}>—</span>
                  <TimeControl value={hours[day].close} onChange={(v) => updateHour(day, "close", v)} isDark={isDark} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-16">
        <NavigationButtons
          onNext={() => {
            const zipError = validateZip(formData.zip || "", formData.country || "US");
            if (zipError) {
              setErrors((prev) => ({ ...prev, zip: zipError }));
              return;
            }
            nextStep();
          }}
          onBack={prevStep}
        />
      </div>
    </div>
  );
};

export default Step3BusinessAddress;

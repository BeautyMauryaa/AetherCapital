import React, { useState } from 'react';
import { useOnboardingStore } from "@/app/store/onboarding.store";
import NavigationButtons from "../../components/common/NavigationButtons";
import { MapPin, Clock, ChevronDown } from "lucide-react";


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

const SectionLabel = ({ children, required }) => (
  <p className="text-[10px] font-bold tracking-[0.22em] text-white/40 uppercase mb-3">
    {children}{required && <span className="text-[#a855f7] ml-1">*</span>}
  </p>
);

const Step3BusinessAddress = () => {
  const { formData, updateForm, nextStep, prevStep } = useOnboardingStore();
  const [showCountryDrop, setShowCountryDrop] = useState(false);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Hours Logic
  const hours = formData.operatingHours || days.reduce((acc, day) => ({
    ...acc,
    [day]: { active: day !== "Saturday" && day !== "Sunday", open: "09:00 AM", close: "06:00 PM" }
  }), {});

  const selectedCountry = COUNTRIES_WITH_FLAGS.find((c) => c.code === (formData.country || "US"));

  const handleFieldChange = (name, value) => {
    updateForm({ [name]: value });
  };

  const handleCountryChange = (code) => {
    updateForm({ 
        country: code, 
        timezone: TIMEZONE_BY_COUNTRY[code] || "UTC" 
    });
    setShowCountryDrop(false);
  };

  const toggleDay = (day) => {
    updateForm({
      operatingHours: { ...hours, [day]: { ...hours[day], active: !hours[day].active } }
    });
  };

  const hasAddress = formData.address1?.trim();

  return (
    <div className="max-w-4xl pb-24">
      {/* Header */}
      <div className="mb-10">
        <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-[#a855f7] uppercase mb-3 before:content-[''] before:w-6 before:h-[1px] before:bg-[#a855f7]">
          STEP 03 / 06
        </p>
        <h1 className="text-[42px] font-bold leading-tight tracking-tight mb-3 text-white">
          Address & <span className="text-[#a855f7]">location.</span>
        </h1>
        <p className="text-[14px] text-white/50">
          Where your business operates and your availability.
        </p>
      </div>

      <div className="space-y-12">
        {/* Section 1: Address Fields */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-[10px] font-bold tracking-[0.25em] text-white/40 uppercase whitespace-nowrap">
              Primary Business Address
            </h3>
            <div className="w-full h-[1px] bg-white/5" />
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Country & Timezone */}
            <div className="grid  gap-6">
              <div className="space-y-3">
                <SectionLabel required>Country</SectionLabel>
                <div className="relative">
                  <button
                    onClick={() => setShowCountryDrop(!showCountryDrop)}
                    className="w-full h-[52px] px-4 rounded-xl bg-[#111118] border border-white/[0.08] flex items-center justify-between text-white"
                  >
                    <span className="flex items-center gap-3">
                        <span className="text-lg">{selectedCountry?.flag}</span>
                        {selectedCountry?.name}
                    </span>
                    <ChevronDown size={16} className="text-white/30" />
                  </button>
                  {showCountryDrop && (
                    <div className="absolute z-50 top-full mt-1 w-full bg-[#16161f] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                      {COUNTRIES_WITH_FLAGS.map((c) => (
                        <div
                          key={c.code}
                          onClick={() => handleCountryChange(c.code)}
                          className="px-4 py-3 hover:bg-white/5 cursor-pointer text-white/70 hover:text-white flex items-center gap-3"
                        >
                          <span>{c.flag}</span>{c.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* <div className="space-y-3">
                <SectionLabel required>Timezone</SectionLabel>
                <input 
                  disabled
                  value={formData.timezone || "America/New_York"}
                  className="w-full h-[52px] px-4 rounded-xl bg-[#111118]/50 border border-white/[0.08] text-white/40 cursor-not-allowed"
                />
              </div> */}
            </div>

            {/* Street Address */}
            <div className="space-y-3">
                <SectionLabel required>Address Line 1</SectionLabel>
                <input 
                  name="address1" 
                  placeholder="Street number and name" 
                  value={formData.address1 || ""} 
                  onChange={(e) => handleFieldChange("address1", e.target.value)}
                  className="w-full h-[52px] px-4 rounded-xl bg-[#111118] border border-white/[0.08] text-white focus:border-[#a855f7]/50 outline-none" 
                />
            </div>
              <div className="space-y-3">
                <SectionLabel required>Address Line 2</SectionLabel>
                <input 
                  name="address1" 
                  placeholder="Street number and name" 
                  value={formData.address1 || ""} 
                  onChange={(e) => handleFieldChange("address1", e.target.value)}
                  className="w-full h-[52px] px-4 rounded-xl bg-[#111118] border border-white/[0.08] text-white focus:border-[#a855f7]/50 outline-none" 
                />
            </div>
            
            {/* City/State/Zip */}
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-3">
                <SectionLabel required>City</SectionLabel>
                <input value={formData.city || ""} onChange={(e) => handleFieldChange("city", e.target.value)} className="w-full h-[52px] px-4 rounded-xl bg-[#111118] border border-white/[0.08] text-white outline-none" />
              </div>
              <div className="space-y-3">
                <SectionLabel>State</SectionLabel>
                <input value={formData.state || ""} onChange={(e) => handleFieldChange("state", e.target.value)} className="w-full h-[52px] px-4 rounded-xl bg-[#111118] border border-white/[0.08] text-white outline-none" />
              </div>
              <div className="space-y-3">
                <SectionLabel required>Zip</SectionLabel>
                <input value={formData.zip || ""} onChange={(e) => handleFieldChange("zip", e.target.value)} className="w-full h-[52px] px-4 rounded-xl bg-[#111118] border border-white/[0.08] text-white outline-none" />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Map Verification */}
        <div className="bg-[#13131A] border border-white/[0.05] rounded-2xl overflow-hidden flex h-32">
          <div className="w-1/3 bg-white/5 flex items-center justify-center border-r border-white/5 relative">
             <div className="absolute inset-0 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
             <MapPin className={hasAddress ? "text-[#a855f7] animate-pulse" : "text-white/10"} size={24} />
          </div>
          <div className="p-6 flex flex-col justify-center">
            <h4 className="text-[10px] font-bold text-[#a855f7] uppercase tracking-widest mb-1">Location Preview</h4>
            <p className="text-[12px] text-white/40">
                {hasAddress ? `${formData.address1}, ${formData.city || ""}` : "Waiting for address input..."}
            </p>
          </div>
        </div>

        {/* Mailing Toggle */}
        <label className="flex items-center gap-3 cursor-pointer group">
          <div 
            onClick={() => handleFieldChange("sameAsPrimary", !formData.sameAsPrimary)}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${formData.sameAsPrimary !== false ? "bg-[#a855f7] border-[#a855f7]" : "border-white/20"}`}
          >
            {formData.sameAsPrimary !== false && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
          </div>
          <span className="text-[12px] text-white/40 group-hover:text-white transition-colors">Mailing address is the same as primary</span>
        </label>
{/* ── TIME ZONE ── */}
<div className="space-y-3">
  <SectionLabel required>Time Zone</SectionLabel>
  <div className="relative">
    <select
      value={formData.timezone || TIMEZONE_BY_COUNTRY[formData.country || "US"]}
      onChange={(e) => handleFieldChange("timezone", e.target.value)}
      className="w-full h-[52px] px-4 pr-10 rounded-xl bg-[#111118] border border-white/[0.08]
        text-[14px] text-white appearance-none cursor-pointer
        focus:outline-none focus:border-[#a855f7]/50 transition-all duration-200"
      style={{ colorScheme: "dark" }}
    >
      {/* You can map through your TIMEZONES array here */}
      <option value="America/New_York">Eastern Standard Time (EST)</option>
      <option value="America/Chicago">Central Standard Time (CST)</option>
      <option value="America/Denver">Mountain Standard Time (MST)</option>
      <option value="America/Los_Angeles">Pacific Standard Time (PST)</option>
      <option value="Europe/London">Greenwich Mean Time (GMT)</option>
      <option value="Asia/Kolkata">India Standard Time (IST)</option>
      <option value="Asia/Dubai">Gulf Standard Time (GST)</option>
      <option value="Asia/Singapore">Singapore Standard Time (SGT)</option>
      {/* Add others as needed */}
    </select>
    
    {/* Custom Chevron so it looks like your other inputs */}
    <ChevronDown
      size={16}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
    />
  </div>
  <p className="text-[11px] text-white/20 mt-1 italic uppercase tracking-tighter">
    Auto-detected from country
  </p>
</div>
        {/* Section 3: Operating Hours */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-[10px] font-bold tracking-[0.25em] text-white/40 uppercase whitespace-nowrap flex items-center gap-2">
              <Clock size={14} className="text-[#a855f7]" />
              Operating Hours
            </h3>
            <div className="w-full h-[1px] bg-white/5" />
          </div>

          <div className="space-y-2.5">
            {days.map((day) => (
              <div 
                key={day} 
                className={`flex items-center justify-between p-4 px-6 rounded-2xl border transition-all duration-300 ${
                  hours[day].active ? "bg-[#13131A] border-white/10" : "bg-transparent border-white/[0.03] opacity-40"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div 
                    onClick={() => toggleDay(day)}
                    className={`w-5 h-5 rounded border cursor-pointer flex items-center justify-center transition-all ${
                      hours[day].active ? "bg-[#a855f7] border-[#a855f7]" : "border-white/20"
                    }`}
                  >
                    {hours[day].active && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <span className="text-[14px] font-medium text-white/80">{day}</span>
                </div>

                {hours[day].active ? (
                  <div className="flex items-center gap-3">
                    <div className="bg-black/40 border border-white/5 px-4 py-2 rounded-xl text-[11px] text-white/60 font-mono italic">{hours[day].open}</div>
                    <span className="text-white/10">—</span>
                    <div className="bg-black/40 border border-white/5 px-4 py-2 rounded-xl text-[11px] text-white/60 font-mono italic">{hours[day].close}</div>
                  </div>
                ) : (
                  <span className="text-[10px] font-mono tracking-widest text-white/20 uppercase">Closed</span>
                )}
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
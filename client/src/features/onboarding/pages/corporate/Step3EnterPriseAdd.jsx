import React, { useState } from 'react';
import { MapPin, ChevronDown, Clock, Plus, Building2, Globe } from 'lucide-react';
import { useOnboardingStore } from "@/app/store/onboarding.store";
import NavigationButtons from "../../components/common/NavigationButtons";

const Step3EnterPriseAdd = () => {
  const { formData, updateForm, nextStep, prevStep } = useOnboardingStore();
  const [showCountryDrop, setShowCountryDrop] = useState(false);

  const DAYS = [
    { id: 'mon', label: 'MON' }, { id: 'tue', label: 'TUE' },
    { id: 'wed', label: 'WED' }, { id: 'thu', label: 'THU' },
    { id: 'fri', label: 'FRI' }, { id: 'sat', label: 'SAT' },
    { id: 'sun', label: 'SUN' }
  ];

  const hours = formData.operatingHours || DAYS.reduce((acc, day) => ({
    ...acc,
    [day.id]: { active: !['sat', 'sun'].includes(day.id), open: "09:00 AM", close: "05:00 PM" }
  }), {});

  const handleFieldChange = (name, value) => updateForm({ [name]: value });

  const toggleDay = (dayId) => {
    updateForm({
      operatingHours: { ...hours, [dayId]: { ...hours[dayId], active: !hours[dayId].active } }
    });
  };

  const hasAddress = formData.address1?.trim();

  const inputStyle = {
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-main)',
  };

  const labelStyle = {
    color: 'var(--text-main)',
    opacity: 0.5,
  };

  return (
    <div className="max-w-4xl pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="mb-10 text-left">
        <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-[#a855f7] uppercase mb-4 before:content-[''] before:w-8 before:h-[1px] before:bg-[#a855f7]">
          STEP 03 / 06
        </p>
        <h1 className="text-[48px] font-bold leading-tight tracking-tight mb-4"
          style={{ color: 'var(--text-main)' }}>
          Address & <span className="text-[#a855f7]">location.</span>
        </h1>
        <p className="text-[15px] max-w-lg" style={{ color: 'var(--text-main)', opacity: 0.4 }}>
          Where you operate, where to mail you, and the hours we can reach you.
        </p>
      </div>

      <div className="space-y-12">
        {/* ── PRIMARY ADDRESS ── */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 mb-2">
            <h3 className="text-[11px] font-bold tracking-[0.25em] uppercase whitespace-nowrap flex items-center gap-2"
              style={{ color: 'var(--text-main)', opacity: 0.4 }}>
              <Building2 size={14} className="text-[#a855f7]" />
              Primary Address
            </h3>
            <div className="w-full h-[1px]" style={{ backgroundColor: 'var(--border-color)' }} />
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Country */}
            <div className="space-y-3">
              <label className="text-[11px] font-medium uppercase tracking-widest ml-1" style={labelStyle}>
                Country *
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCountryDrop(!showCountryDrop)}
                  className="w-full h-[56px] px-5 rounded-2xl flex items-center justify-between text-sm hover:opacity-80 transition-all"
                  style={inputStyle}
                >
                  <span className="flex items-center gap-3">
                    <div
                      className="w-6 h-4 rounded-sm overflow-hidden flex items-center justify-center"
                      style={{ backgroundColor: 'var(--border-color)' }}
                    >
                      <Globe size={12} style={{ color: 'var(--text-main)', opacity: 0.4 }} />
                    </div>
                    <span style={{ color: 'var(--text-main)' }}>{formData.country || "United States"}</span>
                  </span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${showCountryDrop ? 'rotate-180' : ''}`}
                    style={{ color: 'var(--text-main)', opacity: 0.3 }}
                  />
                </button>
                {showCountryDrop && (
                  <div
                    className="absolute z-50 top-full mt-1 w-full rounded-xl overflow-hidden shadow-2xl max-h-64 overflow-y-auto"
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    {["United States", "United Kingdom", "Canada", "Australia", "India", "Germany", "Singapore"].map((country) => (
                      <div
                        key={country}
                        onClick={() => { handleFieldChange("country", country); setShowCountryDrop(false); }}
                        className="px-5 py-3 cursor-pointer transition-colors"
                        style={{ color: 'var(--text-main)', opacity: 0.7 }}
                        onMouseEnter={e => e.currentTarget.style.opacity = 1}
                        onMouseLeave={e => e.currentTarget.style.opacity = 0.7}
                      >
                        {country}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Address Line 1 */}
            <div className="space-y-3">
              <label className="text-[11px] font-medium uppercase tracking-widest ml-1" style={labelStyle}>
                Address Line 1 *
              </label>
              <input
                placeholder="Street number and street name"
                value={formData.address1 || ""}
                onChange={(e) => handleFieldChange("address1", e.target.value)}
                className="w-full h-[56px] px-5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
                style={inputStyle}
              />
            </div>

            {/* Address Line 2 */}
            <div className="space-y-3">
              <label className="text-[11px] font-medium uppercase tracking-widest ml-1" style={labelStyle}>
                Address Line 2
              </label>
              <input
                placeholder="Apt 4B / Suite / Floor"
                value={formData.address2 || ""}
                onChange={(e) => handleFieldChange("address2", e.target.value)}
                className="w-full h-[56px] px-5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
                style={inputStyle}
              />
            </div>

            {/* City / State / Zip */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: "City *", field: "city", placeholder: "City" },
                { label: "State *", field: "state", placeholder: "State" },
                { label: "Zip *", field: "zip", placeholder: "10001" },
              ].map(({ label, field, placeholder }) => (
                <div key={field} className="space-y-3">
                  <label className="text-[11px] font-medium uppercase tracking-widest" style={labelStyle}>
                    {label}
                  </label>
                  <input
                    placeholder={placeholder}
                    value={formData[field] || ""}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                    className="w-full h-[56px] px-5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ADDRESS PREVIEW ── */}
        <div
          className="grid grid-cols-[1fr_2fr] rounded-3xl overflow-hidden min-h-[140px] group"
          style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div
            className="flex items-center justify-center relative overflow-hidden"
            style={{ borderRight: '1px solid var(--border-color)' }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:24px_24px] opacity-10 group-hover:opacity-20 transition-opacity" />
            <div
              className={`p-4 rounded-full transition-all duration-500 ${hasAddress ? 'shadow-[0_0_20px_rgba(168,85,247,0.3)]' : ''}`}
              style={{ backgroundColor: hasAddress ? 'rgba(168,85,247,0.2)' : 'var(--border-color)' }}
            >
              <MapPin
                size={24}
                className={hasAddress ? "text-[#a855f7]" : ""}
                style={!hasAddress ? { color: 'var(--text-main)', opacity: 0.1 } : {}}
              />
            </div>
          </div>
          <div className="p-8 flex flex-col justify-center">
            <h4 className="text-[10px] font-bold text-[#a855f7] uppercase tracking-[0.2em] mb-2">
              Address Verification
            </h4>
            <p className="text-[13px] leading-relaxed font-medium" style={{ color: 'var(--text-main)', opacity: 0.4 }}>
              {hasAddress
                ? `${formData.address1}, ${formData.city || ""}, ${formData.state || ""}`
                : "Enter an address to preview the location."}
            </p>
          </div>
        </div>

        {/* ── MAILING + TIMEZONE ── */}
        <div className="space-y-6 pt-4">
          <label className="flex items-center gap-3 cursor-pointer group w-fit">
            <div
              className="w-5 h-5 rounded flex items-center justify-center transition-all"
              style={formData.mailingSame ? {
                backgroundColor: '#a855f7',
                border: '1px solid #a855f7',
              } : {
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--card-bg)',
              }}
              onClick={() => handleFieldChange("mailingSame", !formData.mailingSame)}
            >
              {formData.mailingSame && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
            <span
              className="text-sm transition-colors"
              style={{ color: 'var(--text-main)', opacity: 0.6 }}
            >
              Mailing address is the same as primary
            </span>
          </label>

          <div className="space-y-3 pt-4">
            <label className="text-[11px] font-medium uppercase tracking-widest ml-1" style={labelStyle}>
              Time Zone
            </label>
            <div className="relative">
              <select
                className="w-full h-[56px] px-5 rounded-2xl text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
                style={{ ...inputStyle, colorScheme: 'var(--color-scheme, light)' }}
                value={formData.timezone || "America/New_York"}
                onChange={(e) => handleFieldChange("timezone", e.target.value)}
              >
                <option value="America/New_York" style={{ backgroundColor: 'var(--card-bg)' }}>America/New_York</option>
                <option value="Europe/London" style={{ backgroundColor: 'var(--card-bg)' }}>Europe/London</option>
                <option value="Asia/Tokyo" style={{ backgroundColor: 'var(--card-bg)' }}>Asia/Tokyo</option>
                <option value="Asia/Kolkata" style={{ backgroundColor: 'var(--card-bg)' }}>Asia/Kolkata</option>
                <option value="Asia/Dubai" style={{ backgroundColor: 'var(--card-bg)' }}>Asia/Dubai</option>
                <option value="Asia/Singapore" style={{ backgroundColor: 'var(--card-bg)' }}>Asia/Singapore</option>
              </select>
              <Clock
                size={16}
                className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: 'var(--text-main)', opacity: 0.2 }}
              />
            </div>
            <p className="text-[11px] italic ml-1" style={{ color: 'var(--text-main)', opacity: 0.2 }}>
              Auto-detected from country — editable
            </p>
          </div>
        </div>

        {/* ── OPERATING HOURS ── */}
        <section className="pt-6">
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-[11px] font-bold tracking-[0.25em] uppercase whitespace-nowrap"
              style={{ color: 'var(--text-main)', opacity: 0.4 }}>
              Operating Hours
            </h3>
            <div className="w-full h-[1px]" style={{ backgroundColor: 'var(--border-color)' }} />
          </div>

          <div className="space-y-4">
            {/* Day Toggle Bar */}
            <div
              className="flex gap-2 p-1.5 rounded-2xl"
              style={{
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
              }}
            >
              {DAYS.map((day) => (
                <button
                  key={day.id}
                  onClick={() => toggleDay(day.id)}
                  className="flex-1 py-3 rounded-xl text-[11px] font-bold transition-all duration-300"
                  style={hours[day.id].active ? {
                    backgroundColor: '#a855f7',
                    color: '#ffffff',
                    boxShadow: '0 0 20px rgba(168,85,247,0.2)',
                  } : {
                    color: 'var(--text-main)',
                    opacity: 0.3,
                  }}
                >
                  {day.label}
                </button>
              ))}
            </div>

            {/* Active Day Slots */}
            <div className="space-y-3">
              {DAYS.filter(d => hours[d.id].active).map((day) => (
                <div
                  key={day.id}
                  className="flex items-center gap-4 p-4 rounded-2xl animate-in slide-in-from-left duration-300"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <span
                    className="w-12 text-[12px] font-mono font-bold"
                    style={{ color: 'var(--text-main)', opacity: 0.4 }}
                  >
                    {day.label}
                  </span>
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    {['open', 'close'].map((timeKey) => (
                      <div key={timeKey} className="relative">
                        <input
                          value={hours[day.id][timeKey]}
                          className="w-full h-[44px] px-4 rounded-xl text-xs font-mono text-center focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all"
                          style={{
                            backgroundColor: 'var(--bg-main)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-main)',
                            opacity: 0.7,
                          }}
                          onChange={(e) => {
                            const newHours = { ...hours, [day.id]: { ...hours[day.id], [timeKey]: e.target.value } };
                            updateForm({ operatingHours: newHours });
                          }}
                        />
                        <Clock
                          size={12}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                          style={{ color: 'var(--text-main)', opacity: 0.15 }}
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    className="w-10 h-10 flex items-center justify-center rounded-xl transition-all hover:text-[#a855f7]"
                    style={{
                      backgroundColor: 'var(--border-color)',
                      color: 'var(--text-main)',
                      opacity: 0.5,
                    }}
                  >
                    <Plus size={18} />
                  </button>
                </div>
              ))}
            </div>

            <p
              className="text-[11px] text-center mt-4 uppercase tracking-widest"
              style={{ color: 'var(--text-main)', opacity: 0.2 }}
            >
              Toggle days of operation, then set hours per day
            </p>
          </div>
        </section>
      </div>

      <div className="mt-16">
        <NavigationButtons onNext={nextStep} onBack={prevStep} />
      </div>
    </div>
  );
};

export default Step3EnterPriseAdd;
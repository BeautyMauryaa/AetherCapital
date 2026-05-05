import React, { useState } from 'react';
import { MapPin, ChevronDown, Clock, Plus, Building2, Globe } from 'lucide-react';
import { useOnboardingStore } from "@/app/store/onboarding.store";
import NavigationButtons from "../../components/common/NavigationButtons";
import "./Step3EnterPriseAdd.css";

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

  return (
    <div className="enterprise-container animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="mb-10 text-left">
        <p className="step-label">STEP 03 / 06</p>
        <h1 className="main-title">
          Address & <span className="text-[#a855f7]">location.</span>
        </h1>
        <p className="sub-description">
          Where you operate, where to mail you, and the hours we can reach you.
        </p>
      </div>

      <div className="space-y-12">
        {/* PRIMARY ADDRESS */}
        <section className="space-y-8">
          <div className="section-header">
            <h3 className="section-title">
              <Building2 size={14} className="text-[#a855f7]" />
              Primary Address
            </h3>
            <div className="section-divider" />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="input-group">
              <label className="input-label">Country *</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCountryDrop(!showCountryDrop)}
                  className="enterprise-input flex items-center justify-between"
                >
                  <span className="flex items-center gap-3">
                    <div className="w-6 h-4 rounded-sm overflow-hidden flex items-center justify-center bg-[var(--border-color)]">
                      <Globe size={12} className="opacity-40" />
                    </div>
                    <span>{formData.country || "United States"}</span>
                  </span>
                  <ChevronDown size={18} className={`transition-transform opacity-30 ${showCountryDrop ? 'rotate-180' : ''}`} />
                </button>
                {showCountryDrop && (
                  <div className="absolute z-50 top-full mt-1 w-full rounded-xl overflow-hidden shadow-2xl max-h-64 overflow-y-auto bg-[var(--card-bg)] border border-[var(--border-color)]">
                    {["United States", "United Kingdom", "Canada", "Australia", "India", "Germany", "Singapore"].map((country) => (
                      <div
                        key={country}
                        onClick={() => { handleFieldChange("country", country); setShowCountryDrop(false); }}
                        className="px-5 py-3 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                      >
                        {country}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Address Line 1 *</label>
              <input
                placeholder="Street number and street name"
                value={formData.address1 || ""}
                onChange={(e) => handleFieldChange("address1", e.target.value)}
                className="enterprise-input"
              />
            </div>

            <div className="grid grid-cols-3 gap-6">
              {[
                { label: "City *", field: "city", placeholder: "City" },
                { label: "State *", field: "state", placeholder: "State" },
                { label: "Zip *", field: "zip", placeholder: "10001" },
              ].map(({ label, field, placeholder }) => (
                <div key={field} className="input-group">
                  <label className="input-label">{label}</label>
                  <input
                    placeholder={placeholder}
                    value={formData[field] || ""}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                    className="enterprise-input"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ADDRESS PREVIEW */}
        <div className="preview-card group">
          <div className="preview-icon-box">
            <div className="preview-dot-pattern" />
            <div className={`p-4 rounded-full transition-all duration-500 ${hasAddress ? 'bg-[#a855f733] shadow-[0_0_20px_rgba(168,85,247,0.3)]' : 'bg-[var(--border-color)]'}`}>
              <MapPin size={24} className={hasAddress ? "text-[#a855f7]" : "opacity-10"} />
            </div>
          </div>
          <div className="p-8 flex flex-col justify-center">
            <h4 className="text-[10px] font-bold text-[#a855f7] uppercase tracking-[0.2em] mb-2">Address Verification</h4>
            <p className="text-[13px] leading-relaxed font-medium opacity-40">
              {hasAddress ? `${formData.address1}, ${formData.city || ""}, ${formData.state || ""}` : "Enter an address to preview the location."}
            </p>
          </div>
        </div>

        {/* MAILING + TIMEZONE */}
        <div className="space-y-6 pt-4">
          <label className="flex items-center gap-3 cursor-pointer group w-fit">
            <div
              className={`w-5 h-5 rounded flex items-center justify-center transition-all border ${formData.mailingSame ? 'bg-[#a855f7] border-[#a855f7]' : 'bg-[var(--card-bg)] border-[var(--border-color)]'}`}
              onClick={() => handleFieldChange("mailingSame", !formData.mailingSame)}
            >
              {formData.mailingSame && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
            <span className="text-sm opacity-60">Mailing address is the same as primary</span>
          </label>

          <div className="input-group pt-4">
            <label className="input-label">Time Zone</label>
            <div className="relative">
              <select
                className="enterprise-input appearance-none"
                style={{ colorScheme: 'var(--color-scheme, light)' }}
                value={formData.timezone || "America/New_York"}
                onChange={(e) => handleFieldChange("timezone", e.target.value)}
              >
                <option value="America/New_York">America/New_York</option>
                <option value="Europe/London">Europe/London</option>
                <option value="Asia/Tokyo">Asia/Tokyo</option>
                <option value="Asia/Kolkata">Asia/Kolkata</option>
              </select>
              <Clock size={16} className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-20" />
            </div>
            <p className="text-[11px] italic ml-1 opacity-20">Auto-detected from country — editable</p>
          </div>
        </div>

        {/* OPERATING HOURS */}
        <section className="pt-6">
          <div className="section-header">
            <h3 className="section-title">Operating Hours</h3>
            <div className="section-divider" />
          </div>

          <div className="space-y-4">
            <div className="day-toggle-bar">
              {DAYS.map((day) => (
                <button
                  key={day.id}
                  onClick={() => toggleDay(day.id)}
                  className={`day-btn ${hours[day.id].active ? 'day-btn-active' : ''}`}
                >
                  {day.label}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {DAYS.filter(d => hours[d.id].active).map((day) => (
                <div key={day.id} className="time-slot-row animate-in slide-in-from-left duration-300">
                  <span className="w-12 text-[12px] font-mono font-bold opacity-40">{day.label}</span>
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    {['open', 'close'].map((timeKey) => (
                      <div key={timeKey} className="relative">
                        <input
                          value={hours[day.id][timeKey]}
                          className="time-input"
                          onChange={(e) => {
                            const newHours = { ...hours, [day.id]: { ...hours[day.id], [timeKey]: e.target.value } };
                            updateForm({ operatingHours: newHours });
                          }}
                        />
                        <Clock size={12} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-15" />
                      </div>
                    ))}
                  </div>
                  <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--border-color)] opacity-50 hover:text-[#a855f7] transition-all">
                    <Plus size={18} />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-center mt-4 uppercase tracking-widest opacity-20">
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
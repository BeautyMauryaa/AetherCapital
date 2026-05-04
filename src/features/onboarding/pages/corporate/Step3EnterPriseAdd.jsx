import React, { useState } from 'react';
import { 
  MapPin, 
  ChevronDown, 
  Clock, 
  Plus, 
  Building2,
  Globe,
  Navigation
} from 'lucide-react';
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

  // Initialize operating hours if they don't exist
  const hours = formData.operatingHours || DAYS.reduce((acc, day) => ({
    ...acc,
    [day.id]: { active: !['sat', 'sun'].includes(day.id), open: "09:00 AM", close: "05:00 PM" }
  }), {});

  const handleFieldChange = (name, value) => {
    updateForm({ [name]: value });
  };

  const toggleDay = (dayId) => {
    const updatedHours = { 
      ...hours, 
      [dayId]: { ...hours[dayId], active: !hours[dayId].active } 
    };
    updateForm({ operatingHours: updatedHours });
  };

  const hasAddress = formData.address1?.trim();

  return (
    <div className="max-w-4xl pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="mb-10 text-left">
        <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-[#a855f7] uppercase mb-4 before:content-[''] before:w-8 before:h-[1px] before:bg-[#a855f7]">
          STEP 03 / 06
        </p>
        <h1 className="text-[48px] font-bold leading-tight tracking-tight mb-4 text-white">
          Address & <span className="text-[#a855f7]">location.</span>
        </h1>
        <p className="text-[15px] text-white/40 max-w-lg">
          Where you operate, where to mail you, and the hours we can reach you.
        </p>
      </div>

      <div className="space-y-12">
        {/* ── PRIMARY HEADQUARTERS ── */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 mb-2">
            <h3 className="text-[11px] font-bold tracking-[0.25em] text-white/40 uppercase whitespace-nowrap flex items-center gap-2">
              <Building2 size={14} className="text-[#a855f7]" />
              Primary Address
            </h3>
            <div className="w-full h-[1px] bg-white/[0.05]" />
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Country Selector */}
            <div className="space-y-3">
              <label className="text-[11px] font-medium text-white/50 uppercase tracking-widest ml-1">Country *</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCountryDrop(!showCountryDrop)}
                  className="w-full h-[56px] px-5 rounded-2xl bg-[#111118] border border-white/[0.08] flex items-center justify-between text-white text-sm hover:border-white/20 transition-all"
                >
                  <span className="flex items-center gap-3">
                    <div className="w-6 h-4 bg-white/10 rounded-sm overflow-hidden flex items-center justify-center">
                       <Globe size={12} className="text-white/40" />
                    </div>
                    {formData.country || "United States"}
                  </span>
                  <ChevronDown size={18} className={`text-white/30 transition-transform ${showCountryDrop ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>

            {/* Street Address Lines */}
            <div className="space-y-3">
              <label className="text-[11px] font-medium text-white/50 uppercase tracking-widest ml-1">Address Line 1 *</label>
              <input 
                placeholder="Street number and street name" 
                value={formData.address1 || ""} 
                onChange={(e) => handleFieldChange("address1", e.target.value)}
                className="w-full h-[56px] px-5 rounded-2xl bg-[#111118] border border-white/[0.08] text-white text-sm focus:border-[#a855f7]/50 outline-none transition-all placeholder:text-white/10" 
              />
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-medium text-white/50 uppercase tracking-widest ml-1">Address Line 2</label>
              <input 
                placeholder="Apt 4B / Suite / Floor" 
                value={formData.address2 || ""} 
                onChange={(e) => handleFieldChange("address2", e.target.value)}
                className="w-full h-[56px] px-5 rounded-2xl bg-[#111118] border border-white/[0.08] text-white text-sm focus:border-[#a855f7]/50 outline-none transition-all placeholder:text-white/10" 
              />
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-3">
                <label className="text-[11px] font-medium text-white/50 uppercase tracking-widest">City *</label>
                <input placeholder="City" value={formData.city || ""} onChange={(e) => handleFieldChange("city", e.target.value)} className="w-full h-[56px] px-5 bg-[#111118] border border-white/[0.08] rounded-2xl text-white text-sm outline-none focus:border-[#a855f7]/50" />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-medium text-white/50 uppercase tracking-widest">State *</label>
                <input placeholder="State" value={formData.state || ""} onChange={(e) => handleFieldChange("state", e.target.value)} className="w-full h-[56px] px-5 bg-[#111118] border border-white/[0.08] rounded-2xl text-white text-sm outline-none focus:border-[#a855f7]/50" />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-medium text-white/50 uppercase tracking-widest">Zip *</label>
                <input placeholder="10001" value={formData.zip || ""} onChange={(e) => handleFieldChange("zip", e.target.value)} className="w-full h-[56px] px-5 bg-[#111118] border border-white/[0.08] rounded-2xl text-white text-sm outline-none focus:border-[#a855f7]/50" />
              </div>
            </div>
          </div>
        </section>

        {/* ── ADDRESS VERIFICATION PREVIEW ── */}
        <div className="grid grid-cols-[1fr_2fr] bg-[#111118] border border-white/[0.05] rounded-3xl overflow-hidden min-h-[140px] group">
          <div className="bg-white/[0.02] flex items-center justify-center border-r border-white/5 relative overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:24px_24px] opacity-10 group-hover:opacity-20 transition-opacity" />
             <div className={`p-4 rounded-full transition-all duration-500 ${hasAddress ? 'bg-[#a855f7]/20 shadow-[0_0_20px_rgba(168,85,247,0.3)]' : 'bg-white/5'}`}>
                <MapPin className={hasAddress ? "text-[#a855f7]" : "text-white/10"} size={24} />
             </div>
          </div>
          <div className="p-8 flex flex-col justify-center">
            <h4 className="text-[10px] font-bold text-[#a855f7] uppercase tracking-[0.2em] mb-2">Address Verification</h4>
            <p className="text-[13px] text-white/40 leading-relaxed font-medium">
                {hasAddress ? `${formData.address1}, ${formData.city || ""}, ${formData.state || ""}` : "Enter an address to preview the location."}
            </p>
          </div>
        </div>

        {/* ── TIME ZONE & MAILING ── */}
        <div className="space-y-6 pt-4">
          <label className="flex items-center gap-3 cursor-pointer group w-fit">
            <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${formData.mailingSame ? 'bg-[#a855f7] border-[#a855f7]' : 'border-white/20 bg-white/5'}`}
                 onClick={() => handleFieldChange("mailingSame", !formData.mailingSame)}>
               {formData.mailingSame && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
            <span className="text-sm text-white/60 group-hover:text-white transition-colors">Mailing address is the same as primary</span>
          </label>

          <div className="space-y-3 pt-4">
             <label className="text-[11px] font-medium text-white/50 uppercase tracking-widest ml-1">Time Zone</label>
             <div className="relative">
                <select 
                  className="w-full h-[56px] px-5 rounded-2xl bg-[#111118] border border-white/[0.08] text-white text-sm appearance-none focus:border-[#a855f7]/50 outline-none"
                  value={formData.timezone || "America/New_York"}
                  onChange={(e) => handleFieldChange("timezone", e.target.value)}
                >
                  <option value="America/New_York">America/New_York</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="Asia/Tokyo">Asia/Tokyo</option>
                </select>
                <Clock size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/10 pointer-events-none" />
             </div>
             <p className="text-[11px] text-white/20 italic ml-1">Auto-detected from country — editable</p>
          </div>
        </div>

        {/* ── OPERATING HOURS ── */}
        <section className="pt-6">
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-[11px] font-bold tracking-[0.25em] text-white/40 uppercase whitespace-nowrap flex items-center gap-2">
              Operating Hours
            </h3>
            <div className="w-full h-[1px] bg-white/[0.05]" />
          </div>

          <div className="space-y-4">
            {/* Day Toggle Bar */}
            <div className="flex gap-2 p-1.5 bg-[#111118] border border-white/[0.05] rounded-2xl">
              {DAYS.map((day) => (
                <button
                  key={day.id}
                  onClick={() => toggleDay(day.id)}
                  className={`flex-1 py-3 rounded-xl text-[11px] font-bold transition-all duration-300 ${
                    hours[day.id].active 
                      ? "bg-[#a855f7] text-white shadow-[0_0_20px_rgba(168,85,247,0.2)]" 
                      : "text-white/20 hover:text-white/40"
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>

            {/* Active Day Slots */}
            <div className="space-y-3">
              {DAYS.filter(d => hours[d.id].active).map((day) => (
                <div key={day.id} className="flex items-center gap-4 p-4 rounded-2xl bg-[#111118]/50 border border-white/[0.05] animate-in slide-in-from-left duration-300">
                  <span className="w-12 text-[12px] font-mono font-bold text-white/40">{day.label}</span>
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div className="relative">
                      <input 
                        value={hours[day.id].open} 
                        className="w-full h-[44px] px-4 rounded-xl bg-black/20 border border-white/5 text-white/60 text-xs font-mono text-center focus:border-[#a855f7]/30 outline-none" 
                        onChange={(e) => {
                           const newHours = {...hours, [day.id]: {...hours[day.id], open: e.target.value}};
                           updateForm({ operatingHours: newHours });
                        }}
                      />
                      <Clock size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/10" />
                    </div>
                    <div className="relative">
                      <input 
                        value={hours[day.id].close} 
                        className="w-full h-[44px] px-4 rounded-xl bg-black/20 border border-white/5 text-white/60 text-xs font-mono text-center focus:border-[#a855f7]/30 outline-none"
                        onChange={(e) => {
                           const newHours = {...hours, [day.id]: {...hours[day.id], close: e.target.value}};
                           updateForm({ operatingHours: newHours });
                        }}
                      />
                      <Clock size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/10" />
                    </div>
                  </div>
                  <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white/20 hover:text-[#a855f7] hover:bg-[#a855f7]/10 transition-all">
                    <Plus size={18} />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-white/20 text-center mt-4 uppercase tracking-widest">Toggle days of operation, then set hours per day</p>
          </div>
        </section>
      </div>

      {/* Footer Navigation */}
       <div className="mt-16">
        <NavigationButtons onNext={nextStep} onBack={prevStep} />
      </div>
    </div>
  );
};

export default Step3EnterPriseAdd;
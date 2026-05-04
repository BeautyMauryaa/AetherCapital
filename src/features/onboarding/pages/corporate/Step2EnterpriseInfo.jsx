import React from 'react';
import { 
  Building2, 
  Hash, 
  Calendar, 
  Briefcase, 
  Users, 
  Layers, 
  Globe,
  Info
} from 'lucide-react';
import { useOnboardingStore } from "@/app/store/onboarding.store";
import NavigationButtons from "../../components/common/NavigationButtons";

const Step2EnterpriseInfo = () => {
const { formData, updateForm, nextStep, prevStep } = useOnboardingStore();

  const handleFieldChange = (field, value) => {
    updateForm({ [field]: value });
  };

  const industries = [
    "Financial Services", "Technology", "Manufacturing", 
    "Healthcare", "Energy", "Retail", "Telecommunications"
  ];

  return (
    <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-4xl font-semibold text-white mb-3">
          A bit about <span className="text-[#a855f7]">you.</span>
        </h1>
        <p className="text-white/40 text-[15px]">
          Personal details we'll use for KYC verification and compliance.
        </p>
      </div>

      <div className="space-y-8">
        {/* ── COMPANY NAME SECTION ── */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider flex items-center gap-2">
              Company Name <span className="text-[#a855f7]">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Legal name"
                value={formData.legalName || ""}
                onChange={(e) => handleFieldChange("legalName", e.target.value)}
                className="w-full h-[52px] px-4 bg-[#111118] border border-white/[0.08] rounded-xl text-white placeholder:text-white/10 focus:outline-none focus:border-[#a855f7]/50 transition-all"
              />
              <Building2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/10" />
            </div>
          </div>
          <div className="space-y-2 pt-6">
            <input
              type="text"
              placeholder="Trade name (DBA)"
              value={formData.tradeName || ""}
              onChange={(e) => handleFieldChange("tradeName", e.target.value)}
              className="w-full h-[52px] px-4 bg-[#111118] border border-white/[0.08] rounded-xl text-white placeholder:text-white/10 focus:outline-none focus:border-[#a855f7]/50"
            />
          </div>
        </div>

        {/* ── REGISTRATION SECTION ── */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider flex items-center gap-2">
              Registration <span className="text-[#a855f7]">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Registration number"
                value={formData.regNumber || ""}
                onChange={(e) => handleFieldChange("regNumber", e.target.value)}
                className="w-full h-[52px] px-4 bg-[#111118] border border-white/[0.08] rounded-xl text-white placeholder:text-white/10 focus:outline-none focus:border-[#a855f7]/50"
              />
              <Hash size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/10" />
            </div>
          </div>
          <div className="space-y-2 pt-6">
            <div className="relative">
              <input
                type="text"
                placeholder="mm/dd/yyyy"
                value={formData.regDate || ""}
                onChange={(e) => handleFieldChange("regDate", e.target.value)}
                className="w-full h-[52px] px-4 bg-[#111118] border border-white/[0.08] rounded-xl text-white placeholder:text-white/10 focus:outline-none focus:border-[#a855f7]/50"
              />
              <Calendar size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/10" />
            </div>
          </div>
        </div>

        {/* ── INDUSTRY SELECT ── */}
        <div className="space-y-2">
          <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider">Industry *</label>
          <div className="relative">
            <select
              value={formData.industry || ""}
              onChange={(e) => handleFieldChange("industry", e.target.value)}
              className="w-full h-[52px] px-4 bg-[#111118] border border-white/[0.08] rounded-xl text-white appearance-none focus:outline-none focus:border-[#a855f7]/50"
            >
              <option value="" disabled>Select industry</option>
              {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
            </select>
            <Briefcase size={16} className="absolute right-10 top-1/2 -translate-y-1/2 text-white/10" />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="white" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* ── NUMBER OF EMPLOYEES SLIDER ── */}
        <div className="space-y-6">
          <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider">Number of Employees</label>
          <div className="relative pt-2">
            <input 
              type="range" 
              min="1" max="4" step="1"
              value={formData.employeeRange || 2}
              onChange={(e) => handleFieldChange("employeeRange", e.target.value)}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#a855f7]"
            />
            <div className="flex justify-between mt-4">
              {['1-10', '11-50', '51-200', '200+'].map((label, i) => (
                <span key={label} className={`text-[10px] font-bold tracking-tighter ${Number(formData.employeeRange) === i + 1 ? 'text-[#a855f7]' : 'text-white/20'}`}>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── ENTERPRISE DETAILS ── */}
        {/* ── ENTERPRISE DETAILS ── */}
<div className="pt-4 space-y-6">
  <div className="flex items-center gap-4">
    <h3 className="text-[11px] font-bold tracking-[0.2em] text-white/90 uppercase whitespace-nowrap">Enterprise Details</h3>
    <div className="w-full h-[1px] bg-white/[0.05]" />
  </div>

  <div className="grid grid-cols-2 gap-6">
    {/* Subsidiary Count - Counter UI from your image */}
    <div className="space-y-2">
      <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider text-left block">Subsidiary Count</label>
      <div className="flex items-center h-[52px] bg-[#111118] border border-white/[0.08] rounded-xl overflow-hidden px-4">
        <button 
          onClick={() => handleFieldChange("subsidiaryCount", Math.max(0, (formData.subsidiaryCount || 0) - 1))}
          className="text-white/30 hover:text-white transition-colors"
        >
          −
        </button>
        <input 
          type="number" 
          value={formData.subsidiaryCount || 0}
          readOnly
          className="flex-1 bg-transparent text-center text-white text-sm focus:outline-none font-mono"
        />
        <button 
          onClick={() => handleFieldChange("subsidiaryCount", (formData.subsidiaryCount || 0) + 1)}
          className="text-white/30 hover:text-[#a855f7] transition-colors"
        >
          +
        </button>
      </div>
    </div>

    {/* Parent Company */}
    <div className="space-y-2">
      <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider text-left block">Parent Company</label>
      <input
        type="text"
        placeholder="Parent or holding company"
        value={formData.parentCompany || ""}
        onChange={(e) => handleFieldChange("parentCompany", e.target.value)}
        className="w-full h-[52px] px-4 bg-[#111118] border border-white/[0.08] rounded-xl text-white placeholder:text-white/10 focus:outline-none focus:border-[#a855f7]/50"
      />
    </div>
  </div>

  {/* Listed Company Toggle - Matches image_ab0db7.png */}
  <div className={`p-5 rounded-2xl border transition-all duration-500 ${formData.isListed ? 'bg-[#a855f7]/5 border-[#a855f7]/20' : 'bg-white/[0.02] border-white/[0.05]'}`}>
    <div className="flex items-center justify-between">
      <div>
        <h4 className="text-sm font-medium text-white/90">Listed company?</h4>
        <p className="text-[11px] text-white/30 italic">Toggle on to enter ticker symbol</p>
      </div>
      <button 
        type="button"
        onClick={() => handleFieldChange("isListed", !formData.isListed)}
        className={`w-12 h-6 rounded-full relative transition-all duration-300 ${formData.isListed ? 'bg-[#a855f7]' : 'bg-white/10'}`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${formData.isListed ? 'left-7' : 'left-1'}`} />
      </button>
    </div>

    {/* Ticker Input - Appears when toggle is ON */}
    {formData.isListed && (
      <div className="mt-6 pt-6 border-t border-white/[0.05] animate-in fade-in slide-in-from-top-2 duration-300">
        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-3">Stock Ticker</label>
        <div className="relative">
          <input 
            type="text"
            placeholder="E.G. AETH"
            value={formData.stockTicker || ""}
            onChange={(e) => handleFieldChange("stockTicker", e.target.value.toUpperCase())}
            className="w-full h-[52px] px-5 bg-black/20 border border-white/[0.08] rounded-xl text-white font-mono placeholder:text-white/5 focus:border-[#a855f7]/50 outline-none uppercase"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-white/5 rounded text-[10px] font-mono text-white/20">
            NYSE / NASDAQ
          </div>
        </div>
      </div>
    )}
  </div>
</div>
      </div>

      {/* Navigation Footer */}
       <div className="mt-16">
        <NavigationButtons onNext={nextStep} onBack={prevStep} />
      </div>
    </div>
  );
};

export default Step2EnterpriseInfo;
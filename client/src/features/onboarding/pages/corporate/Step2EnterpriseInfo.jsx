import React from 'react';
import { 
  Building2, Hash, Calendar, Briefcase
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

  const inputStyle = {
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-main)',
  };

  return (
    <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-semibold mb-3" style={{ color: 'var(--text-main)' }}>
          A bit about <span className="text-[#a855f7]">you.</span>
        </h1>
        <p className="text-[15px]" style={{ color: 'var(--text-main)', opacity: 0.4 }}>
          Personal details we'll use for KYC verification and compliance.
        </p>
      </div>

      <div className="space-y-8">
        {/* ── COMPANY NAME ── */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[11px] font-medium uppercase tracking-wider flex items-center gap-2"
              style={{ color: 'var(--text-main)', opacity: 0.5 }}>
              Company Name <span className="text-[#a855f7]">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Legal name"
                value={formData.legalName || ""}
                onChange={(e) => handleFieldChange("legalName", e.target.value)}
                className="w-full h-[52px] px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
                style={inputStyle}
              />
              <Building2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-main)', opacity: 0.2 }} />
            </div>
          </div>
          <div className="space-y-2 pt-6">
            <input
              type="text"
              placeholder="Trade name (DBA)"
              value={formData.tradeName || ""}
              onChange={(e) => handleFieldChange("tradeName", e.target.value)}
              className="w-full h-[52px] px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
              style={inputStyle}
            />
          </div>
        </div>

        {/* ── REGISTRATION ── */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[11px] font-medium uppercase tracking-wider flex items-center gap-2"
              style={{ color: 'var(--text-main)', opacity: 0.5 }}>
              Registration <span className="text-[#a855f7]">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Registration number"
                value={formData.regNumber || ""}
                onChange={(e) => handleFieldChange("regNumber", e.target.value)}
                className="w-full h-[52px] px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
                style={inputStyle}
              />
              <Hash size={16} className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-main)', opacity: 0.2 }} />
            </div>
          </div>
          <div className="space-y-2 pt-6">
            <div className="relative">
              <input
                type="text"
                placeholder="mm/dd/yyyy"
                value={formData.regDate || ""}
                onChange={(e) => handleFieldChange("regDate", e.target.value)}
                className="w-full h-[52px] px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
                style={inputStyle}
              />
              <Calendar size={16} className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-main)', opacity: 0.2 }} />
            </div>
          </div>
        </div>

        {/* ── INDUSTRY ── */}
        <div className="space-y-2">
          <label className="text-[11px] font-medium uppercase tracking-wider"
            style={{ color: 'var(--text-main)', opacity: 0.5 }}>
            Industry *
          </label>
          <div className="relative">
            <select
              value={formData.industry || ""}
              onChange={(e) => handleFieldChange("industry", e.target.value)}
              className="w-full h-[52px] px-4 rounded-xl appearance-none focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
              style={inputStyle}
            >
              <option value="" disabled>Select industry</option>
              {industries.map(ind => (
                <option key={ind} value={ind}
                  style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-main)' }}>
                  {ind}
                </option>
              ))}
            </select>
            <Briefcase size={16} className="absolute right-10 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--text-main)', opacity: 0.2 }} />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeOpacity="0.3"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* ── EMPLOYEES SLIDER ── */}
        <div className="space-y-6">
          <label className="text-[11px] font-medium uppercase tracking-wider"
            style={{ color: 'var(--text-main)', opacity: 0.5 }}>
            Number of Employees
          </label>
          <div className="relative pt-2">
            <input
              type="range" min="1" max="4" step="1"
              value={formData.employeeRange || 2}
              onChange={(e) => handleFieldChange("employeeRange", e.target.value)}
              className="w-full h-1 rounded-lg appearance-none cursor-pointer accent-[#a855f7]"
              style={{ backgroundColor: 'var(--border-color)' }}
            />
            <div className="flex justify-between mt-4">
              {['1-10', '11-50', '51-200', '200+'].map((label, i) => (
                <span key={label}
                  className="text-[10px] font-bold tracking-tighter"
                  style={{
                    color: Number(formData.employeeRange) === i + 1 ? '#a855f7' : 'var(--text-main)',
                    opacity: Number(formData.employeeRange) === i + 1 ? 1 : 0.2,
                  }}>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── ENTERPRISE DETAILS ── */}
        <div className="pt-4 space-y-6">
          <div className="flex items-center gap-4">
            <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase whitespace-nowrap"
              style={{ color: 'var(--text-main)' }}>
              Enterprise Details
            </h3>
            <div className="w-full h-[1px]" style={{ backgroundColor: 'var(--border-color)' }} />
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Subsidiary Count */}
            <div className="space-y-2">
              <label className="text-[11px] font-medium uppercase tracking-wider block"
                style={{ color: 'var(--text-main)', opacity: 0.5 }}>
                Subsidiary Count
              </label>
              <div
                className="flex items-center h-[52px] rounded-xl overflow-hidden px-4"
                style={inputStyle}
              >
                <button
                  onClick={() => handleFieldChange("subsidiaryCount", Math.max(0, (formData.subsidiaryCount || 0) - 1))}
                  className="transition-colors hover:text-purple-500"
                  style={{ color: 'var(--text-main)', opacity: 0.4 }}
                >
                  −
                </button>
                <input
                  type="number"
                  value={formData.subsidiaryCount || 0}
                  readOnly
                  className="flex-1 bg-transparent text-center text-sm focus:outline-none font-mono"
                  style={{ color: 'var(--text-main)' }}
                />
                <button
                  onClick={() => handleFieldChange("subsidiaryCount", (formData.subsidiaryCount || 0) + 1)}
                  className="transition-colors hover:text-purple-500"
                  style={{ color: 'var(--text-main)', opacity: 0.4 }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Parent Company */}
            <div className="space-y-2">
              <label className="text-[11px] font-medium uppercase tracking-wider block"
                style={{ color: 'var(--text-main)', opacity: 0.5 }}>
                Parent Company
              </label>
              <input
                type="text"
                placeholder="Parent or holding company"
                value={formData.parentCompany || ""}
                onChange={(e) => handleFieldChange("parentCompany", e.target.value)}
                className="w-full h-[52px] px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Listed Company Toggle */}
          <div
            className="p-5 rounded-2xl transition-all duration-500"
            style={formData.isListed ? {
              backgroundColor: 'rgba(168, 85, 247, 0.05)',
              border: '1px solid rgba(168, 85, 247, 0.2)',
            } : {
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium" style={{ color: 'var(--text-main)' }}>
                  Listed company?
                </h4>
                <p className="text-[11px] italic" style={{ color: 'var(--text-main)', opacity: 0.3 }}>
                  Toggle on to enter ticker symbol
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleFieldChange("isListed", !formData.isListed)}
                className="w-12 h-6 rounded-full relative transition-all duration-300"
                style={{ backgroundColor: formData.isListed ? '#a855f7' : 'var(--border-color)' }}
              >
                <div
                  className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300"
                  style={{ left: formData.isListed ? '28px' : '4px' }}
                />
              </button>
            </div>

            {formData.isListed && (
              <div
                className="mt-6 pt-6 animate-in fade-in slide-in-from-top-2 duration-300"
                style={{ borderTop: '1px solid var(--border-color)' }}
              >
                <label className="text-[10px] font-bold uppercase tracking-widest block mb-3"
                  style={{ color: 'var(--text-main)', opacity: 0.4 }}>
                  Stock Ticker
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="E.G. AETH"
                    value={formData.stockTicker || ""}
                    onChange={(e) => handleFieldChange("stockTicker", e.target.value.toUpperCase())}
                    className="w-full h-[52px] px-5 rounded-xl font-mono uppercase focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
                    style={{
                      backgroundColor: 'var(--bg-main)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                    }}
                  />
                  <div
                    className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 rounded text-[10px] font-mono"
                    style={{
                      backgroundColor: 'var(--border-color)',
                      color: 'var(--text-main)',
                      opacity: 0.5,
                    }}
                  >
                    NYSE / NASDAQ
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-16">
        <NavigationButtons onNext={nextStep} onBack={prevStep} />
      </div>
    </div>
  );
};

export default Step2EnterpriseInfo;
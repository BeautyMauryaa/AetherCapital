import React, { useState } from 'react';
import { Building2, Hash, Calendar, Briefcase } from 'lucide-react';
import { useOnboardingStore } from "@/app/store/onboarding.store";
import NavigationButtons from "../../components/common/NavigationButtons";
import { useTheme } from "@/context/ThemeContext"; // Import the theme hook

const Step2EnterpriseInfo = () => {
  const { formData, updateForm, nextStep, prevStep } = useOnboardingStore();
  
  // Fix: Get the theme from your context
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [errors, setErrors] = useState({});

  const handleFieldChange = (field, value) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
    updateForm({ [field]: value });
  };

  const handleContinue = () => {
    const newErrors = {};
    if (!formData.legalName?.trim()) newErrors.legalName = "Company Name is required";
    if (!formData.regNumber?.trim()) newErrors.regNumber = "Registration Number is required";
    if (!formData.regDate?.trim()) newErrors.regDate = "Date is required";
    if (!formData.industry) newErrors.industry = "Industry is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    nextStep();
  };

  const getInputStyle = (fieldName) => ({
    backgroundColor: 'var(--card-bg)',
    border: errors[fieldName] ? '1px solid #ef4444' : '1px solid var(--border-color)',
    color: 'var(--text-main)',
  });

  const industries = ["Financial Services", "Technology", "Manufacturing", "Healthcare", "Energy", "Retail", "Telecommunications"];

  return (
    <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10">
        <h1 className="text-4xl font-semibold mb-3" style={{ color: 'var(--text-main)' }}>
          A bit about <span className="text-[#a855f7]">you.</span>
        </h1>
        <p className="text-[15px]" style={{ color: 'var(--text-main)', opacity: 0.4 }}>
          Personal details we'll use for KYC verification and compliance.
        </p>
      </div>

      <div className="space-y-8">
        {/* COMPANY NAME */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-main)', opacity: 0.5 }}>
              Company Name <span className="text-[#a855f7]">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Legal name"
                value={formData.legalName || ""}
                onChange={(e) => handleFieldChange("legalName", e.target.value)}
                className={`w-full h-[52px] px-4 rounded-xl focus:outline-none transition-all ${errors.legalName ? 'ring-1 ring-red-500/50' : 'focus:ring-1 focus:ring-purple-500/50'}`}
                style={getInputStyle("legalName")}
              />
              <Building2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: errors.legalName ? '#ef4444' : 'var(--text-main)', opacity: 0.2 }} />
            </div>
            {errors.legalName && <p className="text-[10px] text-red-500 font-medium">{errors.legalName}</p>}
          </div>

          <div className="space-y-2 pt-6">
            <input
              type="text"
              placeholder="Trade name (DBA)"
              value={formData.tradeName || ""}
              onChange={(e) => handleFieldChange("tradeName", e.target.value)}
              className="w-full h-[52px] px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
              style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
            />
          </div>
        </div>

        {/* REGISTRATION */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-main)', opacity: 0.5 }}>
              Registration <span className="text-[#a855f7]">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Registration number"
                value={formData.regNumber || ""}
                onChange={(e) => handleFieldChange("regNumber", e.target.value)}
                className={`w-full h-[52px] px-4 rounded-xl focus:outline-none transition-all ${errors.regNumber ? 'ring-1 ring-red-500/50' : 'focus:ring-1 focus:ring-purple-500/50'}`}
                style={getInputStyle("regNumber")}
              />
              <Hash size={16} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: errors.regNumber ? '#ef4444' : 'var(--text-main)', opacity: 0.2 }} />
            </div>
            {errors.regNumber && <p className="text-[10px] text-red-500 font-medium">{errors.regNumber}</p>}
          </div>

          <div className="space-y-2 pt-6">
            <div className="relative">
              <input
                type="datetime-local"
                value={formData.regDate || ""}
                onChange={(e) => handleFieldChange("regDate", e.target.value)}
                // Fix: isDark is now correctly defined and used here
                className={`w-full h-[52px] px-4 rounded-xl focus:outline-none transition-all cursor-pointer 
                  ${errors.regDate ? 'ring-1 ring-red-500/50' : 'focus:ring-1 focus:ring-purple-500/50'}
                  ${isDark ? 'scheme-dark' : 'scheme-light'}`}
                style={getInputStyle("regDate")}
              />
            </div>
            {errors.regDate && <p className="text-[10px] text-red-500 font-medium">{errors.regDate}</p>}
          </div>
        </div>

        {/* INDUSTRY */}
        <div className="space-y-2">
          <label className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-main)', opacity: 0.5 }}>
            Industry *
          </label>
          <div className="relative">
            <select
              value={formData.industry || ""}
              onChange={(e) => handleFieldChange("industry", e.target.value)}
              className={`w-full h-[52px] px-4 rounded-xl appearance-none focus:outline-none transition-all ${errors.industry ? 'ring-1 ring-red-500/50' : 'focus:ring-1 focus:ring-purple-500/50'}`}
              style={getInputStyle("industry")}
            >
              <option value="" disabled>Select industry</option>
              {industries.map(ind => (
                <option key={ind} value={ind} style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-main)' }}>{ind}</option>
              ))}
            </select>
            <Briefcase size={16} className="absolute right-10 top-1/2 -translate-y-1/2" style={{ color: errors.industry ? '#ef4444' : 'var(--text-main)', opacity: 0.2 }} />
          </div>
          {errors.industry && <p className="text-[10px] text-red-500 font-medium">{errors.industry}</p>}
        </div>

        {/* NUMBER OF EMPLOYEES */}
<div className="space-y-2">
  <label className="text-[11px] font-medium uppercase tracking-wider"
    style={{ color: 'var(--text-main)', opacity: 0.5 }}>
    Number of Employees
  </label>
  <div className="relative px-2">
    <input
      type="range"
      min={0} max={3} step={1}
      value={["1-10","11-50","51-200","200+"].indexOf(formData.employeeRange || "11-50") === -1 ? 1 : ["1-10","11-50","51-200","200+"].indexOf(formData.employeeRange || "11-50")}
      onChange={(e) => handleFieldChange("employeeRange", ["1-10","11-50","51-200","200+"][e.target.value])}
      className="w-full accent-purple-500 cursor-pointer"
    />
    <div className="flex justify-between mt-1">
      {["1-10","11-50","51-200","200+"].map((label, i) => (
        <span key={i}
          className="text-[11px] font-medium"
          style={{
            color: formData.employeeRange === label || (!formData.employeeRange && label === "11-50")
              ? "#a855f7" : "var(--text-main)",
            opacity: formData.employeeRange === label || (!formData.employeeRange && label === "11-50") ? 1 : 0.35
          }}>
          {label}
        </span>
      ))}
    </div>
  </div>
</div>

{/* ENTERPRISE DETAILS */}
<div className="space-y-4">
  <label className="text-[11px] font-bold uppercase tracking-wider"
    style={{ color: 'var(--text-main)', opacity: 0.5 }}>
    Enterprise Details
  </label>

  <div className="grid grid-cols-2 gap-4">
    {/* Subsidiary Count */}
    <div className="space-y-2">
      <label className="text-[11px] font-medium uppercase tracking-wider"
        style={{ color: 'var(--text-main)', opacity: 0.5 }}>
        Subsidiary Count
      </label>
      <div className="flex items-center h-[52px] rounded-xl overflow-hidden"
        style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
        <button
          type="button"
          onClick={() => handleFieldChange("subsidiaryCount", Math.max(0, (formData.subsidiaryCount || 0) - 1))}
          className="w-12 h-full flex items-center justify-center text-xl hover:bg-purple-500/10 transition-colors"
          style={{ color: 'var(--text-main)', opacity: 0.5 }}>
          −
        </button>
        <span className="flex-1 text-center text-[15px] font-semibold"
          style={{ color: 'var(--text-main)' }}>
          {formData.subsidiaryCount || 0}
        </span>
        <button
          type="button"
          onClick={() => handleFieldChange("subsidiaryCount", (formData.subsidiaryCount || 0) + 1)}
          className="w-12 h-full flex items-center justify-center text-xl hover:bg-purple-500/10 transition-colors"
          style={{ color: 'var(--text-main)', opacity: 0.5 }}>
          +
        </button>
      </div>
    </div>

    {/* Parent Company */}
    <div className="space-y-2">
      <label className="text-[11px] font-medium uppercase tracking-wider"
        style={{ color: 'var(--text-main)', opacity: 0.5 }}>
        Parent Company
      </label>
      <input
        type="text"
        placeholder="Parent or holding company"
        value={formData.parentCompany || ""}
        onChange={(e) => handleFieldChange("parentCompany", e.target.value)}
        className="w-full h-[52px] px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
        style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
      />
    </div>
  </div>

  {/* Listed Company Toggle */}
  <div className="flex items-center justify-between p-5 rounded-xl"
    style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
    <div>
      <p className="text-[14px] font-medium" style={{ color: 'var(--text-main)' }}>
        Listed company?
      </p>
      <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-main)', opacity: 0.4 }}>
        Toggle on to enter ticker symbol
      </p>
    </div>
    <button
      type="button"
      onClick={() => handleFieldChange("isListed", !formData.isListed)}
      className={`relative w-12 h-6 rounded-full transition-all duration-300
        ${formData.isListed ? 'bg-purple-500' : 'bg-gray-400/30'}`}>
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300
        ${formData.isListed ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  </div>

  {/* Ticker Symbol — shows only when listed */}
  {formData.isListed && (
    <input
      type="text"
      placeholder="Ticker symbol (e.g. AAPL)"
      value={formData.tickerSymbol || ""}
      onChange={(e) => handleFieldChange("tickerSymbol", e.target.value.toUpperCase())}
      className="w-full h-[52px] px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all animate-in fade-in duration-300"
      style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
    />
  )}
</div>

        {/* Navigation */}
        <div className="mt-16">
          <NavigationButtons onNext={handleContinue} onBack={prevStep} />
        </div>
      </div>
    </div>
  );
};

export default Step2EnterpriseInfo;

import React from 'react';
import { useOnboardingStore } from "@/app/store/onboarding.store";
import NavigationButtons from "../../components/common/NavigationButtons";

const Step2Org = () => {
  const { formData, updateForm, nextStep, prevStep } = useOnboardingStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateForm({ [name]: value });
  };

  // --- Validation Logic ---
  const handleNext = () => {
    const requiredFields = ['companyName', 'regNumber', 'industry'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      alert("Please fill in all required fields marked with *");
      return;
    }
    nextStep();
  };

  const inputStyle = {
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-main)',
  };

  const labelStyle = {
    color: 'var(--text-main)',
    opacity: 0.4,
  };

  return (
    <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="mb-10">
        <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-[#a855f7] uppercase mb-4 before:content-[''] before:w-8 before:h-[1px] before:bg-[#a855f7]">
          STEP 02 / 06
        </p>
        <h1 className="text-[40px] font-bold leading-tight tracking-tight mb-4" style={{ color: 'var(--text-main)' }}>
          A bit about <span className="text-[#a855f7]">the entity.</span>
        </h1>
        <p className="text-[15px] opacity-50" style={{ color: 'var(--text-main)' }}>
          Official organization details required for regulatory compliance.
        </p>
      </div>

      <div className="space-y-8">
        {/* Company Name Row */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-bold tracking-[0.2em] uppercase block mb-3" style={labelStyle}>
              COMPANY NAME <span className="text-[#a855f7]">*</span>
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName || ""}
              onChange={handleChange}
              placeholder="Legal entity name"
              className="w-full rounded-2xl px-5 py-4 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all border-transparent"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold tracking-[0.2em] uppercase block mb-3" style={labelStyle}>
              TRADE NAME (DBA)
            </label>
            <input
              type="text"
              name="tradeName"
              value={formData.tradeName || ""}
              onChange={handleChange}
              placeholder="If different from legal"
              className="w-full rounded-2xl px-5 py-4 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all border-transparent"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Registration Row */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-bold tracking-[0.2em] uppercase block mb-3" style={labelStyle}>
              REGISTRATION <span className="text-[#a855f7]">*</span>
            </label>
            <input
              type="text"
              name="regNumber"
              value={formData.regNumber || ""}
              onChange={handleChange}
              placeholder="CRN / Tax ID"
              className="w-full rounded-2xl px-5 py-4 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all border-transparent"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold tracking-[0.2em] uppercase block mb-3" style={labelStyle}>
              INCORPORATION DATE
            </label>
            <input
              type="date"
              name="incDate"
              value={formData.incDate || ""}
              onChange={handleChange}
              className="w-full rounded-2xl px-5 py-4 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all border-transparent"
              style={{
                ...inputStyle,
                colorScheme: 'var(--color-scheme, light)',
              }}
            />
          </div>
        </div>

        {/* Industry */}
        <div>
          <label className="text-[10px] font-bold tracking-[0.2em] uppercase block mb-3" style={labelStyle}>
            INDUSTRY <span className="text-[#a855f7]">*</span>
          </label>
          <div className="relative">
            <select
              name="industry"
              value={formData.industry || ""}
              onChange={handleChange}
              className="w-full rounded-2xl px-5 py-4 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all appearance-none border-transparent"
              style={inputStyle}
            >
              <option value="" style={{ backgroundColor: 'var(--card-bg)' }}>Select primary sector</option>
              <option value="fintech" style={{ backgroundColor: 'var(--card-bg)' }}>Fintech / Neobanking</option>
              <option value="crypto" style={{ backgroundColor: 'var(--card-bg)' }}>Crypto / Web3 Infrastructure</option>
              <option value="ecommerce" style={{ backgroundColor: 'var(--card-bg)' }}>Global E-commerce</option>
              <option value="saas" style={{ backgroundColor: 'var(--card-bg)' }}>Software as a Service</option>
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>

        {/* Employees Slider */}
        <div className="pt-4">
          <div className="flex justify-between items-end mb-8">
            <label className="text-[10px] font-bold tracking-[0.2em] uppercase" style={labelStyle}>
              TEAM SIZE
            </label>
            <span className="text-[10px] font-mono text-[#a855f7] font-bold">
              ESTIMATED HEADCOUNT
            </span>
          </div>
          <div className="px-2">
            <input
              type="range"
              min="1" max="4" step="1"
              name="employeeRange"
              value={formData.employeeRange || 2}
              onChange={handleChange}
              className="w-full h-[2px] rounded-lg appearance-none cursor-pointer accent-[#a855f7]"
              style={{ backgroundColor: 'var(--border-color)' }}
            />
            <div className="flex justify-between mt-6 text-[10px] font-mono uppercase tracking-widest">
              {['1-10', '11-50', '51-200', '200+'].map((label, i) => (
                <span
                  key={label}
                  className="transition-all duration-300"
                  style={{
                    color: Number(formData.employeeRange || 2) === i + 1 ? '#a855f7' : 'var(--text-main)',
                    opacity: Number(formData.employeeRange || 2) === i + 1 ? 1 : 0.2,
                    fontWeight: Number(formData.employeeRange || 2) === i + 1 ? 800 : 400,
                    transform: Number(formData.employeeRange || 2) === i + 1 ? 'translateY(-2px)' : 'none',
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <NavigationButtons onNext={handleNext} onBack={prevStep} />
      </div>
    </div>
  );
};

export default Step2Org;
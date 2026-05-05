import React from 'react';
import { useOnboardingStore } from "@/app/store/onboarding.store";
import NavigationButtons from "../../components/common/NavigationButtons";

const Step2Org = () => {
  const { formData, updateForm, nextStep, prevStep } = useOnboardingStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateForm({ [name]: value });
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
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-10">
        <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-[#a855f7] uppercase mb-3 before:content-[''] before:w-6 before:h-[1px] before:bg-[#a855f7]">
          STEP 02 / 06
        </p>
        <h1 className="text-4xl font-semibold mb-3" style={{ color: 'var(--text-main)' }}>
          A bit about <span className="text-[#a855f7]">you</span>.
        </h1>
        <p className="text-[14px]" style={{ color: 'var(--text-main)', opacity: 0.5 }}>
          Personal details we'll use for KYC verification and compliance.
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
              placeholder="Legal name"
              className="w-full rounded-xl px-5 py-4 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold tracking-[0.2em] uppercase block mb-3 opacity-0" style={labelStyle}>
              TRADE NAME
            </label>
            <input
              type="text"
              name="tradeName"
              value={formData.tradeName || ""}
              onChange={handleChange}
              placeholder="Trade name (DBA)"
              className="w-full rounded-xl px-5 py-4 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
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
              placeholder="Registration number"
              className="w-full rounded-xl px-5 py-4 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold tracking-[0.2em] uppercase block mb-3 opacity-0" style={labelStyle}>
              DATE
            </label>
            <input
              type="date"
              name="incDate"
              value={formData.incDate || ""}
              onChange={handleChange}
              className="w-full rounded-xl px-5 py-4 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
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
          <select
            name="industry"
            value={formData.industry || ""}
            onChange={handleChange}
            className="w-full rounded-xl px-5 py-4 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all appearance-none"
            style={inputStyle}
          >
            <option value="" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-main)' }}>
              Select industry
            </option>
            <option value="fintech" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-main)' }}>
              Fintech
            </option>
            <option value="crypto" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-main)' }}>
              Crypto / Web3
            </option>
            <option value="ecommerce" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-main)' }}>
              E-commerce
            </option>
          </select>
        </div>

        {/* Employees Slider */}
        <div>
          <label className="text-[10px] font-bold tracking-[0.2em] uppercase block mb-8" style={labelStyle}>
            NUMBER OF EMPLOYEES
          </label>
          <div className="px-2">
            <input
              type="range"
              min="1" max="4" step="1"
              name="employeeRange"
              value={formData.employeeRange || 2}
              onChange={handleChange}
              className="w-full h-1 rounded-lg appearance-none cursor-pointer accent-[#a855f7]"
              style={{ backgroundColor: 'var(--border-color)' }}
            />
            <div className="flex justify-between mt-4 text-[10px] font-mono uppercase tracking-widest">
              {['1-10', '11-50', '51-200', '200+'].map((label, i) => (
                <span
                  key={label}
                  style={{
                    color: Number(formData.employeeRange) === i + 1 ? '#a855f7' : 'var(--text-main)',
                    opacity: Number(formData.employeeRange) === i + 1 ? 1 : 0.2,
                    fontWeight: Number(formData.employeeRange) === i + 1 ? 700 : 400,
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <NavigationButtons onNext={nextStep} onBack={prevStep} />
      </div>
    </div>
  );
};

export default Step2Org;
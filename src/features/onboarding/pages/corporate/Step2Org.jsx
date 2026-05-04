import React from 'react';
import { useOnboardingStore } from "@/app/store/onboarding.store";
import NavigationButtons from "../../components/common/NavigationButtons";

const Step2Org = () => {
  const { formData, updateForm, nextStep, prevStep } = useOnboardingStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateForm({ [name]: value });
  };

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-10">
        <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-[#a855f7] uppercase mb-3 before:content-[''] before:w-6 before:h-[1px] before:bg-[#a855f7]">
          STEP 02 / 06
        </p>
        <h1 className="text-4xl font-semibold text-white mb-3">
          A bit about <span className="text-[#a855f7]">you</span>.
        </h1>
        <p className="text-[14px] text-white/50">
          Personal details we'll use for KYC verification and compliance.
        </p>
      </div>

      <div className="space-y-8">
        {/* Company Name Row */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase block mb-3">
              COMPANY NAME <span className="text-[#a855f7]">*</span>
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName || ""}
              onChange={handleChange}
              placeholder="Legal name"
              className="w-full bg-[#13131A] border border-white/[0.05] rounded-xl px-5 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-[#a855f7]/50 transition-all"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase block mb-3 opacity-0">
              TRADE NAME
            </label>
            <input
              type="text"
              name="tradeName"
              value={formData.tradeName || ""}
              onChange={handleChange}
              placeholder="Trade name (DBA)"
              className="w-full bg-[#13131A] border border-white/[0.05] rounded-xl px-5 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-[#a855f7]/50 transition-all"
            />
          </div>
        </div>

        {/* Registration Row */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase block mb-3">
              REGISTRATION <span className="text-[#a855f7]">*</span>
            </label>
            <input
              type="text"
              name="regNumber"
              value={formData.regNumber || ""}
              onChange={handleChange}
              placeholder="Registration number"
              className="w-full bg-[#13131A] border border-white/[0.05] rounded-xl px-5 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-[#a855f7]/50 transition-all"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase block mb-3 opacity-0">
              DATE
            </label>
            <input
              type="date"
              name="incDate"
              value={formData.incDate || ""}
              onChange={handleChange}
              className="w-full bg-[#13131A] border border-white/[0.05] rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#a855f7]/50 transition-all [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Industry Selection */}
        <div>
          <label className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase block mb-3">
            INDUSTRY <span className="text-[#a855f7]">*</span>
          </label>
          <select
            name="industry"
            value={formData.industry || ""}
            onChange={handleChange}
            className="w-full bg-[#13131A] border border-white/[0.05] rounded-xl px-5 py-4 text-white/40 focus:outline-none focus:border-[#a855f7]/50 transition-all appearance-none"
          >
            <option value="">Select industry</option>
            <option value="fintech">Fintech</option>
            <option value="crypto">Crypto / Web3</option>
            <option value="ecommerce">E-commerce</option>
          </select>
        </div>

        {/* Number of Employees Slider */}
        <div>
          <label className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase block mb-8">
            NUMBER OF EMPLOYEES
          </label>
          <div className="px-2">
            <input
              type="range"
              min="1"
              max="4"
              step="1"
              name="employeeRange"
              value={formData.employeeRange || 2}
              onChange={handleChange}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#a855f7]"
            />
            <div className="flex justify-between mt-4 text-[10px] font-mono text-white/20 uppercase tracking-widest">
              <span>1-10</span>
              <span className="text-[#a855f7] font-bold">11-50</span>
              <span>51-200</span>
              <span>200+</span>
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
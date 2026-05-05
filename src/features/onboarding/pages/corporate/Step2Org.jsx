import React from 'react';
import { useOnboardingStore } from "@/app/store/onboarding.store";
import NavigationButtons from "../../components/common/NavigationButtons";
import "./Step2Org.css";

const Step2Org = () => {
  const { formData, updateForm, nextStep, prevStep } = useOnboardingStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateForm({ [name]: value });
  };

  const employeeRanges = ['1-10', '11-50', '51-200', '200+'];

  return (
    <div className="org-step-container">
      <div className="mb-10">
        <p className="step-subtitle-meta">
          STEP 02 / 06
        </p>
        <h1 className="org-title">
          A bit about <span className="text-[#a855f7]">you</span>.
        </h1>
        <p className="org-description">
          Personal details we'll use for KYC verification and compliance.
        </p>
      </div>

      <div className="space-y-8">
        <div className="org-form-grid">
          <div>
            <label className="org-field-label">
              COMPANY NAME <span className="text-[#a855f7]">*</span>
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName || ""}
              onChange={handleChange}
              placeholder="Legal name"
              className="org-input"
            />
          </div>
          <div>
            <label className="org-field-label opacity-0">
              TRADE NAME
            </label>
            <input
              type="text"
              name="tradeName"
              value={formData.tradeName || ""}
              onChange={handleChange}
              placeholder="Trade name (DBA)"
              className="org-input"
            />
          </div>
        </div>
        <div className="org-form-grid">
          <div>
            <label className="org-field-label">
              REGISTRATION <span className="text-[#a855f7]">*</span>
            </label>
            <input
              type="text"
              name="regNumber"
              value={formData.regNumber || ""}
              onChange={handleChange}
              placeholder="Registration number"
              className="org-input"
            />
          </div>
          <div>
            <label className="org-field-label opacity-0">
              DATE
            </label>
            <input
              type="date"
              name="incDate"
              value={formData.incDate || ""}
              onChange={handleChange}
              className="org-input org-input-date"
            />
          </div>
        </div>

        <div>
          <label className="org-field-label">
            INDUSTRY <span className="text-[#a855f7]">*</span>
          </label>
          <select
            name="industry"
            value={formData.industry || ""}
            onChange={handleChange}
            className="org-input org-select"
          >
            <option value="" className="org-select-option">
              Select industry
            </option>
            <option value="fintech" className="org-select-option">
              Fintech
            </option>
            <option value="crypto" className="org-select-option">
              Crypto / Web3
            </option>
            <option value="ecommerce" className="org-select-option">
              E-commerce
            </option>
          </select>
        </div>

        <div>
          <label className="org-field-label !mb-8">
            NUMBER OF EMPLOYEES
          </label>
          <div className="px-2">
            <input
              type="range"
              min="1" max="4" step="1"
              name="employeeRange"
              value={formData.employeeRange || 2}
              onChange={handleChange}
              className="employee-slider-input"
            />
            <div className="slider-labels-container">
              {employeeRanges.map((label, i) => {
                const isSelected = Number(formData.employeeRange) === i + 1;
                return (
                  <span
                    key={label}
                    className="slider-tick-label"
                    style={{
                      color: isSelected ? '#a855f7' : 'var(--text-main)',
                      opacity: isSelected ? 1 : 0.2,
                      fontWeight: isSelected ? 700 : 400,
                    }}
                  >
                    {label}
                  </span>
                );
              })}
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
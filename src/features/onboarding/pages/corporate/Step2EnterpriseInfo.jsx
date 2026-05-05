import React from 'react';
import { Building2, Hash, Calendar, Briefcase } from 'lucide-react';
import { useOnboardingStore } from "@/app/store/onboarding.store";
import NavigationButtons from "../../components/common/NavigationButtons";
import "./Step2EnterpriseInfo.css";

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
    <div className="enterprise-info-container">
      {/* Header */}
      <div className="mb-10">
        <h1 className="step-title">
          A bit about <span className="text-[#a855f7]">you.</span>
        </h1>
        <p className="step-subtitle">
          Personal details we'll use for KYC verification and compliance.
        </p>
      </div>

      <div className="form-section">
        {/* ── COMPANY NAME ── */}
        <div className="form-grid-2">
          <div className="input-group">
            <label className="field-label">
              Company Name <span className="text-[#a855f7]">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Legal name"
                value={formData.legalName || ""}
                onChange={(e) => handleFieldChange("legalName", e.target.value)}
                className="base-input"
              />
              <Building2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20" />
            </div>
          </div>
          <div className="input-group pt-6">
            <input
              type="text"
              placeholder="Trade name (DBA)"
              value={formData.tradeName || ""}
              onChange={(e) => handleFieldChange("tradeName", e.target.value)}
              className="base-input"
            />
          </div>
        </div>

        {/* ── REGISTRATION ── */}
        <div className="form-grid-2">
          <div className="input-group">
            <label className="field-label">
              Registration <span className="text-[#a855f7]">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Registration number"
                value={formData.regNumber || ""}
                onChange={(e) => handleFieldChange("regNumber", e.target.value)}
                className="base-input"
              />
              <Hash size={16} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20" />
            </div>
          </div>
          <div className="input-group pt-6">
            <div className="relative">
              <input
                type="text"
                placeholder="mm/dd/yyyy"
                value={formData.regDate || ""}
                onChange={(e) => handleFieldChange("regDate", e.target.value)}
                className="base-input"
              />
              <Calendar size={16} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20" />
            </div>
          </div>
        </div>

        {/* ── INDUSTRY ── */}
        <div className="input-group">
          <label className="field-label">Industry *</label>
          <div className="relative">
            <select
              value={formData.industry || ""}
              onChange={(e) => handleFieldChange("industry", e.target.value)}
              className="base-select"
            >
              <option value="" disabled className="select-option">Select industry</option>
              {industries.map(ind => (
                <option key={ind} value={ind} className="select-option">
                  {ind}
                </option>
              ))}
            </select>
            <Briefcase size={16} className="absolute right-10 top-1/2 -translate-y-1/2 opacity-20" />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/30">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* ── EMPLOYEES SLIDER ── */}
        <div className="space-y-6">
          <label className="field-label">Number of Employees</label>
          <div className="relative pt-2">
            <input
              type="range" min="1" max="4" step="1"
              value={formData.employeeRange || 2}
              onChange={(e) => handleFieldChange("employeeRange", e.target.value)}
              className="employee-slider"
            />
            <div className="flex justify-between mt-4">
              {['1-10', '11-50', '51-200', '200+'].map((label, i) => (
                <span key={label}
                  className="slider-label"
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
          <div className="divider-container">
            <h3 className="divider-text">Enterprise Details</h3>
            <div className="divider-line" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="input-group">
              <label className="field-label block">Subsidiary Count</label>
              <div className="counter-wrapper">
                <button
                  onClick={() => handleFieldChange("subsidiaryCount", Math.max(0, (formData.subsidiaryCount || 0) - 1))}
                  className="counter-btn"
                >
                  −
                </button>
                <input
                  type="number"
                  value={formData.subsidiaryCount || 0}
                  readOnly
                  className="counter-input"
                />
                <button
                  onClick={() => handleFieldChange("subsidiaryCount", (formData.subsidiaryCount || 0) + 1)}
                  className="counter-btn"
                >
                  +
                </button>
              </div>
            </div>

            <div className="input-group">
              <label className="field-label block">Parent Company</label>
              <input
                type="text"
                placeholder="Parent or holding company"
                value={formData.parentCompany || ""}
                onChange={(e) => handleFieldChange("parentCompany", e.target.value)}
                className="base-input"
              />
            </div>
          </div>

          {/* Listed Company Toggle */}
          <div className={`toggle-card ${formData.isListed ? "toggle-card-active" : ""}`}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-foreground">Listed company?</h4>
                <p className="text-[11px] italic text-foreground/30">Toggle on to enter ticker symbol</p>
              </div>
              <button
                type="button"
                onClick={() => handleFieldChange("isListed", !formData.isListed)}
                className="toggle-switch"
                style={{ backgroundColor: formData.isListed ? '#a855f7' : 'var(--border-color)' }}
              >
                <div
                  className="toggle-knob"
                  style={{ left: formData.isListed ? '28px' : '4px' }}
                />
              </button>
            </div>

            {formData.isListed && (
              <div className="ticker-input-wrapper">
                <label className="field-label !block mb-3 opacity-40">Stock Ticker</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="E.G. AETH"
                    value={formData.stockTicker || ""}
                    onChange={(e) => handleFieldChange("stockTicker", e.target.value.toUpperCase())}
                    className="ticker-input"
                  />
                  <div className="ticker-badge">NYSE / NASDAQ</div>
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
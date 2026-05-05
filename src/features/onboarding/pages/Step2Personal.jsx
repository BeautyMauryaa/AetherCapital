import React, { useState } from "react";
import { useOnboardingStore } from "@/app/store/onboarding.store";
import NavigationButtons from "../components/common/NavigationButtons";
import StepHeader from "../components/StepHeader";
import { ChevronDown, Search } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

import "./Step2Personal.css";

const GENDERS = ["Female", "Male", "Non-binary", "Prefer not to say"];
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const YEARS = Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - i);
const COUNTRIES = ["Afghanistan","Albania","Algeria","Argentina","Australia","Austria","Bangladesh","Belgium","Brazil","Canada","Chile","China","Colombia","Denmark","Egypt","Ethiopia","Finland","France","Germany","Ghana","Greece","Hungary","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Japan","Jordan","Kenya","Malaysia","Mexico","Morocco","Netherlands","New Zealand","Nigeria","Norway","Pakistan","Peru","Philippines","Poland","Portugal","Romania","Russia","Saudi Arabia","South Africa","South Korea","Spain","Sweden","Switzerland","Thailand","Turkey","Ukraine","United Arab Emirates","United Kingdom","United States","Vietnam","Zimbabwe"];

const Step2Personal = () => {
  const { nextStep, updateForm, formData } = useOnboardingStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [firstName, setFirstName]   = useState(formData.firstName   || "");
  const [middleName, setMiddleName] = useState(formData.middleName  || "");
  const [lastName, setLastName]     = useState(formData.lastName    || "");
  const [day, setDay]               = useState(formData.dobDay       || "");
  const [month, setMonth]           = useState(formData.dobMonth     || "");
  const [year, setYear]             = useState(formData.dobYear      || "");
  const [gender, setGender]         = useState(formData.gender       || "");
  const [countrySearch, setCountrySearch] = useState(formData.nationality || "");
  const [showDropdown, setShowDropdown]   = useState(false);
  const [nationality, setNationality]     = useState(formData.nationality || "");

  const filtered = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const selectCountry = (c) => {
    setNationality(c);
    setCountrySearch(c);
    setShowDropdown(false);
  };

  const handleContinue = () => {
    updateForm({ firstName, middleName, lastName, dobDay: day, dobMonth: month, dobYear: year, gender, nationality });
    nextStep();
  };

  const labelClass = `text-[10px] font-bold tracking-[0.22em] uppercase mb-4 ${isDark ? "text-white/40" : "text-slate-400"}`;

  return (
    <div className="personal-container px-4 sm:px-6 lg:px-2 pt-6 sm:pt-10 pb-24 sm:pb-28">
      <StepHeader
        step={2}
        title="A bit about"
        highlight="you."
        subtitle="Personal details we'll use for KYC verification and compliance."
      />

      {/* FULL NAME */}
      <div className="mb-8">
        <p className={labelClass}>Full Name <span className="text-purple-500">*</span></p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input className="form-input-base" placeholder="First" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <input className="form-input-base" placeholder="Middle (optional)" value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
          <input className="form-input-base" placeholder="Last" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
      </div>

      {/* DATE OF BIRTH */}
      <div className="mb-8">
        <p className={labelClass}>Date of Birth <span className="text-purple-500">*</span></p>
        <div className="grid grid-cols-3 gap-3">
          {/* Day */}
          <div className="relative">
            <select value={day} onChange={(e) => setDay(e.target.value)} className="form-input-base pr-10 appearance-none cursor-pointer">
              <option value="" disabled>Day</option>
              {DAYS.map((d) => <option key={d} value={d} className={isDark ? "bg-[#16161D]" : "bg-white"}>{d}</option>)}
            </select>
            <ChevronDown size={16} className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? "text-white/30" : "text-slate-400"}`} />
          </div>
          {/* Month */}
          <div className="relative">
            <select value={month} onChange={(e) => setMonth(e.target.value)} className="form-input-base pr-10 appearance-none cursor-pointer">
              <option value="" disabled>Month</option>
              {MONTHS.map((m) => <option key={m} value={m} className={isDark ? "bg-[#16161D]" : "bg-white"}>{m}</option>)}
            </select>
            <ChevronDown size={16} className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? "text-white/30" : "text-slate-400"}`} />
          </div>
          {/* Year */}
          <div className="relative">
            <select value={year} onChange={(e) => setYear(e.target.value)} className="form-input-base pr-10 appearance-none cursor-pointer">
              <option value="" disabled>Year</option>
              {YEARS.map((y) => <option key={y} value={y} className={isDark ? "bg-[#16161D]" : "bg-white"}>{y}</option>)}
            </select>
            <ChevronDown size={16} className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? "text-white/30" : "text-slate-400"}`} />
          </div>
        </div>
      </div>

      {/* GENDER */}
      <div className="mb-8">
        <p className={labelClass}>Gender</p>
        <div className="flex flex-wrap gap-3">
          {GENDERS.map((g) => (
            <button
              key={g}
              onClick={() => setGender(g)}
              className={`gender-btn ${gender === g ? 'active' : ''}`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* NATIONALITY */}
      <div className="mb-8 relative">
        <p className={labelClass}>Nationality <span className="text-purple-500">*</span></p>
        <div className="relative">
          <div className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? "text-white/25" : "text-slate-400"}`}>
            <Search size={15} />
          </div>
          <input
            type="text"
            placeholder="Search countries..."
            value={countrySearch}
            onChange={(e) => { setCountrySearch(e.target.value); setNationality(""); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // Allow click to register
            className="form-input-base pl-10 pr-10"
          />
          <ChevronDown
            size={16}
            className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform
              ${showDropdown ? "rotate-180" : ""}
              ${isDark ? "text-white/30" : "text-slate-400"}`}
          />
        </div>

        {showDropdown && filtered.length > 0 && (
          <div className="country-dropdown">
            {filtered.map((c) => (
              <button
                key={c}
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevent blur before click
                  selectCountry(c);
                }}
                className={`country-option ${nationality === c ? 'selected' : ''}`}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      <NavigationButtons onNext={handleContinue} />
    </div>
  );
};

export default Step2Personal;
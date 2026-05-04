import { useState } from "react";
import { useOnboardingStore } from "@/app/store/onboarding.store";
import NavigationButtons from "../components/common/NavigationButtons";
import { ChevronDown, Search } from "lucide-react";

const GENDERS = ["Female", "Male", "Non-binary", "Prefer not to say"];

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
const YEARS = Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - i);

const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Argentina","Australia","Austria","Bangladesh",
  "Belgium","Brazil","Canada","Chile","China","Colombia","Denmark","Egypt",
  "Ethiopia","Finland","France","Germany","Ghana","Greece","Hungary","India",
  "Indonesia","Iran","Iraq","Ireland","Israel","Italy","Japan","Jordan","Kenya",
  "Malaysia","Mexico","Morocco","Netherlands","New Zealand","Nigeria","Norway",
  "Pakistan","Peru","Philippines","Poland","Portugal","Romania","Russia",
  "Saudi Arabia","South Africa","South Korea","Spain","Sweden","Switzerland",
  "Thailand","Turkey","Ukraine","United Arab Emirates","United Kingdom",
  "United States","Vietnam","Zimbabwe"
];

/* ── Reusable styled input ── */
const Field = ({ placeholder, value, onChange, type = "text" }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full h-[52px] px-4 rounded-xl bg-[#111118] border border-white/[0.08]
      text-[14px] text-white placeholder:text-white/25
      focus:outline-none focus:border-purple-500/50 focus:bg-[#13111e]
      transition-all duration-200"
  />
);

/* ── Reusable styled select ── */
const StyledSelect = ({ value, onChange, placeholder, children }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-[52px] px-4 pr-10 rounded-xl bg-[#111118] border border-white/[0.08]
        text-[14px] text-white appearance-none cursor-pointer
        focus:outline-none focus:border-purple-500/50 focus:bg-[#13111e]
        transition-all duration-200"
      style={{ colorScheme: "dark" }}
    >
      <option value="" disabled className="bg-[#111118]">{placeholder}</option>
      {children}
    </select>
    <ChevronDown
      size={16}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
    />
  </div>
);

/* ── Section label ── */
const SectionLabel = ({ children, required }) => (
  <p className="text-[10px] font-bold tracking-[0.22em] text-white/40 uppercase mb-4">
    {children}
    {required && <span className="text-purple-500 ml-1">*</span>}
  </p>
);

const Step2Personal = () => {
  const { nextStep, updateForm, formData } = useOnboardingStore();

  const [firstName, setFirstName]   = useState(formData.firstName   || "");
  const [middleName, setMiddleName] = useState(formData.middleName  || "");
  const [lastName, setLastName]     = useState(formData.lastName    || "");
  const [day, setDay]               = useState(formData.dobDay      || "");
  const [month, setMonth]           = useState(formData.dobMonth    || "");
  const [year, setYear]             = useState(formData.dobYear     || "");
  const [gender, setGender]         = useState(formData.gender      || "");
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

  return (
    <div className="max-w-4xl mx-auto px-2 pt-10 pb-28">

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-[1.5px] bg-purple-500 rounded-full" />
        <span className="font-mono text-[11px] tracking-[0.2em] text-purple-500 uppercase font-bold">
          Step 02 / 06
        </span>
      </div>

      {/* Heading */}
      <h1 className="text-[42px] font-bold leading-tight tracking-tight mb-3">
        A bit about{" "}
        <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
          you.
        </span>
      </h1>
      <p className="text-[15px] text-white/45 mb-10">
        Personal details we'll use for KYC verification and compliance.
      </p>

      {/* ── FULL NAME ── */}
      <div className="mb-8">
        <SectionLabel required>Full Name</SectionLabel>
        <div className="grid grid-cols-3 gap-3">
          <Field placeholder="First"             value={firstName}  onChange={setFirstName}  />
          <Field placeholder="Middle (optional)" value={middleName} onChange={setMiddleName} />
          <Field placeholder="Last"              value={lastName}   onChange={setLastName}   />
        </div>
      </div>

      {/* ── DATE OF BIRTH ── */}
      <div className="mb-8">
        <SectionLabel required>Date of Birth</SectionLabel>
        <div className="grid grid-cols-3 gap-3">
          <StyledSelect value={day}   onChange={setDay}   placeholder="Day">
            {DAYS.map((d) => <option key={d} value={d} className="bg-[#111118]">{d}</option>)}
          </StyledSelect>
          <StyledSelect value={month} onChange={setMonth} placeholder="Month">
            {MONTHS.map((m) => <option key={m} value={m} className="bg-[#111118]">{m}</option>)}
          </StyledSelect>
          <StyledSelect value={year}  onChange={setYear}  placeholder="Year">
            {YEARS.map((y) => <option key={y} value={y} className="bg-[#111118]">{y}</option>)}
          </StyledSelect>
        </div>
      </div>

      {/* ── GENDER ── */}
      <div className="mb-8">
        <SectionLabel>Gender</SectionLabel>
        <div className="flex flex-wrap gap-3">
          {GENDERS.map((g) => (
            <button
              key={g}
              onClick={() => setGender(g)}
              className={`px-5 py-2.5 rounded-full text-[13px] font-medium border transition-all duration-200
                ${gender === g
                  ? "border-purple-500/70 bg-purple-500/10 text-white shadow-[0_0_0_1px_rgba(139,92,246,0.3)]"
                  : "border-white/[0.12] bg-transparent text-white/60 hover:border-white/25 hover:text-white/80"
                }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* ── NATIONALITY ── */}
      <div className="mb-8 relative">
        <SectionLabel required>Nationality</SectionLabel>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none">
            <Search size={15} />
          </div>
          <input
            type="text"
            placeholder="Search countries..."
            value={countrySearch}
            onChange={(e) => {
              setCountrySearch(e.target.value);
              setNationality("");
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className="w-full h-[52px] pl-10 pr-10 rounded-xl bg-[#111118] border border-white/[0.08]
              text-[14px] text-white placeholder:text-white/25
              focus:outline-none focus:border-purple-500/50 focus:bg-[#13111e]
              transition-all duration-200"
          />
          <ChevronDown
            size={16}
            className={`absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none transition-transform ${showDropdown ? "rotate-180" : ""}`}
          />
        </div>

        {/* Dropdown */}
        {showDropdown && filtered.length > 0 && (
          <div className="absolute z-50 top-full mt-1 w-full max-h-52 overflow-y-auto
            bg-[#16161f] border border-white/[0.08] rounded-xl shadow-2xl">
            {filtered.map((c) => (
              <button
                key={c}
                onMouseDown={() => selectCountry(c)}
                className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors
                  ${nationality === c
                    ? "bg-purple-500/15 text-white"
                    : "text-white/60 hover:bg-white/[0.05] hover:text-white"
                  }`}
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
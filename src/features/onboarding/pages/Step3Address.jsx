import { useState } from "react";
import { useOnboardingStore } from "@/app/store/onboarding.store";
import NavigationButtons from "../components/common/NavigationButtons";
import { ChevronDown, MapPin } from "lucide-react";

const COUNTRIES_WITH_FLAGS = [
  { code: "US", flag: "🇺🇸", name: "United States" },
  { code: "GB", flag: "🇬🇧", name: "United Kingdom" },
  { code: "CA", flag: "🇨🇦", name: "Canada" },
  { code: "AU", flag: "🇦🇺", name: "Australia" },
  { code: "IN", flag: "🇮🇳", name: "India" },
  { code: "DE", flag: "🇩🇪", name: "Germany" },
  { code: "FR", flag: "🇫🇷", name: "France" },
  { code: "JP", flag: "🇯🇵", name: "Japan" },
  { code: "CN", flag: "🇨🇳", name: "China" },
  { code: "BR", flag: "🇧🇷", name: "Brazil" },
  { code: "MX", flag: "🇲🇽", name: "Mexico" },
  { code: "SG", flag: "🇸🇬", name: "Singapore" },
  { code: "AE", flag: "🇦🇪", name: "United Arab Emirates" },
  { code: "ZA", flag: "🇿🇦", name: "South Africa" },
  { code: "NG", flag: "🇳🇬", name: "Nigeria" },
  { code: "KE", flag: "🇰🇪", name: "Kenya" },
  { code: "PK", flag: "🇵🇰", name: "Pakistan" },
  { code: "BD", flag: "🇧🇩", name: "Bangladesh" },
  { code: "PH", flag: "🇵🇭", name: "Philippines" },
  { code: "ID", flag: "🇮🇩", name: "Indonesia" },
  { code: "NL", flag: "🇳🇱", name: "Netherlands" },
  { code: "IT", flag: "🇮🇹", name: "Italy" },
  { code: "ES", flag: "🇪🇸", name: "Spain" },
  { code: "KR", flag: "🇰🇷", name: "South Korea" },
  { code: "SA", flag: "🇸🇦", name: "Saudi Arabia" },
];

const TIMEZONE_BY_COUNTRY = {
  US: "America/New_York", GB: "Europe/London", CA: "America/Toronto",
  AU: "Australia/Sydney", IN: "Asia/Kolkata", DE: "Europe/Berlin",
  FR: "Europe/Paris", JP: "Asia/Tokyo", CN: "Asia/Shanghai",
  BR: "America/Sao_Paulo", MX: "America/Mexico_City", SG: "Asia/Singapore",
  AE: "Asia/Dubai", ZA: "Africa/Johannesburg", NG: "Africa/Lagos",
  KE: "Africa/Nairobi", PK: "Asia/Karachi", BD: "Asia/Dhaka",
  PH: "Asia/Manila", ID: "Asia/Jakarta", NL: "Europe/Amsterdam",
  IT: "Europe/Rome", ES: "Europe/Madrid", KR: "Asia/Seoul", SA: "Asia/Riyadh",
};

const TIMEZONES = [
  "America/New_York", "America/Toronto", "Europe/London", "Europe/Berlin",
  "Europe/Paris", "Asia/Tokyo", "Asia/Singapore", "Asia/Dubai",
  "Australia/Sydney", "Asia/Kolkata", "UTC", "America/Los_Angeles",
  "America/Chicago", "America/Sao_Paulo", "America/Mexico_City",
  "Africa/Lagos", "Africa/Johannesburg", "Africa/Nairobi",
  "Asia/Karachi", "Asia/Dhaka", "Asia/Manila", "Asia/Jakarta",
  "Asia/Shanghai", "Asia/Seoul", "Europe/Amsterdam", "Europe/Rome",
  "Europe/Madrid", "Pacific/Auckland",
];

const Field = ({ placeholder, value, onChange, hasError }) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`w-full h-[52px] px-4 rounded-xl bg-[#111118] border text-[14px] text-white
      placeholder:text-white/25 focus:outline-none transition-all duration-200
      ${hasError
        ? "border-red-500/60 focus:border-red-500"
        : "border-white/[0.08] focus:border-purple-500/50 focus:bg-[#13111e]"
      }`}
  />
);

const SectionLabel = ({ children, required }) => (
  <p className="text-[10px] font-bold tracking-[0.22em] text-white/40 uppercase mb-3">
    {children}{required && <span className="text-purple-500 ml-1">*</span>}
  </p>
);

const Step3Address = () => {
  const { nextStep, updateForm, formData } = useOnboardingStore();

  const [country, setCountry]             = useState(formData.country        || "US");
  const [address1, setAddress1]           = useState(formData.address1       || "");
  const [address2, setAddress2]           = useState(formData.address2       || "");
  const [city, setCity]                   = useState(formData.city           || "");
  const [state, setState]                 = useState(formData.state          || "");
  const [zip, setZip]                     = useState(formData.zip            || "");
  const [sameAsPrimary, setSameAsPrimary] = useState(formData.sameAsPrimary ?? true);
  const [mailAddress1, setMailAddress1]   = useState(formData.mailAddress1   || "");
  const [mailCity, setMailCity]           = useState(formData.mailCity       || "");
  const [mailState, setMailState]         = useState(formData.mailState      || "");
  const [mailPostal, setMailPostal]       = useState(formData.mailPostal     || "");
  const [timezone, setTimezone]           = useState(formData.timezone       || TIMEZONE_BY_COUNTRY["US"]);
  const [showCountryDrop, setShowCountryDrop] = useState(false);
  const [errors, setErrors]               = useState({});

  const selectedCountry = COUNTRIES_WITH_FLAGS.find((c) => c.code === country);

  const handleCountryChange = (code) => {
    setCountry(code);
    setTimezone(TIMEZONE_BY_COUNTRY[code] || "America/New_York");
    setShowCountryDrop(false);
  };

  const hasAddress   = address1.trim();
  const previewLine2 = [city, state, zip].filter(Boolean).join(", ");

  const validate = () => {
    const e = {};
    if (!address1.trim()) e.address1 = true;
    if (!city.trim())     e.city     = true;
    if (!zip.trim())      e.zip      = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinue = () => {
    if (!validate()) return;
    updateForm({
      country, address1, address2, city, state, zip,
      sameAsPrimary, mailAddress1, mailCity, mailState, mailPostal, timezone,
    });
    nextStep();
  };

  return (
    <div className="max-w-4xl mx-auto px-2 pt-10 pb-28">

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-[1.5px] bg-purple-500 rounded-full" />
        <span className="font-mono text-[11px] tracking-[0.2em] text-purple-500 uppercase font-bold">
          Step 03 / 06
        </span>
      </div>

      {/* Heading */}
      <h1 className="text-[42px] font-bold leading-tight tracking-tight mb-3">
        Address &{" "}
        <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
          location.
        </span>
      </h1>
      <p className="text-[15px] text-white/45 mb-10">
        Where you operate, where to mail you, and the hours we can reach you.
      </p>

      {/* PRIMARY ADDRESS label */}
      <p className="text-[10px] font-bold tracking-[0.22em] text-white/40 uppercase mb-6">
        Primary Address
      </p>

      {/* ── COUNTRY ── */}
      <div className="mb-5">
        <SectionLabel required>Country</SectionLabel>
        <div className="relative">
          <button
            onClick={() => setShowCountryDrop(!showCountryDrop)}
            onBlur={() => setTimeout(() => setShowCountryDrop(false), 150)}
            className="w-full h-[52px] px-4 rounded-xl bg-[#111118] border border-white/[0.08]
              flex items-center gap-3 text-[14px] text-white
              hover:border-white/[0.18] focus:outline-none focus:border-purple-500/50
              transition-all duration-200"
          >
            <span className="text-lg leading-none">{selectedCountry?.flag}</span>
            <span className="flex-1 text-left">{selectedCountry?.name}</span>
            <ChevronDown size={16} className={`text-white/30 transition-transform ${showCountryDrop ? "rotate-180" : ""}`} />
          </button>

          {showCountryDrop && (
            <div className="absolute z-50 top-full mt-1 w-full max-h-52 overflow-y-auto
              bg-[#16161f] border border-white/[0.08] rounded-xl shadow-2xl">
              {COUNTRIES_WITH_FLAGS.map((c) => (
                <button
                  key={c.code}
                  onMouseDown={() => handleCountryChange(c.code)}
                  className={`w-full text-left px-4 py-2.5 flex items-center gap-3 text-[13px] transition-colors
                    ${country === c.code
                      ? "bg-purple-500/15 text-white"
                      : "text-white/60 hover:bg-white/[0.05] hover:text-white"
                    }`}
                >
                  <span className="text-base">{c.flag}</span>
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── ADDRESS LINE 1 ── */}
      <div className="mb-5">
        <SectionLabel required>Address Line 1</SectionLabel>
        <Field
          placeholder="Street number and street name"
          value={address1}
          onChange={(v) => { setAddress1(v); setErrors((e) => ({ ...e, address1: false })); }}
          hasError={errors.address1}
        />
        {errors.address1 && <p className="text-[11px] text-red-400 mt-1.5">Address is required</p>}
      </div>

      {/* ── ADDRESS LINE 2 ── */}
      <div className="mb-5">
        <SectionLabel>Address Line 2</SectionLabel>
        <Field placeholder="Apt 4B" value={address2} onChange={setAddress2} />
        <p className="text-[12px] text-white/30 mt-2">Apartment, suite, floor — optional</p>
      </div>

      {/* ── CITY / STATE / ZIP ── */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div>
          <SectionLabel required>City</SectionLabel>
          <Field
            placeholder=""
            value={city}
            onChange={(v) => { setCity(v); setErrors((e) => ({ ...e, city: false })); }}
            hasError={errors.city}
          />
          {errors.city && <p className="text-[11px] text-red-400 mt-1.5">Required</p>}
        </div>
        <div>
          <SectionLabel>State</SectionLabel>
          <Field placeholder="" value={state} onChange={setState} />
        </div>
        <div>
          <SectionLabel required>ZIP</SectionLabel>
          <Field
            placeholder="10001"
            value={zip}
            onChange={(v) => { setZip(v); setErrors((e) => ({ ...e, zip: false })); }}
            hasError={errors.zip}
          />
          {errors.zip && <p className="text-[11px] text-red-400 mt-1.5">Required</p>}
        </div>
      </div>

      {/* ── MAP PREVIEW + ADDRESS VERIFICATION ── */}
      <div className="flex rounded-2xl overflow-hidden border border-white/[0.07] mb-6 min-h-[160px]">
        <div className="flex-1 bg-[#0e0e18] flex items-center justify-center relative">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative flex flex-col items-center">
            <MapPin
              size={32}
              className={`transition-colors duration-300 ${hasAddress ? "text-purple-500" : "text-purple-500/50"}`}
              fill={hasAddress ? "rgba(139,92,246,0.25)" : "transparent"}
            />
            <div className={`rounded-full blur-sm mt-0.5 h-1 transition-all duration-300
              ${hasAddress ? "bg-purple-500/60 w-8" : "bg-purple-500/20 w-4"}`}
            />
          </div>
        </div>

        <div className="w-[45%] bg-[#111118] px-6 py-5 flex flex-col justify-center border-l border-white/[0.06]">
          <p className="text-[9px] font-bold tracking-[0.22em] text-purple-400/80 uppercase mb-3">
            Address Verification
          </p>
          {hasAddress ? (
            <div className="space-y-1">
              <p className="text-[14px] font-medium text-white leading-snug">{address1}</p>
              {previewLine2 && <p className="text-[13px] text-white/50">{previewLine2}</p>}
              <p className="text-[11px] text-white/30 mt-2 italic">We'll verify this address</p>
            </div>
          ) : (
            <p className="text-[13px] text-white/30 leading-relaxed">
              Enter an address to preview the location.
            </p>
          )}
        </div>
      </div>

      {/* ── MAILING SAME AS PRIMARY CHECKBOX ── */}
      <div className="mb-6">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            onClick={() => setSameAsPrimary(!sameAsPrimary)}
            className={`w-5 h-5 rounded-[5px] border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200
              ${sameAsPrimary
                ? "bg-purple-600 border-purple-600 shadow-[0_0_8px_rgba(139,92,246,0.4)]"
                : "bg-transparent border-white/20 group-hover:border-white/40"
              }`}
          >
            {sameAsPrimary && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <span className="text-[14px] text-white/75 group-hover:text-white/90 transition-colors select-none">
            Mailing address is the same as primary
          </span>
        </label>
      </div>

      {/* ── MAILING ADDRESS SECTION (shown only when unchecked) ── */}
      {!sameAsPrimary && (
        <div className="mb-8 p-6 rounded-2xl border border-white/[0.07] bg-[#0f0f17]">
          <p className="text-[10px] font-bold tracking-[0.22em] text-white/40 uppercase mb-6">
            Mailing Address
          </p>

          <div className="mb-5">
            <SectionLabel>Address Line 1</SectionLabel>
            <Field
              placeholder="Street number and street name"
              value={mailAddress1}
              onChange={setMailAddress1}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <SectionLabel>City</SectionLabel>
              <Field placeholder="" value={mailCity} onChange={setMailCity} />
            </div>
            <div>
              <SectionLabel>State</SectionLabel>
              <Field placeholder="" value={mailState} onChange={setMailState} />
            </div>
            <div>
              <SectionLabel>Postal</SectionLabel>
              <Field placeholder="" value={mailPostal} onChange={setMailPostal} />
            </div>
          </div>
        </div>
      )}

      {/* ── TIME ZONE — native <select> so it opens browser's own dropdown ── */}
      <div className="mb-8">
        <SectionLabel>Time Zone</SectionLabel>
        <div className="relative">
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full h-[52px] px-4 pr-10 rounded-xl bg-[#111118] border border-white/[0.08]
              text-[14px] text-white appearance-none cursor-pointer
              focus:outline-none focus:border-purple-500/50 transition-all duration-200"
            style={{ colorScheme: "dark" }}
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz} className="bg-[#111118] text-white">
                {tz}
              </option>
            ))}
          </select>
          {/* Decorative chevron — pointer-events-none so clicks pass to select */}
          <ChevronDown
            size={16}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
          />
        </div>
        <p className="text-[12px] text-white/30 mt-2">Auto-detected from country — editable</p>
      </div>

      <NavigationButtons onNext={handleContinue} />
    </div>
  );
};

export default Step3Address;
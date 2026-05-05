import { useState } from "react";
import { useOnboardingStore } from "@/app/store/onboarding.store";
import NavigationButtons from "../components/common/NavigationButtons";
import StepHeader from "../components/StepHeader";
import { ChevronDown, MapPin } from "lucide-react";
import "./Step3Address.css";

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
    className={`s3-field-input ${hasError ? "s3-field-error" : "s3-field-default"}`}
  />
);

const SectionLabel = ({ children, required }) => (
  <p className="s3-label-base">
    {children}{required && <span className="s3-label-required">*</span>}
  </p>
);

const Step3Address = () => {
  const { nextStep, updateForm, formData } = useOnboardingStore();

  const [country, setCountry] = useState(formData.country || "US");
  const [address1, setAddress1] = useState(formData.address1 || "");
  const [address2, setAddress2] = useState(formData.address2 || "");
  const [city, setCity] = useState(formData.city || "");
  const [state, setState] = useState(formData.state || "");
  const [zip, setZip] = useState(formData.zip || "");
  const [sameAsPrimary, setSameAsPrimary] = useState(formData.sameAsPrimary ?? true);
  const [mailAddress1, setMailAddress1] = useState(formData.mailAddress1 || "");
  const [mailCity, setMailCity] = useState(formData.mailCity || "");
  const [mailState, setMailState] = useState(formData.mailState || "");
  const [mailPostal, setMailPostal] = useState(formData.mailPostal || "");
  const [timezone, setTimezone] = useState(formData.timezone || TIMEZONE_BY_COUNTRY["US"]);
  const [showCountryDrop, setShowCountryDrop] = useState(false);
  const [errors, setErrors] = useState({});

  const selectedCountry = COUNTRIES_WITH_FLAGS.find((c) => c.code === country);

  const handleCountryChange = (code) => {
    setCountry(code);
    setTimezone(TIMEZONE_BY_COUNTRY[code] || "America/New_York");
    setShowCountryDrop(false);
  };

  const hasAddress = address1.trim();
  const previewLine2 = [city, state, zip].filter(Boolean).join(", ");

  const validate = () => {
    const e = {};
    if (!address1.trim()) e.address1 = true;
    if (!city.trim()) e.city = true;
    if (!zip.trim()) e.zip = true;
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
    <div className="s3-container">
      <StepHeader
        step={3}
        title="Address &"
        highlight="location."
        subtitle="Where you operate, where to mail you, and the hours we can reach you."
      />

      <p className="s3-section-heading">Primary Address</p>

      {/* COUNTRY */}
      <div className="mb-5">
        <SectionLabel required>Country</SectionLabel>
        <div className="relative">
          <button
            onClick={() => setShowCountryDrop(!showCountryDrop)}
            onBlur={() => setTimeout(() => setShowCountryDrop(false), 150)}
            className="s3-dropdown-button"
          >
            <span className="text-lg leading-none">{selectedCountry?.flag}</span>
            <span className="flex-1 text-left">{selectedCountry?.name}</span>
            <ChevronDown size={16} className={`text-foreground/30 transition-transform ${showCountryDrop ? "rotate-180" : ""}`} />
          </button>

          {showCountryDrop && (
            <div className="s3-dropdown-menu">
              {COUNTRIES_WITH_FLAGS.map((c) => (
                <button
                  key={c.code}
                  onMouseDown={() => handleCountryChange(c.code)}
                  className={`s3-dropdown-item ${country === c.code ? "s3-dropdown-item-active" : "s3-dropdown-item-inactive"}`}
                >
                  <span className="text-base">{c.flag}</span>
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ADDRESS LINE 1 */}
      <div className="mb-5">
        <SectionLabel required>Address Line 1</SectionLabel>
        <Field
          placeholder="Street number and street name"
          value={address1}
          onChange={(v) => { setAddress1(v); setErrors((e) => ({ ...e, address1: false })); }}
          hasError={errors.address1}
        />
        {errors.address1 && <p className="s3-error-text">Address is required</p>}
      </div>

      {/* ADDRESS LINE 2 */}
      <div className="mb-5">
        <SectionLabel>Address Line 2</SectionLabel>
        <Field placeholder="Apt 4B" value={address2} onChange={setAddress2} />
        <p className="s3-helper-text">Apartment, suite, floor — optional</p>
      </div>

      {/* CITY / STATE / ZIP */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div>
          <SectionLabel required>City</SectionLabel>
          <Field
            placeholder=""
            value={city}
            onChange={(v) => { setCity(v); setErrors((e) => ({ ...e, city: false })); }}
            hasError={errors.city}
          />
          {errors.city && <p className="s3-error-text">Required</p>}
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
          {errors.zip && <p className="s3-error-text">Required</p>}
        </div>
      </div>

      {/* MAP PREVIEW */}
      <div className="s3-map-wrapper">
        <div className="s3-map-visual">
          <div
            className="s3-map-grid-overlay"
            style={{
              backgroundImage: "linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative flex flex-col items-center">
            <MapPin
              size={32}
              className={`transition-colors duration-300 ${hasAddress ? "text-purple-500" : "text-purple-500/30"}`}
              fill={hasAddress ? "rgba(139,92,246,0.25)" : "transparent"}
            />
            <div className={`rounded-full blur-sm mt-0.5 h-1 transition-all duration-300
              ${hasAddress ? "bg-purple-500/60 w-8" : "bg-purple-500/20 w-4"}`}
            />
          </div>
        </div>

        <div className="s3-map-info-panel">
          <p className="text-[9px] font-bold tracking-[0.22em] text-purple-500/80 uppercase mb-3">
            Address Verification
          </p>
          {hasAddress ? (
            <div className="space-y-1">
              <p className="text-[14px] font-medium text-foreground leading-snug">{address1}</p>
              {previewLine2 && <p className="text-[13px] text-foreground/50">{previewLine2}</p>}
              <p className="text-[11px] text-foreground/30 mt-2 italic">We'll verify this address</p>
            </div>
          ) : (
            <p className="text-[13px] text-foreground/30 leading-relaxed">
              Enter an address to preview the location.
            </p>
          )}
        </div>
      </div>

      {/* MAILING CHECKBOX */}
      <div className="mb-6">
        <label className="s3-checkbox-container" onClick={() => setSameAsPrimary(!sameAsPrimary)}>
          <div className={`s3-checkbox-box ${sameAsPrimary ? "s3-checkbox-checked" : "s3-checkbox-unchecked"}`}>
            {sameAsPrimary && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span className="text-[14px] text-foreground/75 group-hover:text-foreground transition-colors select-none">
            Mailing address is the same as primary
          </span>
        </label>
      </div>

      {/* MAILING ADDRESS SECTION */}
      {!sameAsPrimary && (
        <div className="mb-8 p-6 rounded-2xl border border-border bg-card/50">
          <p className="s3-section-heading">Mailing Address</p>
          <div className="mb-5">
            <SectionLabel>Address Line 1</SectionLabel>
            <Field placeholder="Street number and street name" value={mailAddress1} onChange={setMailAddress1} />
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

      {/* TIME ZONE */}
      <div className="mb-8">
        <SectionLabel>Time Zone</SectionLabel>
        <div className="relative">
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="s3-field-input appearance-none cursor-pointer pr-10"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz} className="bg-card text-foreground">
                {tz}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/30 pointer-events-none" />
        </div>
        <p className="s3-helper-text">Auto-detected from country — editable</p>
      </div>

      <NavigationButtons onNext={handleContinue} />
    </div>
  );
};

export default Step3Address;
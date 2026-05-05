import React from "react";
import { User, Building2, Landmark, Check } from "lucide-react";
import "./AccountTypeCard.css";

const AccountTypeCard = ({ title, description, active, onClick, type }) => {
  const icons = {
    individual: <User size={22} />,
    business: <Building2 size={22} />,
    enterprise: <Landmark size={22} />,
  };

  return (
    <div
      onClick={onClick}
      className={`account-card ${active ? "account-card-active" : ""}`}
    >
      <div className="flex justify-between items-start mb-5 sm:mb-8">
        <div className={`card-icon-box ${active ? "card-icon-active" : "opacity-40"}`}>
          {icons[type]}
        </div>

        <div className={`card-checkbox ${active ? "checkbox-active" : "opacity-20"}`}>
          {active && <Check size={12} strokeWidth={4} className="sm:w-[14px] sm:h-[14px]" />}
        </div>
      </div>
      <h3 className={`text-[17px] sm:text-[20px] font-bold mb-2 sm:mb-3 tracking-tight transition-colors 
        ${active ? "text-main" : "text-main opacity-80"}`}>
        {title}
      </h3>
      
      <p className={`text-[13px] sm:text-[14px] leading-relaxed transition-colors text-main
        ${active ? "opacity-60" : "opacity-40"}`}>
        {description}
      </p>

      <div className="card-glow" />
    </div>
  );
};

export default AccountTypeCard;
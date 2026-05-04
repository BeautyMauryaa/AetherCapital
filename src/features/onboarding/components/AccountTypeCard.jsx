import React from 'react';
import { User, Building2, Landmark, CheckCircle2 } from 'lucide-react';

const AccountTypeCard = ({ title, description, active, onClick, type }) => {
  // Mapping icons to account types
  const icons = {
    individual: <User size={20} />,
    business: <Building2 size={20} />,
    enterprise: <Landmark size={20} />,
  };

  return (
    <div
      onClick={onClick}
      className={`relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col h-full
        ${
          active
            ? "border-purple-500 bg-purple-500/5 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
            : "border-white/5 bg-white/2 hover:border-white/20"
        }
      `}
    >
      {/* Top Row: Icon and Status Indicator */}
      <div className="flex justify-between items-start mb-6">
        <div className={`p-2.5 rounded-xl transition-colors ${
          active ? "bg-purple-600 text-white" : "bg-white/5 text-white/40"
        }`}>
          {icons[type]}
        </div>
        
        {/* Selection Circle/Checkmark */}
        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all
          ${active 
            ? "bg-purple-500 border-purple-500 text-white" 
            : "border-white/10 group-hover:border-white/30"
          }`}>
          {active && <CheckCircle2 size={14} strokeWidth={3} />}
        </div>
      </div>

      {/* Content */}
      <h3 className={`text-base font-semibold mb-2 transition-colors ${active ? "text-white" : "text-white/80"}`}>
        {title}
      </h3>
      <p className="text-xs leading-relaxed text-white/40 font-medium">
        {description}
      </p>
    </div>
  );
};

export default AccountTypeCard;
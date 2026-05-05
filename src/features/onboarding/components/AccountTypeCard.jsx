import React from "react";
import { User, Building2, Landmark, Check } from "lucide-react";
import { useTheme } from "@/context/Themecontext";

const AccountTypeCard = ({ title, description, active, onClick, type }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const icons = {
    individual: <User size={22} />,
    business: <Building2 size={22} />,
    enterprise: <Landmark size={22} />,
  };

  return (
    <div
      onClick={onClick}
      className={`relative p-5 sm:p-6 lg:p-8 rounded-[20px] sm:rounded-[24px] border-2 transition-all duration-300 cursor-pointer flex flex-col h-full
        ${active
          ? isDark
            ? "border-[#9C75E6] bg-[#0B0B0E] shadow-[0_0_30px_rgba(156,117,230,0.1)]"
            : "border-[#9C75E6] bg-white shadow-[0_0_30px_rgba(156,117,230,0.15)]"
          : isDark
            ? "border-white/5 bg-[#16161D] hover:border-white/20 hover:bg-[#1c1c24]"
            : "border-slate-200 bg-white hover:border-[#9C75E6]/40 hover:bg-slate-50"
        }`}
    >
      {/* Top Section: Icon and Checkbox */}
      <div className="flex justify-between items-start mb-5 sm:mb-8">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all ${
          active
            ? "bg-gradient-to-br from-[#9C75E6] to-[#E95CDB] text-white"
            : isDark
              ? "bg-[#0B0B0E] border border-white/10 text-white/40"
              : "bg-slate-100 border border-slate-200 text-slate-400"
        }`}>
          {icons[type]}
        </div>

        {/* Custom Circular Checkbox */}
        <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all
          ${active
            ? "bg-[#9C75E6] border-[#9C75E6] text-white"
            : isDark
              ? "border-white/10 bg-transparent"
              : "border-slate-300 bg-transparent"
          }`}>
          {active && <Check size={12} strokeWidth={4} className="sm:w-[14px] sm:h-[14px]" />}
        </div>
      </div>

      {/* Text Content */}
      <h3 className={`text-[17px] sm:text-[20px] font-bold mb-2 sm:mb-3 tracking-tight transition-colors ${
        active
          ? isDark ? "text-white" : "text-slate-900"
          : isDark ? "text-white/90" : "text-slate-700"
      }`}>
        {title}
      </h3>
      <p className={`text-[13px] sm:text-[14px] leading-relaxed transition-colors ${
        active
          ? isDark ? "text-white/60" : "text-slate-500"
          : isDark ? "text-white/40" : "text-slate-400"
      }`}>
        {description}
      </p>

      {/* Bottom Glow Effect (Visible only when active) */}
      {active && (
        <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-4 blur-xl rounded-full
          ${isDark ? "bg-[#9C75E6]/20" : "bg-[#9C75E6]/15"}`}
        />
      )}
    </div>
  );
};

export default AccountTypeCard;
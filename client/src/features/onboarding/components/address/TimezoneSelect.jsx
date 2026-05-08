// import React from 'react';
// import { ChevronDown, Globe } from 'lucide-react';
// import { useOnboardingStore } from "@/app/store/onboarding.store";
// import { useTheme } from "@/context/ThemeContext";

// const TimezoneSelect = () => {
//   const { formData, updateForm } = useOnboardingStore();
//   const { theme } = useTheme();
//   const isDark = theme === "dark";

//   const selectedTimezone = formData.timezone || "Europe/London";

//   return (
//     <div className="w-full mb-10">
//       {/* Label */}
//       <label className={`text-[10px] font-bold tracking-[0.2em] uppercase mb-4 block
//         ${isDark ? "text-white/40" : "text-slate-400"}`}>
//         Time Zone
//       </label>

//       <div className="relative group">
//         {/* Display trigger */}
//         <div className={`w-full h-[56px] rounded-xl px-5 flex items-center justify-between
//           cursor-pointer transition-all border
//           ${isDark
//             ? "bg-white/[0.03] border-white/10 hover:border-white/20 focus-within:border-purple-500/50"
//             : "bg-white border-slate-200 hover:border-slate-300 focus-within:border-purple-500/50"
//           }`}>
//           <div className="flex items-center gap-3">
//             <Globe size={18} className={isDark ? "text-white/20" : "text-slate-400"} />
//             <span className={`text-sm font-medium
//               ${isDark ? "text-white/90" : "text-slate-800"}`}>
//               {selectedTimezone}
//             </span>
//           </div>
//           <ChevronDown size={18} className={isDark ? "text-white/20 group-hover:text-white/40" : "text-slate-400 group-hover:text-slate-600"} />
//         </div>

//         {/* Hidden real select */}
//         <select
//           value={selectedTimezone}
//           onChange={(e) => updateForm({ timezone: e.target.value })}
//           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer appearance-none"
//         >
//           <option value="America/New_York">America/New_York</option>
//           <option value="America/Los_Angeles">America/Los_Angeles</option>
//           <option value="America/Chicago">America/Chicago</option>
//           <option value="America/Toronto">America/Toronto</option>
//           <option value="America/Sao_Paulo">America/Sao_Paulo</option>
//           <option value="Europe/London">Europe/London</option>
//           <option value="Europe/Berlin">Europe/Berlin</option>
//           <option value="Europe/Paris">Europe/Paris</option>
//           <option value="Europe/Amsterdam">Europe/Amsterdam</option>
//           <option value="Asia/Kolkata">Asia/Kolkata</option>
//           <option value="Asia/Dubai">Asia/Dubai</option>
//           <option value="Asia/Singapore">Asia/Singapore</option>
//           <option value="Asia/Tokyo">Asia/Tokyo</option>
//           <option value="Asia/Shanghai">Asia/Shanghai</option>
//           <option value="Africa/Lagos">Africa/Lagos</option>
//           <option value="Africa/Nairobi">Africa/Nairobi</option>
//           <option value="Australia/Sydney">Australia/Sydney</option>
//           <option value="UTC">UTC</option>
//         </select>
//       </div>

//       <p className={`text-[10px] mt-3 tracking-wide
//         ${isDark ? "text-white/20" : "text-slate-400"}`}>
//         Auto-detected from country — <span className="italic">editable</span>
//       </p>
//     </div>
//   );
// };

// export default TimezoneSelect;
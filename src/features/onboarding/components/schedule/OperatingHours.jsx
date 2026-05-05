import React, { useState } from "react";
import "./OperatingHours.css";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const OperatingHours = () => {
  const [activeDays, setActiveDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri"]);

  const toggleDay = (day) => {
    setActiveDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };

  return (
    <div className="hours-container">
      <div className="flex justify-between items-center mb-6">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-main opacity-40">
          Operating Schedule
        </p>
        <span className="text-[9px] font-mono text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded uppercase">
          UTC +0:00
        </span>
      </div>
      <div className="flex gap-2 mb-8">
        {days.map((day) => {
          const isActive = activeDays.includes(day);
          return (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              className={`day-pill ${isActive ? "day-pill-active" : "day-pill-inactive"}`}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="space-y-1">
        {days.map((day) => {
          const isActive = activeDays.includes(day);
          return (
            <div key={day} className={`time-row ${!isActive ? "opacity-25" : ""}`}>
              <span className="w-12 text-[11px] font-bold text-main opacity-70 uppercase tracking-tighter">
                {day}
              </span>
              
              <div className="flex items-center gap-4 flex-1">
                {isActive ? (
                  <>
                    <div className="time-input-group flex-1">
                      <span className="text-[9px] text-purple-500 font-mono">ON</span>
                      <input type="time" defaultValue="09:00" className="time-field w-full" />
                    </div>
                    <div className="w-2 h-[1px] bg-border" />
                    <div className="time-input-group flex-1">
                      <span className="text-[9px] text-purple-500 font-mono">OFF</span>
                      <input type="time" defaultValue="17:00" className="time-field w-full" />
                    </div>
                  </>
                ) : (
                  <span className="text-[11px] font-mono italic opacity-50 pl-2">Closed / Non-operational</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OperatingHours;
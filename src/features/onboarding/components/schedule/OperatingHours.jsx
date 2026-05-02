import { useState } from "react";

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
    <div className="mb-6">

      <p className="text-sm text-gray-400 mb-3">Operating Hours</p>

      {/* Day selector */}
      <div className="flex gap-2 mb-4">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => toggleDay(day)}
            className={`px-4 py-2 rounded-lg text-sm
              ${
                activeDays.includes(day)
                  ? "bg-purple-500"
                  : "bg-white/10"
              }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Time inputs */}
      {activeDays.map((day) => (
        <div key={day} className="flex gap-4 mb-2">
          <span className="w-10">{day}</span>
          <input type="time" className="input" />
          <input type="time" className="input" />
        </div>
      ))}

    </div>
  );
};

export default OperatingHours;
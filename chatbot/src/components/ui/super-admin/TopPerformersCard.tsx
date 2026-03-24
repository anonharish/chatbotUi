import React, { useState } from "react";

interface Performer {
  name: string;
  value: number;
}

interface TopPerformersCardProps {
  performers?: Performer[];
  states?: string[];
  districts?: string[];
  areas?: string[];
  className?: string;
}

const defaultPerformers: Performer[] = [
  { name: "Sam",   value: 45 },
  { name: "Rig",   value: 20 },
  { name: "Amy",   value: 30 },
  { name: "Sunny", value: 15 },
  { name: "Ben",   value: 10 },
  { name: "Sam",   value: 42 },
  { name: "Rig",   value: 55 },
  { name: "Amy",   value: 38 },
  { name: "Sunny", value: 68 },
  { name: "Ben",   value: 50 },
  { name: "Sam",   value: 72 },
  { name: "Rig",   value: 88 },
];

const TopPerformersCard: React.FC<TopPerformersCardProps> = ({
  performers = defaultPerformers,
  states    = ["All States", "Andhra Pradesh", "Telangana"],
  districts = ["All Districts", "Krishna", "Guntur"],
  areas     = ["All Areas", "Rural", "Urban"],
  className = "",
}) => {
  const [selectedState,    setSelectedState]    = useState(states[0]);
  const [selectedDistrict, setSelectedDistrict] = useState(districts[0]);
  const [selectedArea,     setSelectedArea]     = useState(areas[0]);

  const maxVal = Math.max(...performers.map((p) => p.value));

  return (
    <div
      className={`
        relative rounded-2xl p-5
        backdrop-blur-md bg-white/10 border border-white/20 shadow-xl
        overflow-hidden flex flex-col ${className}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-2xl" />

      {/* Header */}
      <div className="z-10 flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-white font-semibold text-sm">Top Performer's List</h3>
        <div className="flex gap-2 flex-wrap">
          {[
            { value: selectedState,    options: states,    setter: setSelectedState },
            { value: selectedDistrict, options: districts, setter: setSelectedDistrict },
            { value: selectedArea,     options: areas,     setter: setSelectedArea },
          ].map((f, i) => (
            <select
              key={i}
              value={f.value}
              onChange={(e) => f.setter(e.target.value)}
              className="text-white text-xs bg-white/10 border border-white/20 rounded-lg px-2 py-1 outline-none cursor-pointer backdrop-blur-sm"
            >
              {f.options.map((opt) => (
                <option key={opt} value={opt} className="bg-gray-800 text-white">
                  {opt}
                </option>
              ))}
            </select>
          ))}
        </div>
      </div>

      {/* Chart area */}
      <div className="z-10 flex items-end gap-2 flex-1 min-h-0">
        {/* Y-axis */}
        <div className="flex flex-col justify-between h-full text-white/40 text-[10px] pr-1 pb-6 flex-shrink-0">
          {[100, 80, 60, 40, 20, 10, 0].map((v) => (
            <span key={v}>{v}</span>
          ))}
        </div>

        {/* Bars */}
        <div className="flex items-end gap-1 flex-1 h-full overflow-x-auto">
          {performers.map((p, i) => {
            const heightPct = (p.value / maxVal) * 100;
            const isTop = i === performers.length - 1;
            return (
              <div key={i} className="flex flex-col items-center gap-1 flex-1 min-w-[28px] h-full">
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[9px] font-bold
                    ${isTop ? "bg-white/60 ring-2 ring-white" : "bg-white/20"}`}
                >
                  {p.name[0]}
                </div>
                {/* Bar */}
                <div className="flex-1 w-full flex items-end">
                  <div
                    className={`w-full rounded-t-md transition-all duration-500 ${isTop ? "bg-white" : "bg-white/50"}`}
                    style={{ height: `${heightPct}%`, minHeight: "4px" }}
                  />
                </div>
                {/* Name */}
                <span className="text-white/50 text-[10px] truncate w-full text-center">
                  {p.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TopPerformersCard;
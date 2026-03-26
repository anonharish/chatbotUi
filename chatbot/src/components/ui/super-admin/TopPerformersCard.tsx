import React, { useState } from "react";
import {
  performersData,
  stateOptions,
  districtOptions,
  areaOptions,
  type Performer,
} from "@/data/directoryData";

export interface TopPerformersCardProps {
  performers?: Performer[];
  states?: string[];
  districts?: string[];
  areas?: string[];
  className?: string;
}

const Y_LABELS = [100, 80, 60, 40, 20, 10, 0];
const AVATAR_SIZE = 44;

const TopPerformersCard: React.FC<TopPerformersCardProps> = ({
  performers = performersData, // ✅ FIXED
  states = stateOptions,
  districts = districtOptions,
  areas = areaOptions,
  className = "",
}) => {
  const [selectedState, setSelectedState] = useState(states[0]);
  const [selectedDistrict, setSelectedDistrict] = useState(districts[0]);
  const [selectedArea, setSelectedArea] = useState(areas[0]);

  const maxVal = Math.max(...performers.map((p) => p.value));

  const filters = [
    { value: selectedState, options: states, setter: setSelectedState },
    { value: selectedDistrict, options: districts, setter: setSelectedDistrict },
    { value: selectedArea, options: areas, setter: setSelectedArea },
  ];

  return (
    <div
      className={`relative w-full h-full backdrop-blur-md bg-white/10 overflow-hidden flex flex-col ${className}`}
      style={{
        borderRadius: "37.56px",
        border: "1.71px solid rgba(255,255,255,0.22)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
      }}
    >
      <div className="relative z-10 flex flex-col h-full px-5 pt-5 pb-4">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-5 flex-wrap">
          <h3 className="text-white font-bold text-sm">
            Top Performer's List
          </h3>

         <div className="flex gap-3 flex-wrap">
  {filters.map((f, i) => (
    <select
      key={i}
      value={f.value}
      onChange={(e) => f.setter(e.target.value)}
      className="
        appearance-none
        bg-white/95 text-gray-700
        text-sm font-medium
        px-6
        h-[42px]
        min-w-[150px]
        rounded-full
        shadow-md
        border border-white/60
        outline-none
        cursor-pointer
      "
    >
      {f.options.map((opt) => (
        <option key={opt}>{opt}</option>
      ))}
    </select>
  ))}
</div>
</div>

        {/* CHART */}
        <div className="flex flex-1 gap-2">

          {/* Y AXIS */}
          <div className="flex flex-col justify-between text-white/50 text-[10px] pr-2 pb-6">
            {Y_LABELS.map((v) => (
              <span key={v}>{v}</span>
            ))}
          </div>

          {/* BARS */}
          <div className="flex items-end gap-2 flex-1">
            {performers.map((p, i) => {
              const heightPct = (p.value / maxVal) * 100;
              const isTop = p.value === maxVal;

              return (
                <div key={i} className="flex flex-col items-center flex-1 h-full">

                  {/* spacer */}
                  <div className="flex-1" />

                  {/* AVATAR (FIXED IMAGE) */}
                  <div
                    className={`rounded-full overflow-hidden border-2 ${
                      isTop ? "border-white" : "border-white/60"
                    }`}
                    style={{
                      width: AVATAR_SIZE,
                      height: AVATAR_SIZE,
                      marginBottom: "4px",
                    }}
                  >
                    <img
                      src={p.image}   // ✅ FIXED
                      alt={p.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://i.pravatar.cc/100";
                      }}
                    />
                  </div>

                  {/* BAR */}
                  <div
className="w-full bg-white/90 rounded-[14px]"
                    style={{
  height: `${heightPct}%`,
  minHeight: "10px",
}}
                  />

                  {/* NAME */}
                  <span className="text-white/70 text-xs mt-1">
                    {p.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  
  );
};

export default TopPerformersCard;
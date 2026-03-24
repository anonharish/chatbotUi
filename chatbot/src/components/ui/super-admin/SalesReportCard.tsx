import React, { useState } from "react";

interface SalesData {
  location: string;
  target: number;
  actual: number;
}

interface SalesReportCardProps {
  data?: SalesData[];
  filters?: string[];
  className?: string;
}

const defaultData: SalesData[] = [
  { location: "Tanuku",    target: 100, actual: 65 },
  { location: "Attili",    target: 100, actual: 80 },
  { location: "Palakollu", target: 100, actual: 90 },
  { location: "Rajole",    target: 100, actual: 55 },
  { location: "Eluru",     target: 100, actual: 95 },
];

const yLabels = ["25 CR", "1 CR", "50L", "25L"];

const SalesReportCard: React.FC<SalesReportCardProps> = ({
  data    = defaultData,
  filters = ["This Month", "Last Month", "This Year"],
  className = "",
}) => {
  const [filter, setFilter] = useState(filters[0]);

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
      <div className="z-10 flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-sm">
          Sales Report Target vs Actual
        </h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-white text-xs bg-white/10 border border-white/20 rounded-lg px-2 py-1 outline-none cursor-pointer"
        >
          {filters.map((f) => (
            <option key={f} value={f} className="bg-gray-800 text-white">
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* Chart */}
      <div className="z-10 flex items-end gap-2 flex-1 min-h-0">
        {/* Y-axis */}
        <div className="flex flex-col justify-between h-full text-white/40 text-[10px] pr-1 pb-6 flex-shrink-0">
          {yLabels.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>

        {/* Grouped bars */}
        <div className="flex items-end gap-3 flex-1 h-full">
          {data.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-1 h-full">
              <div className="flex items-end gap-1 flex-1 w-full">
                <div
                  className="flex-1 rounded-t-md bg-white/25"
                  style={{ height: `${d.target}%`, minHeight: "4px" }}
                />
                <div
                  className="flex-1 rounded-t-md bg-white/70"
                  style={{ height: `${d.actual}%`, minHeight: "4px" }}
                />
              </div>
              <span className="text-white/50 text-[10px] truncate w-full text-center">
                {d.location}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesReportCard;
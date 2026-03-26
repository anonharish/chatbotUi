import React, { useState } from "react";
import {
  salesReportData,
  salesFilterOptions,
  salesYLabels,
  type SalesData,
} from "@/data/directoryData";

// ─── Figma Spec ───────────────────────────────────────────────────────────────
// Card:  460 × 399px  |  border-radius: 37.56px  |  border: 1.71px

export interface SalesReportCardProps {
  className?: string;
}

const SalesReportCard: React.FC<SalesReportCardProps> = ({ className = "" }) => {
  const [filter, setFilter] = useState(salesFilterOptions[0]);

  const data: SalesData[] = salesReportData[filter] ?? salesReportData[salesFilterOptions[0]];
  const maxVal = Math.max(...data.flatMap((d) => [d.target, d.actual]));

  return (
    <div
      className={`relative w-full h-full backdrop-blur-md bg-white/10 overflow-hidden flex flex-col ${className}`}
      style={{
        borderRadius: "37.56px",
        border:       "1.71px solid rgba(255,255,255,0.22)",
        boxShadow:    "0 8px 32px rgba(0,0,0,0.18)",
      }}
    >
      {/* Glassmorphism glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:   "linear-gradient(135deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.03) 100%)",
          borderRadius: "37.56px",
        }}
      />

      <div className="relative z-10 flex flex-col h-full px-5 xl:px-6 pt-5 xl:pt-6 pb-4">

        {/* ── Header ── */}
        <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
          <h3
            className="text-white font-bold flex-shrink-0"
            style={{
              fontFamily: "Outfit, sans-serif",
              fontWeight: 700,
              fontSize:   "clamp(12px, 1.2vw, 15px)",
            }}
          >
            Sales Report Target vs Actual
          </h3>

          {/* White pill filter — same style as TopPerformers */}
          <div className="relative flex-shrink-0">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none outline-none cursor-pointer"
              style={{
                height:       "31px",
                minWidth:     "clamp(100px, 9vw, 118px)",
                borderRadius: "16px",
                background:   "rgba(255,255,255,0.95)",
                border:       "1px solid rgba(255,255,255,0.9)",
                fontFamily:   "Outfit, sans-serif",
                fontWeight:   400,
                fontSize:     "clamp(11px, 1vw, 13px)",
                color:        "#1a1a1a",
                paddingLeft:  "16px",
                paddingRight: "32px",
              }}
            >
              {salesFilterOptions.map((f) => (
                <option key={f} value={f} style={{ background: "white", color: "#1a1a1a" }}>
                  {f}
                </option>
              ))}
            </select>
            {/* Chevron */}
            <svg
              className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              width="12" height="12" viewBox="0 0 12 12" fill="none"
            >
              <path d="M2.5 4.5L6 8L9.5 4.5" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* ── Chart ── */}
        <div className="flex flex-1 min-h-0 gap-1">

          {/* Y-axis */}
          <div
            className="flex flex-col justify-between flex-shrink-0 text-white/50 pb-6 pr-2"
            style={{ fontFamily: "Outfit, sans-serif", fontSize: "clamp(9px, 0.85vw, 11px)" }}
          >
            {salesYLabels.map((l) => (
              <span key={l} className="leading-none">{l}</span>
            ))}
          </div>

          {/* Grouped bars per location */}
          <div className="flex items-end flex-1 min-h-0 gap-2 xl:gap-3">
            {data.map((d, i) => {
              const targetH = (d.target / maxVal) * 100;
              const actualH = (d.actual / maxVal) * 100;

              return (
                <div key={i} className="flex flex-col items-center flex-1 min-w-0 h-full gap-1">
                  {/* Two bars side by side */}
                  <div className="flex items-end gap-1 flex-1 w-full">
                    {/* Target bar — dimmer */}
                    <div
                      className="flex-1 transition-all duration-500"
                      style={{
                        height:       `${targetH}%`,
                        minHeight:    "4px",
                        borderRadius: "8px 8px 4px 4px",
                        background:   "rgba(255,255,255,0.28)",
                      }}
                    />
                    {/* Actual bar — brighter */}
                    <div
                      className="flex-1 transition-all duration-500"
                      style={{
                        height:       `${actualH}%`,
                        minHeight:    "4px",
                        borderRadius: "8px 8px 4px 4px",
                        background:   "rgba(255,255,255,0.80)",
                      }}
                    />
                  </div>

                  {/* Location label */}
                  <span
                    className="text-white/60 truncate w-full text-center flex-shrink-0"
                    style={{
                      fontFamily: "Outfit, sans-serif",
                      fontWeight: 400,
                      fontSize:   "clamp(9px, 0.9vw, 11px)",
                    }}
                  >
                    {d.location}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Legend ── */}
        <div className="flex items-center gap-4 mt-3 flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: "rgba(255,255,255,0.28)" }} />
            <span className="text-white/50" style={{ fontFamily: "Outfit, sans-serif", fontSize: "clamp(9px, 0.9vw, 11px)" }}>
              Target
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: "rgba(255,255,255,0.80)" }} />
            <span className="text-white/50" style={{ fontFamily: "Outfit, sans-serif", fontSize: "clamp(9px, 0.9vw, 11px)" }}>
              Actual
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesReportCard;
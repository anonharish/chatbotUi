import React from "react";

export default function Gauge({ value = 78 }) {
  const totalTicks = 40;
  const sweepAngle = 260;        // controls arc width
  const startAngle = -130;       // start from left-bottom
  const activeTicks = Math.round((value / 100) * totalTicks);

  return (
    <div className="flex flex-col items-center">
      
      {/* ===== Gauge Wrapper (Exact Proportion) ===== */}
      <div className="relative w-[325px] h-[294px]">

        <svg viewBox="0 0 325 294">
          {[...Array(totalTicks)].map((_, i) => {
            const angle =
              (i / totalTicks) * sweepAngle + startAngle;

            const rad = (angle * Math.PI) / 180;

            const cx = 162;   // center X
            const cy = 160;   // move slightly down
            const innerR = 95;
            const outerR = 115;

            const x1 = cx + Math.cos(rad) * innerR;
            const y1 = cy + Math.sin(rad) * innerR;
            const x2 = cx + Math.cos(rad) * outerR;
            const y2 = cy + Math.sin(rad) * outerR;

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={
                  i < activeTicks
                    ? "white"
                    : "rgba(255,255,255,0.2)"
                }
                strokeWidth="6"
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* ===== Center Text ===== */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white -mt-6">
          <div className="text-[48px] font-semibold leading-none mt-15">
            {value}%
          </div>
          <p className="mt-2 text-base">
            Fully Verified
          </p>
        </div>
      </div>

      {/* ===== Bottom Label (Separate) ===== */}
      <p className="mt-4 text-white/70 text-sm tracking-wide">
        KYC Compliance
      </p>

    </div>
  );
}
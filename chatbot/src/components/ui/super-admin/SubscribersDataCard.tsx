import React, { useState } from "react";

interface SubscriberSegment {
  label: string;
  percentage: number;
  color: string;
  pattern?: boolean;
}

const defaultSegments: SubscriberSegment[] = [
  { label: "Platinum", percentage: 40, color: "rgba(255,255,255,0.95)" },
  { label: "Gold", percentage: 35, color: "rgba(180,220,100,0.9)" },
  { label: "Silver", percentage: 25, color: "rgba(180,220,100,0.4)", pattern: true },
];

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function donutSlice(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startAngle: number,
  endAngle: number
) {
  const s1 = polarToCartesian(cx, cy, outerR, startAngle);
  const e1 = polarToCartesian(cx, cy, outerR, endAngle);
  const s2 = polarToCartesian(cx, cy, innerR, endAngle);
  const e2 = polarToCartesian(cx, cy, innerR, startAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;

  return `
    M ${s1.x} ${s1.y}
    A ${outerR} ${outerR} 0 ${large} 1 ${e1.x} ${e1.y}
    L ${s2.x} ${s2.y}
    A ${innerR} ${innerR} 0 ${large} 0 ${e2.x} ${e2.y}
    Z
  `;
}

const SubscribersDataCard: React.FC = () => {
  const [filter, setFilter] = useState("This Month");

  // 🔥 Bigger chart like Figma
  const cx = 120;
  const cy = 120;
  const outerR = 95;
  const innerR = 60;
  const gap = 4;

  let angle = 0;
  const arcs = defaultSegments.map((seg) => {
    const sweep = (seg.percentage / 100) * 360 - gap;
    const arc = { ...seg, startAngle: angle, endAngle: angle + sweep };
    angle += (seg.percentage / 100) * 360;
    return arc;
  });

  return (
    <div
      className="relative w-full h-full backdrop-blur-md bg-white/10 overflow-hidden flex flex-col"
      style={{
        borderRadius: "37.56px",
        border: "1.71px solid rgba(255,255,255,0.22)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
      }}
    >
      {/* Glass glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.03) 100%)",
          borderRadius: "37.56px",
        }}
      />

      {/* INNER LAYOUT (same as SalesReportCard) */}
      <div className="relative z-10 flex flex-col h-full px-5 xl:px-6 pt-5 xl:pt-6 pb-4">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-white font-bold"
            style={{
              fontFamily: "Outfit",
              fontSize: "clamp(12px, 1.2vw, 15px)",
            }}
          >
            Subscribers Data
          </h3>

          {/* WHITE PILL BUTTON */}
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none outline-none cursor-pointer"
              style={{
                height: "31px",
                minWidth: "clamp(95px, 8vw, 110px)",
                borderRadius: "16px",
                background: "rgba(255,255,255,0.95)",
                border: "1px solid rgba(255,255,255,0.9)",
                fontSize: "clamp(11px, 1vw, 13px)",
                paddingLeft: "14px",
                paddingRight: "28px",
              }}
            >
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>

            {/* Chevron */}
            <svg
              className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
              width="12"
              height="12"
              viewBox="0 0 12 12"
            >
              <path
                d="M2.5 4.5L6 8L9.5 4.5"
                stroke="#1a1a1a"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex flex-1 items-center justify-between gap-4">

          {/* DONUT */}
          <svg
            viewBox="0 0 240 240"
            className="w-[180px] sm:w-[210px] md:w-[240px] flex-shrink-0"
          >
            <defs>
              <pattern
                id="hatch"
                patternUnits="userSpaceOnUse"
                width="6"
                height="6"
                patternTransform="rotate(45)"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="6"
                  stroke="rgba(180,220,100,0.6)"
                  strokeWidth="2"
                />
              </pattern>
            </defs>

            {arcs.map((arc, i) => {
              const d = donutSlice(cx, cy, outerR, innerR, arc.startAngle, arc.endAngle);

              const mid =
                arc.startAngle + (arc.endAngle - arc.startAngle) / 2;

              const pos = polarToCartesian(
                cx,
                cy,
                (outerR + innerR) / 2,
                mid
              );

              return (
                <g key={i}>
                  <path d={d} fill={arc.pattern ? "url(#hatch)" : arc.color} />
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    fill="white"
                    fontSize="11"
                    fontWeight="600"
                  >
                    {arc.percentage}%
                  </text>
                </g>
              );
            })}

            {/* CENTER TEXT */}
            <text x={cx} y={cy - 8} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">
              Units total
            </text>

            <text x={cx} y={cy + 14} textAnchor="middle" fill="white" fontSize="22" fontWeight="700">
              1,247
            </text>
          </svg>

          {/* LEGEND */}
          <div className="flex flex-col gap-3">
            {defaultSegments.map((seg, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: seg.color }} />
                <span className="text-white/60 text-xs">{seg.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscribersDataCard;
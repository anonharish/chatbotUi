import React, { useState } from "react";

interface SubscriberSegment {
  label: string;
  percentage: number;
  color: string;
  pattern?: boolean;
}

interface SubscribersDataCardProps {
  segments?: SubscriberSegment[];
  totalUnits?: number;
  filters?: string[];
  className?: string;
}

const defaultSegments: SubscriberSegment[] = [
  { label: "Platinum", percentage: 40, color: "rgba(255,255,255,0.9)" },
  { label: "Gold",     percentage: 35, color: "rgba(180,220,100,0.8)" },
  { label: "Silver",   percentage: 25, color: "rgba(180,220,100,0.3)", pattern: true },
];

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function donutSlice(cx: number, cy: number, outerR: number, innerR: number,
  startAngle: number, endAngle: number) {
  const s1 = polarToCartesian(cx, cy, outerR, startAngle);
  const e1 = polarToCartesian(cx, cy, outerR, endAngle);
  const s2 = polarToCartesian(cx, cy, innerR, endAngle);
  const e2 = polarToCartesian(cx, cy, innerR, startAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
     
  return [
    `M ${s1.x} ${s1.y}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${e1.x} ${e1.y}`,
    `L ${s2.x} ${s2.y}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${e2.x} ${e2.y}`,
    "Z",
  ].join(" ");
}

const SubscribersDataCard: React.FC<SubscribersDataCardProps> = ({
  segments   = defaultSegments,
  totalUnits = 1247,
  filters    = ["This Month", "Last Month", "This Year"],
  className  = "",
}) => {
  const [filter, setFilter] = useState(filters[0]);

  const cx = 90; const cy = 90;
  const outerR = 72; const innerR = 46;
  const gap = 4;

  let angle = 0;
  const arcs = segments.map((seg) => {
    const sweep = (seg.percentage / 100) * 360 - gap;
    const arc = { ...seg, startAngle: angle, endAngle: angle + sweep };
    angle += (seg.percentage / 100) * 360;
    return arc;
  });

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
        <h3 className="text-white font-semibold text-sm">Subscribers Data</h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-white text-xs bg-white/10 border border-white/20 rounded-lg px-2 py-1 outline-none cursor-pointer"
        >
          {filters.map((f) => (
            <option key={f} value={f} className="bg-gray-800 text-white">{f}</option>
          ))}
        </select>
      </div>

      {/* Chart + Legend */}
      <div className="z-10 flex items-center justify-around flex-1 min-h-0">
        <svg width="180" height="180" viewBox="0 0 180 180" className="flex-shrink-0">
          <defs>
            <pattern id="hatch" patternUnits="userSpaceOnUse" width="6" height="6"
              patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="6"
                stroke="rgba(180,220,100,0.55)" strokeWidth="2.5" />
            </pattern>
          </defs>

          {arcs.map((arc, i) => {
            const d = donutSlice(cx, cy, outerR, innerR, arc.startAngle, arc.endAngle);
            const mid = arc.startAngle + (arc.endAngle - arc.startAngle) / 2;
            const lp  = polarToCartesian(cx, cy, (outerR + innerR) / 2 + 20, mid);
            return (
              <g key={i}>
                <path d={d} fill={arc.pattern ? "url(#hatch)" : arc.color} />
                <text x={lp.x} y={lp.y + 4} textAnchor="middle"
                  fill="white" fontSize="10" fontWeight="600">
                  {arc.percentage}%
                </text>
              </g>
            );
          })}

          {/* Center */}
          <text x={cx} y={cy - 8} textAnchor="middle"
            fill="rgba(255,255,255,0.55)" fontSize="9">Units total</text>
          <text x={cx} y={cy + 12} textAnchor="middle"
            fill="white" fontSize="19" fontWeight="700">
            {totalUnits.toLocaleString()}
          </text>
        </svg>

        {/* Legend */}
        <div className="flex flex-col gap-3">
          {segments.map((seg, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ background: seg.color }} />
              <span className="text-white/60 text-xs">{seg.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscribersDataCard;
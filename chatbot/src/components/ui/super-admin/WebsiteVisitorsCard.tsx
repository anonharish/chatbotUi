import React from "react";

interface WebsiteVisitorsCardProps {
  data?: number[];
  months?: string[];
  peak?: { index: number; label: string };
  className?: string;
}

const defaultData   = [25000, 28000, 22000, 35000, 37000, 30000, 32000];
const defaultMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const WebsiteVisitorsCard: React.FC<WebsiteVisitorsCardProps> = ({
  data    = defaultData,
  months  = defaultMonths,
  peak    = { index: 4, label: "37K Visitors" },
  className = "",
}) => {
  const W = 500;
  const H = 160;
  const pad = { l: 42, r: 16, t: 20, b: 28 };

  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);
  const xStep  = (W - pad.l - pad.r) / (data.length - 1);

  const points = data.map((v, i) => ({
    x: pad.l + i * xStep,
    y: pad.t + ((maxVal - v) / (maxVal - minVal || 1)) * (H - pad.t - pad.b),
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = [
    `M ${points[0].x} ${H - pad.b}`,
    ...points.map((p) => `L ${p.x} ${p.y}`),
    `L ${points[points.length - 1].x} ${H - pad.b}`,
    "Z",
  ].join(" ");

  const yLabels = ["50K", "40K", "30K", "20K", "10K", "0"];

  return (
    <div
      className={`
        relative rounded-2xl p-5
        backdrop-blur-md bg-white/10 border border-white/20 shadow-xl
        overflow-hidden flex flex-col ${className}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-2xl" />

      <h3 className="z-10 text-white font-semibold text-sm mb-3">
        Website Visitors
      </h3>

      <div className="z-10 flex-1 min-h-0">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="wvGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="rgba(255,255,255,0.25)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
            </linearGradient>
          </defs>

          {/* Grid lines + Y labels */}
          {yLabels.map((label, i) => {
            const yPos = pad.t + (i / (yLabels.length - 1)) * (H - pad.t - pad.b);
            return (
              <g key={i}>
                <line x1={pad.l} y1={yPos} x2={W - pad.r} y2={yPos}
                  stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                <text x={pad.l - 4} y={yPos + 4} textAnchor="end"
                  fill="rgba(255,255,255,0.4)" fontSize="9">{label}</text>
              </g>
            );
          })}

          {/* Area + line */}
          <path d={areaPath} fill="url(#wvGrad)" />
          <path d={linePath} fill="none" stroke="rgba(255,255,255,0.85)"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {/* Peak */}
          {points[peak.index] && (() => {
            const px = points[peak.index].x;
            const py = points[peak.index].y;
            return (
              <g>
                <line x1={px} y1={py} x2={px} y2={H - pad.b}
                  stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="4 3" />
                <circle cx={px} cy={py} r="5" fill="white" />
                <rect x={px - 44} y={py - 30} width="88" height="20" rx="6"
                  fill="rgba(0,0,0,0.5)" />
                <text x={px} y={py - 16} textAnchor="middle"
                  fill="white" fontSize="9" fontWeight="600">
                  {peak.label}
                </text>
              </g>
            );
          })()}

          {/* X labels */}
          {months.map((m, i) => (
            <text key={i}
              x={pad.l + i * xStep} y={H - 4}
              textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">
              {m}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default WebsiteVisitorsCard;
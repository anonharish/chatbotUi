import React, { useRef, useState, useCallback } from "react";
import {
  websiteVisitorsData,
  peakPoint,
  type VisitorDataPoint,
} from "@/data/directoryData";

// ─── Figma Spec ───────────────────────────────────────────────────────────────
// Card:  825 × 367px  |  border-radius: 37.56px  |  border: 1.71px

export interface WebsiteVisitorsCardProps {
  data?:      VisitorDataPoint[];
  peak?:      { index: number; label: string };
  className?: string;
}

// ── Smooth curve helper (catmull-rom → cubic bezier) ─────────────────────────
function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

function formatK(v: number) {
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
  return `${v}`;
}

const W   = 500;
const H   = 180;
const pad = { l: 44, r: 16, t: 24, b: 32 };

const Y_LABELS = ["50K", "40K", "30K", "20K", "10K", "0"];
const Y_VALUES = [50000, 40000, 30000, 20000, 10000, 0];

const WebsiteVisitorsCard: React.FC<WebsiteVisitorsCardProps> = ({
  data      = websiteVisitorsData,
  peak      = peakPoint,
  className = "",
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{
    x: number; y: number; svgX: number; svgY: number;
    month: string; value: number; visible: boolean;
  } | null>(null);

  const values = data.map((d) => d.value);
  const maxVal = Math.max(...Y_VALUES);
  const minVal = 0;
  const xStep  = (W - pad.l - pad.r) / (data.length - 1);

  const points = data.map((d, i) => ({
    x: pad.l + i * xStep,
    y: pad.t + ((maxVal - d.value) / (maxVal - minVal)) * (H - pad.t - pad.b),
  }));

  const linePath = smoothPath(points);
  const areaPath = [
    `M ${points[0].x} ${H - pad.b}`,
    linePath.replace(/^M \S+ \S+/, `L ${points[0].x} ${points[0].y}`),
    `L ${points[points.length - 1].x} ${H - pad.b}`,
    "Z",
  ].join(" ");

  // ── Tooltip on mouse move ──────────────────────────────────────────────────
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!svgRef.current) return;
      const rect    = svgRef.current.getBoundingClientRect();
      const scaleX  = W / rect.width;
      const scaleY  = H / rect.height;
      const mouseX  = (e.clientX - rect.left) * scaleX;

      // Find closest data point
      let closest = 0;
      let minDist = Infinity;
      points.forEach((p, i) => {
        const dist = Math.abs(p.x - mouseX);
        if (dist < minDist) { minDist = dist; closest = i; }
      });

      const p = points[closest];
      setTooltip({
        x:      (p.x / W) * rect.width  + rect.left - svgRef.current.getBoundingClientRect().left,
        y:      (p.y / H) * rect.height,
        svgX:   p.x,
        svgY:   p.y,
        month:  data[closest].month,
        value:  data[closest].value,
        visible: true,
      });
    },
    [points, data]
  );

  const handleMouseLeave = () => setTooltip(null);

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

      <div className="relative z-10 flex flex-col h-full px-5 xl:px-7 pt-5 xl:pt-6 pb-3">

        {/* ── Title ── */}
        <h3
          className="text-white font-bold mb-3 flex-shrink-0"
          style={{
            fontFamily: "Outfit, sans-serif",
            fontWeight: 700,
            fontSize:   "clamp(13px, 1.3vw, 16px)",
          }}
        >
          Website Visitors
        </h3>

        {/* ── SVG Chart ── */}
        <div className="flex-1 min-h-0 relative">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-full cursor-crosshair"
            preserveAspectRatio="none"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <defs>
              <linearGradient id="wvAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="rgba(255,255,255,0.30)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.01)" />
              </linearGradient>
            </defs>

            {/* Y-axis grid lines + labels */}
            {Y_LABELS.map((label, i) => {
              const yPos = pad.t + (i / (Y_LABELS.length - 1)) * (H - pad.t - pad.b);
              return (
                <g key={i}>
                  <line
                    x1={pad.l} y1={yPos} x2={W - pad.r} y2={yPos}
                    stroke="rgba(255,255,255,0.08)" strokeWidth="0.8"
                  />
                  <text
                    x={pad.l - 5} y={yPos + 3.5}
                    textAnchor="end" fill="rgba(255,255,255,0.45)"
                    fontSize="8.5" fontFamily="Outfit, sans-serif"
                  >
                    {label}
                  </text>
                </g>
              );
            })}

            {/* Area fill */}
            <path d={areaPath} fill="url(#wvAreaGrad)" />

            {/* Line */}
            <path
              d={linePath}
              fill="none"
              stroke="rgba(255,255,255,0.90)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Default peak marker */}
            {!tooltip && points[peak.index] && (() => {
              const px = points[peak.index].x;
              const py = points[peak.index].y;
              return (
                <g>
                  <line
                    x1={px} y1={py} x2={px} y2={H - pad.b}
                    stroke="rgba(255,255,255,0.30)" strokeWidth="1"
                    strokeDasharray="4 3"
                  />
                  <circle cx={px} cy={py} r="5" fill="white" />
                  <rect x={px - 46} y={py - 32} width="92" height="22" rx="7"
                    fill="rgba(0,0,0,0.55)" />
                  <text
                    x={px} y={py - 17}
                    textAnchor="middle" fill="white"
                    fontSize="9.5" fontWeight="600" fontFamily="Outfit, sans-serif"
                  >
                    {peak.label}
                  </text>
                </g>
              );
            })()}

            {/* Hover tooltip marker */}
            {tooltip && (
              <g>
                <line
                  x1={tooltip.svgX} y1={tooltip.svgY}
                  x2={tooltip.svgX} y2={H - pad.b}
                  stroke="rgba(255,255,255,0.35)" strokeWidth="1"
                  strokeDasharray="4 3"
                />
                <circle cx={tooltip.svgX} cy={tooltip.svgY} r="5.5" fill="white" />
                <circle cx={tooltip.svgX} cy={tooltip.svgY} r="3" fill="rgba(0,0,0,0.4)" />
                {/* Tooltip box — shifts left if near right edge */}
                <rect
                  x={tooltip.svgX > W - 80 ? tooltip.svgX - 96 : tooltip.svgX - 46}
                  y={tooltip.svgY - 36}
                  width="92" height="26" rx="8"
                  fill="rgba(0,0,0,0.65)"
                />
                <text
                  x={tooltip.svgX > W - 80 ? tooltip.svgX - 50 : tooltip.svgX}
                  y={tooltip.svgY - 26}
                  textAnchor="middle" fill="rgba(255,255,255,0.70)"
                  fontSize="8" fontFamily="Outfit, sans-serif"
                >
                  {tooltip.month}
                </text>
                <text
                  x={tooltip.svgX > W - 80 ? tooltip.svgX - 50 : tooltip.svgX}
                  y={tooltip.svgY - 14}
                  textAnchor="middle" fill="white"
                  fontSize="9.5" fontWeight="700" fontFamily="Outfit, sans-serif"
                >
                  {formatK(tooltip.value)} Visitors
                </text>
              </g>
            )}

            {/* X-axis month labels */}
            {data.map((d, i) => (
              <text
                key={i}
                x={pad.l + i * xStep} y={H - 6}
                textAnchor="middle"
                fill="rgba(255,255,255,0.45)"
                fontSize="8.5"
                fontFamily="Outfit, sans-serif"
              >
                {d.month}
              </text>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default WebsiteVisitorsCard;
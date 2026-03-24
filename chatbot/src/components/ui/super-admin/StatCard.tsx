import React from "react";

// ─── Figma Spec ───────────────────────────────────────────────────────────────
// Card:          405 × 208px  |  border-radius: 37.56px  |  border: 1.71px
// Top row div:   315.2 × 54.6px  |  top: 27.1  left: 39.56
//   Left icon:   43.85 × 44.87px |  top: 4.85  left: 0.51
//   Right text:  82 × 31px       |  top: 12.11 left: 232.33  |  Outfit 13px 400
// Bottom block:  333 × 86px      |  top: 95.86 left: 40

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: {
    value: string;
    positive?: boolean;
  };
  sparkline?: boolean;
  className?: string;
}

// ─── Sparkline ────────────────────────────────────────────────────────────────
const SparklineBars: React.FC = () => {
  const heights = [28, 48, 32, 58, 38, 72, 52, 88, 62, 95, 68, 80];
  return (
    <div
      className="flex items-end gap-[4px]"
      style={{ width: "120px", height: "72px" }}
    >
      {heights.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm bg-white/55"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
};

// ─── Card ─────────────────────────────────────────────────────────────────────
const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  trend,
  sparkline = false,
  className = "",
}) => {
  return (
    <div
      className={`relative w-full h-full backdrop-blur-md bg-white/10 overflow-hidden ${className}`}
      style={{
        borderRadius: "37.56px",
        border: "1.71px solid rgba(255,255,255,0.22)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
      }}
    >
      {/* Glassmorphism inner glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.03) 100%)",
          borderRadius: "37.56px",
        }}
      />

      {/* ── TOP ROW  315.2 × 54.64 | top:27.1 left:39.56 ── */}
      <div
        className="absolute flex items-center justify-between"
        style={{
          width: "315.2px",
          height: "54.64px",
          top: "27.1px",
          left: "39.56px",
        }}
      >
        {/* Left icon  43.85 × 44.87 | offset top:4.85 left:0.51 */}
        <div
          className="flex-shrink-0 flex items-center justify-center"
          style={{
            width: "43.85px",
            height: "44.87px",
            marginTop: "4.85px",
            marginLeft: "0.51px",
          }}
        >
          {/* icon is passed as prop from parent — e.g. <img src={CoinsIcon} /> */}
          {icon}
        </div>

        {/* Right "vs Last Month" text  82 × 31 | Outfit 13px 400 */}
        <div
          className="flex-shrink-0 flex items-center justify-end text-white/50"
          style={{
            width: "82px",
            height: "31px",
            fontFamily: "Outfit, sans-serif",
            fontWeight: 400,
            fontSize: "13px",
            lineHeight: "30.73px",
            letterSpacing: "0.01em",
            whiteSpace: "nowrap",
          }}
        >
          vs Last Month
        </div>
      </div>

      {/* ── BOTTOM BLOCK  333 × 86 | top:95.86 left:40 ── */}
      <div
        className="absolute flex items-end justify-between"
        style={{
          width: "333px",
          height: "86px",
          top: "95.86px",
          left: "40px",
        }}
      >
        {/* Left: trend badge + label + value */}
        <div className="flex flex-col justify-end gap-[4px]" style={{ flex: 1 }}>
          {/* Trend badge */}
          {trend && (
            <span
              className={`w-fit px-2 py-[2px] rounded-full text-[11px] font-semibold leading-tight ${
                trend.positive !== false
                  ? "bg-green-400/20 text-green-300"
                  : "bg-red-400/20 text-red-300"
              }`}
            >
              {trend.positive !== false ? "▲" : "▼"} {trend.value}
            </span>
          )}

          {/* Label */}
          <p
            className="text-white/55 uppercase tracking-wide"
            style={{
              fontFamily: "Outfit, sans-serif",
              fontWeight: 400,
              fontSize: "11px",
              lineHeight: "1.3",
              letterSpacing: "0.06em",
            }}
          >
            {label}
          </p>

          {/* Value */}
          <p
            className="text-white font-bold leading-none tracking-tight"
            style={{
              fontFamily: "Outfit, sans-serif",
              fontWeight: 700,
              fontSize: "28px",
            }}
          >
            {value}
          </p>
        </div>

        {/* Right: sparkline bars */}
        {sparkline && (
          <div className="flex-shrink-0 pb-1">
            <SparklineBars />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
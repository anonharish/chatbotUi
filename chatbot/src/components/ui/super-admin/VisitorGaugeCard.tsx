import React from "react";

// ─── Figma Spec ───────────────────────────────────────────────────────────────
// Card:            405 × 208px  |  border-radius: 37.56px  |  border: 1.71px
// Each gauge box:  162.23 × 84.14px
// Gauge style:     segmented tick marks (speedometer style) — NOT solid arc

interface GaugeProps {
  percentage: number;
  label: string;
}

// ─── Segmented Speedometer Gauge ──────────────────────────────────────────────
const SemiGauge: React.FC<GaugeProps> = ({ percentage, label }) => {
  const cx = 80;
  const cy = 78;
  const innerR = 42;
  const outerR = 62;
  const totalTicks = 28;
  const filledTicks = Math.round((percentage / 100) * totalTicks);

  // Ticks spread from 180° → 0° (left to right across the top)
  const startAngle = 180;
  const endAngle   = 0;
  const angleRange = startAngle - endAngle; // 180°

  const ticks = Array.from({ length: totalTicks }, (_, i) => {
    // spread ticks evenly across 180°
    const angle = startAngle - (i / (totalTicks - 1)) * angleRange;
    const rad   = (angle * Math.PI) / 180;

    const x1 = cx + innerR * Math.cos(rad);
    const y1 = cy - innerR * Math.sin(rad); // SVG y is flipped
    const x2 = cx + outerR * Math.cos(rad);
    const y2 = cy - outerR * Math.sin(rad);

    const isFilled = i < filledTicks;

    return { x1, y1, x2, y2, isFilled };
  });

  // Pointer triangle at the percentage position
  const pointerAngle = startAngle - (percentage / 100) * angleRange;
  const pointerRad   = (pointerAngle * Math.PI) / 180;
  const pointerR     = innerR - 6;
  const px = cx + pointerR * Math.cos(pointerRad);
  const py = cy - pointerR * Math.sin(pointerRad);

  // small triangle pointing outward
  const perpRad = pointerRad + Math.PI / 2;
  const tipX  = px + 6  * Math.cos(pointerRad);
  const tipY  = py - 6  * Math.sin(pointerRad);
  const base1X = px + 4 * Math.cos(perpRad);
  const base1Y = py - 4 * Math.sin(perpRad);
  const base2X = px - 4 * Math.cos(perpRad);
  const base2Y = py + 4 * Math.sin(perpRad);

  return (
    <div className="flex flex-col items-center">
      {/* SVG gauge — viewBox 160×90 */}
      <div style={{ width: "162px", height: "84px", position: "relative" }}>
        <svg
          width="162"
          height="84"
          viewBox="0 0 160 86"
          fill="none"
        >
          {/* Tick marks */}
          {ticks.map((tick, i) => (
            <line
              key={i}
              x1={tick.x1}
              y1={tick.y1}
              x2={tick.x2}
              y2={tick.y2}
              stroke={
                tick.isFilled
                  ? "rgba(255,255,255,0.90)"
                  : "rgba(255,255,255,0.18)"
              }
              strokeWidth="5"
              strokeLinecap="round"
            />
          ))}

          {/* Inner arc (thin white line) */}
          <path
            d={`M ${cx - innerR} ${cy} A ${innerR} ${innerR} 0 0 1 ${cx + innerR} ${cy}`}
            stroke="rgba(255,255,255,0.30)"
            strokeWidth="1"
            fill="none"
          />

          {/* Pointer triangle */}
          <polygon
            points={`${tipX},${tipY} ${base1X},${base1Y} ${base2X},${base2Y}`}
            fill="rgba(255,255,255,0.85)"
          />

          {/* Percentage text */}
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            fill="white"
            fontFamily="Outfit, sans-serif"
            fontWeight="700"
            fontSize="22"
          >
            {percentage}%
          </text>
        </svg>
      </div>

      {/* Label */}
      <span
        className="text-white font-semibold text-center mt-1"
        style={{
          fontFamily: "Outfit, sans-serif",
          fontWeight: 600,
          fontSize: "13px",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </div>
  );
};

// ─── Card ─────────────────────────────────────────────────────────────────────
interface VisitorGaugeCardProps {
  nriPercentage?:   number;
  localPercentage?: number;
  vsLastWeek?:      boolean;
  className?:       string;
}

const VisitorGaugeCard: React.FC<VisitorGaugeCardProps> = ({
  nriPercentage   = 58,
  localPercentage = 75,
  vsLastWeek      = true,
  className       = "",
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
      {/* Glassmorphism glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.03) 100%)",
          borderRadius: "37.56px",
        }}
      />

      {/* ── Header row ── */}
      <div
        className="absolute flex items-center justify-between"
        style={{ top: "20px", left: "27px", right: "27px" }}
      >
        <span
          className="text-white font-semibold"
          style={{ fontFamily: "Outfit, sans-serif", fontSize: "15px", fontWeight: 600 }}
        >
          Visitors
        </span>
        {vsLastWeek && (
          <span
            className="text-white/55"
            style={{ fontFamily: "Outfit, sans-serif", fontSize: "13px", fontWeight: 400 }}
          >
            vs Last Week
          </span>
        )}
      </div>

      {/* ── Two gauges: equal halves, both centred in their half ── */}
      <div
        className="absolute flex items-start"
        style={{
          top: "50px",
          left: "0",
          right: "0",
          paddingLeft: "12px",
          paddingRight: "12px",
          justifyContent: "space-around",
        }}
      >
        <SemiGauge percentage={nriPercentage}   label="NRI Visitors"   />
        <SemiGauge percentage={localPercentage} label="Local Visitors" />
      </div>
    </div>
  );
};

export default VisitorGaugeCard;
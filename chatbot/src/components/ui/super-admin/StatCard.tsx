import { useMemo } from "react";

const SparklineLines: React.FC = () => {
  const lines = useMemo(() => {
    return [
      60, 85, 70, 95, 75, 65, 80, 72, 90, 78, 88, 68, 82, 74
    ];
  }, []);

  return (
    <div className="relative flex items-center justify-between w-full h-full">
      {lines.map((h, i) => {
        const height = Math.max(30, Math.min(100, h));

        return (
          <div
            key={i}
            style={{
              width: "5px",
              height: `${height}%`,
              borderRadius: "10px",
              background: "rgba(255,255,255,0.9)",

              // ✅ PERFECT CENTERING
              position: "absolute",
              left: `${(i / (lines.length - 1)) * 100}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}
    </div>
  );
};

//
// ─── MAIN CARD ────────────────────────────────────────────────────────────────
//
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
      className={`relative w-full min-h-[180px] sm:min-h-[180px] backdrop-blur-md bg-white/10 overflow-hidden ${className}`}
      style={{
        borderRadius: "38px",
        border: "1.7px solid rgba(255,255,255,0.22)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
      }}
    >
      {/* Glass effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.03) 100%)",
        }}
      />

      {/* ─── TOP SECTION ───────────────────────── */}
      <div className="absolute top-5 left-0 w-full px-5 sm:px-6 flex items-center justify-between">
        
        {/* Left Icon */}
        <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12">
          {icon}
        </div>

        {/* Right Text */}
        <span className="text-white/60 text-[12px] sm:text-[13px] font-normal whitespace-nowrap">
          vs Last Month
        </span>
      </div>

      {/* ─── BOTTOM SECTION ───────────────────── */}
      <div className="absolute bottom-5 left-0 w-full px-5 sm:px-6 flex items-end justify-between gap-4">
        
        {/* LEFT CONTENT */}
        <div className="flex flex-col gap-1">
          
          {/* Trend */}
          {trend && (
            <span
              className={`w-fit px-2 py-[3px] rounded-full text-[10px] sm:text-[11px] font-semibold ${
                trend.positive !== false
                  ? "bg-green-400/20 text-green-300"
                  : "bg-red-400/20 text-red-300"
              }`}
            >
              {trend.positive !== false ? "▲" : "▼"} {trend.value}
            </span>
          )}

          {/* Label */}
          <p className="text-white/60 text-[10px] sm:text-[11px] uppercase tracking-wide">
            {label}
          </p>

          {/* Value */}
          <p className="text-white font-bold text-[22px] sm:text-[26px] md:text-[30px] leading-none">
            {value}
          </p>
        </div>

        {/* RIGHT SPARKLINE */}
        {sparkline && (
          <div className="w-[110px] sm:w-[140px] md:w-[170px] h-[60px] sm:h-[70px] md:h-[80px]">
            <SparklineLines />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
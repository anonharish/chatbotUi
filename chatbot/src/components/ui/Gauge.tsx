
export default function Gauge({ value = 78 }) {
  const totalTicks = 36;
  const activeTicks = Math.round(
    (value / 100) * totalTicks
  );

  return (
    <div className="relative w-[240px] h-[240px]">
      <svg viewBox="0 0 240 240">

        {[...Array(totalTicks)].map((_, i) => {
          const angle = (i / totalTicks) * 270 - 135;
          const rad = (angle * Math.PI) / 180;
          const x1 = 120 + Math.cos(rad) * 80;
          const y1 = 120 + Math.sin(rad) * 80;
          const x2 = 120 + Math.cos(rad) * 100;
          const y2 = 120 + Math.sin(rad) * 100;

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

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <div className="text-4xl font-semibold">
          {value}%
        </div>
        <p className="mt-1">Fully Verified</p>
        <p className="text-white/70 text-sm">
          KYC Compliance
        </p>
      </div>

    </div>
  );
}

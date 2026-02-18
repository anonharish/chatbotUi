import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

type VelocityPoint = {
  m: string;
  v: number;
};

type RadialData = {
  value: number;
};

type Props = {
  velocity: VelocityPoint[];
  radial?: RadialData[];
};

export default function BigVelocityCard({ velocity, radial }: Props) {

  const percent = radial?.[0]?.value ?? 78;
  const totalSegments = 23;
  const filled = Math.round((percent / 100) * totalSegments);

  const segments = Array.from({ length: totalSegments }, (_, i) => {
    const angle = -180 + (180 / (totalSegments - 1)) * i;
    return {
      angle,
      isFilled: i < filled,
    };
  });

  return (
    <div
      className="
        w-full
        xl:max-w-[842px]
        min-h-[320px]
        xl:h-[368px]
        bg-white
        rounded-[28px]
        border border-gray-200
        shadow-[0_12px_35px_rgba(0,0,0,0.06)]
        p-6 md:p-8 xl:px-10 xl:py-9
        flex
        flex-col xl:flex-row
        gap-8 xl:gap-10
      "
    >

      {/* ================= LEFT CHART ================= */}
      <div className="flex-1">
        <h3 className="text-base md:text-lg font-medium mb-4 md:mb-6 text-gray-700">
          Agents Onboarding Velocity
        </h3>

        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={velocity}>

            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#DBEAFE" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            {/* ⭐ DOTTED GRID ADDED */}
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#E5E7EB"
            />

            <XAxis
              dataKey="m"
              tick={{ fontSize: 12, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fontSize: 12, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="v"
              stroke="#3B82F6"
              strokeWidth={2.5}
              fill="url(#areaGrad)"
              dot={(props: any) => {
                if (props.payload.m === "Jul") {
                  return (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={5}
                      fill="#3B82F6"
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  );
                }
                return null;
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ================= DIVIDER ================= */}
      <div className="hidden xl:block w-[1px] bg-gray-200" />

      {/* ================= RIGHT GAUGE ================= */}
      <div className="flex-1 flex items-center justify-center relative">

        <div className="w-[220px] sm:w-[260px] md:w-[280px] aspect-[14/10]">
          <svg viewBox="0 0 280 200" className="w-full h-full">
            {segments.map((seg, i) => {

              const radius = 95;
              const centerX = 140;
              const centerY = 155;
              const barLength = 20;
              const barWidth = 8;

              const angleRad = (seg.angle * Math.PI) / 180;
              const innerX = centerX + (radius - barLength) * Math.cos(angleRad);
              const innerY = centerY + (radius - barLength) * Math.sin(angleRad);
              const outerX = centerX + radius * Math.cos(angleRad);
              const outerY = centerY + radius * Math.sin(angleRad);

              return (
                <line
                  key={i}
                  x1={innerX}
                  y1={innerY}
                  x2={outerX}
                  y2={outerY}
                  stroke={seg.isFilled ? "#3B82F6" : "#E5E7EB"}
                  strokeWidth={barWidth}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
        </div>

        {/* CENTER TEXT */}
        <div className="absolute text-center top-[63%] -translate-y-1/2">
          <p className="text-3xl md:text-5xl font-semibold text-gray-700">
            {percent}%
          </p>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Fully Verified
          </p>
        </div>

        {/* BOTTOM LABEL */}
        <div className="absolute bottom-2 md:bottom-4 text-center">
          <p className="text-xs md:text-sm text-gray-500">
            KYC Compliance
          </p>
        </div>
      </div>

    </div>
  );
}

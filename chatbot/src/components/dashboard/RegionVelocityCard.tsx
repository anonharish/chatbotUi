import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid
} from "recharts";
import DashboardCard from "./DashboardCard";

export default function RegionVelocityCard({ velocity }: any) {
  return (
    <DashboardCard
      className="
        w-full
        xl:max-w-[513px]
        min-h-[300px]
        xl:h-[368px]
        px-4 sm:px-6
        py-5
      "
    >
      <h3 className="font-semibold mb-3 md:mb-4 text-gray-700 text-sm md:text-base">
        Region Creation Velocity
      </h3>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={velocity}>

          {/* Smooth area gradient */}
          <defs>
            <linearGradient id="regionGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>

            {/* vertical glow */}
            <linearGradient id="glowLine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4}/>
              <stop offset="100%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
          </defs>

          {/* dashed grid like UI */}
          <CartesianGrid
            strokeDasharray="4 4"
            vertical={false}
            stroke="#E5E7EB"
          />

          <XAxis
            dataKey="m"
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip />

          {/* APR glow highlight */}
          <ReferenceLine
            x="Apr"
            stroke="url(#glowLine)"
            strokeWidth={10}
            strokeLinecap="round"
          />

          {/* Area */}
          <Area
            type="monotone"
            dataKey="v"
            stroke="#2563EB"
            strokeWidth={2.5}
            fill="url(#regionGrad)"
            dot={(props: any) => {
              if (props.payload.m === "Apr") {
                return (
                  <circle
                    cx={props.cx}
                    cy={props.cy}
                    r={5}
                    fill="white"
                    stroke="#2563EB"
                    strokeWidth={3}
                  />
                );
              }
              return null;
            }}
          />

        </AreaChart>
      </ResponsiveContainer>
    </DashboardCard>
  );
}

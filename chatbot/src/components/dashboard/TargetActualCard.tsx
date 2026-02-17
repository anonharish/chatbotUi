import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import DashboardCard from "./DashboardCard";

export default function TargetActualCard({ compare }: any) {
  return (
    <DashboardCard
      className="
        w-full
        xl:max-w-[760px]
        min-h-[300px]
        xl:h-[367px]
        px-4 sm:px-6
        py-5
      "
    >
      {/* TITLE */}
      <h3 className="font-semibold mb-3 md:mb-4 text-gray-700 text-sm md:text-base">
        Regional Creation Target vs Actual
      </h3>

      {/* CHART */}
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={compare}>

          {/* ⭐ DOTTED GRID (like other cards) */}
          <CartesianGrid
            strokeDasharray="4 4"
            vertical={false}
            stroke="#E5E7EB"
          />

          {/* ⭐ BAR GRADIENT */}
          <defs>
            <linearGradient id="gradBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3952E5" />
              <stop offset="50%" stopColor="#1BA1B7" />
              <stop offset="100%" stopColor="#1F98BD" />
            </linearGradient>
          </defs>

          {/* X AXIS */}
          <XAxis
            dataKey="m"
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          {/* Y AXIS */}
          <YAxis
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip />

          {/* TARGET */}
          <Bar
            dataKey="t"
            fill="#E5E7EB"
            radius={[10, 10, 0, 0]}
          />

          {/* ACTUAL */}
          <Bar
            dataKey="a"
            fill="url(#gradBar)"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

    </DashboardCard>
  );
}

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import DashboardCard from "./DashboardCard";

export default function WorkforceCard({ workforce }: any) {
  return (
    <DashboardCard
      className="
        w-full
        xl:max-w-[431px]
        min-h-[300px]
        xl:h-[367px]
        px-4 sm:px-6
        py-5
      "
    >
      {/* TITLE */}
      <h3 className="text-sm md:text-base font-medium mb-4 text-gray-700">
        Workforce Structure
      </h3>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={workforce}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          {/* ⭐ DOTTED GRID */}
          <CartesianGrid
            strokeDasharray="4 4"
            stroke="#E5E7EB"
            vertical={false}
          />

          {/* ⭐ GRADIENT BARS */}
          <defs>
            <linearGradient id="workforceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#93C5FD" />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#6B7280" }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fontSize: 12, fill: "#9CA3AF" }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip />

          <Bar
            dataKey="v"
            radius={[50, 50, 50, 50]}   // ⭐ Pill Shape
            maxBarSize={40}
          >
            {workforce.map((_: any, index: number) => (
              <Cell key={index} fill="url(#workforceGrad)" />
            ))}
          </Bar>

        </BarChart>
      </ResponsiveContainer>
    </DashboardCard>
  );
}

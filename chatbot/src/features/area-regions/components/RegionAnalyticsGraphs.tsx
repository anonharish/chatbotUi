import GlassCard from "@/components/ui/GlassCard";
import CapsuleBar from "@/components/ui/CapsuleBar";
import OutlineCapsuleBar from "@/components/ui/OutlineCapsuleBar";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

/* ===== Figma Glass Tint ===== */
const figmaShade =
  "relative overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 rounded-[24px] md:rounded-[28px] lg:rounded-[32px] " +
  "before:absolute before:inset-0 before:bg-gradient-to-b before:from-blue-200/20 before:to-transparent before:pointer-events-none";

/* ===== Data ===== */
const lineData = [
  { m: "Jan", v: 200 },
  { m: "Feb", v: 260 },
  { m: "Mar", v: 210 },
  { m: "Apr", v: 340 },
  { m: "May", v: 240 },
  { m: "Jun", v: 290 },
  { m: "Jul", v: 250 },
];

const compareData = [
  { m: "Jan", a: 25, b: 40 },
  { m: "Feb", a: 55, b: 38 },
  { m: "Mar", a: 40, b: 60 },
  { m: "Apr", a: 28, b: 40 },
  { m: "May", a: 30, b: 38 },
];

/* ===== Component ===== */
export default function RegionAnalyticsGraphs() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 lg:gap-6">

      {/* ===== Region Creation Velocity ===== */}
      <GlassCard className={`${figmaShade} h-[240px] md:h-[280px] lg:h-[320px] px-4 md:px-5 pt-3 md:pt-4 pb-2`}>
        <h3 className="mb-2 text-white/90 text-xs md:text-sm">
          Region Creation Velocity
        </h3>

        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={lineData}>
            <CartesianGrid
              stroke="white"
              strokeOpacity={0.18}
              strokeDasharray="2 8"
              vertical={false}
            />

            <YAxis
              domain={[0, 500]}
              ticks={[0, 100, 200, 300, 400, 500]}
              tick={{ fill: "white", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />

            <XAxis
              dataKey="m"
              tick={{ fill: "white", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />

            <Line
              type="monotone"
              dataKey="v"
              stroke="white"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* ===== Target vs Actual ===== */}
      <GlassCard className={`${figmaShade} h-[240px] md:h-[280px] lg:h-[320px] px-4 md:px-5 pt-3 md:pt-4 pb-2`}>
        <h3 className="mb-2 text-white/90 text-xs md:text-sm">
          Regional Creation Target vs Actual
        </h3>

        <ResponsiveContainer width="100%" height="90%">
          <BarChart
            data={compareData}
            barGap={12}
            barCategoryGap="30%"
          >
            <CartesianGrid
              stroke="white"
              strokeOpacity={0.18}
              strokeDasharray="2 8"
              vertical={false}
            />

            <YAxis
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              tick={{ fill: "white", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />

            <XAxis
              dataKey="m"
              tick={{ fill: "white", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />

            <Bar
              dataKey="a"
              shape={<OutlineCapsuleBar />}
              barSize={28}
            />

            <Bar
              dataKey="b"
              fill="white"
              shape={<CapsuleBar />}
              barSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>

    </div>
  );
}
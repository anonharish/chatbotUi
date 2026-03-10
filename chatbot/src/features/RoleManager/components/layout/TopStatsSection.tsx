import GlassCard from "@/components/ui/GlassCard";
import Gauge from "@/components/ui/Gauge";
import CapsuleBar from "@/components/ui/CapsuleBar";
import { lineData, barData } from "@/data/directoryData";

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

export default function TopGraphsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* ================= LINE + GAUGE ================= */}
      <GlassCard className="lg:col-span-2 h-[360px] flex flex-col md:flex-row overflow-hidden">
        {/* Line */}
        <div className="w-full md:w-1/2 px-6 pt-6 pb-4">
          <h3 className="text-white text-sm font-medium mb-4 tracking-wide">
            Agents Onboarding Velocity
          </h3>

          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={lineData}
                margin={{ top: 5, right: 20, left: 20, bottom: 25 }}
              >
                <CartesianGrid
                  stroke="white"
                  strokeOpacity={0.12}
                  strokeDasharray="2 8"
                  vertical={false}
                />
                <YAxis
                  domain={[0, 500]}
                  ticks={[0, 100, 200, 300, 400, 500]}
                  tick={{ fill: "white", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={45}
                />
                <XAxis
                  dataKey="m"
                  tick={{ fill: "white", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={20}
                  padding={{ left: 15, right: 10 }}
                />
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke="white"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "white" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="hidden md:block w-[1px] bg-white/15 my-8" />
        <div className="md:hidden h-[1px] bg-white/15 mx-8" />

        {/* Gauge */}
        <div className="w-full md:w-1/2 flex items-center justify-center py-6 md:py-0">
          <Gauge value={78} />
        </div>
      </GlassCard>

      {/* ================= WORKFORCE ================= */}
      <GlassCard className="h-[360px] px-6 pt-6 pb-4">
        <h3 className="text-white text-sm font-medium mb-4 tracking-wide">
          Workforce Structure
        </h3>

        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{ top: 10, right: 10, left: 5, bottom: 5 }}
              barCategoryGap="25%"
            >
              <CartesianGrid
                stroke="white"
                strokeOpacity={0.12}
                strokeDasharray="2 8"
                vertical={false}
              />
              <YAxis
                domain={[0, 500]}
                ticks={[0, 100, 200, 300, 400, 500]}
                tick={{ fill: "white", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <XAxis
                dataKey="n"
                tick={{ fill: "white", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickMargin={14}
                height={40}
              />
              <Bar
                dataKey="v"
                fill="white"
                shape={<CapsuleBar />}
                barSize={36}
                radius={[20, 20, 20, 20]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
}

import GlassCard from "@/components/ui/GlassCard";
import Gauge from "@/components/ui/Gauge";
import CapsuleBar from "@/components/ui/CapsuleBar";

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

const lineData = [
  { m: "Jan", v: 200 },
  { m: "Feb", v: 260 },
  { m: "Mar", v: 210 },
  { m: "Apr", v: 340 },
  { m: "May", v: 240 },
  { m: "Jun", v: 290 },
  { m: "Jul", v: 250 },
];

const barData = [
  { n: "R.O.", v: 120 },
  { n: "I.O.", v: 140 },
  { n: "F.O.", v: 320 },
  { n: "Agents", v: 450 },
];

export default function TopGraphsSection() {
  return (
    <div className="grid grid-cols-3 gap-8">

      {/* Line + Gauge */}
      <GlassCard className="col-span-2 h-[360px] flex">

        {/* Line chart */}
        <div className="w-1/2 p-6">
          <h3 className="mb-4 text-white">
            Agents Onboarding Velocity
          </h3>

          <ResponsiveContainer width="100%" height="85%">
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
                tick={{ fill: "white" }}
                axisLine={false}
                tickLine={false}
              />
              <XAxis
                dataKey="m"
                tick={{ fill: "white" }}
                axisLine={false}
                tickLine={false}
              />
              <Line
                type="monotone"
                dataKey="v"
                stroke="white"
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Divider */}
        <div className="w-[1px] bg-white/20 my-6" />

        {/* Gauge */}
        <div className="w-1/2 flex items-center justify-center">
          <Gauge value={78} />
        </div>

      </GlassCard>

      {/* Workforce */}
      <GlassCard className="h-[360px] p-6">
        <h3 className="mb-4 text-white">
          Workforce Structure
        </h3>

        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={barData}>
            <CartesianGrid
              stroke="white"
              strokeOpacity={0.18}
              strokeDasharray="2 8"
              vertical={false}
            />
            <YAxis
              domain={[0, 500]}
              ticks={[0, 100, 200, 300, 400, 500]}
              tick={{ fill: "white" }}
              axisLine={false}
              tickLine={false}
            />
            <XAxis
              dataKey="n"
              tick={{ fill: "white" }}
              axisLine={false}
              tickLine={false}
            />
            <Bar
              dataKey="v"
              fill="white"
              shape={<CapsuleBar />}
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>

    </div>
  );
}

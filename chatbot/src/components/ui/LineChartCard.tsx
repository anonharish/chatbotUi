import GlassCard from "./GlassCard";
import { CartesianGrid } from "recharts";

import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", value: 200 },
  { month: "Feb", value: 260 },
  { month: "Mar", value: 210 },
  { month: "Apr", value: 340 },
  { month: "May", value: 240 },
  { month: "Jun", value: 290 },
  { month: "Jul", value: 250 },
];

export default function LineChartCard() {
  return (
    <GlassCard className="w-[600px] h-[320px]">
      <h3 className="text-white mb-4">Agents Onboarding Velocity</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
            <CartesianGrid
            stroke="white"
            strokeOpacity={0.15}
            strokeDasharray="4 6"
             />
          <XAxis dataKey="month" stroke="white" />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="white" />
        </LineChart>
      </ResponsiveContainer>
    </GlassCard>
  );
}

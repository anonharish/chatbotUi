import GlassCard from "./GlassCard";
import { CartesianGrid } from "recharts";

import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "R.O.", value: 120 },
  { name: "I.O.", value: 140 },
  { name: "F.O.", value: 320 },
  { name: "Agents", value: 450 },
];

export default function BarChartCard({ data }: { data: any[] }) {
  return (
    <GlassCard className="w-[450px] h-[420px]">
      <h3 className="text-white mb-4">Workforce Structure</h3>

      <ResponsiveContainer width="950%" height="100%">
        <BarChart data={data}>
            <CartesianGrid
             stroke="white"
             strokeOpacity={0.15}
             strokeDasharray="4 6"
            />
          <XAxis dataKey="name" stroke="white" />
          <Bar dataKey="value" fill="white" radius={[20, 20, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </GlassCard>
  );
}

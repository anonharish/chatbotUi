import GlassCard from "./GlassCard";
import {
  CartesianGrid,
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
} from "recharts";

type BarChartCardProps = {
  data: {
    name: string;
    value: number;
  }[];
};

export default function BarChartCard({ data }: BarChartCardProps) {
  return (
    <GlassCard className="w-[450px] h-[420px]">
      <h3 className="text-white mb-4">Workforce Structure</h3>

      <ResponsiveContainer width="100%" height="100%">
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
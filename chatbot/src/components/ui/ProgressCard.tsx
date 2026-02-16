import GlassCard from "./GlassCard";
import { CartesianGrid } from "recharts";

export default function ProgressCard() {
  return (
    <GlassCard className="w-[300px] h-[320px] flex flex-col items-center justify-center">
<CartesianGrid
  stroke="white"
  strokeOpacity={0.15}
  strokeDasharray="4 6"
/>

      <div className="relative w-40 h-40 rounded-full border-[12px] border-white/30 flex items-center justify-center">
        <span className="text-white text-2xl font-semibold">78%</span>
      </div>

      <p className="text-white mt-4">Fully Verified</p>
      <p className="text-white/70 text-sm">KYC Compliance</p>

    </GlassCard>
  );
}

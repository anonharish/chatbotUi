import Gauge from "@/components/ui/Gauge";
import BarChartCard from "@/components/ui/BarChartCard";
import GlassCard from "@/components/ui/GlassCard";

export default function TopStatsSection() {
  return (
    <div className="flex gap-10 justify-center">

      {/* Left Graph Card */}
      <GlassCard className="w-[600px] h-[320px] p-6">
        <h3 className="text-white mb-4">Agents Onboarding Velocity</h3>
        {/* Later we can add line chart here */}
      </GlassCard>

      {/* Gauge */}
      <GlassCard className="w-[350px] h-[320px] flex items-center justify-center">
        <Gauge value={78} />
      </GlassCard>

      {/* Bar Chart */}
      <BarChartCard />

    </div>
  );
}

import GlassCutCard from "@/components/pages/GlassCutCard";
import RegionAnalyticsGraphs from "@/features/area-regions/components/RegionAnalyticsGraphs";
import RegionsDataSection from "@/features/area-regions/components/RegionsDataSection";

export default function RegionsSectionPage() {
  return (
    <div className="pl-20 pr-12 pt-12 pb-12 overflow-x-hidden">

      <div className="w-full max-w-[1660px] mx-auto">

        {/* TOP GRAPHS */}
        <div className="mb-8">
          <RegionAnalyticsGraphs />
        </div>

        {/* TITLE OUTSIDE GLASS */}
        <h2 className="text-white text-2xl font-semibold mb-6 pl-6">
          Regions & Area Data
        </h2>

        {/* GLASS CARD */}
        <GlassCutCard>
          <RegionsDataSection />
        </GlassCutCard>

      </div>

    </div>
  );
}
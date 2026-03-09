import GlassCutCard from "@/components/pages/GlassCutCard";
import { TopGraphs } from "@/features/regions/components/TopGraphs";
import { RegionsSection } from "@/features/regions/components/RegionsSection";

export default function RegionsSectionPage() {
  return (
    <div className="pl-20 pr-12 pt-12 pb-12 overflow-x-hidden">

      <div className="w-full max-w-[1660px] mx-auto">

        {/* TOP GRAPHS */}
        <div className="mb-8">
          <TopGraphs />
        </div>

        {/* TITLE OUTSIDE GLASS */}
        <h2 className="text-white text-2xl font-semibold mb-6 pl-6">
          Regions & Area Data
        </h2>

        {/* GLASS CARD */}
        <GlassCutCard>
          <RegionsSection />
        </GlassCutCard>

      </div>

    </div>
  );
}
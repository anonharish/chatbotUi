import TopGraphsSection from "./components/layout/TopStatsSection";
import GlassCutCard from "@/components/pages/GlassCutCard";
import DirectoryCards from "@/components/DirectoryCards/DirectoryCards";

export default function DirectoryPage() {
  return (

      <div className="min-h-screen pl-20 pr-12 pt-12 pb-12">

        {/* TOP GRAPHS */}
        <TopGraphsSection />

        {/* USER DIRECTORY HEADING */}
        <div className="mt-8">
          <h2 className="text-white text-3xl font-semibold mt-10 ml-8">
            User Directory
          </h2>
        </div>

        {/* GLASS DIRECTORY SECTION */}
<div className="relative flex justify-center items-start -mt-25">

          <div className="relative w-[1304px]">

            {/* Glass Background */}
            <GlassCutCard />

            {/* Directory Cards */}
            <div className="absolute top-[260px] left-0 right-0 flex justify-center">
              <DirectoryCards />
            </div>

          </div>

        </div>

      </div>

  );
}

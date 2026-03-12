import TopGraphsSection from "./components/layout/TopStatsSection";
import GlassCutCard from "@/components/pages/GlassCutCard";
import DirectoryCards from "@/components/DirectoryCards/DirectoryCards";

export default function DirectoryPage() {
  return (
    <div className=" pl-20 pr-12 pt-12 pb-12 overflow-x-hidden">
      {/* TOP GRAPHS */}
      <TopGraphsSection />
      {/* USER DIRECTORY HEADING */}
      <div>
        <h2 className="text-white text-3xl font-semibold mt-2 ">
          User Directory
        </h2>
      </div>
      {/* GLASS DIRECTORY SECTION */}
      <div className="relative flex justify-center items-start mt-8 pb-10">
        <div className="relative w-full max-w-[1304px]">
          {/* Glass Background */}
          <GlassCutCard />
          {/* Directory Cards - Overlaying the Glass Card */}
          <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center pointer-events-none">
            <div className="pointer-events-auto w-full">
              <DirectoryCards />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

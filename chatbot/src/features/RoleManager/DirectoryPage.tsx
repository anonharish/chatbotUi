import TopGraphsSection from "./components/layout/TopStatsSection";
import GlassCutCard from "@/components/pages/GlassCutCard";
import DirectoryCards from "@/components/DirectoryCards/DirectoryCards";

export default function DirectoryPage() {
  return (

      <div className=" pl-20 pr-12 pt-12 pb-12 overflow-x-hidden">
        {/* TOP GRAPHS */}
        <TopGraphsSection />
        {/* USER DIRECTORY HEADING */}
        <div className="mt-8">
          <h2 className="text-white text-3xl font-semibold mt-10 ml-5">
            User Directory
          </h2> 
        </div> 
        {/* GLASS DIRECTORY SECTION */}
          <div className="relative flex justify-center items-start -mt-15">
          <div className="relative w-full max-w-[1800px]">
            {/* Glass Background */}
            <GlassCutCard />
            {/* Directory Cards */}
            <div className="absolute top-[200px] left-0 right-0 flex justify-center">
              <DirectoryCards />
            </div>
          </div>
        </div>
      </div>
  );
}

import GlassCutCard from "@/components/pages/GlassCutCard";
import DirectoryCards from "@/components/DirectoryCards";
import PillDropdownButton from "@/components/ui/PillDropdownButton";

export default function DirectorySection() {
  return (
    <div className="relative flex justify-center">

      {/* Glass Background Shape */}
      <div className="relative w-[1304px] h-[700px]">

        <GlassCutCard />

        {/* Header */}
        <h2 className="absolute top-6 left-10 text-white text-2xl font-semibold">
          User Directory
        </h2>

        {/* Pills */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-6">
          <PillDropdownButton
            label="ANDHRA PRADESH"
            options={["Telangana", "Karnataka", "Tamil Nadu"]}
          />
          <PillDropdownButton
            label="VIZAG ZONE"
            options={["Zone 1", "Zone 2", "Zone 3"]}
          />
        </div>

        {/* Directory Cards */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <DirectoryCards />
        </div>

      </div>
    </div>
  );
}

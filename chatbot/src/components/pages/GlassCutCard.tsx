import PillDropdownButton from "../ui/PillDropdownButton";
import TopRightActions from "../ui/TopRightActions";
import { useState } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";

type FiltersType = {
  state: string;
  zone: string;
  search: string;
};

interface GlassCutCardProps {
  children?: ReactNode;
  onFilterChange?: Dispatch<SetStateAction<FiltersType>>;
}

export default function GlassCutCard({
  children,
  onFilterChange,
}: GlassCutCardProps) {

  const [selectedState, setSelectedState] = useState("ANDHRA PRADESH");
  const [selectedZone, setSelectedZone] = useState("VIZAG ZONE");

  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
    "Chhattisgarh", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  const zones = [
    "North Zone",
    "South Zone",
    "East Zone",
    "West Zone",
    "Central Zone"
  ];

  // 🔥 Handle state change
  const handleStateChange = (value: string) => {
    setSelectedState(value);
    onFilterChange?.((prev) => ({
      ...prev,
      state: value,
    }));
  };

  // 🔥 Handle zone change
  const handleZoneChange = (value: string) => {
    setSelectedZone(value);
    onFilterChange?.((prev) => ({
      ...prev,
      zone: value,
    }));
  };

  return (
    <div className="relative w-full min-h-[720px] mt-8">
      <div className="relative w-full max-w-[1800px] min-h-[720px]">

        {/* SVG BACKGROUND */}
        <svg
          viewBox="0 0 1304 720"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full z-0"
        >
          <defs>
            <clipPath id="cardShape">
              <path d="M46 0 H362 Q408 0 408 46 Q408 93 454 93 H850 Q896 93 896 46 Q896 0 942 0 H1258 Q1304 0 1304 46 V588 Q1304 634 1258 634 H46 Q0 634 0 588 V46 Q0 0 46 0 Z"/>
            </clipPath>
          </defs>

          <foreignObject width="100%" height="100%" clipPath="url(#cardShape)">
            <div className="w-full h-full backdrop-blur-xl bg-white/10 rounded-[46px]" />
          </foreignObject>

          <path
            d="M46 0 H362 Q408 0 408 46 Q408 93 454 93 H850 Q896 93 896 46 Q896 0 942 0 H1258 Q1304 0 1304 46 V674 Q1304 720 1258 720 H46 Q0 720 0 674 V46 Q0 0 46 0 Z"
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1.5"
          />
        </svg>

        {/* TOP CONTROLS */}
        <div className="absolute top-6 left-0 w-full px-6 z-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">

            {/* LEFT */}
            <div className="w-full lg:w-auto flex justify-start">
              <button className="px-5 py-2 md:px-8 md:py-3 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 text-white text-xs md:text-sm hover:bg-white/30 transition-all">
                Role List
              </button>
            </div>

            {/* CENTER */}
            <div className="w-full lg:w-auto flex flex-wrap justify-center gap-4 mr-24 cursor-pointer">
              
              <PillDropdownButton
                label={selectedState}
                options={states}
                onSelect={handleStateChange}
              />

              <PillDropdownButton
                label={selectedZone}
                options={zones}
                onSelect={handleZoneChange}
              />

            </div>

            {/* RIGHT */}
            <div className="w-full lg:w-auto flex justify-end">
              <TopRightActions />
            </div>

          </div>
        </div>

        {/* CHILDREN */}
        <div className="relative z-20 pt-28 px-6 pb-6">
          {children}
        </div>

      </div>
    </div>
  );
}
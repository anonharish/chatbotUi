import PillDropdownButton from "../ui/PillDropdownButton";
import TopRightActions from "../ui/TopRightActions";
export default function GlassCutCard() {
  return (
    <div className="relative w-full max-w-[1304px] mx-auto min-h-[640px] xl:min-h-[720px] rounded-[46px]">
      <svg
        viewBox="0 0 1304 720"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <clipPath id="cardShape">
            <path d=" M46 0 H362 Q408 0 408 46 Q408 93 454 93 H850 Q896 93 896 46 Q896 0 942 0 H1258 Q1304 0 1304 46 V588 Q1304 634 1258 634 H46 Q0 634 0 588 V46 Q0 0 46 0 Z " />
          </clipPath>
        </defs>
        <foreignObject width="100%" height="100%" clipPath="url(#cardShape)">
          <div className="w-full h-full backdrop-blur-xl bg-white/10 border-white/20 rounded-[46px]" />
        </foreignObject>
        <path
          d=" M46 0 H362 Q408 0 408 46 Q408 93 454 93 H850 Q896 93 896 46 Q896 0 942 0 H1258 Q1304 0 1304 46 V674 Q1304 720 1258 720 H46 Q0 720 0 674 V46 Q0 0 46 0 Z "
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.5"
        />
      </svg>

      {/* Top Controls Row mapped to SVG structural percentages */}
      <div className="absolute top-0 left-0 w-full h-[93px] flex z-50">
        {/* LEFT (0 to 408 = 31.3%) */}
        <div className="w-[31.3%] flex items-center justify-center">
          <button
            className="
                        px-8 py-2 md:px-10 md:py-3
                        rounded-full
                        border border-white/40
                        bg-white/10 backdrop-blur-md
                        text-white font-medium
                        hover:bg-white/20
                        transition-all
                    "
          >
            Role List
          </button>
        </div>

        {/* CENTER VALLEY (408 to 896 = 37.4%) */}
        <div className="w-[37.4%] flex items-center justify-center gap-2 lg:gap-4">
          <PillDropdownButton
            label="ANDHRA PRADESH"
            options={["Telangana", "Karnataka"]}
          />
          <PillDropdownButton
            label="VIZAG ZONE"
            options={["Zone 1", "Zone 2"]}
          />
        </div>

        {/* RIGHT (896 to 1304 = 31.3%) */}
        <div className="w-[31.3%] flex items-center justify-center">
          <TopRightActions
            onAdd={() => console.log("Add")}
            onToggle={() => console.log("Toggle")}
          />
        </div>
      </div>
    </div>
  );
}

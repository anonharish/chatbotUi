import PillDropdownButton from "../ui/PillDropdownButton";
import TopRightActions from "../ui/TopRightActions";
export default function GlassCutCard() {
    return (
        <div className="relative w-full min-h-[720px] mt-25">

<<<<<<< HEAD
type Props = {
  children?: ReactNode;
};

export default function GlassCutCard({ children }: Props) {
  return (
    <div className="relative w-full min-h-screen flex justify-center items-center">

      {/* Background */}
      <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center" />

      {/* Glass Card Wrapper */}
      <div className="relative w-[1580px] max-w-[96vw] h-[800px] flex justify-center overflow-hidden">

        {/* Glass Shape */}
        <svg
          width="1304"
          height="800"
          viewBox="0 0 1304 800"
          className="absolute top-0"
        >
          <defs>
            <clipPath id="glassCut">
              <path
                d="
                M60 0
                H400
                Q440 0 440 40
                Q440 95 500 95
                H804
                Q864 95 864 40
                Q864 0 904 0
                H1244
                Q1304 0 1304 60
                V740
                Q1304 800 1244 800
                H60
                Q0 800 0 740
                V60
                Q0 0 60 0
                Z
                "
              />
            </clipPath>
          </defs>

          {/* Glass Fill */}
          <foreignObject width="100%" height="100%" clipPath="url(#glassCut)">
            <div className="w-full h-full bg-white/20 backdrop-blur-xl border border-white/20 rounded-[46px]" />
          </foreignObject>

          {/* Border */}
          <path
            d="
            M60 0
            H400
            Q440 0 440 40
            Q440 95 500 95
            H804
            Q864 95 864 40
            Q864 0 904 0
            H1244
            Q1304 0 1304 60
            V740
            Q1304 800 1244 800
            H60
            Q0 800 0 740
            V60
            Q0 0 60 0
            Z
            "
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1.5"
          />
        </svg>

        {/* Dashboard Pill */}
        <div className="absolute top-[18px] left-1/2 -translate-x-1/2 z-20">
          <div className="px-32 py-5 rounded-full border border-white/30 bg-white/20 backdrop-blur-md text-white text-sm font-medium shadow-md flex items-center gap-2">
            ← Dashboard
          </div>
        </div>

        {/* SCROLLABLE CONTENT AREA */}
        <div
  className="absolute left-0 right-0 bottom-0 top-[120px] z-10 flex justify-center overflow-y-auto hide-scrollbar"
>

          <div className="w-[1180px] max-w-[92%] flex flex-col gap-8">
            {children}
          </div>

        </div>

      </div>
=======
            <div className="relative w-full max-w-[1800px] min-h-[720px] mt-25">
                <svg viewBox="0 0 1304 720" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                    <defs> {/* Glass blur filter */}
                        {/* Main merged shape path */}
                        {" "}
                        <clipPath id="cardShape">
                            <path d=" M46 0 H362 Q408 0 408 46 Q408 93 454 93 H850 Q896 93 896 46 Q896 0 942 0 H1258 Q1304 0 1304 46 V588 Q1304 634 1258 634 H46 Q0 634 0 588 V46 Q0 0 46 0 Z "/>{" "} </clipPath>
                    </defs>
                    {/* Glass fill */}
                    <foreignObject width="100%" height="100%" clipPath="url(#cardShape)">
                        <div className="w-full h-full  backdrop-blur-xl  border-white/20 rounded-[46px]"/>{" "} </foreignObject>
                    {/* Border stroke */}
                    <path d=" M46 0 H362 Q408 0 408 46 Q408 93 454 93 H850 Q896 93 896 46 Q896 0 942 0 H1258 Q1304 0 1304 46 V674 Q1304 720 1258 720 H46 Q0 720 0 674 V46 Q0 0 46 0 Z " fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
                </svg>
                {/* Top Controls Row */}
{/* Top Controls */}
<div className="absolute top-6 left-0 w-full px-6 z-50">

  <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-4">
>>>>>>> 7c9f557d4cefc77262e2c4ddc34072ae11b8da76

    {/* LEFT */}
    <div className="w-full lg:w-auto flex justify-start">
      <button className="
        px-6 py-3 md:px-10 md:py-4
        rounded-full
        bg-white/20
        backdrop-blur-xl
        border border-white/40
        text-white
        text-sm md:text-lg
        hover:bg-white/30
        transition-all
      ">
        Role List
      </button>
    </div>

    {/* CENTER */}
    <div className="w-full lg:w-auto flex flex-wrap justify-center gap-4 mr-24 cursor-pointer">
      <PillDropdownButton
        label="ANDHRA PRADESH"
        options={["Telangana", "Karnataka", "Tamil Nadu"]}
      />
      <PillDropdownButton
        label="VIZAG ZONE"
        options={["Zone 1", "Zone 2", "Zone 3"]}
      />
    </div>

    {/* RIGHT */}
    <div className="w-full lg:w-auto flex justify-end">
      <TopRightActions
        onAddUserRole={() => console.log("User Role")}
        onAddRegion={() => console.log("Region")}
      />
    </div>

  </div>
</div>
</div>
</div>
        
    );
}

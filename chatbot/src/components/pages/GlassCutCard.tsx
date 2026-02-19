import React from "react";
import PillDropdownButton from "../ui/PillDropdownButton";
import TopRightActions from "../ui/TopRightActions";
export default function GlassCutCard() {
  return (
<div className="relative w-full min-h-[720px] mt-25">
      
<div className="relative w-full max-w-[1800px] min-h-[720px] mt-25">

        
        <svg
          viewBox="0 0 1304 720"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          
          <defs>
            
            {/* Glass blur filter */} {/* Main merged shape path */}{" "}
            <clipPath id="cardShape">
            
              <path d=" M46 0 H362 Q408 0 408 46 Q408 93 454 93 H850 Q896 93 896 46 Q896 0 942 0 H1258 Q1304 0 1304 46 V588 Q1304 634 1258 634 H46 Q0 634 0 588 V46 Q0 0 46 0 Z " />{" "}
            </clipPath>
          </defs>
          {/* Glass fill */}
          <foreignObject width="100%" height="100%" clipPath="url(#cardShape)">
          
            <div className="w-full h-full bg-white/20 backdrop-blur-xl border border-white/20 rounded-[46px]" />{" "}
          </foreignObject>
          {/* Border stroke */}
          <path
            d=" M46 0 H362 Q408 0 408 46 Q408 93 454 93 H850 Q896 93 896 46 Q896 0 942 0 H1258 Q1304 0 1304 46 V674 Q1304 720 1258 720 H46 Q0 720 0 674 V46 Q0 0 46 0 Z "
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1.5"
          />
        </svg>
        <div className="absolute top-10 left-10 right-0 flex justify-between items-center ">
          
          <button className=" px-8 py-3 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 text-white font-medium hover:bg-white/30 transition-all duration-200 ">
            
            Role List
          </button>
        </div>
        {/* Dropdown Pills */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-6 z-10">
          
          <PillDropdownButton
            label="ANDHRA PRADESH"
            options={["Telangana", "Karnataka", "Tamil Nadu"]}
          />
          <PillDropdownButton
            label="VIZAG ZONE"
            options={["Zone 1", "Zone 2", "Zone 3"]}
          />
          <div className="absolute top-6 left-0 right-0 flex justify-between items-center px-210">
            
            <TopRightActions
              onAdd={() => console.log("Add Clicked")}
              onToggle={() => console.log("Toggle Clicked")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}


// import PillDropdownButton from "../ui/PillDropdownButton";
// import TopRightActions from "../ui/TopRightActions";
// import GlassCard from "../ui/GlassCard";

// export default function GlassCutCard() {
//   return (
//     <div className="w-full flex justify-center mt-20">

//       <GlassCard className="relative w-[95vw] max-w-[1800px] aspect-[1304/720]">

//         {/* SVG Shape */}
//         <svg
//           viewBox="0 0 1304 720"
//           preserveAspectRatio="xMidYMid meet"
//           className="absolute inset-0 w-full h-full"
//         >
//           <defs>
//             <clipPath id="cardShape">
//               <path d="M46 0 H362 Q408 0 408 46 Q408 93 454 93 H850 Q896 93 896 46 Q896 0 942 0 H1258 Q1304 0 1304 46 V588 Q1304 634 1258 634 H46 Q0 634 0 588 V46 Q0 0 46 0 Z" />
//             </clipPath>
//           </defs>

//           <foreignObject width="100%" height="100%" clipPath="url(#cardShape)">
//             <div
//               className="
//                 w-full h-full
//                 bg-gradient-to-b from-white/30 to-white/10
//                 backdrop-blur-2xl
//                 border border-white/30
//                 shadow-[0_8px_40px_rgba(0,0,0,0.25)]
//                 rounded-[46px]
//               "
//             />
//           </foreignObject>

//           <path
//             d="M46 0 H362 Q408 0 408 46 Q408 93 454 93 H850 Q896 93 896 46 Q896 0 942 0 H1258 Q1304 0 1304 46 V674 Q1304 720 1258 720 H46 Q0 720 0 674 V46 Q0 0 46 0 Z"
//             fill="none"
//             stroke="rgba(255,255,255,0.3)"
//             strokeWidth="1.5"
//           />
//         </svg>

//         {/* LEFT BUTTON */}
//         <div className="absolute top-10 left-10">
//           <button className="px-8 py-3 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 text-white font-medium hover:bg-white/30 transition-all duration-200">
//             Role List
//           </button>
//         </div>

//         {/* CENTER DROPDOWNS */}
//         <div className="absolute top-10 left-1/2 -translate-x-1/2 flex gap-6">
//           <PillDropdownButton
//             label="ANDHRA PRADESH"
//             options={["Telangana", "Karnataka", "Tamil Nadu"]}
//           />
//           <PillDropdownButton
//             label="VIZAG ZONE"
//             options={["Zone 1", "Zone 2", "Zone 3"]}
//           />
//         </div>

//         {/* RIGHT ACTIONS */}
//         <div className="absolute top-10 right-10">
//           <TopRightActions
//             onAdd={() => console.log("Add Clicked")}
//             onToggle={() => console.log("Toggle Clicked")}
//           />
//         </div>

//       </GlassCard>

//     </div>
//   );
// }


// import React from "react";
// import PillDropdownButton from "../ui/PillDropdownButton";


// export default function GlassCutCard() {
// return ( <div >

//   {/* Background */}
//   <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center" />
 

//  {/* Main Container with Smooth Curved Notch */}
//  <div
//   className="relative w-[1304px] h-[634px] mt-30 bg-white/20 backdrop-blur-xl overflow-hidden rounded-[45px_45px_45px_45px]">

//     {/* ✅ Dropdown Pills (Top Center) */}
//         <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-6">

//           <PillDropdownButton
//             label="ANDHRA PRADESH"
//             options={["Telangana", "Karnataka", "Tamil Nadu"]}
//           />

//           <PillDropdownButton
//             label="VIZAG ZONE"
//             options={["Zone 1", "Zone 2", "Zone 3"]}
//           />

//         </div>
//       </div>
// </div>

// );
// }
import React from "react";
import PillDropdownButton from "../ui/PillDropdownButton";

export default function GlassCutCard() {
  return (
    <div className="relative w-full h-screen flex justify-center items-center">

      {/* Background */}
  <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center" />

      {/* Glass Card Wrapper */}
      <div className="relative w-[1304px] h-[634px]">

         {/* SVG Masked Glass Card */}
        <svg
          width="1304"
          height="634"
          viewBox="0 0 1304 634"
          className="absolute inset-0"
        >
          <defs>
            {/* Glass blur filter */}
            <filter id="glassBlur">
              <feGaussianBlur stdDeviation="18" />
            </filter>

             {/* Main merged shape path */}
             <clipPath id="cardShape">
               <path
                 d="
                   M46 0
                   H362
                   Q408 0 408 46
                   Q408 93 454 93
                   H850
                   Q896 93 896 46
                   Q896 0 942 0
                   H1258
                   Q1304 0 1304 46
                   V588
                   Q1304 634 1258 634
                   H46
                   Q0 634 0 588
                   V46
                   Q0 0 46 0
                   Z
                 "
               />
             </clipPath>
           </defs>

         {/* Glass fill */}
          <foreignObject
            width="100%"
            height="100%"
            clipPath="url(#cardShape)"
          >
            <div className="w-full h-full bg-white/20 backdrop-blur-xl border border-white/20 rounded-[46px]" />
          </foreignObject>
           {/* Border stroke */}
          <path
            d="
              M46 0
              H362
              Q408 0 408 46
              Q408 93 454 93
              H850
              Q896 93 896 46
              Q896 0 942 0
              H1258
              Q1304 0 1304 46
              V588
              Q1304 634 1258 634
              H46
              Q0 634 0 588
              V46
              Q0 0 46 0
              Z
            "
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1.5"
          />
        </svg>

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
         </div>

       </div>
     </div>
   );
 }

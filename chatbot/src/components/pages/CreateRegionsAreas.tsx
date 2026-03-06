// import { useNavigate } from "react-router-dom";

// export default function CreateRegionsAreas() {
//   const navigate = useNavigate();

//   const goToMap = () => {
//     navigate("/mapbox-region-selection");
//   };

//   return (
//     <div className="relative w-full min-h-[720px] mt-35">
//       <div className="relative w-full max-w-[1304px] mx-auto min-h-[720px]">

//         {/* Dashboard pill */}

//         <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
//           <button
//             onClick={() => navigate("/dashboardpage")}
//             className="w-[420px] py-4 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 text-white text-lg flex items-center justify-center gap-3 hover:bg-white/30 transition"
//           >
//             ← Dashboard
//           </button>
//         </div>

//         {/* Title */}

//         <div className="text-center mt-32 text-white text-xl">
//           Create Regions and Areas
//         </div>

//         {/* Cards */}

//         <div className="mt-24 flex justify-center gap-16">

//           {/* Region Card */}

//           <div
//             onClick={goToMap}
//             className="cursor-pointer w-[260px] h-[360px] rounded-[40px] border border-white/30 bg-white/10 backdrop-blur-md flex flex-col items-center justify-center hover:scale-105 transition"
//           >
//             <img
//               src="/create-region/region.png"
//               className="w-40 mb-6"
//             />

//             <div className="bg-white rounded-[30px] p-6 text-gray-700 w-full">
//               <h3 className="font-semibold">Region</h3>

//               <p className="text-sm mt-2">
//                 A broad strategic territory managed by the Regional Officer,
//                 comprising multiple operational clusters.
//               </p>
//             </div>
//           </div>

//           {/* Area Card */}

//           <div
//             onClick={goToMap}
//             className="cursor-pointer w-[260px] h-[360px] rounded-[40px] border border-white/30 bg-white/10 backdrop-blur-md flex flex-col items-center justify-center hover:scale-105 transition"
//           >
//             <img
//               src="/create-region/area.png"
//               className="w-40 mb-6"
//             />

//             <div className="bg-white rounded-[30px] p-6 text-gray-700 w-full">
//               <h3 className="font-semibold">Area</h3>

//               <p className="text-sm mt-2">
//                 A specific locality or zone within a Region where daily land
//                 sourcing operations take place.
//               </p>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }



import { useNavigate } from "react-router-dom";

export default function CreateRegionsAreas() {
  const navigate = useNavigate();

  const goToMap = () => {
    navigate("/mapbox-region-selection");
  };

  return (
    <div className="relative w-full min-h-[720px] mt-35">

      <div className="relative w-full max-w-[1304px] min-h-[720px] mx-auto">

        {/* Glass Card */}

        <svg
          viewBox="0 0 1304 720"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          <defs>
            <clipPath id="cardShape">
              <path d="M46 0 H362 Q408 0 408 46 Q408 93 454 93 H850 Q896 93 896 46 Q896 0 942 0 H1258 Q1304 0 1304 46 V588 Q1304 634 1258 634 H46 Q0 634 0 588 V46 Q0 0 46 0 Z" />
            </clipPath>
          </defs>

          <foreignObject width="100%" height="100%" clipPath="url(#cardShape)">
            <div className="w-full h-full backdrop-blur-xl border-white/20 rounded-[46px]" />
          </foreignObject>

          <path
            d="M46 0 H362 Q408 0 408 46 Q408 93 454 93 H850 Q896 93 896 46 Q896 0 942 0 H1258 Q1304 0 1304 46 V674 Q1304 720 1258 720 H46 Q0 720 0 674 V46 Q0 0 46 0 Z"
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1.5"
          />
        </svg>

        {/* Dashboard Button */}

        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
          <button
            onClick={() => navigate("/dashboardpage")}
            className="w-[340px] py-4 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 text-white text-lg flex items-center justify-center gap-3 hover:bg-white/30 transition"
          >
            ← Dashboard
          </button>
        </div>

        {/* Content */}

        <div className="relative z-10 pt-[140px] px-20 pb-20">

          {/* Title */}

          <h2 className="text-white/90 text-xl font-medium tracking-wide text-center mb-16">
            Create Regions and Areas
          </h2>

          {/* Cards */}

          <div className="flex justify-center gap-16">

            {/* Region */}

            <div
              onClick={goToMap}
              className="cursor-pointer w-[260px] h-[360px] rounded-[40px] border border-white/30 bg-white/10 backdrop-blur-md flex flex-col items-center justify-center hover:scale-105 transition"
            >
              <img
                src="/create-region/region.png"
                className="w-40 mb-6"
              />

              <div className="bg-white rounded-[30px] p-6 text-gray-700 w-full">
                <h3 className="font-semibold">Region</h3>

                <p className="text-sm mt-2">
                  A broad strategic territory managed by the Regional Officer,
                  comprising multiple operational clusters.
                </p>
              </div>
            </div>

            {/* Area */}

            <div
              onClick={goToMap}
              className="cursor-pointer w-[260px] h-[360px] rounded-[40px] border border-white/30 bg-white/10 backdrop-blur-md flex flex-col items-center justify-center hover:scale-105 transition"
            >
              <img
                src="/create-region/area.png"
                className="w-40 mb-6"
              />

              <div className="bg-white rounded-[30px] p-6 text-gray-700 w-full">
                <h3 className="font-semibold">Area</h3>

                <p className="text-sm mt-2">
                  A specific locality or zone within a Region where daily land
                  sourcing operations take place.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
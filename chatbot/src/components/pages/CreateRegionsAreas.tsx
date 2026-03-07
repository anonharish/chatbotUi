import { useNavigate } from "react-router-dom";

export default function CreateRegionsAreas() {
  const navigate = useNavigate();

  const goToMap = () => {
    navigate("/mapbox-region-selection");
  };

  const cards = [
    {
      title: "Region",
      img: "src/assets/create-region/create1.png",
      desc: "A broad strategic territory managed by the Regional Officer, comprising multiple operational clusters.",
    },
    {
      title: "Area",
      img: "src/assets/create-region/create2.png",
      desc: "A specific locality or zone within a Region where daily land sourcing operations take place.",
    },
  ];

  return (
    <div className="relative w-full mt-24">

      {/* ---------------- MOBILE VERSION ---------------- */}
      <div className="md:hidden px-4">

        {/* Dashboard */}
        <button
          onClick={() => navigate("/dashboardpage")}
          className="w-full py-3 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 text-white mb-8"
        >
          ← Dashboard
        </button>

        {/* Mobile Glass Container */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">

          <h2 className="text-white text-lg text-center mb-8">
            Create Regions and Areas
          </h2>

          <div className="space-y-6">
            {cards.map((card, i) => (
              <div
                key={i}
                onClick={goToMap}
                className="cursor-pointer rounded-3xl border border-white/30 bg-white/10 backdrop-blur-md p-6 flex flex-col items-center"
              >
                <img src={card.img} className="w-28 mb-4" />

                <div className="bg-white rounded-2xl p-4 text-gray-700 w-full">
                  <h3 className="font-semibold">{card.title}</h3>

                  <p className="text-sm mt-2">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ---------------- DESKTOP VERSION ---------------- */}

      <div className="hidden md:block relative w-full min-h-[720px]">

        <div className="relative w-full max-w-[1500px] min-h-[720px] mx-auto">

          {/* Glass Cut SVG */}
          <svg
            viewBox="0 0 1100 720"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <defs>
              <clipPath id="cardShape">
                <path d="M46 0 H320 Q360 0 360 46 Q360 90 400 90 H700 Q740 90 740 46 Q740 0 780 0 H1054 Q1100 0 1100 46 V588 Q1100 634 1054 634 H46 Q0 634 0 588 V46 Q0 0 46 0 Z" />
              </clipPath>
            </defs>

            <foreignObject width="100%" height="100%" clipPath="url(#cardShape)">
              <div className="w-full h-full backdrop-blur-xl border-white/20 rounded-[46px]" />
            </foreignObject>

            <path
              d="M46 0 H320 Q360 0 360 46 Q360 90 400 90 H700 Q740 90 740 46 Q740 0 780 0 H1054 Q1100 0 1100 46 V674 Q1100 720 1054 720 H46 Q0 720 0 674 V46 Q0 0 46 0 Z"
              fill="none"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.5"
            />
          </svg>

          {/* Dashboard Button */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
            <button
              onClick={() => navigate("/dashboardpage")}
              className="w-[450px] py-3 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 text-white flex items-center justify-center gap-3 hover:bg-white/30 transition"
            >
              ← Dashboard
            </button>
          </div>

          {/* Content */}
          <div className="relative z-10 pt-[140px] px-12 pb-20">

            <h2 className="text-white/90 text-xl font-medium tracking-wide text-center mb-16">
              Create Regions and Areas
            </h2>

            {/* Cards */}
           <div className="mt-16 w-full px-20">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-14 justify-items-center">
              {cards.map((card, i) => (
                <div
  key={i}
  onClick={goToMap}
  className="cursor-pointer relative w-[260px] h-[420px] rounded-[40px] border border-white/30 bg-white/10 backdrop-blur-md overflow-hidden hover:scale-105 transition"
>

  {/* Image Section */}
  <div className="h-[230px] flex items-end justify-center">
    <img src={card.img} className="w-36 mb-6" />
  </div>

  {/* Bottom White Card */}
  <div className="absolute bottom-0 w-full">

    <svg
      viewBox="0 0 300 200"
      preserveAspectRatio="none"
      className="w-full h-[210px]"
    >
      <path
        d="M0 60
           Q0 0 60 0
           H300
           V200
           H40
           Q0 200 0 160
           Z"
        fill="white"
      />
    </svg>

    {/* Text Content */}
    <div className="absolute bottom-6 left-6 right-6 text-gray-700">

      <h3 className="font-semibold text-[16px]">
        {card.title}
      </h3>

      <p className="text-sm mt-2 leading-relaxed">
        {card.desc}
      </p>

    </div>

  </div>

</div>
              ))}

            </div>

          </div>

        </div>

      </div>

    </div>
    </div>
  );
}
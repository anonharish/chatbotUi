import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"

export default function RegionSuccessPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const regionName = location.state?.regionName || "Area"
  return (
    <div className="relative w-full mt-24">

      <div className="relative w-full max-w-[1500px] min-h-[720px] mx-auto">

        {/* Glass Container */}
        <svg
          viewBox="0 0 1100 720"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <defs>
            <clipPath id="glassShape">
              <path d="M46 0 H320 Q360 0 360 46 Q360 90 400 90 H700 Q740 90 740 46 Q740 0 780 0 H1054 Q1100 0 1100 46 V588 Q1100 634 1054 634 H46 Q0 634 0 588 V46 Q0 0 46 0 Z"/>
            </clipPath>
          </defs>

         

          <path
            d="M46 0 H320 Q360 0 360 46 Q360 90 400 90 H700 Q740 90 740 46 Q740 0 780 0 H1054 Q1100 0 1100 46 V674 Q1100 720 1054 720 H46 Q0 720 0 674 V46 Q0 0 46 0 Z"
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1.5"
          />
        </svg>

        {/* Dashboard Breadcrumb Pill */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
          <button
            onClick={() => navigate("/dashboardpage")}
            className="w-[460px] py-3 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 text-white flex items-center justify-center gap-3 hover:bg-white/30 transition"
          >
            ← Dashboard / Create Area / Country
          </button>
        </div>

        {/* Success Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-[720px] text-center">

          {/* Outer Circle */}
          <div className="relative flex items-center justify-center mb-10">

            <div className="w-[220px] h-[220px] rounded-full border border-white/30 flex items-center justify-center">

              <div className="w-[160px] h-[160px] rounded-full border border-white/30 flex items-center justify-center">

                {/* Success Icon */}
                <div className="w-[80px] h-[80px] bg-green-600 rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(0,255,0,0.4)]">

                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>

                </div>

              </div>

            </div>

          </div>

          {/* Success Text */}
          <h2 className="text-white text-2xl font-semibold mb-6">
            {regionName} Created Successfully
          </h2>

          {/* Redirect Pill */}
          <div className="flex items-center gap-3 bg-white/90 px-6 py-2 rounded-full text-gray-700">

            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="green"
              strokeWidth="3"
            >
              <polyline points="20 6 9 17 4 12"/>
            </svg>

            Redirecting To The Area Page.....

          </div>

        </div>

      </div>

    </div>
  )
}
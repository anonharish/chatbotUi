import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"

export default function RegionSuccessPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const regionName = location.state?.regionName || "Region"

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/mapbox-region-selection")
    }, 3000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="relative w-full min-h-[720px] mt-35">

      <div className="relative w-full max-w-[1304px] min-h-[720px] mx-auto">

        {/* Glass Container */}
        <div className="absolute inset-0 rounded-[46px] backdrop-blur-xl border border-white/20"/>

        {/* Top Dashboard Pill */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
          <button
            onClick={() => navigate("/dashboardpage")}
            className="w-[420px] py-4 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 text-white text-lg flex items-center justify-center gap-3 hover:bg-white/30 transition"
          >
            ← Dashboard / Create Area / Country
          </button>
        </div>
        {/* Success Content */}
        <div className="flex flex-col items-center justify-center h-full text-center">
          {/* Success Circle */}
          <div className="relative mb-10">

            <div className="w-40 h-40 rounded-full border border-white/30 flex items-center justify-center">

              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg">

                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>

              </div>

            </div>

          </div>

          {/* Text */}

          <h2 className="text-white text-2xl font-semibold mb-6">
            {regionName} Created Successfully
          </h2>

          {/* Redirect Message */}

          <div className="flex items-center gap-3 bg-white/90 px-6 py-2 rounded-full text-gray-700">

            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="green" strokeWidth="3">
              <polyline points="20 6 9 17 4 12"/>
            </svg>

            Redirecting To The Area Page.....

          </div>

        </div>

      </div>

    </div>
  )
}
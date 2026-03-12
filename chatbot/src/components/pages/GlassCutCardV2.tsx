import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  children?: ReactNode;
};

export default function GlassCutCard({ children }: Props) {
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-screen flex justify-center items-center">

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

        {/* Dashboard Pill — ✅ now navigates to /dashboard */}
        <div className="absolute top-[18px] left-1/2 -translate-x-1/2 z-20">
          <button
            onClick={() => navigate("/dashboardpage")}
            className="px-32 py-5 rounded-full border border-white/30 bg-white/20 backdrop-blur-md text-white text-sm font-medium shadow-md flex items-center gap-2 hover:bg-white/30 transition cursor-pointer"
          >
            ← Dashboard
          </button>
        </div>

        {/* SCROLLABLE CONTENT AREA */}
        <div className="absolute left-0 right-0 bottom-0 top-[120px] z-10 flex justify-center overflow-y-auto hide-scrollbar">
          <div className="w-[1180px] max-w-[92%] flex flex-col gap-8">
            {children}
          </div>
        </div>

      </div>

    </div>
  );
}
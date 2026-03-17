import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  children?: ReactNode;
};

export default function GlassCutCard({ children }: Props) {
  const navigate = useNavigate();

  return (
    <div
      className="fixed inset-0 flex justify-center items-center"
      style={{ zIndex: 0 }}
    >

      <div
        className="relative flex justify-center
                    w-[calc(100%-32px)] h-[720px]
                    lg:w-[960px]     lg:h-[740px]
                    xl:w-[1304px]    xl:h-[800px]
                    2xl:w-[1700px]   2xl:h-[800px]"
        style={{ overflow: "hidden", contain: "strict" }}
      >

        {/* LG SVG (960 × 740) */}
        <svg className="absolute top-0 hidden lg:block xl:hidden" style={{ width:"100%", height:"100%" }} viewBox="0 0 960 740" preserveAspectRatio="xMidYMid meet">
          <defs>
            <clipPath id="glassCutLg">
              <path d="M50 0 H310 Q345 0 345 35 Q345 75 385 75 H575 Q615 75 615 35 Q615 0 650 0 H910 Q960 0 960 50 V690 Q960 740 910 740 H50 Q0 740 0 690 V50 Q0 0 50 0 Z" />
            </clipPath>
          </defs>
          <foreignObject width="100%" height="100%" clipPath="url(#glassCutLg)">
            <div // @ts-ignore
              xmlns="http://www.w3.org/1999/xhtml"
              style={{ width:"100%", height:"100%", background:"rgba(255,255,255,0.20)", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)" }}
            />
          </foreignObject>
          <path d="M50 0 H310 Q345 0 345 35 Q345 75 385 75 H575 Q615 75 615 35 Q615 0 650 0 H910 Q960 0 960 50 V690 Q960 740 910 740 H50 Q0 740 0 690 V50 Q0 0 50 0 Z" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
        </svg>

        {/* XL SVG (1304 × 800) */}
        <svg className="absolute top-0 hidden xl:block 2xl:hidden" style={{ width:"100%", height:"100%" }} viewBox="0 0 1304 800" preserveAspectRatio="xMidYMid meet">
          <defs>
            <clipPath id="glassCutXl">
              <path d="M60 0 H400 Q440 0 440 40 Q440 95 500 95 H804 Q864 95 864 40 Q864 0 904 0 H1244 Q1304 0 1304 60 V740 Q1304 800 1244 800 H60 Q0 800 0 740 V60 Q0 0 60 0 Z" />
            </clipPath>
          </defs>
          <foreignObject width="100%" height="100%" clipPath="url(#glassCutXl)">
            <div // @ts-ignore
              xmlns="http://www.w3.org/1999/xhtml"
              style={{ width:"100%", height:"100%", background:"rgba(255,255,255,0.20)", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)" }}
            />
          </foreignObject>
          <path d="M60 0 H400 Q440 0 440 40 Q440 95 500 95 H804 Q864 95 864 40 Q864 0 904 0 H1244 Q1304 0 1304 60 V740 Q1304 800 1244 800 H60 Q0 800 0 740 V60 Q0 0 60 0 Z" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
        </svg>

        {/* 2XL SVG (1700 × 800) */}
        <svg className="absolute top-0 hidden 2xl:block" style={{ width:"100%", height:"100%" }} viewBox="0 0 1700 800" preserveAspectRatio="xMidYMid meet">
          <defs>
            <clipPath id="glassCut2Xl">
              <path d="M60 0 H510 Q550 0 550 40 Q550 95 610 95 H1090 Q1150 95 1150 40 Q1150 0 1190 0 H1640 Q1700 0 1700 60 V740 Q1700 800 1640 800 H60 Q0 800 0 740 V60 Q0 0 60 0 Z" />
            </clipPath>
          </defs>
          <foreignObject width="100%" height="100%" clipPath="url(#glassCut2Xl)">
            <div // @ts-ignore
              xmlns="http://www.w3.org/1999/xhtml"
              style={{ width:"100%", height:"100%", background:"rgba(255,255,255,0.20)", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)" }}
            />
          </foreignObject>
          <path d="M60 0 H510 Q550 0 550 40 Q550 95 610 95 H1090 Q1150 95 1150 40 Q1150 0 1190 0 H1640 Q1700 0 1700 60 V740 Q1700 800 1640 800 H60 Q0 800 0 740 V60 Q0 0 60 0 Z" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
        </svg>

        {/* Fallback < lg */}
        <div className="absolute inset-0 lg:hidden bg-white/20 backdrop-blur-xl border border-white/20 rounded-3xl" />

        {/* Dashboard Pill — locked inside notch per breakpoint */}
        <div
          className="
            absolute z-20
            mt-3
            lg:mt-[22px]
            xl:mt-[25px]
            2xl:mt-[14px]
          "
          style={{
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <button
            onClick={() => navigate("/dashboardpage")}
            className="
              rounded-full border border-white/30 bg-white/20 backdrop-blur-md
              text-white font-medium shadow-md
              flex items-center gap-2
              hover:bg-white/30 transition cursor-pointer whitespace-nowrap
              px-10     text-xs    py-2.5
              lg:px-16  lg:text-sm  lg:py-3
              xl:px-32  xl:text-base xl:py-4
              2xl:px-52 2xl:text-lg  2xl:py-4
            "
          >
            ← Dashboard
          </button>
        </div>

        {/* SCROLLABLE CONTENT AREA */}
        <div
          className="absolute bottom-0 top-[90px] lg:top-[95px] xl:top-[125px] 2xl:top-[130px] z-10 flex justify-center hide-scrollbar"
          style={{ left:0, right:0, overflowY:"scroll", overflowX:"hidden" }}
        >
          <div
            className="flex flex-col pb-8
                        gap-3          w-[calc(100%-80px)]
                        lg:gap-4       lg:w-[860px]
                        xl:gap-5       xl:w-[1160px]
                        2xl:gap-6      2xl:w-[1500px]"
          >
            {children}
          </div>
        </div>

      </div>
    </div>
  );
}
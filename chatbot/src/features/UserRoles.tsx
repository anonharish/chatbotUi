import React from "react";
import { useNavigate } from "react-router-dom";
import { roleCards } from "@/data/directoryData";

export default function UserRoles() {
  const navigate = useNavigate();

  const handleRoleClick = (role: string) => {
    const formattedRole = role.toLowerCase();
    navigate("/agent-profile", {
      state: { role: formattedRole }
    });
  };

  return (
    <div className="relative w-full min-h-screen flex justify-center items-center">

      <div
        className="relative flex justify-center
                    w-[calc(100%-32px)] h-[720px]
                    lg:w-[960px]     lg:h-[740px]
                    xl:w-[1304px]    xl:h-[800px]
                    2xl:w-[1700px]   2xl:h-[800px]"
        style={{ overflow: "hidden", contain: "strict" }}
      >

        {/* LG SVG */}
        <svg className="absolute top-0 hidden lg:block xl:hidden" style={{ width:"100%", height:"100%" }} viewBox="0 0 960 740" preserveAspectRatio="xMidYMid meet">
          <defs>
            <clipPath id="userRolesCutLg">
              <path d="M50 0 H310 Q345 0 345 35 Q345 75 385 75 H575 Q615 75 615 35 Q615 0 650 0 H910 Q960 0 960 50 V690 Q960 740 910 740 H50 Q0 740 0 690 V50 Q0 0 50 0 Z" />
            </clipPath>
          </defs>
          <foreignObject width="100%" height="100%" clipPath="url(#userRolesCutLg)">
            <div // @ts-ignore
              xmlns="http://www.w3.org/1999/xhtml"
              style={{ width:"100%", height:"100%", background:"rgba(255,255,255,0.20)", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)" }}
            />
          </foreignObject>
          <path d="M50 0 H310 Q345 0 345 35 Q345 75 385 75 H575 Q615 75 615 35 Q615 0 650 0 H910 Q960 0 960 50 V690 Q960 740 910 740 H50 Q0 740 0 690 V50 Q0 0 50 0 Z" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
        </svg>

        {/* XL SVG */}
        <svg className="absolute top-0 hidden xl:block 2xl:hidden" style={{ width:"100%", height:"100%" }} viewBox="0 0 1304 800" preserveAspectRatio="xMidYMid meet">
          <defs>
            <clipPath id="userRolesCutXl">
              <path d="M60 0 H400 Q440 0 440 40 Q440 95 500 95 H804 Q864 95 864 40 Q864 0 904 0 H1244 Q1304 0 1304 60 V740 Q1304 800 1244 800 H60 Q0 800 0 740 V60 Q0 0 60 0 Z" />
            </clipPath>
          </defs>
          <foreignObject width="100%" height="100%" clipPath="url(#userRolesCutXl)">
            <div // @ts-ignore
              xmlns="http://www.w3.org/1999/xhtml"
              style={{ width:"100%", height:"100%", background:"rgba(255,255,255,0.20)", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)" }}
            />
          </foreignObject>
          <path d="M60 0 H400 Q440 0 440 40 Q440 95 500 95 H804 Q864 95 864 40 Q864 0 904 0 H1244 Q1304 0 1304 60 V740 Q1304 800 1244 800 H60 Q0 800 0 740 V60 Q0 0 60 0 Z" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
        </svg>

        {/* 2XL SVG */}
        <svg className="absolute top-0 hidden 2xl:block" style={{ width:"100%", height:"100%" }} viewBox="0 0 1700 800" preserveAspectRatio="xMidYMid meet">
          <defs>
            <clipPath id="userRolesCut2Xl">
              <path d="M60 0 H510 Q550 0 550 40 Q550 95 610 95 H1090 Q1150 95 1150 40 Q1150 0 1190 0 H1640 Q1700 0 1700 60 V740 Q1700 800 1640 800 H60 Q0 800 0 740 V60 Q0 0 60 0 Z" />
            </clipPath>
          </defs>
          <foreignObject width="100%" height="100%" clipPath="url(#userRolesCut2Xl)">
            <div // @ts-ignore
              xmlns="http://www.w3.org/1999/xhtml"
              style={{ width:"100%", height:"100%", background:"rgba(255,255,255,0.20)", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)" }}
            />
          </foreignObject>
          <path d="M60 0 H510 Q550 0 550 40 Q550 95 610 95 H1090 Q1150 95 1150 40 Q1150 0 1190 0 H1640 Q1700 0 1700 60 V740 Q1700 800 1640 800 H60 Q0 800 0 740 V60 Q0 0 60 0 Z" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
        </svg>

        {/* Fallback < lg */}
        <div className="absolute inset-0 lg:hidden bg-white/20 backdrop-blur-xl border border-white/20 rounded-3xl" />

        {/* Dashboard Pill */}
        <div className="absolute z-20" style={{ top:"18px", left:"50%", transform:"translateX(-50%)" }}>
          <button
            onClick={() => navigate("/directory")}
            className="rounded-full border border-white/30 bg-white/20 backdrop-blur-md text-white font-medium shadow-md flex items-center justify-center gap-2 hover:bg-white/30 transition cursor-pointer whitespace-nowrap
              px-10 text-xs py-2.5
              lg:px-16 lg:text-sm lg:py-3
              xl:px-32 xl:text-base xl:py-4
              2xl:px-52 2xl:text-lg 2xl:py-5"
          >
            ← Directory
          </button>
        </div>

        {/* CONTENT AREA */}
        <div
          className="absolute bottom-0 top-[90px] lg:top-[95px] xl:top-[115px] 2xl:top-[130px] z-10 flex flex-col items-center"
          style={{ left:0, right:0, overflow:"hidden" }}
        >
          {/* Heading */}
          <h2 className="text-white/90 font-medium tracking-wide text-center
                         text-sm mt-2 mb-3
                         lg:text-base lg:mt-3 lg:mb-4
                         xl:text-xl xl:mt-4 xl:mb-5
                         2xl:text-2xl 2xl:mt-5 2xl:mb-6">
            Create User Roles
          </h2>

          {/* Cards Grid */}
          <div className="w-full flex items-end justify-center
                          px-5 lg:px-8 xl:px-12 2xl:px-16">
            <div className="grid grid-cols-4 w-full items-end
                            gap-3 lg:gap-4 xl:gap-6 2xl:gap-10">

              {roleCards.map((role, i) => (
                <div
                  key={i}
                  onClick={() => handleRoleClick(role.title)}
                  className="group cursor-pointer relative hover:scale-105 transition-transform w-full"
                  style={{ overflow: "visible" }}
                >
                  {/* Card — glass background */}
                  <div
                    className="relative w-full rounded-[24px] lg:rounded-[28px] xl:rounded-[32px] 2xl:rounded-[36px] border border-white/30 overflow-hidden"
                    style={{
                      height: "clamp(300px, 32vw, 520px)",
                      background: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                    }}
                  >
                    {/* Character image — top 70%, slightly overflows upward */}
                    <div
                      className="absolute left-0 right-0 flex justify-center items-end"
                      style={{ top: "-6%", height: "72%", zIndex: 10 }}
                    >
                      <img
                        src={role.img}
                        alt={role.title}
                        className="h-full w-auto object-contain object-bottom drop-shadow-[0_10px_20px_rgba(0,0,0,0.2)] transition-transform duration-300 group-hover:-translate-y-2"
                      />
                    </div>

                    {/* White bottom section with concave top-left curve */}
                    <div
                      className="absolute bottom-0 left-0 right-0"
                      style={{ height: "32%", zIndex: 20 }}
                    >
                      {/* SVG: concave inward bite at top-left corner */}
                      <svg
                        viewBox="0 0 300 200"
                        preserveAspectRatio="none"
                        className="absolute inset-0 w-full h-full"
                      >
                        <path
                          d="M70 0 Q0 0 0 70 V200 H300 V0 Z"
                          fill="white"
                        />
                      </svg>

                      {/* Text content */}
                      <div
                        className="absolute inset-0 flex flex-col"
                        style={{
                          paddingTop: "clamp(14px, 1.6vw, 26px)",
                          paddingLeft: "clamp(12px, 1.4vw, 24px)",
                          paddingRight: "clamp(12px, 1.4vw, 24px)",
                          paddingBottom: "clamp(10px, 1.2vw, 18px)",
                          gap: "clamp(4px, 0.5vw, 8px)",
                        }}
                      >
                        <h3
                          className="text-gray-800 font-semibold leading-tight flex-shrink-0"
                          style={{ fontSize: "clamp(10px, 1vw, 16px)" }}
                        >
                          {role.title}
                        </h3>
                        <p
                          className="text-gray-500 leading-relaxed flex-1 overflow-hidden"
                          style={{ fontSize: "clamp(8px, 0.75vw, 13px)" }}
                        >
                          {role.desc}
                        </p>
                        <span
                          className="inline-block bg-green-600 text-white rounded-full w-fit flex-shrink-0"
                          style={{
                            fontSize: "clamp(7px, 0.65vw, 12px)",
                            padding: "clamp(3px, 0.3vw, 6px) clamp(8px, 0.8vw, 16px)",
                          }}
                        >
                          {role.tag}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              ))}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
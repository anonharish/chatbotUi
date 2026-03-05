import React from "react";
import PillDropdownButton from "/Users/admin/Desktop/Techgy/chatbotUi/chatbot/src/components/ui/PillDropdownButton";

export default function UserRoles() {
  return (
    <div className="relative w-full min-h-[720px] mt-35">
      <div className="relative w-full max-w-[1800px] min-h-[720px]">
        <svg
          viewBox="0 0 1304 720"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          <defs>
            <clipPath id="cardShape">
              <path d=" M46 0 H362 Q408 0 408 46 Q408 93 454 93 H850 Q896 93 896 46 Q896 0 942 0 H1258 Q1304 0 1304 46 V588 Q1304 634 1258 634 H46 Q0 634 0 588 V46 Q0 0 46 0 Z " />{" "}
            </clipPath>
          </defs>
          {/* Glass fill */}
          <foreignObject width="100%" height="100%" clipPath="url(#cardShape)">
            <div className="w-full h-full  backdrop-blur-xl  border-white/20 rounded-[46px]" />{" "}
          </foreignObject>
          {/* Border stroke */}
          <path
            d=" M46 0 H362 Q408 0 408 46 Q408 93 454 93 H850 Q896 93 896 46 Q896 0 942 0 H1258 Q1304 0 1304 46 V674 Q1304 720 1258 720 H46 Q0 720 0 674 V46 Q0 0 46 0 Z "
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1.5"
          />
        </svg>
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-6 z-10">
          <PillDropdownButton
            label="Dashboard"
            options={["Zone 1", "Zone 2", "Zone 3"]}
          />
        </div>
        {/* ===== Title ===== */}
        <div className="relative z-10 mt-32 text-center">
          <h2 className="text-white/90 text-xl font-medium tracking-wide">
            Create User Roles
          </h2>
        </div>

        {/* ===== Role Cards ===== */}
        <div className="relative z-10 mt-24 px-20 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-14">
            {[
              {
                title: "Regional Officer",
                desc: "Oversees territory strategy and approves final land acquisitions.",
                tag: "Approval Authority",
              },
              {
                title: "Intelligence Officer",
                desc: "Validates documentation and ensures all assets are risk-free.",
                tag: "Risk Assessment",
              },
              {
                title: "Field Officer",
                desc: "Conducts physical inspections to verify boundaries and reality.",
                tag: "Physical Verification",
              },
              {
                title: "Agent",
                desc: "Sources new land opportunities and drives the deal pipeline.",
                tag: "Deal Sourcing",
              },
            ].map((role, i) => (
              <div key={i} className="relative group">
                {/* Outer Glass Card */}
                <div className="relative h-[420px] rounded-[40px] border border-white/30 bg-white/10 backdrop-blur-md overflow-hidden">
                  {/* Image Area */}
                  <div className="h-[230px] flex items-end justify-center">
                    <div className="w-44 h-44 bg-white/20 rounded-full" />
                  </div>

                  {/* Sculpted White Section */}
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

                    {/* Content On Top Of SVG */}
                    <div className="absolute inset-0 px-6 pt-10 pb-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-gray-800 font-semibold text-[15px] mb-2">
                          {role.title}{" "}
                        </h3>

                        <p className="text-gray-500 text-sm leading-relaxed">
                          {role.desc}{" "}
                        </p>
                      </div>

                      <div>
                        <span className="inline-block bg-green-600 text-white text-xs px-4 py-2 rounded-full">
                          {role.tag}{" "}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}{" "}
          </div>
        </div>
      </div>
    </div>
  );
}

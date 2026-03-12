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
    <div className="relative w-full mt-24">
      <div className="relative w-full max-w-[1500px] min-h-[720px] mx-auto">

        {/* Dashboard Button */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
          <button
            onClick={() => navigate("/directory")}
            className="w-[450px] py-3 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 text-white flex items-center justify-center gap-3 hover:bg-white/30 transition"
          >
            ← Dashboard
          </button>
        </div>

        {/* Content */}
        <div className="relative z-10 pt-[140px] px-12 pb-20">

          <h2 className="text-white/90 text-xl font-medium tracking-wide text-center mb-16">
            Create User Roles
          </h2>

          <div className="mt-16 w-full px-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-14 justify-items-center">

              {roleCards.map((role, i) => (
                <div
                  key={i}
                  onClick={() => handleRoleClick(role.title)}
                  className="group cursor-pointer relative w-[260px] h-[420px] rounded-[40px] border border-white/30 bg-white/10 backdrop-blur-md overflow-visible hover:scale-105 transition"
                >
                  {/* Image */}
                  <div className="h-[200px] flex justify-center relative">
                    <img
                      src={role.img}
                      alt={role.title}
                      className="w-[230px] h-[230px] object-contain -mb-[50px] z-20 drop-shadow-[0_25px_25px_rgba(0,0,0,0.25)] transition-transform duration-300 group-hover:-translate-y-2"
                    />
                  </div>

                  {/* Bottom Card */}
                  <div className="absolute bottom-0 w-full">
                    <svg
                      viewBox="0 0 300 200"
                      preserveAspectRatio="none"
                      className="w-full h-[210px]"
                    >
                      <path
                        d="M0 60 Q0 0 60 0 H300 V200 H40 Q0 200 0 160 Z"
                        fill="white" 
                      />
                    </svg>

                    <div className="absolute inset-0 px-6 pt-14 pb-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-gray-800 font-semibold text-[15px] mb-2">
                          {role.title}
                        </h3>

                        <p className="text-gray-500 text-sm leading-relaxed">
                          {role.desc}
                        </p>
                      </div>

                      <span className="inline-block bg-green-600 text-white text-xs px-4 py-2 rounded-full w-fit">
                        {role.tag}
                      </span>
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
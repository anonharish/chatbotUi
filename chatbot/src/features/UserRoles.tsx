import React from "react";
import {useNavigate} from "react-router-dom";
import {roleCards} from "@/data/directoryData";

export default function UserRoles() {
    const navigate = useNavigate();

    return (
        <div className="relative w-full mt-24">

            {/* Desktop Layout */}
            <div className="relative w-full max-w-[1500px] min-h-[720px] mx-auto">

                {/* Glass Container */}
                <svg viewBox="0 0 1100 720" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none">
                    <defs>
                        <clipPath id="cardShape">
                            <path d="M46 0 H320 Q360 0 360 46 Q360 90 400 90 H700 Q740 90 740 46 Q740 0 780 0 H1054 Q1100 0 1100 46 V588 Q1100 634 1054 634 H46 Q0 634 0 588 V46 Q0 0 46 0 Z"/>
                        </clipPath>
                    </defs>

                    <foreignObject width="100%" height="100%" clipPath="url(#cardShape)">
                        <div className="w-full h-full backdrop-blur-xl border-white/20 rounded-[46px]"/>
                    </foreignObject>

                    <path d="M46 0 H320 Q360 0 360 46 Q360 90 400 90 H700 Q740 90 740 46 Q740 0 780 0 H1054 Q1100 0 1100 46 V674 Q1100 720 1054 720 H46 Q0 720 0 674 V46 Q0 0 46 0 Z" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
                </svg>

                {/* Dashboard Pill */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
                    <button onClick={
                            () => navigate("/directory")
                        }
                        className="w-[450px] py-3 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 text-white flex items-center justify-center gap-3 hover:bg-white/30 transition">
                        ← Dashboard
                    </button>
                </div>

                {/* Content */}
                <div className="relative z-10 pt-[140px] px-12 pb-20">

                    {/* Heading (same style as CreateRegions) */}
                    <h2 className="text-white/90 text-xl font-medium tracking-wide text-center mb-16">
                        Create User Roles
                    </h2>

                    {/* Cards */}
                    <div className="mt-16 w-full px-20">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-14 justify-items-center">

                            {
                            roleCards.map((role, i) => (
                                <div key={i}
                                    className="group cursor-pointer relative w-[260px] h-[420px] rounded-[40px] border border-white/30 bg-white/10 backdrop-blur-md overflow-visible hover:scale-105 transition">

                                    <div className="h-[200px] flex justify-center relative">
                                        <img src={
                                                role.img
                                            }
                                            alt={
                                                role.title
                                            }
                                            className="w-[230px] h-[230px] object-contain -mb-[50px] z-20 drop-shadow-[0_25px_25px_rgba(0,0,0,0.25)] transition-transform duration-300 group-hover:-translate-y-2"/>
                                    </div>
                                    {/* Bottom White Card */}
                                    <div className="absolute bottom-0 w-full">

                                        <svg viewBox="0 0 300 200" preserveAspectRatio="none" className="w-full h-[210px]">
                                            <path d="M0 60
                                              Q0 0 60 0
                                              H300
                                              V200
                                              H40
                                              Q0 200 0 160
                                              Z" fill="white"/>
                                        </svg>

                                        <div className="absolute inset-0 px-6 pt-14 pb-6 flex flex-col justify-between">

                                            <div>
                                                <h3 className="text-gray-800 font-semibold text-[15px] mb-2">
                                                    {
                                                    role.title
                                                } </h3>

                                                <p className="text-gray-500 text-sm leading-relaxed">
                                                    {
                                                    role.desc
                                                } </p>
                                            </div>

                                            <span className="inline-block bg-green-600 text-white text-xs px-4 py-2 rounded-full w-fit">
                                                {
                                                role.tag
                                            } </span>

                                        </div>

                                    </div>

                                </div>
                            ))
                        } </div>
                    </div>

                </div>

            </div>

        </div>
    );
}

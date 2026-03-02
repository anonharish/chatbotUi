import type { ReactNode } from "react";
import PillDropdownButton from "../ui/PillDropdownButton";

type Props = {
  children?: ReactNode;
  className?: string;
};

const figmaShade =
  "relative overflow-hidden backdrop-blur-xl border border-white/20 rounded-[46px] " +
  "before:absolute before:inset-0 before:bg-gradient-to-b before:from-blue-200/20 before:to-transparent before:pointer-events-none";

export default function GlassCutCard({ children, className = "" }: Props) {
  return (
    <div className={`relative w-full px-2 md:px-4 ${className}`}>

      {/* MAIN CONTAINER */}
      <div className="
        relative
        w-full
        max-w-[1660px]
        mx-auto
        min-h-[360px]
        md:min-h-[420px]
        lg:min-h-[460px]
      ">

        {/* SVG SHAPE */}
        <svg
          viewBox="0 0 1304 560"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          <defs>
            <clipPath id="cardShape">
              <path
                d="
                  M46 0
                  H362
                  Q408 0 408 46
                  Q408 93 454 93
                  H850
                  Q896 93 896 46
                  Q896 0 942 0
                  H1258
                  Q1304 0 1304 46
                  V520
                  Q1304 560 1258 560
                  H46
                  Q0 560 0 520
                  V46
                  Q0 0 46 0
                  Z
                "
              />
            </clipPath>
          </defs>

          {/* GLASS */}
          <foreignObject width="100%" height="100%" clipPath="url(#cardShape)">
            <div
              className={`
                ${figmaShade}
                w-full h-full
                backdrop-blur-[40px] md:backdrop-blur-[55px] lg:backdrop-blur-[70px]
                bg-white/10
                shadow-[0px_40px_50px_rgba(0,0,0,0.05)]
              `}
            />
          </foreignObject>

          {/* BORDER */}
          <path
            d="
              M46 0
              H362
              Q408 0 408 46
              Q408 93 454 93
              H850
              Q896 93 896 46
              Q896 0 942 0
              H1258
              Q1304 0 1304 46
              V520
              Q1304 560 1258 560
              H46
              Q0 560 0 520
              V46
              Q0 0 46 0
              Z
            "
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1.5"
          />
        </svg>

        {/* DROPDOWNS */}
        <div className="
          absolute
          top-[18px]
          md:top-[24px]
          lg:top-[12px]
          left-1/2 -translate-x-1/2
          flex flex-col sm:flex-row
          items-center
          gap-2 sm:gap-4 lg:gap-6
          z-20
        ">
          <PillDropdownButton
            label="ANDHRA PRADESH"
            options={["Telangana", "Karnataka", "Tamil Nadu"]}
          />
          <PillDropdownButton
            label="VIZAG ZONE"
            options={["Zone 1", "Zone 2", "Zone 3"]}
          />
        </div>

        {/* CONTENT */}
        <div className="
          relative z-10
          pt-[110px]
          md:pt-[120px]
          lg:pt-[90px]
          px-4 md:px-6 lg:px-10
          pb-4 md:pb-6
        ">
          {children}
        </div>

      </div>
    </div>
  );
}
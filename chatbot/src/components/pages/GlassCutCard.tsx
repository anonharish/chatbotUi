import type { ReactNode } from "react";
import PillDropdownButton from "../ui/PillDropdownButton";

type Props = {
  children?: ReactNode;
  className?: string;
};

export default function GlassCutCard({ children, className = "" }: Props) {
  return (
    <div className={`relative w-full ${className}`}>

      {/* MAIN CUT CONTAINER */}
      <div className="relative w-full max-w-[1660px] min-h-[720px] mx-auto">

        {/* SVG GLASS SHAPE */}
        <svg
          viewBox="0 0 1304 720"
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
                  V674
                  Q1304 720 1258 720
                  H46
                  Q0 720 0 674
                  V46
                  Q0 0 46 0
                  Z
                "
              />
            </clipPath>
          </defs>

          {/* FIGMA ACCURATE GLASS FILL */}
          <foreignObject width="100%" height="100%" clipPath="url(#cardShape)">
            <div className="w-full h-full rounded-[46px] backdrop-blur-[70px] bg-[rgba(120,140,60,0.28)] border border-white/20 shadow-[0px_50px_60px_rgba(0,0,0,0.05)]" />
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
              V674
              Q1304 720 1258 720
              H46
              Q0 720 0 674
              V46
              Q0 0 46 0
              Z
            "
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1.5"
          />
        </svg>

        {/* DROPDOWNS INSIDE CUT */}
        <div className="absolute top-[20px] left-1/2 -translate-x-1/2 flex gap-6 z-20">
          <PillDropdownButton
            label="ANDHRA PRADESH"
            options={["Telangana", "Karnataka", "Tamil Nadu"]}
          />
          <PillDropdownButton
            label="VIZAG ZONE"
            options={["Zone 1", "Zone 2", "Zone 3"]}
          />
        </div>

        {/* PAGE CONTENT */}
        <div className="relative z-10 pt-[120px] px-10 pb-10">
          {children}
        </div>

      </div>
    </div>
  );
}
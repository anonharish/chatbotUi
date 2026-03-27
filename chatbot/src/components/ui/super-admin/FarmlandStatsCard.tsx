import React from "react";

import totalIcon    from "@/assets/sp-admin/icons/total-farmlands.png";
import progressIcon from "@/assets/sp-admin/icons/in-progress.png";
import approvedIcon from "@/assets/sp-admin/icons/approved-lands.png";
import rejectedIcon from "@/assets/sp-admin/icons/rejected-lands.png";

interface StatItem {
  icon: string;
  iconAlt: string;
  label: string;
  value: string | number;
}

const leftStats: StatItem[] = [
  { icon: totalIcon,    iconAlt: "Total Farmlands", label: "Total Farmlands", value: "14,563" },
  { icon: progressIcon, iconAlt: "In Progress",     label: "In Progress",     value: "2,427"  },
];

const rightStats: StatItem[] = [
  { icon: approvedIcon, iconAlt: "Approved Lands", label: "Approved Lands", value: "1,567" },
  { icon: rejectedIcon, iconAlt: "Rejected Lands", label: "Rejected Lands", value: "1,222" },
];

// ── Export the interface so TypeScript resolves props correctly ────────────────
export interface FarmlandStatsCardProps {
  variant?:   "left" | "right";
  className?: string;
}

const FarmlandStatsCard: React.FC<FarmlandStatsCardProps> = ({
  variant   = "left",
  className = "",
}) => {
  const stats = variant === "left" ? leftStats : rightStats;

  return (
    <div
      className={`relative w-full h-full backdrop-blur-md bg-white/10 overflow-hidden ${className}`}
      style={{
        borderRadius: "37.56px",
        border:       "1.71px solid rgba(255,255,255,0.22)",
        boxShadow:    "0 8px 32px rgba(0,0,0,0.18)",
      }}
    >
      {/* Glassmorphism glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:   "linear-gradient(135deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.03) 100%)",
          borderRadius: "37.56px",
        }}
      />

      {/* ── Two stat rows ── */}
      <div className="relative z-10 flex flex-col justify-around h-full px-4 xl:px-5 py-3 xl:py-4">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col">
            {/* Divider */}
            {i > 0 && (
              <div
                className="w-full mb-3"
                style={{ height: "1px", background: "rgba(255,255,255,0.10)" }}
              />
            )}

            <div className="flex items-center gap-3">
              {/* Icon */}
              <img
                src={stat.icon}
                alt={stat.iconAlt}
                className="flex-shrink-0"
                style={{
                  width:     "clamp(36px, 4vw, 50px)",
                  height:    "clamp(36px, 4vw, 50px)",
                  objectFit: "contain",
                }}
              />

              {/* Text */}
              <div className="flex flex-col gap-0.5 min-w-0">
                <p
                  className="text-white/60 truncate"
                  style={{
                    fontFamily:    "Outfit, sans-serif",
                    fontWeight:    400,
                    fontSize:      "clamp(11px, 1.1vw, 14px)",
                    lineHeight:    "16.41px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {stat.label}
                </p>
                <p
                  className="text-white font-bold leading-tight"
                  style={{
                    fontFamily:    "Outfit, sans-serif",
                    fontWeight:    700,
                    fontSize:      "clamp(16px, 1.8vw, 22px)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FarmlandStatsCard;
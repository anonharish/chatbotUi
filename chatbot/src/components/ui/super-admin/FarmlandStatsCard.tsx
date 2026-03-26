import React from "react";

// ❌ REMOVED IMAGE IMPORTS (they caused error)

// ─── Icons ─────────────────────────────────────────────────────────
const TotalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" width="26" height="26">
    <circle cx="9" cy="8" r="3.5" stroke="white" strokeWidth="1.5" />
    <path d="M3 19c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="white" strokeWidth="1.5" />
    <circle cx="18" cy="8" r="2.5" stroke="white" strokeWidth="1.5" />
  </svg>
);

const InProgressIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" width="26" height="26">
    <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5" />
    <path d="M12 7v5l3 3" stroke="white" strokeWidth="1.5" />
  </svg>
);

const ApprovedIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" width="26" height="26">
    <path d="M3 17l4-8 4 4 4-6 4 10" stroke="white" strokeWidth="1.5" />
  </svg>
);

const RejectedIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" width="26" height="26">
    <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5" />
    <path d="M9 9l6 6M15 9l-6 6" stroke="white" strokeWidth="1.5" />
  </svg>
);

interface StatItem {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  iconBg: string;
}

const leftStats: StatItem[] = [
  { icon: <TotalIcon />, label: "Total Farmlands", value: "14,563", iconBg: "bg-blue-400/20" },
  { icon: <InProgressIcon />, label: "In Progress", value: "2,427", iconBg: "bg-yellow-400/20" },
];

const rightStats: StatItem[] = [
  { icon: <ApprovedIcon />, label: "Approved Lands", value: "1,567", iconBg: "bg-green-400/20" },
  { icon: <RejectedIcon />, label: "Rejected Lands", value: "1,222", iconBg: "bg-red-400/20" },
];

interface FarmlandStatsCardProps {
  variant?: "left" | "right";
  className?: string;
}

const ROW_HEIGHT = 104;

const FarmlandStatsCard: React.FC<FarmlandStatsCardProps> = ({
  variant = "left",
  className = "",
}) => {
  const stats = variant === "left" ? leftStats : rightStats;

  return (
    <div
      className={`relative w-full h-full backdrop-blur-md bg-white/10 overflow-hidden ${className}`}
      style={{
        borderRadius: "37.56px",
        border: "1.71px solid rgba(255,255,255,0.22)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.03) 100%)",
        }}
      />

      {stats.map((stat, i) => {
        const rowTop = i * ROW_HEIGHT;

        return (
          <div
            key={i}
            className="absolute"
            style={{
              top: `${rowTop}px`,
              left: 0,
              right: 0,
              height: `${ROW_HEIGHT}px`,
            }}
          >
            <div
              className={`absolute flex items-center justify-center rounded-2xl ${stat.iconBg}`}
              style={{
                width: "50px",
                height: "50px",
                top: `${(ROW_HEIGHT - 50) / 2}px`,
                left: "19px",
              }}
            >
              {stat.icon}
            </div>

            <p className="absolute text-white/60" style={{ top: "35px", left: "80px" }}>
              {stat.label}
            </p>

            <p className="absolute text-white font-bold" style={{ top: "54px", left: "80px" }}>
              {stat.value}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default FarmlandStatsCard;
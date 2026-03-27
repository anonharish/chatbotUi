import React from "react";

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
      className={`
        relative w-full h-full overflow-hidden
        backdrop-blur-md bg-white/10
        rounded-[38px]
        border border-white/20
        shadow-[0_8px_32px_rgba(0,0,0,0.18)]
        ${className}
      `}
    >
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/10 to-white/5" />

      {stats.map((stat, i) => {
        const rowTop = i * ROW_HEIGHT;

        return (
          <div
            key={i}
            className="absolute left-0 right-0 h-[104px]"
            style={{ top: `${rowTop}px` }} // unavoidable dynamic
          >
            <div
              className={`
                absolute flex items-center justify-center rounded-2xl
                w-[50px] h-[50px] left-[19px]
                top-1/2 -translate-y-1/2
                ${stat.iconBg}
              `}
            >
              {stat.icon}
            </div>

            <p className="absolute text-white/60 left-[80px] top-[35px] text-sm">
              {stat.label}
            </p>

            <p className="absolute text-white font-bold left-[80px] top-[54px] text-base">
              {stat.value}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default FarmlandStatsCard;
import React from "react";
import {
  StatCard,
  VisitorGaugeCard,
  FarmlandStatsCard,
  TopPerformersCard,
  SalesReportCard,
  WebsiteVisitorsCard,
  SubscribersDataCard,
} from "@/components/ui/super-admin";

// ── Import your icon from assets ──────────────────────────────────────────────
import coinsIcon from "@/assets/sp-admin/row.png";

// ─── Dashboard ────────────────────────────────────────────────────────────────
const SuperAdminDashboard: React.FC = () => {
  return (
    <div className="w-full px-4 py-4 md:px-6 md:py-5 space-y-4">

      {/* ── ROW 1 ── */}
      <div
        className="
          grid gap-4
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-[407fr_407fr_223fr_223fr]
        "
      >
        {/* Card 1 — Total Sales */}
        <div className="h-[160px] sm:h-[180px] lg:h-[208px]">
          <StatCard
            icon={
              <img
                src={coinsIcon}
                alt="Total Sales"
                style={{ width: "43.85px", height: "44.87px", objectFit: "contain" }}
              />
            }
            label="Total Sales"
            value="₹4,360,000"
            trend={{ value: "+8.33%", positive: true }}
            sparkline
            className="h-full"
          />
        </div>

        {/* Card 2 — Visitors Gauge */}
        <div className="h-[160px] sm:h-[180px] lg:h-[208px]">
          <VisitorGaugeCard
            nriPercentage={58}
            localPercentage={75}
            vsLastWeek
            className="h-full"
          />
        </div>

        {/* Cards 3 & 4 — Farmland Stats */}
        <div className="sm:col-span-2 lg:col-span-2 grid grid-cols-2 gap-4">
          <div className="h-[160px] sm:h-[180px] lg:h-[208px]">
            <FarmlandStatsCard variant="left" className="h-full" />
          </div>
          <div className="h-[160px] sm:h-[180px] lg:h-[208px]">
            <FarmlandStatsCard variant="right" className="h-full" />
          </div>
        </div>
      </div>

      {/* ── ROW 2 ── */}
      <div
        className="
          grid gap-4
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-[826fr_460fr]
        "
      >
        <div className="h-[320px] md:h-[360px] lg:h-[400px]">
          <TopPerformersCard className="h-full" />
        </div>
        <div className="h-[320px] md:h-[360px] lg:h-[400px]">
          <SalesReportCard className="h-full" />
        </div>
      </div>

      {/* ── ROW 3 ── */}
      <div
        className="
          grid gap-4
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-[826fr_460fr]
        "
      >
        <div className="h-[320px] md:h-[360px] lg:h-[400px]">
          <WebsiteVisitorsCard className="h-full" />
        </div>
        <div className="h-[320px] md:h-[360px] lg:h-[400px]">
          <SubscribersDataCard className="h-full" />
        </div>
      </div>

    </div>
  );
};

export default SuperAdminDashboard;
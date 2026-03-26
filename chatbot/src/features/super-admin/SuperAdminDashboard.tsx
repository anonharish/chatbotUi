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

import coinsIcon from "@/assets/sp-admin/icons/row.png";

const SuperAdminDashboard: React.FC = () => {
  return (
    <div
  className="
    w-full
    pl-[80px]   // ✅ match sidebar width
    pr-4 py-4
    sm:pr-5 sm:py-5
    md:pr-6 md:py-6
    lg:pr-8 lg:py-7
    xl:pr-10 xl:py-8
    space-y-4
    box-border
    overflow-x-hidden
  "
>
      {/* ── ROW 1: 4 stat cards ── */}
      <div
        className="
          grid gap-3 md:gap-4
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-[407fr_407fr_223fr_223fr]
        "
      >
        {/* Card 1 — Total Sales */}
        <div className="h-[160px] sm:h-[180px] lg:h-[190px] xl:h-[208px]">
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
        <div className="h-[160px] sm:h-[180px] lg:h-[190px] xl:h-[208px]">
          <VisitorGaugeCard
            nriPercentage={58}
            localPercentage={75}
            vsLastWeek
            className="h-full"
          />
        </div>

        {/* Cards 3 & 4 — Farmland Stats */}
        <div className="sm:col-span-2 lg:col-span-2 grid grid-cols-2 gap-3 md:gap-4">
          <div className="h-[160px] sm:h-[180px] lg:h-[190px] xl:h-[208px]">
            <FarmlandStatsCard variant="left" className="h-full" />
          </div>
          <div className="h-[160px] sm:h-[180px] lg:h-[190px] xl:h-[208px]">
            <FarmlandStatsCard variant="right" className="h-full" />
          </div>
        </div>
      </div>

      {/* ── ROW 2: Top Performers + Sales Report ── */}
      <div
        className="
          grid gap-3 md:gap-4
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-[826fr_460fr]
        "
      >
        <div className="h-[300px] sm:h-[340px] md:h-[370px] lg:h-[390px] xl:h-[400px]">
          <TopPerformersCard className="h-full" />
        </div>
        <div className="h-[300px] sm:h-[340px] md:h-[370px] lg:h-[390px] xl:h-[400px]">
          <SalesReportCard className="h-full" />
        </div>
      </div>

      {/* ── ROW 3: Website Visitors + Subscribers ── */}
      <div
        className="
          grid gap-3 md:gap-4
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-[826fr_460fr]
        "
      >
        <div className="h-[300px] sm:h-[340px] md:h-[370px] lg:h-[390px] xl:h-[400px]">
          <WebsiteVisitorsCard className="h-full" />
        </div>
        <div className="h-[300px] sm:h-[340px] md:h-[370px] lg:h-[390px] xl:h-[400px]">
          <SubscribersDataCard className="h-full" />
        </div>
      </div>

    </div>
  );
};

export default SuperAdminDashboard;
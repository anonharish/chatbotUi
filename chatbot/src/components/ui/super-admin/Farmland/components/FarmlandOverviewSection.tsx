import React, { useState } from "react";
import { farmlandAssignmentsData } from "@/data/farmlandOverviewData";
import GlassCutCard from "@/components/pages/GlassCutCard";
import PipelineCard from "./PipelineCard";
import StatCard from "../../StatCard";
import VisitorGaugeCard from "../../VisitorGaugeCard";
import FarmlandStatsCard from "../../FarmlandStatsCard";

const farmlandBg = "/farmland-bg.jpg";

const { assignments } = farmlandAssignmentsData;

const FarmlandOverviewSection: React.FC = () => {
  const [filters, setFilters] = useState({
    state: "",
    zone: "",
    search: "",
  });

  const filteredAssignments = assignments.filter((item) => {
    const search = filters.search.toLowerCase();

    const matchesSearch =
      item.farmland.code.toLowerCase().includes(search) ||
      item.agent.name.toLowerCase().includes(search) ||
      item.deal.location.toLowerCase().includes(search);

    const matchesState = filters.state
      ? item.farmland.state === filters.state
      : true;

    const matchesZone = filters.zone
      ? item.farmland.zone === filters.zone
      : true;

    return matchesSearch && matchesState && matchesZone;
  });

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center rounded-3xl overflow-hidden p-6 flex flex-col gap-4"
      style={{ backgroundImage: `url(${farmlandBg})` }}
    >
      {/* TOP */}
      <div className="grid grid-cols-4 gap-4 h-52">
        <StatCard
          icon={<span>💰</span>}
          label="Total Sales"
          value="$4,360,000"
          trend={{ value: "+8.33%", positive: true }}
          sparkline
        />
        <VisitorGaugeCard
          nriPercentage={58}
          localPercentage={75}
          vsLastWeek
        />
        <FarmlandStatsCard variant="left" />
        <FarmlandStatsCard variant="right" />
      </div>

      {/* ✅ TITLE ABOVE GLASS CARD */}
      <h2 className="text-white text-[1.6vw] font-semibold ml-[0.5vw]">
        Assigned Farmlands
      </h2>

      {/* GLASS CARD */}
      <GlassCutCard onFilterChange={setFilters}>
        <div className="flex flex-col gap-14 items-center w-full">
          {filteredAssignments.length > 0 ? (
            filteredAssignments.map((item) => (
              <PipelineCard key={item.id} data={item} />
            ))
          ) : (
            <p className="text-white text-lg mt-10">No results found</p>
          )}
        </div>
      </GlassCutCard>
    </div>
  );
};

export default FarmlandOverviewSection;
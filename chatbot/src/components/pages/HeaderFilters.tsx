import React from "react";
import TransparentCard from "../ui/TransparentCard";
import FilterButton from "../ui/FilterButton";

export default function HeaderFilters() {
  return (
    <div className="flex justify-center mt-10">
      <TransparentCard className="flex gap-6">
        <FilterButton label="ANDHRA PRADESH" />
        <FilterButton label="VIZAG ZONE" />
      </TransparentCard>
    </div>
  );
}

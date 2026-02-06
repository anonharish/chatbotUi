import React from "react";

interface FilterButtonProps {
  label: string;
}

const FilterButton: React.FC<FilterButtonProps> = ({ label }) => {
  return (
    <button
      className="
        px-8 py-4
        rounded-full
        bg-green-700/70
        text-white
        font-semibold
        hover:bg-green-800
        transition
        backdrop-blur-md
        border border-white/30
      "
    >
      {label} ▼
    </button>
  );
};

export default FilterButton;

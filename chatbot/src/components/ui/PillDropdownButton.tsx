import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface PillDropdownButtonProps {
  label: string;
  options: string[];
  onSelect?: (value: string) => void;
}

export default function PillDropdownButton({
  label,
  options,
  onSelect,
}: PillDropdownButtonProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(label);

  const handleSelect = (option: string) => {
    setSelected(option);
    setOpen(false);
    onSelect?.(option);
  };

  return (
    <div className="relative inline-block">
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="
  flex items-center gap-2
  px-10 py-4
  rounded-full
  text-white font-medium
  border border-white/60
  shadow-md
  hover:bg-[#7b8149]
  transition-all duration-200
"

      >
        
        {selected}
        <ChevronDown
          size={18}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute left-0 mt-2 w-full
            bg-white rounded-xl
            shadow-lg
            overflow-hidden
            z-50
          "
        >
          {options.map((option, i) => (
            <div
              key={i}
              onClick={() => handleSelect(option)}
              className="
                px-4 py-3
                cursor-pointer
                hover:bg-gray-100
                text-gray-700
              "
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

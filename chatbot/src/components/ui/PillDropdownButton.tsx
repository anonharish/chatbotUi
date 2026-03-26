import { useState, useRef, useEffect } from "react";
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
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    setSelected(option);
    setOpen(false);
    onSelect?.(option);
  };

  return (
    <div ref={ref} className="relative inline-block w-full sm:w-auto">

      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="
          flex items-center justify-between gap-2
          w-full sm:w-auto
          px-4 sm:px-8
          py-2 sm:py-3
          rounded-full
          text-white text-sm sm:text-base font-medium
          border border-white/60
          backdrop-blur-xl
          bg-white/20
          hover:bg-[#7b8149]
          transition-all duration-200
        "
      >
        <span className="truncate">{selected}</span>
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute left-0 mt-2
            min-w-full sm:min-w-[180px]
            bg-white rounded-xl
            shadow-xl
            overflow-hidden
            z-[999]
          "
        >
          {options.map((option, i) => (
            <div
              key={i}
              onClick={() => handleSelect(option)}
              className="
                px-4 py-2
                text-sm
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
import { useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TopRightActionButton() {
  const [open] = useState(false); // or remove completely if not needed
  const navigate = useNavigate();

  return (
    <div className="relative">

      {/* Expandable Panel */}
      <div
        className={`
          absolute right-0 top-16
          w-[90vw] max-w-[340px]
          transition-all duration-300 ease-in-out origin-top-right
          ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
          z-[100]
        `}
      >
        <div
          className="
            rounded-[28px]
            p-6
            bg-white/15
            backdrop-blur-xl
            border border-white/50
            text-white
            shadow-xl
          "
        >
          <div className="flex flex-col gap-6"></div>
        </div>
      </div>

      {/* Add Button */}
      <button
        onClick={() => navigate("/UserRoles")}
        className="
          w-12 h-12 md:w-14 md:h-14
          rounded-full
          flex items-center justify-center
          bg-white/20
          backdrop-blur-xl
          border border-white/60
          text-white
          hover:bg-white/30
          transition-all
        "
      >
        <Plus size={20} />
      </button>

    </div>
  );
}
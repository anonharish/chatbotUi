// import { Plus, Pause } from "lucide-react";

// interface Props {
//   onAdd?: () => void;
//   onToggle?: () => void;
// }

// export default function TopRightActions({ onAdd, onToggle }: Props) {
//   return (
//     <div className="flex gap-4">

//       {/* Add Button */}
//       <button
//         onClick={onAdd}
//         className="
//         w-12 h-12
//         rounded-full
//         flex items-center justify-center
//         bg-white/20
//         backdrop-blur-xl
//         border border-white/40
//         text-white
//         hover:bg-white/30
//         hover:scale-105
//         transition-all duration-200
//         "
//       >
//         <Plus size={20} />
//       </button>

//       {/* Toggle/List Button */}
//       <button
//         onClick={onToggle}
//         className="
//         w-12 h-12
//         rounded-full
//         flex items-center justify-center
//         bg-white/20
//         backdrop-blur-xl
//         border border-white/40
//         text-white
//         hover:bg-white/30
//         hover:scale-105
//         transition-all duration-200
//         "
//       >
//         <Pause size={18} />
//       </button>

//     </div>
//   );
// }


import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TopRightActionButton() {
  const [open, setOpen] = useState(false);
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
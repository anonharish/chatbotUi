import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  onAdd?: () => void;
}

export default function TopRightActions({ onAdd }: Props) {
  const navigate = useNavigate();

  return (
    <div className="flex gap-4">
      {/* Add Button */}
      <button
        onClick={onAdd || (() => navigate("/UserRoles"))}
        className="
        w-12 h-12 md:w-14 md:h-14
        rounded-full
        flex items-center justify-center
        bg-white/10
        backdrop-blur-xl
        border border-white/40
        text-white
        hover:bg-white/20
        transition-all duration-200
        "
      >
        <Plus size={24} />
      </button>
    </div>
  );
}

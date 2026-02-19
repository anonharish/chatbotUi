import { Plus, Pause } from "lucide-react";

interface Props {
  onAdd?: () => void;
  onToggle?: () => void;
}

export default function TopRightActions({ onAdd, onToggle }: Props) {
  return (
    <div className="flex gap-4">

      {/* Add Button */}
      <button
        onClick={onAdd}
        className="
        w-12 h-12
        rounded-full
        flex items-center justify-center
        bg-white/20
        backdrop-blur-xl
        border border-white/40
        text-white
        hover:bg-white/30
        hover:scale-105
        transition-all duration-200
        "
      >
        <Plus size={20} />
      </button>

      {/* Toggle/List Button */}
      <button
        onClick={onToggle}
        className="
        w-12 h-12
        rounded-full
        flex items-center justify-center
        bg-white/20
        backdrop-blur-xl
        border border-white/40
        text-white
        hover:bg-white/30
        hover:scale-105
        transition-all duration-200
        "
      >
        <Pause size={18} />
      </button>

    </div>
  );
}

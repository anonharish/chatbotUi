import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

type Item = {
  name: string;
  sub: string;
  contact?: string;
  image: string;
};

const baseCardStyle = `
  bg-white
  w-[310px]
  h-[390px]
  rounded-[44px]
  shadow-[0_18px_40px_rgba(0,0,0,0.18)]
  flex flex-col
`;

export default function DirectoryColumn({
  variant,
  data,
  onItemClick,
  selectedIndex,
}: {
  variant: "roles" | "officers" | "agents";
  data: Item[];
  onItemClick?: (index: number) => void;
  selectedIndex?: number | null;
}) {
  const [search, setSearch] = useState("");

  const [localData, setLocalData] = useState<Item[]>(data);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedItem, setEditedItem] = useState<Item | null>(null);

  /* ================= EDIT ================= */

  const startEdit = (e: React.MouseEvent, item: Item, index: number) => {
    e.stopPropagation();
    setEditingIndex(index);
    setEditedItem({ ...item });
  };

  const saveEdit = () => {
    if (editingIndex === null || !editedItem) return;

    const updated = [...localData];
    updated[editingIndex] = editedItem;

    setLocalData(updated);
    setEditingIndex(null);
    setEditedItem(null);
  };

  /* =================================================
     ROLES CARD (icons stay visible)
  ================================================= */
  if (variant === "roles") {
    return (
      <Card className={`${baseCardStyle} p-6`}>
        <div className="space-y-6">
          {localData.map((item, i) => (
            <div key={i} className="relative space-y-3">

              {/* ICONS ALWAYS VISIBLE */}
              <div className="absolute top-0 right-0 flex gap-3">
                <img
                  src="/icons/edit.png"
                  className="w-4 h-4 cursor-pointer"
                  onClick={(e) => startEdit(e, item, i)}
                />
                <img src="/icons/view.png" className="w-4 h-4 cursor-pointer" />
              </div>

              <img
                src={item.image}
                className="w-14 h-14 rounded-full object-cover"
              />

              {editingIndex === i ? (
                <>
                  <input
                    value={editedItem?.name}
                    onChange={(e) =>
                      setEditedItem({ ...editedItem!, name: e.target.value })
                    }
                    onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                    className="border rounded px-2 py-1 w-full"
                    autoFocus
                  />

                  <input
                    value={editedItem?.sub}
                    onChange={(e) =>
                      setEditedItem({ ...editedItem!, sub: e.target.value })
                    }
                    onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                    className="border rounded px-2 py-1 w-full"
                  />
                </>
              ) : (
                <div className="text-sm">
                  <p>{item.name}</p>
                  <p>{item.sub}</p>
                  <p>Contact - {item.contact}</p>
                </div>
              )}

              {i !== localData.length - 1 && (
                <div className="h-[3px] bg-gray-200 mt-10" />
              )}
            </div>
          ))}
        </div>
      </Card>
    );
  }

  /* =================================================
     OFFICERS + AGENTS
     ⭐ icons hidden while editing
  ================================================= */
  return (
    <Card className={`${baseCardStyle} p-5`}>
      {/* SEARCH */}
      <div className="mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={
            variant === "officers"
              ? "Search Field Officer"
              : "Search Agents"
          }
          className="w-full bg-gray-100 rounded-full py-2 px-3 text-sm outline-none"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-6">
        {localData.map((item, i) => {
          if (
            search &&
            !item.name.toLowerCase().includes(search.toLowerCase())
          )
            return null;

          const isSelected = variant === "officers" && selectedIndex === i;

          return (
            <div
              key={i}
              data-row
              onClick={() => {
                if (variant === "officers" && onItemClick) onItemClick(i);
              }}
              className={`flex items-center justify-between px-2 py-2 rounded-lg ${
                isSelected ? "bg-blue-50 border-2 border-blue-300" : ""
              }`}
            >

              {/* LEFT */}
              <div className="flex items-center gap-3 flex-1">
                <img
                  src={item.image}
                  className="w-10 h-10 rounded-full object-cover"
                />

                {editingIndex === i ? (
                  <div className="flex flex-col gap-1 w-full">
                    <input
                      value={editedItem?.name}
                      onChange={(e) =>
                        setEditedItem({ ...editedItem!, name: e.target.value })
                      }
                      onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                      className="border rounded px-2 py-1"
                      autoFocus
                    />

                    <input
                      value={editedItem?.sub}
                      onChange={(e) =>
                        setEditedItem({ ...editedItem!, sub: e.target.value })
                      }
                      onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                      className="border rounded px-2 py-1"
                    />
                  </div>
                ) : (
                  <div>
                    <p>{item.name}</p>
                    <p className="text-xs text-gray-500">{item.sub}</p>
                  </div>
                )}
              </div>

              {/* ⭐ ICONS HIDDEN DURING EDIT */}
              {editingIndex !== i && (
                <div className="flex gap-3 ml-3">
                  <img
                    src="/icons/edit.png"
                    className="w-4 h-4 cursor-pointer"
                    onClick={(e) => startEdit(e, item, i)}
                  />
                  <img
                    src="/icons/view.png"
                    className="w-4 h-4 cursor-pointer"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

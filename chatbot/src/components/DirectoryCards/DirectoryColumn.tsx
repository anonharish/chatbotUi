import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [localData, setLocalData] = useState<Item[]>(data);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  /* ================= ROLES CARD ================= */

  if (variant === "roles") {
    return (
      <Card className={`${baseCardStyle} p-6`}>
        <div className="space-y-6">
          {localData.map((item, i) => (
            <div key={i} className="relative space-y-3">

              {/* ICONS */}
              <div className="absolute top-0 right-0 flex gap-3">

                {/* EDIT */}
                <img
                  src="/src/assets/icons/edit.png"
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => navigate("/agent-profile")}
                />

                {/* VIEW */}
                <img
                  src="/src/assets/icons/view.png"
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => navigate("/profile-info")}
                />

              </div>

              <img
                src={item.image}
                className="w-14 h-14 rounded-full object-cover"
              />

              <div className="text-sm">
                <p>{item.name}</p>
                <p>{item.sub}</p>
                <p>Contact - {item.contact}</p>
              </div>

              {i !== localData.length - 1 && (
                <div className="h-[3px] bg-gray-200 mt-10" />
              )}

            </div>
          ))}
        </div>
      </Card>
    );
  }

  /* ================= OFFICERS / AGENTS CARD ================= */

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

      <div className="flex-1  space-y-6">
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
              className={`flex items-center justify-between px-2 py-2 rounded-lg cursor-pointer${
                isSelected ? "bg-blue-50 border-2 border-blue-300" : ""
              }`}
            >

              <div className="flex items-center gap-3 flex-1">

                <img
                  src={item.image}
                  className="w-10 h-10 rounded-full object-cover"
                />

                <div>
                  <p>{item.name}</p>
                  <p className="text-xs text-gray-500">{item.sub}</p>
                </div>

              </div>

              {/* ICONS */}
              <div className="flex gap-3 ml-3">

                {/* EDIT */}
                <img
                  src="/src/assets/icons/edit.png"
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => navigate("/agent-profile")}
                />

                {/* VIEW */}
                <img
                  src="/src/assets/icons/view.png"
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => navigate("/profile-info")}
                />

              </div>

            </div>
          );
        })}
      </div>

    </Card>
  );
}
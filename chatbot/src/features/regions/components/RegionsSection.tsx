import { Plus, Pause } from "lucide-react";

export const RegionsSection = () => {
  return (
    <div className="w-full">

      {/* CONTENT */}
      <div className="relative grid grid-cols-[1fr_382px] gap-8 w-full">

        {/* LEFT SIDE */}
        <div className="w-full">

          <button className="px-6 py-2.5 border border-white/40 rounded-full text-white text-sm mb-6 hover:bg-white/10 transition-colors">
            Area / Region List
          </button>

          <div className="grid grid-cols-3 text-white/70 text-sm w-[1140px] px-6 mb-3">
            <span>State</span>
            <span>No. of Regions</span>
            <span>No. of Areas</span>
          </div>

          <div className="space-y-4 flex flex-col">
            {[
              { state: "Andhra Pradesh", regions: 35, areas: 300 },
              { state: "Telangana", regions: 15, areas: 450 },
              { state: "Karnataka", regions: 69, areas: 239 },
              { state: "Tamil Nadu", regions: 44, areas: 436 },
              { state: "Andhra Pradesh", regions: 44, areas: 436 },
            ].map((item, i) => (
              <div
                key={i}
                className="grid grid-cols-3 items-center w-[1140px] h-[82px] px-8 bg-white/90 backdrop-blur-sm rounded-[30px] text-gray-700 shadow-sm hover:bg-white/95 transition-colors"
              >
                <span className="font-medium">{item.state}</span>
                <span>{item.regions}</span>
                <span>{item.areas}</span>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT SIDE CARD */}
        <div className="relative w-[382px] h-[479px] bg-white/90 backdrop-blur-md rounded-[46px] border border-white/40 p-6 shadow-[0px_20px_40px_rgba(0,0,0,0.08)] flex flex-col">

          {/* TOP RIGHT ICONS */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600">
              <Plus size={14} />
            </button>
            <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600">
              <Pause size={14} />
            </button>
          </div>

          {/* TITLE */}
          <p className="text-gray-600 text-sm mb-2">
            Top Zone: Tanuku Area
          </p>

          {/* IMAGE */}
          <div className="my-3">
            <img
              src="/src/assets/regions/land.png"
              alt="Map"
              className="w-full h-[160px] object-contain"
            />
          </div>

          {/* STATS */}
          <div className="space-y-5 text-sm mt-2">

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-500">
                <span>💰</span>
                <span>Total Sales Value</span>
              </div>
              <span className="font-semibold text-gray-900">₹2.5 Cr</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-500">
                <span>📍</span>
                <span>Avg. Price/Acre</span>
              </div>
              <span className="font-semibold text-gray-900">₹15 Lakhs</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-500">
                <span>🎯</span>
                <span>Success Rate</span>
              </div>
              <span className="font-semibold text-gray-900">85%</span>
            </div>

          </div>

          {/* AGENT */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto">
            <div className="flex items-center gap-3">
              <img
                src="/src/assets/agents/photo.png"
                alt="Agent"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-gray-900 font-semibold text-sm">Ram Kishore</p>
                <p className="text-xs text-gray-500">R.O. & I.O.</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">12 Active Leads</p>
              <p className="text-xs text-gray-500">Rank #1</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
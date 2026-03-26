import React from "react";
import { MapPin, Coins, Clock } from "lucide-react";

export interface AssignmentData {
  id: string;
  farmland: {
    code: string;
    area: number;
    costPerAcre: number;
    image: string;
    state: string;
    zone: string;
  };
  deal: {
    location: string;
    amount: string;
    time: string;
  };
  agent: {
    name: string;
    roleId: string;
    avatar: string;
  };
}

/* ── CARD — dot on right border ── */
const Card = ({
  children,
  showRightDot,
}: {
  children: React.ReactNode;
  showRightDot?: boolean;
}) => (
  <div className="relative" style={{ flexShrink: 0 }}>
    <div
      className="bg-white shadow-md flex items-center"
      style={{
        borderRadius: "2vw",
        padding: "1.4vw 1.6vw",
        width: "24vw",
        height: "11vw",
      }}
    >
      <div className="w-full">{children}</div>
    </div>

    {showRightDot && (
      <div
        style={{
          position: "absolute",
          right: "-0.5vw",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Outer shade ring */}
        <div
          style={{
            position: "absolute",
            width: "1.5vw",
            height: "1.5vw",
            borderRadius: "50%",
            backgroundColor: "rgba(0,0,0,0.12)",
          }}
        />
        {/* Dark dot */}
        <div
          style={{
            width: "0.72vw",
            height: "0.72vw",
            borderRadius: "50%",
            backgroundColor: "#374151",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: "0.28vw",
              height: "0.28vw",
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.6)",
            }}
          />
        </div>
      </div>
    )}
  </div>
);

/* ── CONNECTOR: gap on both ends so arrow never touches the cards ── */
const Connector = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      width: "4.5vw",
      flexShrink: 0,
      paddingLeft: "0.5vw",   /* gap after the dot on the left card  */
      paddingRight: "0.5vw",  /* gap before the right card            */
      boxSizing: "border-box",
    }}
  >
    <div
      style={{
        flex: 1,
        height: "1.5px",
        backgroundColor: "#FFFFFF",
        position: "relative",
      }}
    >
      {/* White arrowhead */}
      <div
        style={{
          position: "absolute",
          right: "-1px",
          top: "50%",
          transform: "translateY(-50%)",
          width: 0,
          height: 0,
          borderTop: "0.2vw solid transparent",
          borderBottom: "0.2vw solid transparent",
          borderLeft: "0.36vw solid #FFFFFF",
        }}
      />
    </div>
  </div>
);

export default function PipelineCard({ data }: { data: AssignmentData }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      {/* 🔹 FARMLAND */}
      <Card showRightDot>
        <div className="flex justify-between items-start">
          <div className="w-[2.8vw] h-[2.8vw] rounded-full overflow-hidden bg-green-100">
            <img src={data.farmland.image} className="w-full h-full object-cover" />
          </div>
          <button className="text-[0.7vw] px-[1vw] py-[0.3vw] border border-gray-300 rounded-full text-gray-600">
            View Details
          </button>
        </div>
        <div className="mt-[0.8vw]">
          <p className="text-[0.95vw] font-semibold text-gray-800">{data.farmland.code}</p>
          <p className="text-[0.75vw] text-gray-500 mt-[0.3vw]">Area - {data.farmland.area} acres</p>
          <p className="text-[0.75vw] text-gray-500">
            Cost per acre - ₹{data.farmland.costPerAcre.toLocaleString()}
          </p>
        </div>
      </Card>

      <Connector />

      {/* 🔹 DEAL */}
      <Card showRightDot>
        <div className="flex flex-col gap-[1vw] justify-center h-full">
          <div className="flex items-center gap-[0.8vw]">
            <div className="w-[2vw] h-[2vw] rounded-full bg-blue-100 flex items-center justify-center">
              <MapPin size={14} className="text-blue-600" />
            </div>
            <p className="text-[0.8vw]">
              <span className="font-medium">Location – </span>{data.deal.location}
            </p>
          </div>
          <div className="flex items-center gap-[0.8vw]">
            <div className="w-[2vw] h-[2vw] rounded-full bg-blue-100 flex items-center justify-center">
              <Coins size={14} className="text-blue-600" />
            </div>
            <p className="text-[0.8vw]">
              <span className="font-medium">Deal Amount – </span>{data.deal.amount}
            </p>
          </div>
          <div className="flex items-center gap-[0.8vw]">
            <div className="w-[2vw] h-[2vw] rounded-full bg-blue-100 flex items-center justify-center">
              <Clock size={14} className="text-blue-600" />
            </div>
            <p className="text-[0.8vw]">
              <span className="font-medium">Recorded Time – </span>{data.deal.time}
            </p>
          </div>
        </div>
      </Card>

      <Connector />

      {/* 🔹 AGENT */}
      <Card>
        <div className="flex justify-between items-start">
          <div className="w-[2.8vw] h-[2.8vw] rounded-full overflow-hidden bg-gray-200">
            <img src={data.agent.avatar} className="w-full h-full object-cover" />
          </div>
          <button className="text-[0.7vw] px-[1vw] py-[0.3vw] border border-gray-300 rounded-full text-gray-600">
            View
          </button>
        </div>
        <div className="mt-[0.8vw]">
          <p className="text-[0.95vw] font-semibold">{data.agent.name}</p>
          <p className="text-[0.75vw] text-gray-500 mt-[0.3vw]">Role ID - {data.agent.roleId}</p>
          <p className="text-[0.75vw] text-gray-500">Farmland ID - {data.farmland.code}</p>
        </div>
      </Card>
    </div>
  );
}
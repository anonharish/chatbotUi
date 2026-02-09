import { useState, useRef, useEffect, useCallback } from "react";
import DirectoryColumn from "./DirectoryColumn";

export default function DirectoryCards() {
  const [selectedOfficer, setSelectedOfficer] = useState<number | null>(null);
  const [showAgents, setShowAgents] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const rolesRef = useRef<HTMLDivElement>(null);
  const officersRef = useRef<HTMLDivElement>(null);
  const agentsRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const [officerYs, setOfficerYs] = useState<number[]>([]);
  const [agentYsMap, setAgentYsMap] = useState<{ [key: number]: number[] }>({});
  const [coords, setCoords] = useState<any>({});

  /* ================= DATA ================= */

  const roles = [
    {
      name: "Ram Verma - Regional Officer",
      sub: "Role ID - AG00049",
      contact: "91 982-902-5254",
      image: "/profiles/profile1.png",
    },
    {
      name: "Ram Verma - Intelligence Officer",
      sub: "Role ID - AG00049",
      contact: "91 982-902-5254",
      image: "/profiles/profile2.png",
    },
  ];

  const officers = [
    { name: "Satish Kumar", sub: "FO0113", image: "/profiles/profile3.png" },
    { name: "Ram Verma", sub: "FO0113", image: "/profiles/profile4.png" },
    { name: "Satish Kumar", sub: "FO0113", image: "/profiles/profile5.png" },
    { name: "Ram Verma", sub: "FO0113", image: "/profiles/profile6.png" },
  ];

  // Different agents for each officer
  const agentsData: { [key: number]: any[] } = {
    0: [
      { name: "Satish Kumar", sub: "AG0113", image: "/profiles/profile7.png" },
      { name: "Ram Verma", sub: "AG0113", image: "/profiles/profile8.png" },
      { name: "Satish Kumar", sub: "AG0113", image: "/profiles/profile9.png" },
      { name: "Ram Verma", sub: "AG0113", image: "/profiles/profile5.png" },
    ],
    1: [
      { name: "Agent Alpha", sub: "AG0201", image: "/profiles/profile7.png" },
      { name: "Agent Beta", sub: "AG0202", image: "/profiles/profile8.png" },
      { name: "Agent Gamma", sub: "AG0203", image: "/profiles/profile9.png" },
      { name: "Agent Beta", sub: "AG0202", image: "/profiles/profile8.png" },
    ],
    2: [
      { name: "Field Agent X", sub: "AG0301", image: "/profiles/profile7.png" },
      { name: "Field Agent Y", sub: "AG0302", image: "/profiles/profile8.png" },
      { name: "Field Agent Z", sub: "AG0303", image: "/profiles/profile9.png" },
      { name: "Field Agent W", sub: "AG0304", image: "/profiles/profile5.png" },
    ],
    3: [
      { name: "Special Agent 1", sub: "AG0401", image: "/profiles/profile7.png" },
      { name: "Special Agent 2", sub: "AG0402", image: "/profiles/profile8.png" },
      { name: "Special Agent 3", sub: "AG0401", image: "/profiles/profile7.png" },
      { name: "Special Agent 4", sub: "AG0402", image: "/profiles/profile8.png" },
    ],
  };


  const calculate = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current.getBoundingClientRect();

    const getYs = (ref: any) => {
      if (!ref) return [];
      const rows = ref.querySelectorAll("[data-row]");
      return Array.from(rows).map((r: any) => {
        const rect = r.getBoundingClientRect();
        return rect.top + rect.height / 2 - container.top;
      });
    };

    setOfficerYs(getYs(officersRef.current));

    // Get Y positions for each visible agent card
    if (showAgents && selectedOfficer !== null) {
      const agentRef = agentsRefs.current[selectedOfficer];
      if (agentRef) {
        setAgentYsMap({
          [selectedOfficer]: getYs(agentRef),
        });
      }
    }

    if (rolesRef.current && officersRef.current) {
      const r = rolesRef.current.getBoundingClientRect();
      const o = officersRef.current.getBoundingClientRect();

      setCoords((prev: any) => ({
        ...prev,
        rRight: r.right - container.left,
        oLeft: o.left - container.left,
        oRight: o.right - container.left,
      }));
    }

    if (showAgents && selectedOfficer !== null && agentsRefs.current[selectedOfficer]) {
      const a = agentsRefs.current[selectedOfficer]!.getBoundingClientRect();

      setCoords((prev: any) => ({
        ...prev,
        aLeft: a.left - container.left,
      }));
    }
  }, [showAgents, selectedOfficer]);

  useEffect(() => {
    calculate();
    window.addEventListener("resize", calculate);
    return () => window.removeEventListener("resize", calculate);
  }, [calculate]);

  /* ================= CLICK ================= */

  const handleOfficerClick = (index: number) => {
    if (selectedOfficer === index) {
      setSelectedOfficer(null);
      setShowAgents(false);
    } else {
      setSelectedOfficer(index);
      setShowAgents(true);
    }
  };

  const mid = (a: number, b: number) => (a + b) / 2;

  /* ================= UI ================= */

  return (
    <div
      ref={containerRef}
      className="relative flex justify-center items-start min-h-screen pt-12"
    >
      <div className="flex gap-24 z-10">
        <div ref={rolesRef}>
          <DirectoryColumn variant="roles" data={roles} />
        </div>

        <div ref={officersRef}>
          <DirectoryColumn
            variant="officers"
            data={officers}
            selectedIndex={selectedOfficer}
            onItemClick={handleOfficerClick}
          />
        </div>

        {/* Render agent card for selected officer */}
        {showAgents && selectedOfficer !== null && (
          <div ref={(el) => {
  agentsRefs.current[selectedOfficer] = el;
}}
 >
            <DirectoryColumn
              variant="agents"
              data={agentsData[selectedOfficer] || []}
            />
          </div>
        )}
      </div>

      {/* ================= SVG CONNECTORS ================= */}

      <svg className="absolute inset-0 pointer-events-none w-full h-full">
        {/* ===== Arrow definition ===== */}
        <defs>
          <marker
            id="arrow"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L10,5 L0,10 Z" fill="#9CA3AF" />
          </marker>
        </defs>

        {/* ===== Roles → Officers ===== */}
        {officerYs.length > 0 && (
          <>
            {(() => {
              const spineX = mid(coords.rRight, coords.oLeft);
              const top = Math.min(...officerYs);
              const bottom = Math.max(...officerYs);
              const centerY = mid(top, bottom);

              return (
                <>
                  {/* start node */}
                  <circle cx={coords.rRight} cy={centerY} r="4" fill="#9CA3AF" />

                  {/* horizontal */}
                  <line
                    x1={coords.rRight}
                    y1={centerY}
                    x2={spineX}
                    y2={centerY}
                    stroke="#9CA3AF"
                    strokeWidth="1"
                  />

                  {/* spine */}
                  <line
                    x1={spineX}
                    y1={top}
                    x2={spineX}
                    y2={bottom}
                    stroke="#9CA3AF"
                    strokeWidth="1"
                  />

                  {/* branches */}
                  {officerYs.map((y, i) => (
                    <line
                      key={i}
                      x1={spineX}
                      y1={y}
                      x2={coords.oLeft}
                      y2={y}
                      stroke="#9CA3AF"
                      strokeWidth="1"
                      markerEnd="url(#arrow)"
                    />
                  ))}
                </>
              );
            })()}
          </>
        )}

        {/* ===== Officers → Agents ===== */}
        {showAgents &&
          selectedOfficer !== null &&
          agentYsMap[selectedOfficer]?.length > 0 && (
            <>
              {(() => {
                const agentYs = agentYsMap[selectedOfficer];
                const spineX = mid(coords.oRight, coords.aLeft);
                const startY = officerYs[selectedOfficer];
                const top = Math.min(...agentYs);
                const bottom = Math.max(...agentYs);

                return (
                  <>
                    {/* start node */}
                    <circle cx={coords.oRight} cy={startY} r="4" fill="#9CA3AF" />

                    {/* horizontal */}
                    <line
                      x1={coords.oRight}
                      y1={startY}
                      x2={spineX}
                      y2={startY}
                      stroke="#9CA3AF"
                      strokeWidth="1"
                    />

                    {/* spine */}
                    <line
                      x1={spineX}
                      y1={top}
                      x2={spineX}
                      y2={bottom}
                      stroke="#9CA3AF"
                      strokeWidth="1"
                    />

                    {/* branches */}
                    {agentYs.map((y, i) => (
                      <line
                        key={i}
                        x1={spineX}
                        y1={y}
                        x2={coords.aLeft}
                        y2={y}
                        stroke="#9CA3AF"
                        strokeWidth="1"
                        markerEnd="url(#arrow)"
                      />
                    ))}
                  </>
                );
              })()}
            </>
          )}
      </svg>
    </div>
  );
}
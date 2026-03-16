import {useState, useRef, useEffect, useCallback} from "react";
import DirectoryColumn from "./DirectoryColumn";
import {roles, officers} from "../../data/directoryData";

export default function DirectoryCards() {
    const [selectedOfficer, setSelectedOfficer] = useState < number | null > (null);
    const [showAgents, setShowAgents] = useState(false);

    const containerRef = useRef < HTMLDivElement > (null);
    const rolesRef = useRef < HTMLDivElement > (null);
    const officersRef = useRef < HTMLDivElement > (null);
    const agentsRefs = useRef < {
    [key: number]: HTMLDivElement | null
    } > ({});

    const [officerYs, setOfficerYs] = useState < number[] > ([]);
    const [agentYsMap, setAgentYsMap] = useState < {
    [key: number]: number[]
    } > ({});
    const [coords, setCoords] = useState < any > ({});


    const calculate = useCallback(() => {
        if (! containerRef.current) 
            return;
        

        const container = containerRef.current.getBoundingClientRect();

        const getYs = (ref : any) => {
            if (!ref) 
                return [];
            
            const rows = ref.querySelectorAll("[data-row]");
            return Array.from(rows).map((r : any) => {
                const rect = r.getBoundingClientRect();
                return rect.top + rect.height / 2 - container.top;
            });
        };

        setOfficerYs(getYs(officersRef.current));


        if (showAgents && selectedOfficer !== null) {
            const agentRef = agentsRefs.current[selectedOfficer];
            if (agentRef) {
                setAgentYsMap({[selectedOfficer]: getYs(agentRef)});
            }
        }

        if (rolesRef.current && officersRef.current) {
            const r = rolesRef.current.getBoundingClientRect();
            const o = officersRef.current.getBoundingClientRect();

            setCoords((prev : any) => ({
                ...prev,
                rRight: r.right - container.left,
                oLeft: o.left - container.left,
                oRight: o.right - container.left
            }));
        }

        if (showAgents && selectedOfficer !== null && agentsRefs.current[selectedOfficer]) {
            const a = agentsRefs.current[selectedOfficer]!.getBoundingClientRect();

            setCoords((prev : any) => ({
                ...prev,
                aLeft: a.left - container.left
            }));
        }
    }, [showAgents, selectedOfficer]);

    useEffect(() => {
        calculate();
        window.addEventListener("resize", calculate);
        return() => window.removeEventListener("resize", calculate);
    }, [calculate]);


    const handleOfficerClick = (index : number) => {
        if (selectedOfficer === index) {
            setSelectedOfficer(null);
            setShowAgents(false);
        } else {
            setSelectedOfficer(index);
            setShowAgents(true);
        }
    };

    const mid = (a : number, b : number) => (a + b) / 2;


    return (
        <div ref={containerRef}
            className="relative flex justify-center items-start  pt-12">
            <div className="flex gap-24 z-10">
                <div ref={rolesRef}>
                    <DirectoryColumn variant="roles"
                        data={roles}/>
                </div>

                <div ref={officersRef}>
                    <DirectoryColumn variant="officers"
                        data={officers}
                        selectedIndex={selectedOfficer}
                        onItemClick={handleOfficerClick}/>
                </div>


                {
                showAgents && selectedOfficer !== null && (
                    <div ref={
                        (el) => {
                            agentsRefs.current[selectedOfficer] = el;
                        }
                    }>
                        <DirectoryColumn variant="agents"
                            data={
                                officers[selectedOfficer] ?. agents || []
                            }/>
                    </div>
                )
            } </div>


            <svg className="absolute inset-0 pointer-events-none w-full h-full">

                <defs>
                    <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth">
                        <path d="M0,0 L10,5 L0,10 Z" fill="#ffffffff"/>
                    </marker>
                </defs>


                {
                officerYs.length > 0 && (
                    <> {
                        (() => {
                            const spineX = mid(coords.rRight, coords.oLeft);
                            const top = Math.min(...officerYs);
                            const bottom = Math.max(...officerYs);
                            const centerY = mid(top, bottom);

                            return (
                                <>

                                    <circle cx={
                                            coords.rRight
                                        }
                                        cy={centerY}
                                        r="4"
                                        fill="#F3F3F5"/>


                                    <line x1={
                                            coords.rRight
                                        }
                                        y1={centerY}
                                        x2={spineX}
                                        y2={centerY}
                                        stroke="#F3F3F5"
                                        strokeWidth="1"/>


                                    <line x1={spineX}
                                        y1={top}
                                        x2={spineX}
                                        y2={bottom}
                                        stroke="#F3F3F5"
                                        strokeWidth="1"/> {
                                    officerYs.map((y, i) => (
                                        <line key={i}
                                            x1={spineX}
                                            y1={y}
                                            x2={
                                                coords.oLeft
                                            }
                                            y2={y}
                                            stroke="#F3F3F5"
                                            strokeWidth="1"
                                            markerEnd="url(#arrow)"/>
                                    ))
                                } </>
                            );
                        })()
                    } </>
                )
            }


                {
                showAgents && selectedOfficer !== null && agentYsMap[selectedOfficer] ?. length > 0 && (
                    <> {
                        (() => {
                            const agentYs = agentYsMap[selectedOfficer];
                            const spineX = mid(coords.oRight, coords.aLeft);
                            const startY = officerYs[selectedOfficer];
                            const top = Math.min(... agentYs);
                            const bottom = Math.max(... agentYs);

                            return (
                                <>

                                    <circle cx={
                                            coords.oRight
                                        }
                                        cy={startY}
                                        r="4"
                                        fill="#F3F3F5"/>


                                    <line x1={
                                            coords.oRight
                                        }
                                        y1={startY}
                                        x2={spineX}
                                        y2={startY}
                                        stroke="#F3F3F5"
                                        strokeWidth="1"/>


                                    <line x1={spineX}
                                        y1={top}
                                        x2={spineX}
                                        y2={bottom}
                                        stroke="#F3F3F5"
                                        strokeWidth="1"/> {
                                    agentYs.map((y, i) => (
                                        <line key={i}
                                            x1={spineX}
                                            y1={y}
                                            x2={
                                                coords.aLeft
                                            }
                                            y2={y}
                                            stroke="#F3F3F5"
                                            strokeWidth="1"
                                            markerEnd="url(#arrow)"/>
                                    ))
                                } </>
                            );
                        })()
                    } </>
                )
            } </svg>
        </div>
    );
}

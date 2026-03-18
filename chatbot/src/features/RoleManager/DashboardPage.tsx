import GlassCard from "@/components/ui/GlassCard";
import Gauge from "@/components/ui/Gauge";
import CapsuleBar from "@/components/ui/CapsuleBar";
import OutlineCapsuleBar from "@/components/ui/OutlineCapsuleBar";

import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip
} from "recharts";

const lineData = [
    {
        m: "Jan",
        v: 200
    },
    {
        m: "Feb",
        v: 260
    },
    {
        m: "Mar",
        v: 210
    },
    {
        m: "Apr",
        v: 340
    }, 
    {
        m: "May",
        v: 240
    }, {
        m: "Jun",
        v: 290
    }, {
        m: "Jul",
        v: 250
    },
];

const barData = [
    {
        n: "R.O.",
        v: 120
    }, {
        n: "I.O.",
        v: 140
    }, {
        n: "F.O.",
        v: 320
    }, {
        n: "Agents",
        v: 450
    },
];

const compareData = [
    {
        m: "Jan",
        a: 25,
        b: 40
    },
    {
        m: "Feb",
        a: 55,
        b: 38
    },
    {
        m: "Mar",
        a: 40,
        b: 60
    },
    {
        m: "Apr",
        a: 28,
        b: 40
    }, {
        m: "May",
        a: 30,
        b: 38
    },
];

export default function DashboardPage() {
    return (
        <div className="min-h-screen pl-20 pr-12 pt-12 pb-12">
            {/* ===== TOP ROW ===== */}
            <div className="grid grid-cols-3 gap-8">
                {/* Line + Gauge */}
                <GlassCard className="col-span-2 h-[370px] flex">
                    {/* Line chart */}
                    <div className="w-1/2">
                        <h3 className="mb-4 text-white">Agents Onboarding Velocity</h3>

                        <ResponsiveContainer width="95%" height="90%">
                            <LineChart data={lineData}
                                margin={
                                    {
                                        top: 10,
                                        right: 20,
                                        left: 10,
                                        bottom: 10
                                    }
                            }>
                                <CartesianGrid stroke="white"
                                    strokeOpacity={0.18}
                                    strokeDasharray="2 8"
                                    vertical={false}/>

                                <YAxis width={50}
                                    domain={
                                        [0, 500]
                                    }
                                    ticks={
                                        [
                                            0,
                                            100,
                                            200,
                                            300,
                                            400,
                                            500
                                        ]
                                    }
                                    tick={
                                        {fill: "white"}
                                    }
                                    axisLine={false}
                                    tickLine={false}
                                    tickMargin={10}/>
                                <XAxis dataKey="m"
                                    tick={
                                        {fill: "white"}
                                    }
                                    axisLine={false}
                                    tickLine={false}
                                    tickMargin={20}/>
                                <Tooltip contentStyle={
                                        {
                                            background: "rgba(0,0,0,0.8)",
                                            border: "1px solid rgba(255,255,255,0.2)",
                                            borderRadius: "8px",
                                            color: "white"
                                        }
                                    }
                                    cursor={false}/>

                                <Line type="monotone" dataKey="v" stroke="white"
                                    dot={
                                        {r: 5}
                                    }/>
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Gauge */}
                    <div className="w-1/2 flex items-center justify-center">
                        <Gauge value={78}/>
                    </div>
                </GlassCard>

                {/* Workforce */}
                <GlassCard className="h-[370px]">
                    <h3 className="mb-4 text-white">Workforce Structure</h3>

                    <ResponsiveContainer width="95%" height="90%">
                        <BarChart data={barData}>
                            <CartesianGrid stroke="white"
                                strokeOpacity={0.18}
                                strokeDasharray="2 8"
                                vertical={false}/>

                            <YAxis domain={
                                    [0, 500]
                                }
                                ticks={
                                    [
                                        0,
                                        100,
                                        200,
                                        300,
                                        400,
                                        500
                                    ]
                                }
                                tick={
                                    {fill: "white"}
                                }
                                axisLine={false}
                                tickLine={false}
                                tickMargin={10}/>

                            <XAxis dataKey="n"
                                tick={
                                    {fill: "white"}
                                }
                                axisLine={false}
                                tickLine={false}
                                tickMargin={14}/>
                            <Tooltip contentStyle={
                                    {
                                        background: "rgba(0,0,0,0.8)",
                                        border: "1px solid rgba(255,255,255,0.2)",
                                        borderRadius: "8px"
                                    }
                                }
                                cursor={false}/>

                            <Bar dataKey="v" fill="white"
                                shape={<CapsuleBar/>}
                                barSize={40}/>
                        </BarChart>
                    </ResponsiveContainer>
                </GlassCard>
            </div>

            {/* ===== BOTTOM ROW ===== */}
            <div className="grid grid-cols-3 gap-8 mt-8">
                {/* Region velocity */}
                <GlassCard className="h-[370px]">
                    <h3 className="mb-4 text-white">Region Creation Velocity</h3>

                    <ResponsiveContainer width="95%" height="90%">
                        <LineChart data={lineData}
                            margin={
                                {
                                    top: 10,
                                    right: 20,
                                    left: 10,
                                    bottom: 10
                                }
                        }>
                            <CartesianGrid stroke="white"
                                strokeOpacity={0.18}
                                strokeDasharray="2 8"
                                vertical={false}/>

                            <YAxis width={50}
                                domain={
                                    [0, 500]
                                }
                                ticks={
                                    [
                                        0,
                                        100,
                                        200,
                                        300,
                                        400,
                                        500
                                    ]
                                }
                                tick={
                                    {fill: "white"}
                                }
                                axisLine={false}
                                tickLine={false}
                                tickMargin={10}/>
                            <Tooltip contentStyle={
                                    {
                                        background: "rgba(0,0,0,0.8)",
                                        border: "1px solid rgba(255,255,255,0.2)",
                                        borderRadius: "8px",
                                        color: "white"
                                    }
                                }
                                cursor={false}/>

                            <XAxis dataKey="m"
                                tick={
                                    {fill: "white"}
                                }
                                axisLine={false}
                                tickLine={false}
                                tickMargin={14}/>

                            <Line type="monotone" dataKey="v" stroke="white"/>
                        </LineChart>
                    </ResponsiveContainer>
                </GlassCard>

                {/* Compare */}
                <GlassCard className="col-span-2 h-[370px]">
                    <h3 className="mb-4 text-white">
                        Regional Creation Target vs Actual
                    </h3>

                    <ResponsiveContainer width="95%" height="90%">
                        <BarChart data={compareData}
                            barGap={12}
                            barCategoryGap="30%"
                            margin={
                                {
                                    top: 20,
                                    right: 20,
                                    left: 10,
                                    bottom: 10
                                }
                        }>
                            <CartesianGrid stroke="white"
                                strokeOpacity={0.18}
                                strokeDasharray="2 8"
                                vertical={false}/>

                            <YAxis width={50}
                                domain={
                                    [0, 100]
                                }
                                ticks={
                                    [
                                        0,
                                        20,
                                        40,
                                        60,
                                        80,
                                        100
                                    ]
                                }
                                tick={
                                    {
                                        fill: "white",
                                        fontSize: 11
                                    }
                                }
                                axisLine={false}
                                tickLine={false}
                                tickMargin={10}
                                interval={0}
                                allowDecimals={false}
                                padding={
                                    {
                                        top: 10,
                                        bottom: 0
                                    }
                                }/>

                            <Tooltip contentStyle={
                                    {
                                        background: "rgba(0,0,0,0.8)",
                                        border: "1px solid rgba(255,255,255,0.2)",
                                        borderRadius: "8px",
                                        color: "white"
                                    }
                                }
                                cursor={false}/>

                            <XAxis dataKey="m"
                                tick={
                                    {
                                        fill: "white",
                                        fontSize: 11
                                    }
                                }
                                axisLine={false}
                                tickLine={false}
                                tickMargin={14}/>

                            <Bar dataKey="a"
                                shape={<OutlineCapsuleBar/>}
                                barSize={40}/>
                            <Bar dataKey="b" fill="white"
                                shape={<CapsuleBar/>}
                                barSize={40}/>
                        </BarChart>
                    </ResponsiveContainer>
                </GlassCard>
            </div>
        </div>
    );
}

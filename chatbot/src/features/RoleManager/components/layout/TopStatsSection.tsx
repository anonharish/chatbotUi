// import GlassCard from "@/components/ui/GlassCard";
// import Gauge from "@/components/ui/Gauge";
// import CapsuleBar from "@/components/ui/CapsuleBar";
// import { lineData, barData } from "@/data/directoryData";

// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   ResponsiveContainer,
// } from "recharts";



// export default function TopGraphsSection() {
//   return (
//     <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

//       {/* ================= DESKTOP: LINE + GAUGE ================= */}
//       <GlassCard className="
//         xl:col-span-2
//         h-auto xl:h-[360px]
//         hidden xl:flex
//         flex-row
//         overflow-hidden
//       ">
//         {/* Line */}
//         <div className="w-1/2 px-6 pt-6 pb-4">
//           <h3 className="text-white text-sm font-medium mb-4 tracking-wide">
//             Agents Onboarding Velocity
//           </h3>

//           <div className="h-[260px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart
//                 data={lineData}
//                 margin={{ top: 5, right: 20, left: 20, bottom: 25 }}
//               >
//                 <CartesianGrid
//                   stroke="white"
//                   strokeOpacity={0.12}
//                   strokeDasharray="2 8"
//                   vertical={false}
//                 />
//                 <YAxis
//                   domain={[0, 500]}
//                   ticks={[0, 100, 200, 300, 400, 500]}
//                   tick={{ fill: "white", fontSize: 11 }}
//                   axisLine={false}
//                   tickLine={false}
//                   width={45}
//                 />
//                 <XAxis
//   dataKey="m"
//   tick={{ fill: "white", fontSize: 11 }}
//   axisLine={false}
//   tickLine={false}
//   minTickGap={20}
//   padding={{ left: 15, right: 10 }}
//   tickMargin={14}
//   height={40}
// />
//                 <Line
//                   type="monotone"
//                   dataKey="v"
//                   stroke="white"
//                   strokeWidth={2}
//                   dot={{ r: 4, fill: "white" }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div className="w-[1px] bg-white/15 my-8" />

//         {/* Gauge */}
//         <div className="w-1/2 flex items-center justify-center">
//           <Gauge value={78} />
//         </div>
//       </GlassCard>

//       {/* ================= DESKTOP WORKFORCE ================= */}
//       <GlassCard className="hidden xl:block h-[360px] px-6 pt-6 pb-4">
//         <h3 className="text-white text-sm font-medium mb-4 tracking-wide">
//           Workforce Structure
//         </h3>

//         <div className="h-[260px]">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart
//               data={barData}
//               margin={{ top: 10, right: 10, left: 5, bottom: 5 }}
//               barCategoryGap="25%"
//             >
//               <CartesianGrid
//                 stroke="white"
//                 strokeOpacity={0.12}
//                 strokeDasharray="2 8"
//                 vertical={false}
//               />
//               <YAxis
//                 domain={[0, 500]}
//                 ticks={[0, 100, 200, 300, 400, 500]}
//                 tick={{ fill: "white", fontSize: 11 }}
//                 axisLine={false}
//                 tickLine={false}
//                 width={32}
//               />
//               <XAxis
//                 dataKey="n"
//                 tick={{ fill: "white", fontSize: 11 }}
//                 axisLine={false}
//                 tickLine={false}
//                 tickMargin={14}
//                 height={40}
//               />
//               <Bar
//                 dataKey="v"
//                 fill="white"
//                 shape={<CapsuleBar />}
//                 barSize={36}
//                 radius={[20, 20, 20, 20]}
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </GlassCard>

//       {/* ================= TABLET + MOBILE ================= */}

//       {/* Line Chart Full Width */}
//       <GlassCard className="xl:hidden px-6 pt-6 pb-4">
//         <h3 className="text-white text-sm font-medium mb-4 tracking-wide">
//           Agents Onboarding Velocity
//         </h3>

//         <div className="h-[240px]">
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart
//               data={lineData}
//               margin={{ top: 5, right: 20, left: 20, bottom: 25 }}
//             >
//               <CartesianGrid
//                 stroke="white"
//                 strokeOpacity={0.12}
//                 strokeDasharray="2 8"
//                 vertical={false}
//               />
//               <YAxis
//                 domain={[0, 500]}
//                 ticks={[0, 100, 200, 300, 400, 500]}
//                 tick={{ fill: "white", fontSize: 11 }}
//                 axisLine={false}
//                 tickLine={false}
//                 width={45}
//               />
//               <XAxis
//                 dataKey="m"
//                 tick={{ fill: "white", fontSize: 11 }}
//                 axisLine={false}
//                 tickLine={false}
//                 minTickGap={20}
//                 padding={{ left: 15, right: 10 }}
//                   tickMargin={14}

//               />
//               <Line
//                 type="monotone"
//                 dataKey="v"
//                 stroke="white"
//                 strokeWidth={2}
//                 dot={{ r: 4, fill: "white" }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </GlassCard>

// {/* Gauge + Workforce (Tablet & Mobile) */}
// <div className="xl:hidden grid grid-cols-1 md:grid-cols-10 gap-6 items-stretch">

//   {/* Gauge */}
//   <div className="md:col-span-3 flex">
//     <GlassCard className="flex-1 p-6 flex items-center justify-center h-[320px]">
//       <div className="w-full max-w-[280px] aspect-[325/294]">
//         <Gauge value={78} />
//       </div>
//     </GlassCard>
//   </div>

//   {/* Workforce */}
//   <div className="md:col-span-7 flex">
//     <GlassCard className="flex-1 p-6 flex flex-col h-[320px]">

//       <h3 className="text-white text-sm font-medium mb-4">
//         Workforce Structure
//       </h3>

//       <div className="flex-1">
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart data={barData}>
//             <CartesianGrid
//               stroke="white"
//               strokeOpacity={0.12}
//               strokeDasharray="2 8"
//               vertical={false}
//             />
//             <YAxis
//               domain={[0, 500]}
//               ticks={[0, 100, 200, 300, 400, 500]}
//               tick={{ fill: "white", fontSize: 11 }}
//               axisLine={false}
//               tickLine={false}
//               width={32}
//             />
//             <XAxis
//               dataKey="n"
//               tick={{ fill: "white", fontSize: 11 }}
//               axisLine={false}
//               tickLine={false}
//                 tickMargin={14}

//             />
//             <Bar
//               dataKey="v"
//               fill="white"
//               shape={<CapsuleBar />}
//               barSize={30}
//             />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//     </GlassCard>
//   </div>

// </div>
// </div>
//   );
// }

import GlassCard from "@/components/ui/GlassCard";
import Gauge from "@/components/ui/Gauge";
import CapsuleBar from "@/components/ui/CapsuleBar";
import { lineData, barData } from "@/data/directoryData";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function TopGraphsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* ================= DESKTOP: LINE + GAUGE ================= */}
      <GlassCard
        className="
        lg:col-span-2
        min-h-[360px]
        hidden lg:flex
        flex-row
        overflow-hidden
      "
      >
        {/* Line Chart */}
        <div className="w-1/2 px-6 pt-6 pb-4">
          <h3 className="text-white text-sm font-medium mb-4 tracking-wide">
            Agents Onboarding Velocity
          </h3>

          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={lineData}
                margin={{ top: 5, right: 20, left: 20, bottom: 25 }}
              >
                <CartesianGrid
                  stroke="white"
                  strokeOpacity={0.12}
                  strokeDasharray="2 8"
                  vertical={false}
                />

                <YAxis
                  domain={[0, 500]}
                  ticks={[0, 100, 200, 300, 400, 500]}
                  tick={{ fill: "white", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={45}
                />

                <XAxis
                  dataKey="m"
                  tick={{ fill: "white", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={20}
                  padding={{ left: 15, right: 10 }}
                  tickMargin={14}
                  height={40}
                />

                <Line
                  type="monotone"
                  dataKey="v"
                  stroke="white"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "white" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Divider */}
        <div className="w-[1px] bg-white/15 my-8" />

        {/* Gauge */}
        <div className="w-1/2 flex items-center justify-center">
          <Gauge value={78} />
        </div>
      </GlassCard>

      {/* ================= DESKTOP WORKFORCE ================= */}
      <GlassCard className="hidden lg:block min-h-[360px] px-6 pt-6 pb-4">
        <h3 className="text-white text-sm font-medium mb-4 tracking-wide">
          Workforce Structure
        </h3>

        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{ top: 10, right: 10, left: 5, bottom: 5 }}
              barCategoryGap="25%"
            >
              <CartesianGrid
                stroke="white"
                strokeOpacity={0.12}
                strokeDasharray="2 8"
                vertical={false}
              />

              <YAxis
                domain={[0, 500]}
                ticks={[0, 100, 200, 300, 400, 500]}
                tick={{ fill: "white", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={32}
              />

              <XAxis
                dataKey="n"
                tick={{ fill: "white", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickMargin={14}
                height={40}
              />

              <Bar
                dataKey="v"
                fill="white"
                shape={<CapsuleBar />}
                barSize={36}
                radius={[20, 20, 20, 20]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* ================= TABLET + MOBILE ================= */}

      {/* Line Chart */}
      <GlassCard className="lg:hidden px-6 pt-6 pb-4">
        <h3 className="text-white text-sm font-medium mb-4 tracking-wide">
          Agents Onboarding Velocity
        </h3>

        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={lineData}
              margin={{ top: 5, right: 20, left: 20, bottom: 25 }}
            >
              <CartesianGrid
                stroke="white"
                strokeOpacity={0.12}
                strokeDasharray="2 8"
                vertical={false}
              />

              <YAxis
                domain={[0, 500]}
                ticks={[0, 100, 200, 300, 400, 500]}
                tick={{ fill: "white", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={45}
              />

              <XAxis
                dataKey="m"
                tick={{ fill: "white", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                minTickGap={20}
                padding={{ left: 15, right: 10 }}
                tickMargin={14}
              />

              <Line
                type="monotone"
                dataKey="v"
                stroke="white"
                strokeWidth={2}
                dot={{ r: 4, fill: "white" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Gauge + Workforce */}
      {/* Gauge + Workforce */}
<div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">

  {/* Gauge */}
  <div className="flex justify-center items-center">
    <GlassCard className="w-full max-w-[340px] p-6 flex items-center justify-center min-h-[320px]">
      <div className="w-full max-w-[280px] aspect-[325/294] flex items-center justify-center">
        <Gauge value={78} />
      </div>
    </GlassCard>
  </div>

  {/* Workforce */}
  <div className="flex">
    <GlassCard className="flex-1 p-6 flex flex-col min-h-[320px]">
      <h3 className="text-white text-sm font-medium mb-4">
        Workforce Structure
      </h3>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData}>
            <CartesianGrid
              stroke="white"
              strokeOpacity={0.12}
              strokeDasharray="2 8"
              vertical={false}
            />

            <YAxis
              domain={[0, 500]}
              ticks={[0, 100, 200, 300, 400, 500]}
              tick={{ fill: "white", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={32}
            />

            <XAxis
              dataKey="n"
              tick={{ fill: "white", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickMargin={14}
            />

            <Bar
              dataKey="v"
              fill="white"
              shape={<CapsuleBar />}
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  </div>

</div>
    </div>
  );
}
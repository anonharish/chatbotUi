import BigVelocityCard from "@/components/dashboard/BigVelocityCard";
import WorkforceCard from "@/components/dashboard/WorkforceCard";
import RegionVelocityCard from "@/components/dashboard/RegionVelocityCard";
import TargetActualCard from "@/components/dashboard/TargetActualCard";

const velocity = [
  { m: "Jan", v: 120 },
  { m: "Feb", v: 180 },
  { m: "Mar", v: 140 },
  { m: "Apr", v: 260 },
  { m: "May", v: 170 },
  { m: "Jun", v: 210 },
  { m: "Jul", v: 190 },
];

const workforce = [
  { name: "R.O", v: 120 },
  { name: "I.O", v: 130 },
  { name: "F.O", v: 300 },
  { name: "Agents", v: 450 },
];

const compare = [
  { m: "Jan", t: 30, a: 40 },
  { m: "Feb", t: 60, a: 40 },
  { m: "Mar", t: 40, a: 60 },
  { m: "Apr", t: 30, a: 40 },
  { m: "May", t: 30, a: 40 },
];

const radial = [{ name: "KYC", value: 78 }];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white p-10 space-y-10">

      {/* ================= FIRST ROW ================= */}
      <div className="grid gap-10 xl:grid-cols-[842px_431px]">
        <BigVelocityCard velocity={velocity} radial={radial} />
        <WorkforceCard workforce={workforce} />
      </div>

      {/* ================= SECOND ROW ================= */}
      <div className="grid gap-10 xl:grid-cols-[513px_760px]">
        <RegionVelocityCard velocity={velocity} />
        <TargetActualCard compare={compare} />
      </div>

    </div>
  );
}

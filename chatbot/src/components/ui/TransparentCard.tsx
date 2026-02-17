import React from "react";
import { CartesianGrid } from "recharts";

export default function TransparentCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
    <div
      className="
        flex gap-8
        px-12 py-6
        rounded-full
        backdrop-blur-3xl
        bg-white/10
        border border-white/30
        shadow-xl
      "
      
      style={{
        boxShadow:
          "inset 0 0 20px rgba(255,255,255,0.2), 0 20px 40px rgba(0,0,0,0.4)",
      }}
    >
      <CartesianGrid
  stroke="white"
  strokeOpacity={0.15}
  strokeDasharray="4 6"
/>

      {children}
    </div>
  );
}

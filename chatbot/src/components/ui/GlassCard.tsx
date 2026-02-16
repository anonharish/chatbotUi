export default function GlassCard({
  children,
  className = "",
  variant = "blue",
}: any) {
  const styles =
    variant === "green"
      ? "bg-gradient-to-b from-green-700/80 to-green-900/80"
      : "bg-white/10";

  return (
    <div
      className={`
        rounded-[32px]
        backdrop-blur-2xl
        border border-white/30
        shadow-[0_20px_60px_rgba(0,0,0,0.25)]
        p-6 text-white
        ${styles}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

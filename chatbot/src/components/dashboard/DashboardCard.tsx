export default function DashboardCard({ children, className = "" }: any) {
  return (
    <div
      className={`
        bg-white
        rounded-[40px]
        border border-gray-200
        shadow-[0_12px_35px_rgba(0,0,0,0.06)]
        px-6 py-5
        ${className}
      `}
    >
      {children}
    </div>
  );
}

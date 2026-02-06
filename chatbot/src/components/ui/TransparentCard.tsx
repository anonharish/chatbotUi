import React from "react";

interface TransparentCardProps {
  children: React.ReactNode;
  className?: string;
}

const TransparentCard: React.FC<TransparentCardProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`
        backdrop-blur-xl
        bg-white/10
        border border-white/30
        shadow-xl
        rounded-[60px]
        px-8 py-6
        flex items-center justify-center
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default TransparentCard;

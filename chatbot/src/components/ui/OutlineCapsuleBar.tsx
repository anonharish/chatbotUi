import React from "react";


const OutlineCapsuleBar = (props: any) => {
  const { x, y, width, height } = props;

  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={width / 2}
      ry={width / 2}
      fill="transparent"
      stroke="white"
      strokeWidth={3}
    />
  );
};

export default OutlineCapsuleBar;

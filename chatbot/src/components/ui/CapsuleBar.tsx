
const CapsuleBar = (props: any) => {
  const { x, y, width, height, fill } = props;

  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={width / 2}
      ry={width / 2}
      fill={fill}
    />
  );
};

export default CapsuleBar;

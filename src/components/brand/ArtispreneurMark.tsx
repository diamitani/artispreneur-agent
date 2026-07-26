type Variant = "color" | "reversed" | "mono-white";

const LEFT_LEAVES: Array<[number, number, number]> = [
  [158, 115, -72],
  [125, 158, -52],
  [103, 205, -32],
  [92, 255, -10],
  [95, 305, 15],
  [110, 350, 40],
  [140, 388, 62],
  [180, 412, 80],
];

export function ArtispreneurMark({
  size = 64,
  variant = "color",
  className = "",
}: {
  size?: number;
  variant?: Variant;
  className?: string;
}) {
  const id = `lm-${variant}-${size}`;
  const aColor =
    variant === "color" ? "#CC0000" : variant === "reversed" ? "#FED001" : "#FFFFFF";
  const goldStops =
    variant === "mono-white" ? ["#FFFFFF", "#FFFFFF", "#FFFFFF"] : ["#FEE55E", "#FED001", "#D4AC00"];
  const veinColor = variant === "mono-white" ? "rgba(255,255,255,0.35)" : "#D4AC00";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Artispreneur"
      className={className}
    >
      <defs>
        <linearGradient id={`${id}-gold`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={goldStops[0]} />
          <stop offset="55%" stopColor={goldStops[1]} />
          <stop offset="100%" stopColor={goldStops[2]} />
        </linearGradient>
        <symbol id={`${id}-leaf`} viewBox="-30 -12 60 24" overflow="visible">
          <path
            d="M -28 0 Q -14 -11 14 -8 Q 26 -4 28 0 Q 26 4 14 8 Q -14 11 -28 0 Z"
            fill={`url(#${id}-gold)`}
          />
          <path
            d="M -26 0 L 26 0"
            stroke={veinColor}
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity={0.4}
          />
        </symbol>
      </defs>
      <g>
        {LEFT_LEAVES.map(([x, y, rot], i) => (
          <use key={`L${i}`} href={`#${id}-leaf`} x={x} y={y} transform={`rotate(${rot} ${x} ${y})`} />
        ))}
      </g>
      <g>
        {LEFT_LEAVES.map(([x, y, rot], i) => {
          const mx = 500 - x;
          return (
            <use key={`R${i}`} href={`#${id}-leaf`} x={mx} y={y} transform={`rotate(${-rot} ${mx} ${y})`} />
          );
        })}
      </g>
      <text
        x="250"
        y="345"
        textAnchor="middle"
        fontFamily="Libre Baskerville, Georgia, serif"
        fontWeight="900"
        fontSize="290"
        fill={aColor}
        letterSpacing="-4"
      >
        A
      </text>
    </svg>
  );
}

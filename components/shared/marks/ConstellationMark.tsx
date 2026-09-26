import { cn } from "@/lib/utils"

const HOME: [number, number][] = [
  [33, 76], [33, 55], [33, 39.5], [33, 24], [43.15, 39.5], [53.3, 55], [67, 76],
]
const EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [1, 5],
]

export default function ConstellationMark({ size = 64, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      role="img"
      aria-label="Isaac Adjei"
      className={cn("ia-constellation text-foreground", className)}
    >
      <g className="cn-edges">
        {EDGES.map(([a, b], i) => (
          <line
            key={i}
            x1={HOME[a][0]}
            y1={HOME[a][1]}
            x2={HOME[b][0]}
            y2={HOME[b][1]}
            pathLength={100}
            style={{ "--i": i } as React.CSSProperties}
          />
        ))}
      </g>
      <g className="cn-nodes">
        {HOME.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={3.6}
            className={i === 1 || i === 5 ? "cn-ac" : undefined}
            style={{ "--i": i } as React.CSSProperties}
          />
        ))}
      </g>
    </svg>
  )
}

import { TrendIndicator } from "./TrendIndicator"

function StatCardSparkline({ data }: { data: number[] }) {
  const VW = 64
  const VH = 20
  const pts = data.length === 0 ? [0, 0] : data.length === 1 ? [data[0], data[0]] : data
  const min = Math.min(...pts)
  const max = Math.max(...pts)
  const range = max - min || 1
  const step = VW / (pts.length - 1)
  const coords = pts.map((v, i) => [i * step, VH - ((v - min) / range) * VH] as const)
  const line = coords.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(2)}`).join(" ")
  const area = `0,${VH} ${line} ${VW},${VH}`
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="none" className="block h-5 w-16 shrink-0 overflow-visible text-primary" aria-hidden>
      <polygon points={area} fill="currentColor" fillOpacity={0.15} />
      <polyline
        points={line}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

export function StatCard({
  label,
  value,
  trend,
  accentClassName,
  scope,
  sparkline,
}: {
  label: string
  value: string | number
  trend?: { delta: number; label?: string }
  accentClassName?: string
  scope?: "all-time" | "current"
  sparkline?: number[]
}) {
  return (
    <div className={`border border-border rounded-lg p-4 bg-card ${accentClassName ?? ""}`}>
      <div className="flex items-center gap-1.5">
        <p className="text-xs text-muted-foreground">{label}</p>
        {scope && (
          <span className="text-[9px] uppercase tracking-wide text-muted-foreground/70 border border-border/50 rounded px-1 leading-tight">
            {scope}
          </span>
        )}
      </div>
      <div className="flex items-end justify-between gap-2 mt-1">
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold">{value}</p>
          {trend && <TrendIndicator delta={trend.delta} label={trend.label} />}
        </div>
        {sparkline && sparkline.length >= 2 && <StatCardSparkline data={sparkline} />}
      </div>
    </div>
  )
}

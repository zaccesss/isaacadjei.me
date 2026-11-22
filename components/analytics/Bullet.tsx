"use client"

export function Bullet({
  label,
  value,
  target,
  max,
  valueFormatter,
}: {
  label: string
  value: number
  target: number
  max?: number
  valueFormatter?: (value: number) => string
}) {
  const ceiling = max ?? (Math.max(value, target) * 1.1 || 1)
  const valuePct = Math.min((value / ceiling) * 100, 100)
  const targetPct = Math.min((target / ceiling) * 100, 100)
  const onTarget = value >= target
  const format = valueFormatter ?? ((v: number) => v.toLocaleString("en-GB"))

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-sm">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums text-muted-foreground">
          {format(value)} of {format(target)} target, <span className="font-medium text-foreground">{onTarget ? "on target" : "behind"}</span>
        </span>
      </div>
      <div className="relative h-4 rounded-sm bg-muted" aria-hidden>
        <div className={`h-full rounded-sm ${onTarget ? "bg-emerald-700 dark:bg-emerald-400" : "bg-amber-600 dark:bg-amber-400"}`} style={{ width: `${valuePct}%` }} />
        <div className="absolute top-[-2px] h-[calc(100%+4px)] w-[2px] bg-foreground" style={{ left: `${targetPct}%` }} />
      </div>
    </div>
  )
}

import { cn } from "@/lib/utils"

const BANDS = [
  { from: 80, word: "On track", bar: "bg-emerald-700 dark:bg-emerald-400" },
  { from: 50, word: "Getting there", bar: "bg-amber-600 dark:bg-amber-400" },
  { from: 0, word: "Needs attention", bar: "bg-red-700 dark:bg-red-400" },
]

export function Meter({
  value,
  label,
  valueFormatter,
  bands = true,
  className,
}: {
  value: number
  label?: string
  height?: number
  valueFormatter?: (value: number) => string
  bands?: boolean
  className?: string
}) {
  const clamped = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0))
  const band = BANDS.find((b) => clamped >= b.from) ?? BANDS[BANDS.length - 1]
  const figure = valueFormatter ? valueFormatter(clamped) : `${Math.round(clamped)}%`
  return (
    <div className={cn("space-y-2", className)}>
      <p className="flex flex-wrap items-baseline gap-x-2">
        <span className="text-3xl font-semibold tabular-nums">{figure}</span>
        {label && <span className="text-sm text-muted-foreground">{label}</span>}
      </p>
      <div
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(clamped)}
        aria-valuetext={`${figure}${bands ? `, ${band.word.toLowerCase()}` : ""}`}
        aria-label={label ?? "Progress"}
        className="h-2.5 rounded-sm bg-muted"
      >
        <div className={cn("h-full rounded-sm", bands ? band.bar : "bg-primary")} style={{ width: `${clamped}%` }} />
      </div>
      {bands && <p className="text-sm font-medium">{band.word}</p>}
    </div>
  )
}

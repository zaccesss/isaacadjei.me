import { cn } from "@/lib/utils"

const BANDS = [
  { from: 80, word: "On track", stroke: "stroke-emerald-700 dark:stroke-emerald-400" },
  { from: 50, word: "Getting there", stroke: "stroke-amber-600 dark:stroke-amber-400" },
  { from: 0, word: "Needs attention", stroke: "stroke-red-700 dark:stroke-red-400" },
]

const ARC = "M 16 100 A 84 84 0 0 1 184 100"

export function Gauge({
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
    <div
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      aria-valuetext={`${figure}${bands ? `, ${band.word.toLowerCase()}` : ""}`}
      aria-label={label ?? "Progress"}
      className={cn("mx-auto flex w-full max-w-[240px] flex-col items-center", className)}
    >
      <div className="relative w-full">
        <svg viewBox="0 0 200 108" className="block w-full" aria-hidden="true">
          <path d={ARC} fill="none" stroke="hsl(var(--border))" strokeWidth={16} strokeLinecap="round" />
          {clamped > 0 && (
            <path
              d={ARC}
              fill="none"
              pathLength={100}
              strokeDasharray={`${clamped} 100`}
              strokeWidth={16}
              strokeLinecap="round"
              className={bands ? band.stroke : "stroke-primary"}
            />
          )}
        </svg>
        <span className="absolute inset-x-0 bottom-1 text-center text-3xl font-semibold tabular-nums">{figure}</span>
      </div>
      {label && <span className="mt-2 text-center text-sm text-muted-foreground">{label}</span>}
      {bands && <span className="mt-0.5 text-center text-sm font-medium">{band.word}</span>}
    </div>
  )
}

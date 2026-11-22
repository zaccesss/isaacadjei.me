export function ProgressBar({
  value,
  max = 100,
  label,
  colorClassName = "bg-primary",
}: {
  value: number
  max?: number
  label?: string
  colorClassName?: string
}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div className="flex items-center gap-2">
      {label && <span className="w-20 shrink-0 text-xs text-muted-foreground">{label}</span>}
      <div className="h-1.5 flex-1 rounded-full bg-muted" aria-hidden>
        <div className={`${colorClassName} h-1.5 rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-10 text-right text-xs font-semibold tabular-nums">{pct}%</span>
    </div>
  )
}

import { ArrowUp, ArrowDown, Minus } from "lucide-react"

export function TrendIndicator({ delta, label }: { delta: number; label?: string }) {
  if (delta === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground">
        <Minus aria-hidden className="h-3 w-3" />
        <span className="sr-only">No change, </span>
        {label ?? "0%"}
      </span>
    )
  }
  const positive = delta > 0
  const Icon = positive ? ArrowUp : ArrowDown
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${positive ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
      <Icon aria-hidden className="h-3 w-3" />
      <span className="sr-only">{positive ? "Up " : "Down "}</span>
      {label ?? `${Math.abs(delta)}%`}
    </span>
  )
}

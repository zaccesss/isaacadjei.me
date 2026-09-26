import { cn } from "@/lib/utils"

export default function BrailleDivider({ className }: { className?: string }) {
  const cols = [8, 20, 44, 56]
  const rows = [10, 22, 34]
  const raised: [number, number][] = [[0, 1], [1, 0], [2, 0]]
  const isRaised = (c: number, r: number) => raised.some(([rc, rr]) => rc === c && rr === r)
  return (
    <div className={cn("flex items-center gap-3 text-muted-foreground/50", className)} aria-hidden="true">
      <span className="h-px flex-1 bg-current opacity-40" />
      <svg width="34" height="16" viewBox="0 0 64 44" fill="none" className="ia-braille shrink-0">
        {cols.map((cx, c) =>
          rows.map((cy, r) => {
            const on = isRaised(c, r)
            return (
              <circle
                key={`${c}-${r}`}
                cx={cx}
                cy={cy}
                r={on ? 4.6 : 1.8}
                className={on ? "br-dot" : "br-ghost"}
                style={on ? ({ "--d": `${(raised.findIndex(([rc, rr]) => rc === c && rr === r) * 0.28).toFixed(2)}s` } as React.CSSProperties) : undefined}
              />
            )
          })
        )}
      </svg>
      <span className="h-px flex-1 bg-current opacity-40" />
    </div>
  )
}

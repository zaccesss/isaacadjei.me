"use client"

import EmptyState from "@/components/shared/EmptyState"
import { chartVar } from "@/lib/ui/chart-palette"

export interface FunnelStage {
  name: string
  value: number
}

export function Funnel({
  stages,
  colours,
  valueFormatter,
}: {
  stages: FunnelStage[]
  colours?: string[]
  valueFormatter?: (value: number) => string
}) {
  if (!stages.length || stages[0].value === 0) {
    return <EmptyState title="No data for this period" description="The funnel fills in once the first stage has entries." className="py-8" />
  }
  const max = stages[0].value
  const format = valueFormatter ?? ((v: number) => v.toLocaleString("en-GB"))
  const colour = colours?.[0] ?? chartVar("chart-1")

  return (
    <ol className="flex flex-col gap-2">
      {stages.map((stage, i) => {
        const widthPct = max > 0 ? Math.min(100, Math.max((stage.value / max) * 100, stage.value > 0 ? 4 : 0)) : 0
        const prev = i > 0 ? stages[i - 1].value : null
        const dropPct = prev && prev > 0 ? Math.round(((prev - stage.value) / prev) * 1000) / 10 : null
        return (
          <li key={stage.name} className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium">{stage.name}</span>
              <span className="tabular-nums text-muted-foreground">{format(stage.value)}</span>
            </div>
            <div className="h-5 rounded-sm bg-muted" aria-hidden>
              <div className="h-full rounded-sm" style={{ width: `${widthPct}%`, backgroundColor: colour }} />
            </div>
            {dropPct !== null && dropPct > 0 && <p className="text-xs text-muted-foreground">-{dropPct}% from previous stage</p>}
          </li>
        )
      })}
    </ol>
  )
}

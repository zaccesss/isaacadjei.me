"use client"

import type { ReactNode } from "react"
import type { PlacedMarker } from "@/lib/stats-milestone-place"
import { dayName } from "@/lib/stats-helpers"

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-semibold leading-none text-background tabular-nums">
      {children}
    </span>
  )
}

export function ChartMarkers({
  markers,
  count,
  axis,
  top = 6,
  bottom = 30,
  children,
}: {
  markers: PlacedMarker[]
  count: number
  axis: "point" | "band"
  top?: number
  bottom?: number
  children: ReactNode
}) {
  if (markers.length === 0 || count === 0) return <>{children}</>
  const at = (i: number) => (axis === "band" ? (i + 0.5) / count : count === 1 ? 0.5 : i / (count - 1))
  const left = (i: number) => `calc(8px + ${at(i).toFixed(4)} * (100% - 16px))`
  return (
    <div>
      <div className="relative">
        {children}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {markers.map((m) => (
            <span key={m.index} className="absolute border-l border-dashed border-foreground/70" style={{ left: left(m.index), top, bottom }} />
          ))}
        </div>
      </div>
      <div aria-hidden className="relative h-5 mt-1">
        {markers.map((m) => (
          <span key={m.index} className="absolute top-0 -translate-x-1/2" style={{ left: left(m.index) }}>
            <Badge>{m.items.map((x) => x.n).join(",")}</Badge>
          </span>
        ))}
      </div>
      <ol className="mt-2 space-y-1 text-xs text-muted-foreground" aria-label="Launches on this chart">
        {markers.flatMap((m) => m.items).map((x) => (
          <li key={x.n} className="flex items-start gap-2">
            <span aria-hidden><Badge>{x.n}</Badge></span>
            <span><span className="font-medium text-foreground">{dayName(x.date)}:</span> {x.detail}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

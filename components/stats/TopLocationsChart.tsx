"use client"

import { useEffect, useState } from "react"
import { BarChart, ChartFrame, tableOf } from "@/components/analytics"

type LocationPoint = { location: string; count: number }

export default function TopLocationsChart() {
  const [points, setPoints] = useState<LocationPoint[] | null>(null)

  useEffect(() => {
    fetch("/api/stats/applications-locations")
      .then((r) => (r.ok ? r.json() : { points: [], remoteCount: 0 }))
      .then((d) => setPoints([...(d.points ?? []), ...(d.remoteCount ? [{ location: "Remote", count: d.remoteCount }] : [])]))
      .catch(() => setPoints([]))
  }, [])

  if (points === null) {
    return <div className="h-56 rounded-2xl border border-border/60 bg-card p-5" aria-busy="true" />
  }

  const top = [...points].sort((a, b) => b.count - a.count).slice(0, 10).map((p) => ({ name: p.location, value: p.count }))

  return (
    <ChartFrame className="rounded-2xl border border-border/60 bg-card p-5" title="Top 10 cities" unit="opportunities tracked" table={top.length ? tableOf(top, ["City", "Opportunities"]) : undefined} empty={!top.length} emptyTitle="No cities yet" emptyDescription="Cities appear once tracked opportunities have a location.">
      <BarChart data={top} dataKey="value" xKey="name" layout="horizontal" name="Opportunities" valueFormatter={(v) => `${v} opportunit${v === 1 ? "y" : "ies"} tracked`} />
    </ChartFrame>
  )
}

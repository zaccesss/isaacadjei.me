"use client"

import { useEffect, useState } from "react"
import { BarChart, ChartFrame, tableOf } from "@/components/analytics"
import type { GitHubStats } from "@/app/api/github-stats/route"

export default function GitHubYearlyChart() {
  const [years, setYears] = useState<{ year: number; total: number }[] | null>(null)

  useEffect(() => {
    fetch("/api/github-stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: GitHubStats | null) => setYears(d?.contributions?.years ?? []))
      .catch(() => setYears([]))
  }, [])

  if (years === null) {
    return <div className="h-40 rounded-2xl border border-border/60 bg-card p-5" aria-busy="true" />
  }

  if (years.length === 0) return null
  if (years.length === 1) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-5">
        <p className="text-base font-semibold">Contributions by year</p>
        <p className="mt-1 text-sm text-muted-foreground">{years[0].total.toLocaleString("en-GB")} contributions in {years[0].year}.</p>
      </div>
    )
  }
  const rows = years.map((y) => ({ name: String(y.year), value: y.total }))

  return (
    <ChartFrame className="rounded-2xl border border-border/60 bg-card p-5" title="Contributions by year" unit="contributions" table={tableOf(rows, ["Year", "Contributions"])}>
      <BarChart data={rows} dataKey="value" xKey="name" height={180} name="Contributions" valueFormatter={(v) => v.toLocaleString("en-GB")} />
    </ChartFrame>
  )
}

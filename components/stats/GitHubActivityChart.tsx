"use client"

import { useEffect, useState } from "react"
import { ChartFrame, Composed, seriesTable, useAnalyticsPeriod, filterByPeriod } from "@/components/analytics"
import EmptyState from "@/components/shared/EmptyState"
import { ukShortDate } from "@/lib/time/short-date"
import type { GitHubStats } from "@/app/api/github-stats/route"

export default function GitHubActivityChart() {
  const { period } = useAnalyticsPeriod()
  const [days, setDays] = useState<{ date: string; count: number }[] | null>(null)

  useEffect(() => {
    fetch("/api/github-stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: GitHubStats | null) => setDays(d?.contributions?.days ?? []))
      .catch(() => setDays([]))
  }, [])

  if (days === null) {
    return <div className="h-56 rounded-2xl border border-border/60 bg-card p-5" aria-busy="true" />
  }

  const filtered = filterByPeriod(days, period, (d) => d.date)
  const data = filtered.reduce<{ name: string; contributions: number; cumulative: number }[]>((acc, d) => {
    const prevCumulative = acc.length ? acc[acc.length - 1].cumulative : 0
    acc.push({ name: ukShortDate(d.date), contributions: d.count, cumulative: prevCumulative + d.count })
    return acc
  }, [])

  const series = [{ key: "contributions", name: "Contributions" }, { key: "cumulative", name: "Cumulative" }]
  return (
    <ChartFrame className="rounded-2xl border border-border/60 bg-card p-5" title="Daily activity" unit="contributions per day and running total" table={data.length ? seriesTable(data, "Day", series) : undefined} empty={!data.length} emptyTitle="No contributions in this period" emptyDescription="Pick a longer period to see more days.">
      <Composed data={data} barKey="contributions" lineKey="cumulative" barName="Contributions" lineName="Cumulative" height={220} />
    </ChartFrame>
  )
}

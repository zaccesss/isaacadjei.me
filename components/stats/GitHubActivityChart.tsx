"use client"

import { useEffect, useState } from "react"
import { Composed, useAnalyticsPeriod, filterByPeriod } from "@/components/analytics"
import type { GitHubStats } from "@/app/api/github-stats/route"
import { Activity } from "lucide-react"

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
    return <div className="rounded-2xl border border-border/60 bg-card shadow-xs p-5 h-56 animate-pulse" />
  }

  const filtered = filterByPeriod(days, period, (d) => d.date)
  const data = filtered.reduce<{ name: string; contributions: number; cumulative: number }[]>((acc, d) => {
    const prevCumulative = acc.length ? acc[acc.length - 1].cumulative : 0
    acc.push({ name: d.date, contributions: d.count, cumulative: prevCumulative + d.count })
    return acc
  }, [])

  if (!data.length) return null

  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-xs p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Daily activity</span>
      </div>
      <Composed
        data={data}
        barKey="contributions"
        lineKey="cumulative"
        barName="Contributions"
        lineName="Cumulative"
        height={220}
      />
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { BarChart, ChartFrame, LineChart, StatCard, tableOf, useAnalyticsPeriod } from "@/components/analytics"
import EmptyState from "@/components/shared/EmptyState"
import { relabel, weekName } from "@/components/stats/chart-data"
import type { GamingSummary } from "@/lib/stats/gaming"

const CARD = "rounded-lg border border-border bg-card p-4"

export function GamingHistory() {
  const { period } = useAnalyticsPeriod()
  const [result, setResult] = useState<{ period: typeof period; summary: GamingSummary | null } | null>(null)
  const loading = result === null || result.period !== period
  const summary = result?.period === period ? result.summary : null

  useEffect(() => {
    const ctrl = new AbortController()
    fetch(`/api/stats/gaming-history?period=${period}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setResult({ period, summary: data && "totalHours" in data ? (data as GamingSummary) : null }))
      .catch(() => { if (!ctrl.signal.aborted) setResult({ period, summary: null }) })
    return () => ctrl.abort()
  }, [period])

  if (loading) {
    return (
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Play history</h2>
        <div className="grid grid-cols-3 gap-3" aria-busy="true">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 rounded-xl bg-muted/60 motion-safe:animate-pulse" />)}
        </div>
      </section>
    )
  }

  const h = (v: number) => `${v} h`
  if (!summary || (summary.sessions === 0 && summary.lifetime.length === 0)) {
    return (
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Play history</h2>
        <EmptyState title="No play history for this period" description="Pick a longer period or check back after the next session." />
      </section>
    )
  }
  const games = summary.byGame.slice(0, 6)
  const weekly = relabel(summary.weekly, weekName)
  const lifetime = summary.lifetime.slice(0, 8)
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Play history</h2>
      {summary.sessions > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Hours tracked" value={summary.totalHours} />
          <StatCard label="Sessions" value={summary.sessions} />
          <StatCard label="Longest session" value={`${summary.longestHours} h`} />
        </div>
      )}
      {summary.byGame.length > 0 && (
        <ChartFrame className={CARD} title="Most played" unit="hours" table={tableOf(games, ["Game", "Hours"], { key: "hours" })}>
          <BarChart data={games} dataKey="hours" xKey="name" height={200} valueFormatter={h} name="Hours" />
        </ChartFrame>
      )}
      {summary.weekly.length > 1 && (
        <ChartFrame className={CARD} title="Hours per week" unit="hours" table={tableOf(weekly, ["Week of", "Hours"], { key: "hours" })}>
          <LineChart data={weekly} dataKey="hours" xKey="name" height={180} dots valueFormatter={h} name="Hours" />
        </ChartFrame>
      )}
      {summary.byGame.length === 0 && summary.lifetime.length > 0 && (
        <ChartFrame className={CARD} title="Lifetime playtime" unit="hours" table={tableOf(lifetime, ["Game", "Hours"], { key: "hours" })}>
          <BarChart data={lifetime} dataKey="hours" xKey="name" height={220} valueFormatter={h} name="Hours" />
        </ChartFrame>
      )}
    </section>
  )
}

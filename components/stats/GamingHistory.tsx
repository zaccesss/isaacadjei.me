"use client"

import { useEffect, useState } from "react"
import { BarChart, LineChart, StatCard, useAnalyticsPeriod } from "@/components/analytics"
import type { GamingSummary } from "@/lib/gaming"

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
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Play history</h2>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-muted/60 rounded-xl animate-pulse" />)}
        </div>
      </section>
    )
  }

  if (!summary || (summary.sessions === 0 && summary.lifetime.length === 0)) return null
  const h = (v: number) => `${v} h`
  return (
    <section className="space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Play history</h2>
      {summary.sessions > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Hours tracked" value={summary.totalHours} />
          <StatCard label="Sessions" value={summary.sessions} />
          <StatCard label="Longest session" value={`${summary.longestHours} h`} />
        </div>
      )}
      {summary.byGame.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm font-semibold mb-3">Most played</p>
          <BarChart data={summary.byGame.slice(0, 6)} dataKey="hours" xKey="name" height={200} valueFormatter={h} />
        </div>
      )}
      {summary.weekly.length > 1 && (
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm font-semibold mb-3">Hours per week</p>
          <LineChart data={summary.weekly} dataKey="hours" xKey="name" height={180} dots valueFormatter={h} />
        </div>
      )}
      {summary.byGame.length === 0 && summary.lifetime.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm font-semibold mb-3">Lifetime playtime</p>
          <BarChart data={summary.lifetime.slice(0, 8)} dataKey="hours" xKey="name" height={220} valueFormatter={h} />
        </div>
      )}
    </section>
  )
}

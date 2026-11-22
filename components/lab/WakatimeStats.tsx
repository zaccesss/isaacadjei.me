"use client"

import { useEffect, useState } from "react"
import TypingMotto from "@/components/shared/motion/TypingMotto"
import { BarChart, ChartFrame, GridHeatmap, LineChart, PieChart, hoursTable, tableOf, useAnalyticsPeriod } from "@/components/analytics"
import { Code2, Clock, Flame, TrendingUp, Zap } from "lucide-react"

type WakatimeStats = {
  totalSeconds: number
  dailyAvgSeconds: number
  activeDays: number
  bestDaySeconds: number
  bestDayDate: string
  codingStreak: number
  languages: { name: string; total_seconds: number }[]
  projects: { name: string; total_seconds: number }[]
  editors: { name: string; total_seconds: number }[]
  dailyTrend: { date: string; seconds: number }[]
  weekdayTotals: { day: string; seconds: number }[]
  hourlyTotals: { hour: number; seconds: number }[]
  heatmap: { dow: number; hour: number; seconds: number }[]
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const PIE_PARTS = 7

function fmt(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
}

function CodingHeatmap({ data }: { data: { dow: number; hour: number; seconds: number }[] }) {
  const hourTotals = Array.from({ length: 24 }, (_, h) =>
    data.filter((d) => d.hour === h).reduce((sum, d) => sum + d.seconds, 0)
  )
  const peakHour = hourTotals.indexOf(Math.max(...hourTotals))

  return (
    <div className="space-y-2">
      <GridHeatmap
        data={data.map((d) => ({ day: (d.dow + 6) % 7, hour: d.hour, value: d.seconds }))}
        valueFormatter={fmt}
        height={200}
      />
      <p className="text-sm text-muted-foreground">
        Busiest hour <span className="font-medium text-foreground tabular-nums">{String(peakHour).padStart(2, "0")}:00</span>, London time
      </p>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, sub }: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-1.5">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-lg font-bold text-foreground leading-none">{value}</p>
      {sub && <p className="text-xs text-muted-foreground font-mono">{sub}</p>}
    </div>
  )
}

export default function WakatimeStats() {
  const { period } = useAnalyticsPeriod()
  const [result, setResult] = useState<{ period: typeof period; stats: WakatimeStats | null } | null>(null)
  const loading = result === null || result.period !== period
  const stats = result?.period === period ? result.stats : null

  useEffect(() => {
    const ctrl = new AbortController()
    fetch(`/api/wakatime-stats?period=${period}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setResult({ period, stats: data && "totalSeconds" in data ? (data as WakatimeStats) : null })
      })
      .catch(() => { if (!ctrl.signal.aborted) setResult({ period, stats: null }) })
    return () => ctrl.abort()
  }, [period])

  const hours = (seconds: number) => Math.round((seconds / 3600) * 10) / 10
  const trendData = (stats?.dailyTrend ?? []).map((d) => ({ name: fmtDate(d.date), hours: hours(d.seconds) }))

  const weekdayData = stats
    ? [1, 2, 3, 4, 5, 6, 0].map((i) => ({ name: DAYS[i], seconds: stats.weekdayTotals[i].seconds }))
    : []
  const weekSplit = [
    { name: "Weekdays", value: weekdayData.slice(0, 5).reduce((a, d) => a + d.seconds, 0) },
    { name: "Weekends", value: weekdayData.slice(5).reduce((a, d) => a + d.seconds, 0) },
  ]

  const hourSeconds = Array.from({ length: 24 }, (_, h) => stats?.hourlyTotals.find((d) => d.hour === h)?.seconds ?? 0)
  const hourData = hourSeconds.map((seconds, h) => ({ name: String(h).padStart(2, "0"), seconds }))

  const parts = (items: { name: string; total_seconds: number }[]) => items.map((i) => ({ name: i.name, value: i.total_seconds }))
  const languages = parts(stats?.languages ?? [])
  const projects = parts(stats?.projects ?? [])
  const editors = parts(stats?.editors ?? [])
  const hasHours = hourSeconds.some((v) => v > 0)
  const hasLanguages = languages.length > 0
  const partsTable = (rows: { name: string; value: number }[], first: string) =>
    rows.length > PIE_PARTS ? { columns: [first, "Time"], rows: rows.map((r) => [r.name, fmt(r.value)]) } : undefined

  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-xs p-5 space-y-6">
      <div className="flex items-center gap-2">
        <Code2 aria-hidden className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-base font-semibold">In the code</h2>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 bg-muted/60 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {!loading && !stats && (
        <p className="text-sm text-muted-foreground">No coding data for this period yet.</p>
      )}

      {!loading && stats && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              icon={Clock}
              label="Total"
              value={fmt(stats.totalSeconds)}
              sub={`${stats.activeDays} active day${stats.activeDays !== 1 ? "s" : ""}`}
            />
            <StatCard
              icon={TrendingUp}
              label="Daily avg"
              value={fmt(stats.dailyAvgSeconds)}
              sub="on active days"
            />
            <StatCard
              icon={Zap}
              label="Best day"
              value={fmt(stats.bestDaySeconds)}
              sub={stats.bestDayDate ? fmtDate(stats.bestDayDate) : undefined}
            />
            <StatCard
              icon={Flame}
              label="Streak"
              value={`${stats.codingStreak}d`}
              sub="consecutive days"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {trendData.length > 1 && (
              <ChartFrame className="md:col-span-2" id="waka-daily" title="Daily coding hours" unit="hours" table={tableOf(trendData, ["Day", "Hours"], { key: "hours" })}>
                <LineChart data={trendData} dataKey="hours" xKey="name" height={160} valueFormatter={(v) => `${v} h`} name="Coding" />
              </ChartFrame>
            )}

            {stats.heatmap.length > 0 && (
              <ChartFrame className="md:col-span-2" id="waka-when" title="When I code" unit="time, weekday by hour, London time">
                <CodingHeatmap data={stats.heatmap} />
              </ChartFrame>
            )}

            {hasHours && (
              <ChartFrame className={hasLanguages ? undefined : "md:col-span-2"} id="waka-hours" title="By hour of day" unit="hours, London time" table={hoursTable(hourSeconds, "Time", fmt)}>
                <BarChart data={hourData} dataKey="seconds" xKey="name" height={200} valueFormatter={fmt} tickFormatter={(v) => `${hours(v)}h`} name="Coding" />
              </ChartFrame>
            )}

            {hasLanguages && (
              <ChartFrame className={hasHours ? undefined : "md:col-span-2"} id="waka-languages" title="Languages" unit="share of time" table={partsTable(languages, "Language")}>
                <PieChart data={languages} maxSlices={PIE_PARTS} valueFormatter={fmt} centreLabel="Coded" />
              </ChartFrame>
            )}

            {weekdayData.some((d) => d.seconds > 0) && (
              <div className="grid gap-6 md:col-span-2 md:grid-cols-[3fr_2fr]">
                <ChartFrame id="waka-weekdays" title="By day of week" unit="hours" table={tableOf(weekdayData, ["Day", "Time"], { key: "seconds", format: fmt })}>
                  <BarChart data={weekdayData} dataKey="seconds" xKey="name" height={200} valueFormatter={fmt} tickFormatter={(v) => `${hours(v)}h`} name="Coding" />
                </ChartFrame>
                <ChartFrame id="waka-week-split" title="Weekdays and weekends" unit="share of time">
                  <PieChart data={weekSplit} valueFormatter={fmt} centreLabel="Coded" height={180} />
                </ChartFrame>
              </div>
            )}

            {projects.length > 0 && (
              <ChartFrame id="waka-projects" title="Projects" unit="share of time" table={partsTable(projects, "Project")}>
                <PieChart data={projects} maxSlices={PIE_PARTS} valueFormatter={fmt} centreLabel="Coded" />
              </ChartFrame>
            )}

            {editors.length > 0 && (
              <ChartFrame id="waka-editors" title="Editors" unit="share of time" table={partsTable(editors, "Editor")}>
                <PieChart data={editors} maxSlices={PIE_PARTS} valueFormatter={fmt} centreLabel="Coded" />
              </ChartFrame>
            )}
          </div>
        </>
      )}
      <TypingMotto text="rm -rf impostor_syndrome && touch grass" />
    </div>
  )
}

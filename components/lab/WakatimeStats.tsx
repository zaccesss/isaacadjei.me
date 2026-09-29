"use client"

import { useEffect, useState } from "react"
import TypingMotto from "@/components/shared/TypingMotto"
import {
  ResponsiveContainer,
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts"
import { GridHeatmap, useAnalyticsPeriod } from "@/components/analytics"
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

const COLOURS = ["#6366f1", "#f59e0b", "#22c55e", "#ef4444", "#3b82f6", "#ec4899", "#14b8a6", "#f97316"]

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

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

const PIE_LEGEND_WIDTH = 108
function truncLabel(value: string, max = 13): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value
}

const TOOLTIP_STYLE = {
  fontSize: 12,
  borderRadius: 8,
  background: "hsl(var(--background))",
  border: "1px solid hsl(var(--border))",
  color: "hsl(var(--foreground))",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
}

function CodingHeatmap({ data }: { data: { dow: number; hour: number; seconds: number }[] }) {
  const hourTotals = Array.from({ length: 24 }, (_, h) =>
    data.filter((d) => d.hour === h).reduce((sum, d) => sum + d.seconds, 0)
  )
  const peakHour = hourTotals.indexOf(Math.max(...hourTotals, 1))

  return (
    <div className="space-y-2">
      <GridHeatmap
        data={data.map((d) => ({ day: (d.dow + 6) % 7, hour: d.hour, value: d.seconds }))}
        valueFormatter={fmt}
        height={200}
      />
      <p className="text-[9px] font-mono text-muted-foreground/70">
        peak <span className="text-primary">{peakHour}:00 UTC</span>
      </p>
    </div>
  )
}

function ProgressBars({ items, total }: { items: { name: string; total_seconds: number }[]; total: number }) {
  const [hovered, setHovered] = useState<string | null>(null)
  return (
    <div className="space-y-2">
      {items.slice(0, 6).map((item, i) => {
        const pct = total > 0 ? (item.total_seconds / total) * 100 : 0
        const isHov = hovered === item.name
        return (
          <div
            key={item.name}
            className="space-y-1 cursor-default"
            onMouseEnter={() => setHovered(item.name)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="flex items-center justify-between text-xs">
              <span className={`font-medium transition-colors ${isHov ? "text-primary" : "text-foreground"}`}>
                {item.name}
              </span>
              <div className="flex items-center gap-2 text-muted-foreground tabular-nums">
                <span>{pct.toFixed(1)}%</span>
                <span>{fmt(item.total_seconds)}</span>
              </div>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${pct}%`,
                  background: isHov ? "hsl(var(--primary))" : COLOURS[i % COLOURS.length],
                }}
              />
            </div>
          </div>
        )
      })}
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
        <span className="text-[10px] font-mono uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-lg font-bold text-foreground leading-none">{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground font-mono">{sub}</p>}
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

  const langTotal = (stats?.languages ?? []).reduce((a, b) => a + b.total_seconds, 0)
  const projTotal = (stats?.projects ?? []).reduce((a, b) => a + b.total_seconds, 0)

  const trendData = (stats?.dailyTrend ?? []).map((d) => ({
    date: fmtDate(d.date),
    hours: +(d.seconds / 3600).toFixed(2),
  }))

  const weekdayData = stats
    ? [1, 2, 3, 4, 5, 6, 0].map((i) => ({
        day: DAYS[i],
        hours: +(stats.weekdayTotals[i].seconds / 3600).toFixed(1),
      }))
    : []

  const hourData = (stats?.hourlyTotals ?? []).map((d) => ({
    hour: `${d.hour}:00`,
    hours: +(d.seconds / 3600).toFixed(1),
  }))

  const editorPie = (stats?.editors ?? []).map((e, i) => ({
    name: e.name,
    value: +(e.total_seconds / 3600).toFixed(1),
    colour: COLOURS[i % COLOURS.length],
  }))

  const langPie = (stats?.languages ?? []).slice(0, 6).map((l, i) => ({
    name: l.name,
    value: +(l.total_seconds / 3600).toFixed(1),
    colour: COLOURS[i % COLOURS.length],
  }))

  const projPie = (stats?.projects ?? []).slice(0, 6).map((p, i) => ({
    name: p.name,
    value: +(p.total_seconds / 3600).toFixed(1),
    colour: COLOURS[i % COLOURS.length],
  }))

  const weekVsWeekendPie = stats
    ? [
        {
          name: "Weekdays",
          value: +weekdayData.slice(0, 5).reduce((a, d) => a + d.hours, 0).toFixed(1),
          colour: COLOURS[0],
        },
        {
          name: "Weekends",
          value: +weekdayData.slice(5).reduce((a, d) => a + d.hours, 0).toFixed(1),
          colour: COLOURS[3],
        },
      ]
    : []

  const editorBarData = (stats?.editors ?? []).slice(0, 6).map((e, i) => ({
    name: e.name,
    hours: +(e.total_seconds / 3600).toFixed(1),
    colour: COLOURS[i % COLOURS.length],
  }))

  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-xs p-5 space-y-6">
      <div className="flex items-center gap-2">
        <Code2 className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">In the code</span>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 bg-muted/60 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {!loading && !stats && (
        <p className="text-xs text-muted-foreground font-mono">no coding data available</p>
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

          {trendData.length > 1 && (
            <div className="space-y-2">
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">daily coding hours</p>
              <ResponsiveContainer width="100%" height={130}>
                <LineChart data={trendData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 9 }}
                    tickLine={false}
                    axisLine={false}
                    interval={Math.max(0, Math.floor(trendData.length / 8) - 1)}
                  />
                  <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(v) => [`${v}h`, "Coding"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="hours"
                    stroke={COLOURS[0]}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: COLOURS[0], stroke: "#fff", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {stats.heatmap.length > 0 && (
            <div className="flex gap-6 items-start flex-wrap">
              <div className="space-y-2 shrink-0">
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">when I code (UTC hour x day)</p>
                <CodingHeatmap data={stats.heatmap} />
              </div>
              {hourData.some((d) => d.hours > 0) && (
                <div className="flex-1 min-w-[180px] space-y-2">
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">by hour of day (UTC)</p>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={hourData} barSize={10} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="hour" tick={{ fontSize: 8 }} tickLine={false} axisLine={false} interval={5} />
                      <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v}h`, "Coding"]} />
                      <Bar dataKey="hours" fill={COLOURS[2]} radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {stats.languages.length > 0 && (
            <div className="space-y-3">
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">languages</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <ProgressBars items={stats.languages} total={langTotal} />
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={langPie}
                      dataKey="value"
                      nameKey="name"
                      cx="40%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={72}
                      paddingAngle={2}
                    >
                      {langPie.map((entry, i) => <Cell key={i} fill={entry.colour} />)}
                    </Pie>
                    <Tooltip
                      contentStyle={TOOLTIP_STYLE}
                      formatter={(v) => [`${v}h`, ""]}
                    />
                    <Legend
                      iconType="circle"
                      iconSize={7}
                      wrapperStyle={{ fontSize: 10, paddingLeft: 12, width: PIE_LEGEND_WIDTH }}
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      formatter={(value) => truncLabel(String(value))}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {stats.projects.length > 0 && (
            <div className="space-y-3">
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">projects</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <ProgressBars items={stats.projects} total={projTotal} />
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={projPie}
                      dataKey="value"
                      nameKey="name"
                      cx="40%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={72}
                      paddingAngle={2}
                    >
                      {projPie.map((entry, i) => <Cell key={i} fill={entry.colour} />)}
                    </Pie>
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v}h`, ""]} />
                    <Legend
                      iconType="circle"
                      iconSize={7}
                      wrapperStyle={{ fontSize: 10, paddingLeft: 12, width: PIE_LEGEND_WIDTH }}
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      formatter={(value) => truncLabel(String(value))}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {editorPie.length > 0 && (
            <div className="space-y-3">
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">editors</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={editorPie}
                      dataKey="value"
                      nameKey="name"
                      cx="40%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={72}
                      paddingAngle={2}
                    >
                      {editorPie.map((entry, i) => <Cell key={i} fill={entry.colour} />)}
                    </Pie>
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v}h`, ""]} />
                    <Legend
                      iconType="circle"
                      iconSize={7}
                      wrapperStyle={{ fontSize: 10, paddingLeft: 12 }}
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                    />
                  </PieChart>
                </ResponsiveContainer>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart
                    data={editorBarData}
                    layout="vertical"
                    margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={72} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v}h`, ""]} />
                    <Bar dataKey="hours" radius={[0, 3, 3, 0]}>
                      {editorBarData.map((entry, i) => <Cell key={i} fill={entry.colour} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {weekdayData.some((d) => d.hours > 0) && (
            <div className="space-y-3">
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">by day of week</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={weekdayData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} interval={0} />
                    <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v}h`, "Coding"]} />
                    <Bar dataKey="hours" radius={[3, 3, 0, 0]}>
                      {weekdayData.map((entry, i) => (
                        <Cell key={i} fill={entry.day === "Sat" || entry.day === "Sun" ? COLOURS[3] : COLOURS[0]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={weekVsWeekendPie}
                      dataKey="value"
                      nameKey="name"
                      cx="40%"
                      cy="50%"
                      innerRadius={38}
                      outerRadius={60}
                      paddingAngle={3}
                    >
                      {weekVsWeekendPie.map((entry, i) => <Cell key={i} fill={entry.colour} />)}
                    </Pie>
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v}h`, ""]} />
                    <Legend
                      iconType="circle"
                      iconSize={7}
                      wrapperStyle={{ fontSize: 10, paddingLeft: 12 }}
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

        </>
      )}
      <TypingMotto text="rm -rf impostor_syndrome && touch grass" delay={800} />
    </div>
  )
}

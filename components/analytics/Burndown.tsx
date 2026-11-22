"use client"

import { ResponsiveContainer, LineChart as RLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import EmptyState from "@/components/shared/EmptyState"
import { CHART_NEUTRAL, chartVar } from "@/lib/ui/chart-palette"
import { ukShortDate } from "@/lib/time/short-date"
import { CHART_ANIMATION, SeriesLegend, ThemedTooltip, Y_AXIS_WIDTH } from "./charts"

export interface BurndownTask {
  start_date: string
  end_date: string
  status: string
}

const dayMs = 24 * 60 * 60 * 1000
const ACCENT = chartVar("chart-1")
const TICK = { fontSize: 13, fill: "hsl(var(--muted-foreground))" }

export function Burndown({ tasks, height = 200 }: { tasks: BurndownTask[]; height?: number }) {
  if (tasks.length < 2) {
    return <EmptyState title="Not enough tasks yet" description="Add at least 2 tasks to plot a burndown." className="py-8" />
  }

  const rangeStart = new Date(Math.min(...tasks.map((t) => new Date(t.start_date).getTime())))
  const rangeEnd = new Date(Math.max(...tasks.map((t) => new Date(t.end_date).getTime())))
  const totalDays = Math.max(1, Math.round((rangeEnd.getTime() - rangeStart.getTime()) / dayMs))
  const totalTasks = tasks.length

  const rows: { date: string; remaining: number; ideal: number }[] = []
  for (let i = 0; i <= totalDays; i++) {
    const day = new Date(rangeStart.getTime() + i * dayMs)
    const remaining = tasks.filter((t) => t.status !== "done" && new Date(t.end_date).getTime() >= day.getTime()).length
    const ideal = Math.max(0, Math.round(totalTasks * (1 - i / totalDays)))
    rows.push({ date: ukShortDate(day.toISOString(), false), remaining, ideal })
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={height}>
        <RLineChart data={rows} margin={{ top: 8, right: 12, bottom: 0, left: 4 }}>
          <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="date" tick={TICK} tickLine={false} axisLine={{ stroke: "hsl(var(--border))" }} interval="preserveStartEnd" minTickGap={24} />
          <YAxis width={Y_AXIS_WIDTH} tick={TICK} tickLine={false} axisLine={false} allowDecimals={false} tickCount={4} />
          <Tooltip
            content={({ active, payload, label }) => (
              <ThemedTooltip
                active={active}
                label={String(label ?? "")}
                payload={payload?.map((p) => ({ name: String(p.name), value: Number(p.value ?? 0), color: p.dataKey === "ideal" ? CHART_NEUTRAL : ACCENT }))}
              />
            )}
          />
          <Line type="monotone" dataKey="remaining" name="Open tasks" stroke={ACCENT} strokeWidth={2} dot={false} isAnimationActive={CHART_ANIMATION} />
          <Line type="monotone" dataKey="ideal" name="Ideal pace" stroke={CHART_NEUTRAL} strokeWidth={1.5} strokeDasharray="4 4" dot={false} isAnimationActive={CHART_ANIMATION} />
        </RLineChart>
      </ResponsiveContainer>
      <SeriesLegend items={[{ name: "Open tasks", colour: ACCENT, shape: "line" }, { name: "Ideal pace", colour: CHART_NEUTRAL, shape: "line" }]} />
    </div>
  )
}

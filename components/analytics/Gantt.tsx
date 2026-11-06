"use client"

import { ResponsiveContainer, BarChart as RBarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, LabelList } from "recharts"

export interface GanttTask {
  id: string
  name: string
  start_date: string
  end_date: string
  status: string
}

export interface GanttProps {
  tasks: GanttTask[]
  height?: number
  axis?: "days" | "dates"
  today?: string
  colours?: Record<string, string>
  statusLabels?: Record<string, string>
  legend?: string[]
  emptyText?: string
}

const STATUS_COLOURS: Record<string, string> = {
  done: "#22c55e",
  complete: "#22c55e",
  completed: "#22c55e",
  "in progress": "#3b82f6",
  in_progress: "#3b82f6",
  active: "#3b82f6",
  blocked: "#ef4444",
  planned: "#94a3b8",
  planning: "#94a3b8",
}

function statusColour(status: string, overrides?: Record<string, string>): string {
  return overrides?.[status] ?? overrides?.[status.toLowerCase()] ?? STATUS_COLOURS[status.toLowerCase()] ?? "#8b5cf6"
}

const dayMs = 24 * 60 * 60 * 1000

const LABEL_WIDTH = 180
const LABEL_CHARS = 28

function TaskLabel({ x, y, payload }: { x?: number; y?: number; payload?: { value: string } }) {
  const name = payload?.value ?? ""
  const shown = name.length > LABEL_CHARS ? `${name.slice(0, LABEL_CHARS - 1).trimEnd()}…` : name
  return (
    <text x={x} y={y} dy={4} textAnchor="end" fontSize={11} fill="currentColor" className="text-muted-foreground">
      <title>{name}</title>
      {shown}
    </text>
  )
}

const dayNum = (iso: string) => Math.floor(Date.parse(`${iso.slice(0, 10)}T00:00:00Z`) / dayMs)
const fromDayNum = (n: number) => new Date(n * dayMs)
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

type Tick = { offset: number; label: string }

function dateAxis(firstDay: number, lastDay: number): { start: number; end: number; ticks: Tick[] } {
  const span = lastDay - firstDay
  if (span <= 120) {
    const start = firstDay - ((firstDay + 3) % 7)
    const end = lastDay + ((7 - ((lastDay + 3) % 7)) % 7)
    const ticks: Tick[] = []
    for (let d = start; d <= end; d += 7) {
      const dt = fromDayNum(d)
      ticks.push({ offset: d - start, label: `${dt.getUTCDate()} ${MONTHS[dt.getUTCMonth()]}` })
    }
    return { start, end, ticks }
  }
  const step = span > 730 ? 3 : 1
  const first = fromDayNum(firstDay)
  let y = first.getUTCFullYear()
  let m = first.getUTCMonth() - (first.getUTCMonth() % step)
  const start = Math.floor(Date.UTC(y, m, 1) / dayMs)
  const ticks: Tick[] = []
  let end = start
  for (let i = 0; i < 400; i++) {
    const d = Math.floor(Date.UTC(y, m, 1) / dayMs)
    ticks.push({ offset: d - start, label: m === 0 || i === 0 ? `${MONTHS[m]} ${y}` : MONTHS[m] })
    end = d
    if (d > lastDay) break
    m += step
    if (m > 11) { m -= 12; y += 1 }
  }
  return { start, end, ticks }
}

const prettyStatus = (s: string) => s.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase())

export function Gantt({ tasks, height, axis = "days", today, colours, statusLabels, legend, emptyText }: GanttProps) {
  if (!tasks.length) {
    return <p className="text-xs text-muted-foreground">{emptyText ?? "No tasks yet - add a task with a start and end date to plot a timeline."}</p>
  }

  const sorted = [...tasks].sort((a, b) => a.start_date.localeCompare(b.start_date))
  const dates = axis === "dates"
  const labelOf = (s: string) => statusLabels?.[s] ?? prettyStatus(s)

  let domainStart = 0
  let domainEnd: number | null = null
  let ticks: Tick[] | null = null
  if (dates) {
    const first = Math.min(...sorted.map((t) => dayNum(t.start_date)))
    const last = Math.max(...sorted.map((t) => dayNum(t.end_date) + 1))
    const a = dateAxis(first, last)
    domainStart = a.start
    domainEnd = a.end - a.start
    ticks = a.ticks
  }

  const projectStart = new Date(sorted[0].start_date).getTime()
  const rows = sorted.map((t) => {
    if (dates) {
      const s = dayNum(t.start_date)
      return { ...t, offsetDays: s - domainStart, durationDays: Math.max(1, dayNum(t.end_date) - s + 1), statusLabel: labelOf(t.status) }
    }
    const start = new Date(t.start_date).getTime()
    const end = new Date(t.end_date).getTime()
    const offsetDays = Math.round((start - projectStart) / dayMs)
    const durationDays = Math.max(1, Math.round((end - start) / dayMs))
    return { ...t, offsetDays, durationDays, statusLabel: labelOf(t.status) }
  })

  const todayOffset = today ? (dates ? dayNum(today) - domainStart : Math.round((new Date(today).getTime() - projectStart) / dayMs)) : null
  const showToday = todayOffset !== null && todayOffset >= 0 && (domainEnd === null || todayOffset <= domainEnd)
  const tickLabel = new Map(ticks?.map((t) => [t.offset, t.label]))

  const chart = (
      <ResponsiveContainer width="100%" height={height ?? Math.max(160, rows.length * 34 + (showToday ? 16 : 0))}>
        <RBarChart data={rows} layout="vertical" margin={{ top: showToday ? 20 : 6, right: statusLabels ? 76 : 12, bottom: 0, left: 8 }} barCategoryGap={10}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
          {dates && ticks ? (
            <XAxis
              type="number"
              domain={[0, domainEnd ?? "auto"]}
              ticks={ticks.map((t) => t.offset)}
              allowDataOverflow
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={8}
              tickFormatter={(v: number) => tickLabel.get(v) ?? ""}
            />
          ) : (
            <XAxis
              type="number"
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `day ${v}`}
            />
          )}
          <YAxis
            type="category"
            dataKey="name"
            width={LABEL_WIDTH}
            interval={0}
            tick={<TaskLabel />}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            content={({ active, payload }) => {
              const row = payload?.[0]?.payload as (typeof rows)[number] | undefined
              if (!active || !row) return null
              return (
                <div className="rounded-md border border-border bg-background px-3 py-2 shadow-md text-xs">
                  <p className="font-medium text-foreground">{row.name}</p>
                  <p className="text-muted-foreground">{row.start_date} to {row.end_date}</p>
                  <p className="text-muted-foreground capitalize">{statusLabels ? row.statusLabel : row.status}</p>
                </div>
              )
            }}
            cursor={{ fill: "hsl(var(--muted))", radius: 3 }}
          />
          <Bar dataKey="offsetDays" stackId="g" fill="transparent" isAnimationActive={false} />
          <Bar dataKey="durationDays" stackId="g" radius={[3, 3, 3, 3]} isAnimationActive={false}>
            {rows.map((row) => (
              <Cell key={row.id} fill={statusColour(row.status, colours)} />
            ))}
            {statusLabels && <LabelList dataKey="statusLabel" position="right" fontSize={10} fill="currentColor" className="text-muted-foreground" />}
          </Bar>
          {showToday && (
            <ReferenceLine
              x={todayOffset}
              stroke="hsl(var(--foreground))"
              strokeDasharray="4 3"
              strokeWidth={1.5}
              ifOverflow="hidden"
              label={{ value: "Today", position: "top", fontSize: 10, fill: "hsl(var(--foreground))" }}
            />
          )}
        </RBarChart>
      </ResponsiveContainer>
  )

  if (!dates && !legend?.length) return chart

  return (
    <div className="flex flex-col gap-3">
      {chart}
      {legend && legend.length > 0 && (
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground" aria-label="Legend">
          {legend.map((s) => (
            <li key={s} className="inline-flex items-center gap-1.5">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: statusColour(s, colours) }} />
              {labelOf(s)}
            </li>
          ))}
          {showToday && (
            <li className="inline-flex items-center gap-1.5">
              <span aria-hidden="true" className="h-3 w-0 border-l-2 border-dashed border-foreground" />
              Today
            </li>
          )}
        </ul>
      )}
      {dates && (
        <ul className="sr-only">
          {rows.map((r) => <li key={r.id}>{r.name}: {r.start_date} to {r.end_date}, {r.statusLabel}</li>)}
        </ul>
      )}
    </div>
  )
}

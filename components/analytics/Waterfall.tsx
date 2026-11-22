"use client"

import { ResponsiveContainer, BarChart as RBarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import EmptyState from "@/components/shared/EmptyState"
import { chartVar } from "@/lib/ui/chart-palette"
import { CHART_ANIMATION, SeriesLegend, Y_AXIS_WIDTH, columnAxisHeight, formatTick } from "./charts"

export interface WaterfallStep {
  name: string
  delta: number
  isTotal?: boolean
}

const POSITIVE = chartVar("chart-2")
const NEGATIVE = chartVar("chart-4")
const TOTAL = chartVar("chart-1")
const TICK = { fontSize: 13, fill: "hsl(var(--muted-foreground))" }

export function Waterfall({
  steps,
  height = 200,
  valueFormatter,
}: {
  steps: WaterfallStep[]
  height?: number
  valueFormatter?: (value: number) => string
}) {
  if (!steps.length) {
    return <EmptyState title="No data for this period" description="The steps appear once there are figures to add up." className="py-8" />
  }
  const format = valueFormatter ?? ((v: number) => v.toLocaleString("en-GB"))

  const { rows } = steps.reduce<{ rows: { name: string; base: number; value: number; delta: number; isTotal: boolean }[]; running: number }>(
    (acc, step) => {
      if (step.isTotal) {
        return {
          rows: [...acc.rows, { name: step.name, base: 0, value: step.delta, delta: step.delta, isTotal: true }],
          running: step.delta,
        }
      }
      const start = acc.running
      const running = start + step.delta
      const base = Math.min(start, running)
      const value = Math.abs(step.delta)
      return {
        rows: [...acc.rows, { name: step.name, base, value, delta: step.delta, isTotal: false }],
        running,
      }
    },
    { rows: [], running: 0 },
  )

  const axisHeight = columnAxisHeight(rows.map((r) => r.name))
  const hasTotal = rows.some((r) => r.isTotal)
  return (
    <div>
    <ResponsiveContainer width="100%" height={height}>
      <RBarChart data={rows} margin={{ top: 8, right: 12, bottom: 0, left: 4 }} stackOffset="none">
        <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="name" tick={TICK} tickLine={false} axisLine={{ stroke: "hsl(var(--border))" }} interval={0} angle={axisHeight > 30 ? -35 : 0} textAnchor={axisHeight > 30 ? "end" : "middle"} height={axisHeight} />
        <YAxis width={Y_AXIS_WIDTH} tick={TICK} tickLine={false} axisLine={false} tickCount={4} tickFormatter={(v) => formatTick(Number(v))} />
        <Tooltip
          content={({ active, payload }) => {
            const row = payload?.[0]?.payload as (typeof rows)[number] | undefined
            if (!active || !row) return null
            return (
              <div className="rounded-md border border-border bg-background px-3 py-2 text-xs shadow-md">
                <p className="font-medium text-foreground">{row.name}</p>
                <p className="tabular-nums text-muted-foreground">
                  {row.isTotal ? format(row.delta) : `${row.delta >= 0 ? "+" : ""}${format(row.delta)}`}
                </p>
              </div>
            )
          }}
          cursor={{ fill: "hsl(var(--muted))", radius: 3 }}
        />
        <Bar dataKey="base" stackId="w" fill="transparent" isAnimationActive={CHART_ANIMATION} />
        <Bar dataKey="value" stackId="w" radius={[3, 3, 3, 3]} isAnimationActive={CHART_ANIMATION}>
          {rows.map((row) => (
            <Cell key={row.name} fill={row.isTotal ? TOTAL : row.delta >= 0 ? POSITIVE : NEGATIVE} />
          ))}
        </Bar>
      </RBarChart>
    </ResponsiveContainer>
    <SeriesLegend items={[{ name: "Rise", colour: POSITIVE }, { name: "Fall", colour: NEGATIVE }, ...(hasTotal ? [{ name: "Total", colour: TOTAL }] : [])]} />
    </div>
  )
}

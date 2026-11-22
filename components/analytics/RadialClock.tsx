"use client"

import ReactECharts from "./EChart"
import { useEChartsColours, useChartSeries } from "./echarts-theme"

const HOUR_LABELS = Array.from({ length: 24 }, (_, h) => String(h).padStart(2, "0"))
const number = (v: number) => v.toLocaleString("en-GB", { maximumFractionDigits: 1 })

interface RadialClockProps {
  hours: number[]
  height?: number
  valueLabel?: string
  valueFormatter?: (value: number) => string
  colour?: string
}

export function RadialClock({ hours, height = 260, valueLabel = "", valueFormatter, colour }: RadialClockProps) {
  const colours = useEChartsColours()
  const series = useChartSeries()
  const barColour = colour ?? series[0]
  const safeHours = Array.from({ length: 24 }, (_, h) => (Number.isFinite(hours[h]) ? hours[h] : 0))
  const max = Math.max(...safeHours, 1)
  const fmt = (v: number) => `${valueFormatter ? valueFormatter(v) : number(v)}${valueLabel ? ` ${valueLabel}` : ""}`
  const peak = safeHours.indexOf(Math.max(...safeHours))
  const any = safeHours.some((v) => v > 0)

  const option = {
    polar: { radius: ["14%", "78%"] },
    angleAxis: {
      type: "category",
      data: HOUR_LABELS,
      startAngle: 90,
      clockwise: true,
      axisLine: { lineStyle: { color: colours.border } },
      axisTick: { show: false },
      axisLabel: { color: colours.mutedForeground, fontSize: 13, interval: 2 },
      splitLine: { show: false },
    },
    radiusAxis: {
      type: "value",
      max,
      axisLine: { show: false },
      axisLabel: { show: false },
      axisTick: { show: false },
      splitNumber: 3,
      splitLine: { lineStyle: { color: colours.border, type: "dashed" } },
    },
    tooltip: {
      trigger: "item",
      backgroundColor: colours.card,
      borderColor: colours.border,
      textStyle: { color: colours.foreground, fontSize: 13 },
      formatter: (p: { name: string; value: number }) => `${p.name}:00 to ${String((Number(p.name) + 1) % 24).padStart(2, "0")}:00<br/>${fmt(p.value)}`,
    },
    series: [{ type: "bar", coordinateSystem: "polar", data: safeHours, itemStyle: { color: barColour }, roundCap: true, barCategoryGap: "18%" }],
  }

  return (
    <div className="relative">
      <div aria-hidden="true">
        <ReactECharts option={option} style={{ height, width: "100%" }} opts={{ renderer: "svg" }} notMerge />
      </div>
      {any && (
        <p className="text-center text-sm text-muted-foreground">
          Busiest hour <span className="font-medium text-foreground tabular-nums">{HOUR_LABELS[peak]}:00</span>, {fmt(safeHours[peak])}
        </p>
      )}
      <ul className="sr-only">
        {safeHours.map((v, h) => <li key={h}>{`${HOUR_LABELS[h]}:00: ${fmt(v)}`}</li>)}
      </ul>
    </div>
  )
}

"use client"

import ReactECharts from "echarts-for-react"
import { useEChartsColours } from "./echarts-theme"

const HOUR_LABELS = Array.from({ length: 24 }, (_, h) => String(h).padStart(2, "0"))

interface RadialClockProps {
  hours: number[]
  height?: number
  valueLabel?: string
  valueFormatter?: (value: number) => string
  colour?: string
}

export function RadialClock({ hours, height = 260, valueLabel = "", valueFormatter, colour }: RadialClockProps) {
  const colours = useEChartsColours()
  const barColour = colour ?? colours.primary
  const safeHours = Array.from({ length: 24 }, (_, h) => {
    const v = hours[h]
    return Number.isFinite(v) ? v : 0
  })
  const max = Math.max(...safeHours, 1)

  const option = {
    polar: { radius: ["15%", "80%"] },
    angleAxis: {
      type: "category",
      data: HOUR_LABELS,
      startAngle: 90,
      clockwise: true,
      axisLine: { lineStyle: { color: colours.border } },
      axisLabel: { color: colours.mutedForeground, fontSize: 9, interval: 1 },
      splitLine: { show: false },
    },
    radiusAxis: {
      type: "value",
      max,
      axisLine: { show: false },
      axisLabel: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: colours.border, type: "dashed" } },
    },
    tooltip: {
      trigger: "item",
      backgroundColor: colours.card,
      borderColor: colours.border,
      textStyle: { color: colours.foreground, fontSize: 11 },
      formatter: (p: { name: string; value: number }) => {
        const formatted = valueFormatter ? valueFormatter(p.value) : p.value.toLocaleString()
        return `${p.name}:00<br/>${formatted}${valueLabel ? ` ${valueLabel}` : ""}`
      },
    },
    series: [
      {
        type: "bar",
        coordinateSystem: "polar",
        data: safeHours,
        itemStyle: { color: barColour },
        roundCap: true,
      },
    ],
  }

  return <ReactECharts option={option} style={{ height, width: "100%" }} opts={{ renderer: "svg" }} notMerge />
}

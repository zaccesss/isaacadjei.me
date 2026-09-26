"use client"

import ReactECharts from "echarts-for-react"
import { useEChartsColours, intensityScale, relativeLevel } from "./echarts-theme"

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const Y_AXIS_DAY_LABELS = [...DAY_LABELS].reverse()
const HOUR_LABELS = Array.from({ length: 24 }, (_, h) => (h === 0 ? "12am" : h < 12 ? `${h}am` : h === 12 ? "12pm" : `${h - 12}pm`))

export interface GridHeatmapDatum {
  day: number
  hour: number
  value: number
}

interface GridHeatmapProps {
  data: GridHeatmapDatum[]
  height?: number
  valueLabel?: string
  valueFormatter?: (value: number) => string
  colourScale?: string[]
}

export function GridHeatmap({
  data,
  height = 220,
  valueLabel = "",
  valueFormatter,
  colourScale,
}: GridHeatmapProps) {
  const colours = useEChartsColours()
  const scale = colourScale ?? intensityScale(colours)
  const safe = data.map((d) => ({ ...d, value: Number.isFinite(d.value) ? d.value : 0 }))
  const max = Math.max(...safe.map((d) => d.value), 1)

  const option = {
    tooltip: {
      formatter: (p: { data: { value: [number, number, number]; raw: number } }) => {
        const [hour, yPos] = p.data.value
        const formatted = valueFormatter ? valueFormatter(p.data.raw) : p.data.raw.toLocaleString()
        return `${DAY_LABELS[6 - yPos]} ${HOUR_LABELS[hour]}<br/>${formatted}${valueLabel ? ` ${valueLabel}` : ""}`
      },
      backgroundColor: colours.card,
      borderColor: colours.border,
      textStyle: { color: colours.foreground, fontSize: 11 },
    },
    grid: { height: "70%", top: "5%", left: "8%", right: "2%" },
    xAxis: {
      type: "category",
      data: HOUR_LABELS,
      splitArea: { show: true, areaStyle: { color: [colours.card, colours.muted] } },
      axisLabel: { color: colours.mutedForeground, fontSize: 9, interval: 2 },
      axisLine: { lineStyle: { color: colours.border } },
    },
    yAxis: {
      type: "category",
      data: Y_AXIS_DAY_LABELS,
      splitArea: { show: true, areaStyle: { color: [colours.card, colours.muted] } },
      axisLabel: { color: colours.mutedForeground, fontSize: 10 },
      axisLine: { lineStyle: { color: colours.border } },
    },
    visualMap: {
      show: false,
      min: 0,
      max: 4,
      calculable: false,
      inRange: { color: scale },
    },
    series: [
      {
        type: "heatmap",
        data: safe.map((d) => ({ value: [d.hour, 6 - d.day, relativeLevel(d.value, max)], raw: d.value })),
        itemStyle: { borderWidth: 2, borderColor: colours.card },
      },
    ],
  }

  return (
    <div>
      <ReactECharts option={option} style={{ height, width: "100%" }} opts={{ renderer: "svg" }} notMerge />
      <div className="mt-1.5 flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
        <span>Less</span>
        {scale.map((c, i) => (
          <span key={i} className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: c }} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}

"use client"

import { useRef, useEffect } from "react"
import ReactECharts from "./EChart"
import { useEChartsColours, intensityScale, relativeLevel } from "./echarts-theme"
import { ukShortDate } from "@/lib/time/short-date"

export interface CalendarHeatmapDatum {
  date: string
  value: number
}

interface CalendarHeatmapProps {
  data: CalendarHeatmapDatum[]
  range?: [string, string]
  height?: number
  cellSize?: number
  valueLabel?: string
  valueFormatter?: (value: number) => string
  colourScale?: string[]
}

function defaultRange(data: CalendarHeatmapDatum[]): [string, string] {
  const latest = data.length ? data.reduce((a, b) => (a.date > b.date ? a : b)).date : new Date().toISOString().slice(0, 10)
  const end = new Date(latest)
  const start = new Date(end)
  start.setDate(start.getDate() - 364)
  return [start.toISOString().slice(0, 10), end.toISOString().slice(0, 10)]
}

export function CalendarHeatmap({
  data,
  range,
  height = 180,
  cellSize = 12,
  valueLabel = "",
  valueFormatter,
  colourScale,
}: CalendarHeatmapProps) {
  const colours = useEChartsColours()
  const scale = colourScale ?? intensityScale(colours)
  const [start, end] = range ?? defaultRange(data)
  const safe = data.map((d) => ({ ...d, value: Number.isFinite(d.value) ? d.value : 0 }))
  const max = Math.max(...safe.map((d) => d.value), 1)

  const weeks = Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (7 * 86400000)) + 1
  const chartWidth = weeks * (cellSize + 1) + 40

  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollLeft = el.scrollWidth
  }, [chartWidth])

  const option = {
    tooltip: {
      formatter: (p: { data: { value: [string, number]; raw: number } }) => {
        const [date] = p.data.value
        const formatted = valueFormatter ? valueFormatter(p.data.raw) : p.data.raw.toLocaleString("en-GB")
        return `${ukShortDate(date)}<br/>${formatted}${valueLabel ? ` ${valueLabel}` : ""}`
      },
      backgroundColor: colours.card,
      borderColor: colours.border,
      textStyle: { color: colours.foreground, fontSize: 13 },
    },
    visualMap: {
      show: false,
      min: 0,
      max: 4,
      calculable: false,
      inRange: { color: scale },
    },
    calendar: {
      range: [start, end],
      cellSize: [cellSize, cellSize],
      splitLine: { show: false },
      itemStyle: { borderWidth: 2, borderColor: colours.card, color: colours.border },
      yearLabel: { show: false },
      monthLabel: { color: colours.mutedForeground, fontSize: 13 },
      dayLabel: { color: colours.mutedForeground, fontSize: 13, firstDay: 1, nameMap: ["", "Mon", "", "Wed", "", "Fri", ""] },
    },
    series: [
      {
        type: "heatmap",
        coordinateSystem: "calendar",
        data: safe.map((d) => ({ value: [d.date, relativeLevel(d.value, max)], raw: d.value })),
      },
    ],
  }

  return (
    <div>
      <div ref={scrollRef} tabIndex={0} role="region" aria-label="Calendar heatmap, scrolls sideways" className="overflow-x-auto rounded-sm focus-visible:outline-2 focus-visible:outline-ring">
        <ReactECharts
          option={option}
          style={{ height, width: chartWidth }}
          opts={{ renderer: "svg" }}
          notMerge
        />
      </div>
      <div className="mt-1.5 flex items-center justify-end gap-1 text-xs text-muted-foreground" aria-hidden>
        <span>Less</span>
        {scale.map((c, i) => (
          <span key={i} className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: c }} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}

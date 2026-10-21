"use client"

import ReactECharts from "echarts-for-react"
import { useEChartsColours, type EChartsColours } from "./echarts-theme"
import { DEFAULT_CHART_COLOURS } from "./charts"

const PALETTE = DEFAULT_CHART_COLOURS

function tooltip(c: EChartsColours) {
  return { backgroundColor: c.card, borderColor: c.border, textStyle: { color: c.foreground, fontSize: 11 } }
}
function axis(c: EChartsColours, name?: string, extra: Record<string, unknown> = {}) {
  return {
    type: "value" as const,
    name,
    nameTextStyle: { color: c.mutedForeground, fontSize: 10 },
    axisLabel: { color: c.mutedForeground, fontSize: 10 },
    axisLine: { lineStyle: { color: c.border } },
    splitLine: { lineStyle: { color: c.border, opacity: 0.5 } },
    ...extra,
  }
}
function Chart({ option, height }: { option: Record<string, unknown>; height: number }) {
  return <ReactECharts option={option} style={{ height, width: "100%" }} opts={{ renderer: "svg" }} notMerge />
}

export function Candlestick({ data, height = 240 }: { data: { name: string; open: number; close: number; low: number; high: number }[]; height?: number }) {
  const c = useEChartsColours()
  return (
    <Chart
      height={height}
      option={{
        tooltip: { trigger: "axis", ...tooltip(c) },
        grid: { left: 44, right: 12, top: 12, bottom: 28 },
        xAxis: { type: "category", data: data.map((d) => d.name), axisLabel: { color: c.mutedForeground, fontSize: 10 }, axisLine: { lineStyle: { color: c.border } } },
        yAxis: axis(c, undefined, { scale: true }),
        series: [{ type: "candlestick", data: data.map((d) => [d.open, d.close, d.low, d.high]), itemStyle: { color: "#22c55e", color0: "#ef4444", borderColor: "#22c55e", borderColor0: "#ef4444" } }],
      }}
    />
  )
}

export function ParallelCoordinates({ dimensions, rows, height = 260 }: { dimensions: string[]; rows: number[][]; height?: number }) {
  const c = useEChartsColours()
  return (
    <Chart
      height={height}
      option={{
        tooltip: tooltip(c),
        parallelAxis: dimensions.map((name, dim) => ({ dim, name, nameTextStyle: { color: c.mutedForeground, fontSize: 10 }, axisLabel: { color: c.mutedForeground, fontSize: 9 }, axisLine: { lineStyle: { color: c.border } } })),
        parallel: { left: 40, right: 40, top: 36, bottom: 16 },
        series: [{ type: "parallel", lineStyle: { width: 1.5, opacity: 0.55, color: c.primary }, data: rows }],
      }}
    />
  )
}

export type TreeNode = { name: string; value?: number; children?: TreeNode[] }

export function Sunburst({ data, height = 300 }: { data: TreeNode[]; height?: number }) {
  const c = useEChartsColours()
  return (
    <Chart
      height={height}
      option={{
        tooltip: tooltip(c),
        color: PALETTE,
        series: [{ type: "sunburst", data, radius: ["12%", "92%"], label: { color: "#fff", fontSize: 10, minAngle: 8 }, itemStyle: { borderColor: c.card, borderWidth: 1.5 } }],
      }}
    />
  )
}

export function TreeChart({ data, height = 300 }: { data: TreeNode; height?: number }) {
  const c = useEChartsColours()
  return (
    <Chart
      height={height}
      option={{
        tooltip: tooltip(c),
        series: [{
          type: "tree", data: [data], top: "4%", bottom: "4%", left: "12%", right: "22%", symbolSize: 8, initialTreeDepth: 3,
          lineStyle: { color: c.border, width: 1.2 }, itemStyle: { color: c.primary, borderColor: c.primary },
          label: { position: "left", verticalAlign: "middle", align: "right", color: c.foreground, fontSize: 10 },
          leaves: { label: { position: "right", verticalAlign: "middle", align: "left" } },
        }],
      }}
    />
  )
}

export function NetworkGraph({ nodes, links, height = 300 }: { nodes: { id: string; group?: number; size?: number }[]; links: { source: string; target: string }[]; height?: number }) {
  const c = useEChartsColours()
  return (
    <Chart
      height={height}
      option={{
        tooltip: tooltip(c),
        color: PALETTE,
        series: [{
          type: "graph", layout: "force", roam: true, draggable: true, force: { repulsion: 180, edgeLength: 60 },
          label: { show: true, color: c.foreground, fontSize: 10, position: "right" },
          lineStyle: { color: c.border, width: 1.2, opacity: 0.9 },
          categories: [...new Set(nodes.map((n) => n.group ?? 0))].map((g) => ({ name: String(g) })),
          data: nodes.map((n) => ({ id: n.id, name: n.id, symbolSize: n.size ?? 16, category: n.group ?? 0 })),
          links,
        }],
      }}
    />
  )
}

export function ThemeRiver({ data, height = 240 }: { data: [string, number, string][]; height?: number }) {
  const c = useEChartsColours()
  return (
    <Chart
      height={height}
      option={{
        tooltip: { trigger: "axis", ...tooltip(c) },
        color: PALETTE,
        legend: { data: [...new Set(data.map((d) => d[2]))], textStyle: { color: c.mutedForeground, fontSize: 10 }, bottom: 0 },
        singleAxis: { type: "time", bottom: 32, top: 12, axisLabel: { color: c.mutedForeground, fontSize: 10 }, axisLine: { lineStyle: { color: c.border } } },
        series: [{ type: "themeRiver", data, label: { show: false } }],
      }}
    />
  )
}

export function Nyquist({ points, height = 260 }: { points: { re: number; im: number }[]; height?: number }) {
  const c = useEChartsColours()
  return (
    <Chart
      height={height}
      option={{
        tooltip: { trigger: "item", ...tooltip(c) },
        grid: { left: 48, right: 16, top: 16, bottom: 36 },
        xAxis: axis(c, "Real"),
        yAxis: axis(c, "Imaginary"),
        series: [
          { type: "line", showSymbol: false, smooth: true, data: points.map((p) => [p.re, p.im]), lineStyle: { color: c.primary, width: 2 } },
          { type: "line", showSymbol: false, smooth: true, data: points.map((p) => [p.re, -p.im]), lineStyle: { color: c.primary, width: 1, type: "dashed" } },
          { type: "scatter", data: [[-1, 0]], symbolSize: 10, itemStyle: { color: "#ef4444" }, tooltip: { formatter: "Critical point (-1, 0)" } },
        ],
      }}
    />
  )
}

export function Constellation({ points, height = 260 }: { points: { i: number; q: number }[]; height?: number }) {
  const c = useEChartsColours()
  return (
    <Chart
      height={height}
      option={{
        tooltip: tooltip(c),
        grid: { left: 40, right: 16, top: 16, bottom: 36 },
        xAxis: axis(c, "I", { min: -2, max: 2 }),
        yAxis: axis(c, "Q", { min: -2, max: 2 }),
        series: [{ type: "scatter", symbolSize: 5, itemStyle: { color: c.primary, opacity: 0.45 }, data: points.map((p) => [p.i, p.q]) }],
      }}
    />
  )
}

export function EyeDiagram({ traces, height = 240 }: { traces: number[][]; height?: number }) {
  const c = useEChartsColours()
  const len = traces[0]?.length ?? 0
  return (
    <Chart
      height={height}
      option={{
        grid: { left: 40, right: 16, top: 12, bottom: 28 },
        xAxis: axis(c, "Time (symbol periods)", { min: 0, max: 2 }),
        yAxis: axis(c, "Amplitude"),
        series: traces.map((t) => ({ type: "line", showSymbol: false, silent: true, lineStyle: { color: c.primary, width: 1, opacity: 0.22 }, data: t.map((v, k) => [(k / Math.max(len - 1, 1)) * 2, v]) })),
      }}
    />
  )
}

export function SmithChart({ locus, height = 300 }: { locus: { re: number; im: number }[]; height?: number }) {
  const c = useEChartsColours()
  const circle = (cx: number, cy: number, r: number, from = 0, to = Math.PI * 2) =>
    Array.from({ length: 121 }, (_, k) => {
      const t = from + ((to - from) * k) / 120
      return [cx + r * Math.cos(t), cy + r * Math.sin(t)]
    }).filter(([x, y]) => x * x + y * y <= 1.0005)
  const grid: Record<string, unknown>[] = [{ type: "line", showSymbol: false, silent: true, data: circle(0, 0, 1), lineStyle: { color: c.mutedForeground, width: 1.4 } }]
  for (const r of [0.2, 0.5, 1, 2, 5]) grid.push({ type: "line", showSymbol: false, silent: true, data: circle(r / (1 + r), 0, 1 / (1 + r)), lineStyle: { color: c.border, width: 1 } })
  for (const x of [0.2, 0.5, 1, 2, 5]) {
    grid.push({ type: "line", showSymbol: false, silent: true, data: circle(1, 1 / x, 1 / x), lineStyle: { color: c.border, width: 1 } })
    grid.push({ type: "line", showSymbol: false, silent: true, data: circle(1, -1 / x, 1 / x), lineStyle: { color: c.border, width: 1 } })
  }
  grid.push({ type: "line", showSymbol: false, silent: true, data: [[-1, 0], [1, 0]], lineStyle: { color: c.border, width: 1 } })
  return (
    <div className="mx-auto" style={{ maxWidth: height + 40 }}>
      <Chart
        height={height}
        option={{
          grid: { left: 8, right: 8, top: 8, bottom: 8 },
          xAxis: { type: "value", min: -1.05, max: 1.05, show: false },
          yAxis: { type: "value", min: -1.05, max: 1.05, show: false },
          series: [...grid, { type: "line", showSymbol: true, symbolSize: 5, smooth: true, data: locus.map((p) => [p.re, p.im]), lineStyle: { color: c.primary, width: 2.2 }, itemStyle: { color: c.primary }, z: 5 }],
        }}
      />
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import ReactECharts from "echarts-for-react"
import * as echarts from "echarts"
import { useTheme } from "next-themes"
import { useEChartsColours } from "./echarts-theme"

let loading: Promise<void> | null = null
function useWorldMap(): boolean {
  const [ready, setReady] = useState(() => !!echarts.getMap("world"))
  useEffect(() => {
    if (echarts.getMap("world")) return
    loading ??= fetch("/maps/world.json").then((r) => r.json()).then((geo) => { echarts.registerMap("world", geo) })
    let live = true
    loading.then(() => { if (live) setReady(true) }).catch(() => { loading = null })
    return () => { live = false }
  }, [])
  return ready
}

export function Choropleth({ data, height = 300, valueLabel = "" }: { data: { name: string; value: number }[]; height?: number; valueLabel?: string }) {
  const c = useEChartsColours()
  const dark = useTheme().resolvedTheme === "dark"
  const land = dark ? c.border : c.muted
  const ready = useWorldMap()
  if (!ready) return <div className="animate-pulse rounded-md bg-muted/40" style={{ height }} />
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <ReactECharts
      style={{ height, width: "100%" }}
      opts={{ renderer: "svg" }}
      notMerge
      option={{
        tooltip: { backgroundColor: c.card, borderColor: c.border, textStyle: { color: c.foreground, fontSize: 11 }, formatter: (p: { name: string; value?: number }) => `${p.name}<br/>${p.value ?? 0} ${valueLabel}` },
        visualMap: { min: 0, max, orient: "horizontal", left: 8, bottom: 4, itemWidth: 10, itemHeight: 90, text: ["More", "Less"], textStyle: { color: c.mutedForeground, fontSize: 10 }, inRange: { color: dark ? [c.border, "#3b82f6", "#bfdbfe"] : [c.muted, c.primary] } },
        series: [{ type: "map", map: "world", roam: true, data, emphasis: { label: { show: false }, itemStyle: { areaColor: dark ? "#93c5fd" : c.primary } }, itemStyle: { areaColor: land, borderColor: dark ? c.mutedForeground : c.border, borderWidth: 0.4 } }],
      }}
    />
  )
}

export function FlowMap({ routes, height = 300 }: { routes: { from: { name: string; coord: [number, number] }; to: { name: string; coord: [number, number] }; value?: number }[]; height?: number }) {
  const c = useEChartsColours()
  const dark = useTheme().resolvedTheme === "dark"
  const ready = useWorldMap()
  if (!ready) return <div className="animate-pulse rounded-md bg-muted/40" style={{ height }} />
  const points = new Map<string, [number, number]>()
  for (const r of routes) { points.set(r.from.name, r.from.coord); points.set(r.to.name, r.to.coord) }
  return (
    <ReactECharts
      style={{ height, width: "100%" }}
      notMerge
      option={{
        tooltip: { backgroundColor: c.card, borderColor: c.border, textStyle: { color: c.foreground, fontSize: 11 } },
        geo: { map: "world", roam: true, itemStyle: { areaColor: dark ? c.border : c.muted, borderColor: dark ? c.mutedForeground : c.border, borderWidth: 0.4 }, emphasis: { itemStyle: { areaColor: dark ? c.border : c.muted } } },
        series: [
          { type: "lines", coordinateSystem: "geo", zlevel: 1, effect: { show: true, period: 5, trailLength: 0.25, symbolSize: 4, color: c.primary }, lineStyle: { color: c.primary, width: 1.2, opacity: 0.55, curveness: 0.25 }, data: routes.map((r) => ({ coords: [r.from.coord, r.to.coord], lineStyle: { width: 0.8 + Math.min(r.value ?? 1, 6) * 0.35 } })) },
          { type: "scatter", coordinateSystem: "geo", zlevel: 2, symbolSize: 7, itemStyle: { color: c.primary }, label: { show: true, formatter: "{b}", position: "right", color: c.foreground, fontSize: 10 }, data: [...points.entries()].map(([name, coord]) => ({ name, value: coord })) },
        ],
      }}
    />
  )
}

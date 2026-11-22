"use client"

import * as React from "react"
import { CHART_COLOURS, CHART_NEUTRAL, chartVar } from "@/lib/ui/chart-palette"
import EmptyState from "@/components/shared/EmptyState"
import { cn } from "@/lib/utils"
import {
  LineChart as RLineChart, Line, BarChart as RBarChart, Bar, Cell, ReferenceLine,
  PieChart as RPieChart, Pie,
  Treemap as RTreemap, Sankey as RSankey,
  RadarChart as RRadarChart, Radar as RRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart as RScatterChart, Scatter, ZAxis,
  AreaChart as RAreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"

export const DEFAULT_CHART_COLOURS = CHART_COLOURS
const ACCENT = chartVar("chart-1")

export const CHART_ANIMATION = false

export const Y_AXIS_WIDTH = 48
const MARGIN = { top: 8, right: 12, bottom: 0, left: 4 }
export const PLOT_INSET = { left: MARGIN.left + Y_AXIS_WIDTH, right: MARGIN.right }

const TICK = { fontSize: 13, fill: "hsl(var(--muted-foreground))" }
const AXIS_LINE = { stroke: "hsl(var(--border))" }
const GRID = "hsl(var(--border))"
const TICK_COUNT = 4

const compact = new Intl.NumberFormat("en-GB", { notation: "compact", maximumFractionDigits: 1 })
export const formatTick = (v: number) => compact.format(v)
const plain = (v: number) => v.toLocaleString("en-GB", { maximumFractionDigits: 1 })

type ChartDatum = Record<string, string | number>

const allZero = (data: ChartDatum[], keys: string[]) => data.length === 0 || data.every((d) => keys.every((k) => !Number(d[k])))

function ChartEmpty({ title, description }: { title?: string; description?: React.ReactNode }) {
  return <EmptyState title={title ?? "Nothing to show yet"} description={description ?? "Figures appear here once there is data for this period."} className="py-8" />
}

type EmptyProps = { emptyTitle?: string; emptyDescription?: React.ReactNode }

export function ThemedTooltip({
  active,
  payload,
  label,
  valueFormatter,
}: {
  active?: boolean
  payload?: { name: string; value: number; color?: string }[]
  label?: string
  valueFormatter?: (v: number) => string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-md border border-border bg-background px-3 py-2 text-sm shadow-md">
      {label && <p className="mb-1.5 font-medium text-foreground">{label}</p>}
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-1.5 py-0.5">
          {p.color && <span aria-hidden className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: p.color }} />}
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-medium tabular-nums text-foreground">
            {valueFormatter && typeof p.value === "number" ? valueFormatter(p.value) : plain(Number(p.value))}
          </span>
        </div>
      ))}
    </div>
  )
}

const yTitle = (value?: string) => (value ? { value, angle: -90, position: "insideLeft" as const, offset: 12, style: { fontSize: 13, fill: "hsl(var(--muted-foreground))", textAnchor: "middle" as const } } : undefined)
const xTitle = (value?: string) => (value ? { value, position: "insideBottom" as const, offset: 0, style: { fontSize: 13, fill: "hsl(var(--muted-foreground))" } } : undefined)

export function SeriesLegend({ items }: { items: { name: string; colour: string; shape?: "box" | "line" }[] }) {
  return (
    <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground" aria-label="Legend">
      {items.map((s) => (
        <li key={s.name} className="flex items-center gap-1.5">
          <span aria-hidden className={s.shape === "line" ? "inline-block h-0.5 w-4 rounded" : "inline-block h-2.5 w-2.5 rounded-sm"} style={{ background: s.colour }} />
          {s.name}
        </li>
      ))}
    </ul>
  )
}

export function LineChart({
  data,
  dataKey,
  xKey = "name",
  height = 160,
  colour = ACCENT,
  valueFormatter,
  tickFormatter = formatTick,
  dots = false,
  name,
  xLabel,
  yLabel,
  emptyTitle,
  emptyDescription,
}: {
  data: ChartDatum[]
  dataKey: string
  xKey?: string
  height?: number
  colour?: string
  valueFormatter?: (value: number) => string
  tickFormatter?: (value: number) => string
  dots?: boolean
  name?: string
  xLabel?: string
  yLabel?: string
} & EmptyProps) {
  if (allZero(data, [dataKey])) return <ChartEmpty title={emptyTitle} description={emptyDescription} />
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RLineChart data={data} margin={MARGIN}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey={xKey} tick={TICK} tickLine={false} axisLine={AXIS_LINE} interval="preserveStartEnd" minTickGap={24} height={xLabel ? 48 : 30} label={xTitle(xLabel)} />
        <YAxis width={yLabel ? Y_AXIS_WIDTH + 18 : Y_AXIS_WIDTH} tick={TICK} tickLine={false} axisLine={false} tickCount={TICK_COUNT} tickFormatter={(v) => tickFormatter(Number(v))} label={yTitle(yLabel)} />
        <Tooltip
          content={({ active, payload, label }) => (
            <ThemedTooltip
              active={active}
              payload={payload?.map((p) => ({ name: String(name ?? p.name ?? dataKey), value: Number(p.value ?? 0), color: colour }))}
              label={String(label ?? "")}
              valueFormatter={valueFormatter}
            />
          )}
          cursor={{ stroke: GRID, strokeWidth: 1 }}
        />
        <Line type="monotone" dataKey={dataKey} name={name} stroke={colour} strokeWidth={2} dot={dots ? { r: 3, fill: colour, strokeWidth: 0 } : false} activeDot={{ r: 4, strokeWidth: 0 }} isAnimationActive={CHART_ANIMATION} />
      </RLineChart>
    </ResponsiveContainer>
  )
}

export function wrapLabel(text: string, width: number): string[] {
  const lines: string[] = []
  let line = ""
  for (const word of text.split(/\s+/).filter(Boolean)) {
    if (!line) line = word
    else if (line.length + 1 + word.length <= width) line += ` ${word}`
    else { lines.push(line); line = word }
    while (line.length > width) { lines.push(line.slice(0, width)); line = line.slice(width) }
  }
  if (line) lines.push(line)
  return lines.length ? lines : [""]
}

const CHAR_PX = 7.4
const LINE_PX = 16

export function columnAxisHeight(labels: string[]): number {
  const longest = Math.max(0, ...labels.map((l) => l.length))
  return labels.length * longest > 48 ? Math.round(Math.min(longest, 16) * CHAR_PX * 0.6 + 26) : 30
}

export function BarChart({
  data,
  dataKey,
  xKey = "name",
  height = 160,
  colour = ACCENT,
  valueFormatter,
  tickFormatter = formatTick,
  interval = "preserveStartEnd",
  legend = false,
  name,
  hideXAxisTicks = false,
  layout = "auto",
  highlight,
  xLabel,
  yLabel,
  emptyTitle,
  emptyDescription,
}: {
  data: ChartDatum[]
  dataKey: string
  xKey?: string
  height?: number
  colour?: string
  colours?: string[]
  valueFormatter?: (value: number) => string
  tickFormatter?: (value: number) => string
  interval?: number | "preserveStart" | "preserveEnd" | "preserveStartEnd"
  legend?: boolean
  name?: string
  hideXAxisTicks?: boolean
  layout?: "auto" | "vertical" | "horizontal"
  highlight?: number | string
  xLabel?: string
  yLabel?: string
} & EmptyProps) {
  if (allZero(data, [dataKey])) return <ChartEmpty title={emptyTitle} description={emptyDescription} />
  const labels = data.map((d) => String(d[xKey] ?? ""))
  const longest = Math.max(0, ...labels.map((l) => l.length))
  const horizontal = layout === "horizontal" || (layout === "auto" && (legend || hideXAxisTicks || (longest > 10 && data.length <= 24)))
  const fill = (d: ChartDatum, i: number) => (highlight === undefined || highlight === i || highlight === d[xKey] ? colour : CHART_NEUTRAL)
  const values = data.map((d) => Number(d[dataKey] ?? 0))
  const negative = values.some((v) => v < 0)
  const domain: [(min: number) => number, (max: number) => number] = [(min) => Math.min(0, min), (max) => Math.max(0, max)]
  const tooltip = (
    <Tooltip
      content={({ active, payload, label }) => (
        <ThemedTooltip
          active={active}
          payload={payload?.map((p) => ({ name: String(name ?? p.name ?? dataKey), value: Number(p.value ?? 0), color: colour }))}
          label={String(label ?? "")}
          valueFormatter={valueFormatter}
        />
      )}
      cursor={{ fill: "hsl(var(--muted))", radius: 3 }}
    />
  )
  const bars = (radius: [number, number, number, number], size?: number) => (
    <Bar dataKey={dataKey} name={name} fill={colour} radius={radius} barSize={size} isAnimationActive={CHART_ANIMATION}>
      {highlight !== undefined && data.map((d, i) => <Cell key={`${labels[i]}-${i}`} fill={fill(d, i)} />)}
    </Bar>
  )

  if (horizontal) {
    const axisWidth = Math.min(220, Math.max(56, Math.ceil(Math.min(longest, 28) * CHAR_PX) + 12))
    const chars = Math.max(6, Math.floor((axisWidth - 12) / CHAR_PX))
    const maxLines = Math.max(...labels.map((l) => wrapLabel(l, chars).length))
    const band = Math.max(30, maxLines * LINE_PX + 12)
    return (
      <ResponsiveContainer width="100%" height={data.length * band + (xLabel ? 52 : 36)}>
        <RBarChart data={data} layout="vertical" margin={{ top: 4, right: 16, bottom: 0, left: 4 }}>
          <CartesianGrid stroke={GRID} horizontal={false} />
          <XAxis type="number" domain={domain} tick={TICK} tickLine={false} axisLine={false} tickCount={TICK_COUNT} tickFormatter={(v) => tickFormatter(Number(v))} height={xLabel ? 46 : 30} label={xTitle(xLabel)} />
          <YAxis
            type="category"
            dataKey={xKey}
            width={axisWidth}
            interval={0}
            tickLine={false}
            axisLine={AXIS_LINE}
            tick={(props: { x?: number | string; y?: number | string; payload?: { value?: unknown } }) => {
              const x = Number(props.x ?? 0)
              const y = Number(props.y ?? 0)
              const lines = wrapLabel(String(props.payload?.value ?? ""), chars)
              return (
                <text x={x - 4} y={y} textAnchor="end" fontSize={13} fill="hsl(var(--muted-foreground))">
                  {lines.map((l, i) => <tspan key={i} x={x - 4} dy={i === 0 ? 4 - ((lines.length - 1) * LINE_PX) / 2 : LINE_PX}>{l}</tspan>)}
                </text>
              )
            }}
          />
          {tooltip}
          {negative && <ReferenceLine x={0} stroke="hsl(var(--foreground))" />}
          {bars([0, 3, 3, 0], Math.min(20, band - 10))}
        </RBarChart>
      </ResponsiveContainer>
    )
  }

  const axisHeight = columnAxisHeight(labels)
  const slanted = axisHeight > 30
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RBarChart data={data} margin={MARGIN}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis
          dataKey={xKey}
          tick={TICK}
          tickLine={false}
          axisLine={AXIS_LINE}
          interval={typeof interval === "number" ? interval : data.length > 12 ? Math.ceil(data.length / 10) - 1 : data.length > 8 ? 0 : interval}
          angle={slanted ? -35 : 0}
          textAnchor={slanted ? "end" : "middle"}
          height={axisHeight + (xLabel ? 18 : 0)}
          label={xTitle(xLabel)}
        />
        <YAxis width={yLabel ? Y_AXIS_WIDTH + 18 : Y_AXIS_WIDTH} domain={domain} tick={TICK} tickLine={false} axisLine={false} tickCount={TICK_COUNT} tickFormatter={(v) => tickFormatter(Number(v))} label={yTitle(yLabel)} />
        {tooltip}
        {negative && <ReferenceLine y={0} stroke="hsl(var(--foreground))" />}
        {bars([3, 3, 0, 0], data.length > 20 ? undefined : 18)}
      </RBarChart>
    </ResponsiveContainer>
  )
}

const share = (part: number, whole: number) => {
  const p = whole > 0 ? (part / whole) * 100 : 0
  return p > 0 && p < 1 ? "<1%" : `${Math.round(p)}%`
}

export function PieChart({
  data,
  height = 200,
  colours = DEFAULT_CHART_COLOURS,
  valueFormatter,
  maxSlices = 6,
  centreLabel = "Total",
  showTotal = true,
  sort = true,
  emptyTitle,
  emptyDescription,
}: {
  data: { name: string; value: number; colour?: string }[]
  height?: number
  colours?: string[]
  valueFormatter?: (value: number) => string
  maxSlices?: number
  centreLabel?: string
  showTotal?: boolean
  sort?: boolean
} & EmptyProps) {
  const [active, setActive] = React.useState<number | null>(null)
  const positive = data.filter((d) => d.value > 0)
  const sorted = sort ? [...positive].sort((a, b) => b.value - a.value) : positive
  if (!sorted.length) return <ChartEmpty title={emptyTitle} description={emptyDescription} />
  const parts = sorted.length > maxSlices
    ? [...sorted.slice(0, maxSlices - 1), { name: "Other", value: sorted.slice(maxSlices - 1).reduce((t, d) => t + d.value, 0), colour: CHART_NEUTRAL }]
    : sorted
  const total = parts.reduce((t, d) => t + d.value, 0)
  const fmt = (v: number) => (valueFormatter ? valueFormatter(v) : plain(v))
  const colourOf = (d: { colour?: string }, i: number) => d.colour ?? colours[i % colours.length]
  const size = Math.min(Math.max(height, 160), 220)
  const lit = active !== null && parts[active] ? parts[active] : null
  return (
    <div className="@container">
      <div className="flex flex-col items-center gap-4 @md:flex-row @md:gap-6">
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <ResponsiveContainer width="100%" height="100%">
            <RPieChart>
              <Pie
                data={parts}
                dataKey="value"
                nameKey="name"
                innerRadius="64%"
                outerRadius="98%"
                paddingAngle={1}
                stroke="hsl(var(--card))"
                strokeWidth={2}
                isAnimationActive={CHART_ANIMATION}
                onMouseEnter={(_: unknown, i: number) => setActive(i)}
                onMouseLeave={() => setActive(null)}
              >
                {parts.map((d, i) => (
                  <Cell key={d.name} fill={colourOf(d, i)} opacity={active === null || active === i ? 1 : 0.35} />
                ))}
              </Pie>
            </RPieChart>
          </ResponsiveContainer>
          <div aria-hidden className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            {(lit || showTotal) && (
              <>
                <span className="text-xl font-semibold leading-tight tabular-nums">{fmt(lit ? lit.value : total)}</span>
                <span className="max-w-full truncate text-[13px] text-muted-foreground">{lit ? lit.name : centreLabel}</span>
              </>
            )}
          </div>
        </div>
        <ul className="w-full min-w-0 space-y-0.5 text-sm">
          {parts.map((d, i) => (
            <li
              key={d.name}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className={cn("grid grid-cols-[auto_minmax(0,1fr)_auto_3rem] items-center gap-x-2 rounded-sm px-1.5 py-1", active === i && "bg-muted")}
            >
              <span aria-hidden className="h-3 w-3 rounded-sm" style={{ background: colourOf(d, i) }} />
              <span className="truncate" title={d.name}>{d.name}</span>
              <span className="font-medium tabular-nums">{fmt(d.value)}</span>
              <span className="text-right tabular-nums text-muted-foreground">{share(d.value, total)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function TreemapCell(props: { depth?: number; x?: number; y?: number; width?: number; height?: number; name?: string; value?: number; index?: number; colours: string[]; valueFormatter?: (v: number) => string }) {
  const { depth, x = 0, y = 0, width = 0, height = 0, name = "", value, index = 0, colours, valueFormatter } = props
  if (!depth) return null
  const fill = colours[index % colours.length]
  const showLabel = name.length * CHAR_PX < width - 12 && height > 24
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} stroke="hsl(var(--card))" strokeWidth={2} rx={3} />
      {showLabel && (
        <>
          <text x={x + 6} y={y + 17} fontSize={13} fontWeight={600} fill="hsl(var(--card))">{name}</text>
          {height > 44 && typeof value === "number" && (
            <text x={x + 6} y={y + 34} fontSize={13} fill="hsl(var(--card))">{valueFormatter ? valueFormatter(value) : plain(value)}</text>
          )}
        </>
      )}
    </g>
  )
}

export function Treemap({
  data,
  height = 240,
  colours = DEFAULT_CHART_COLOURS,
  valueFormatter,
  emptyTitle,
  emptyDescription,
}: {
  data: { name: string; value: number }[]
  height?: number
  colours?: string[]
  valueFormatter?: (value: number) => string
} & EmptyProps) {
  if (!data.some((d) => d.value > 0)) return <ChartEmpty title={emptyTitle} description={emptyDescription} />
  const sized = data.filter((d) => d.value > 0).map((d) => ({ ...d, sqrtValue: Math.sqrt(d.value) }))
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RTreemap
        data={sized}
        dataKey="sqrtValue"
        nameKey="name"
        aspectRatio={4 / 3}
        isAnimationActive={CHART_ANIMATION}
        content={(props) => {
          const p = props as { payload?: { value?: number }; value?: number }
          return <TreemapCell {...(props as object)} value={p.payload?.value ?? p.value} colours={colours} valueFormatter={valueFormatter} />
        }}
      >
        <Tooltip
          content={({ active, payload }) => (
            <ThemedTooltip
              active={active}
              payload={payload?.map((p) => ({ name: String(p.payload?.name ?? ""), value: Number(p.payload?.value ?? 0), color: colours[0] }))}
              valueFormatter={valueFormatter}
            />
          )}
        />
      </RTreemap>
    </ResponsiveContainer>
  )
}

export interface SankeyChartData {
  nodes: { name: string }[]
  links: { source: number; target: number; value: number }[]
}

export function Sankey({
  data,
  height = 280,
  nodeColours = DEFAULT_CHART_COLOURS,
  valueFormatter,
  emptyTitle,
  emptyDescription,
}: {
  data: SankeyChartData
  height?: number
  nodeColours?: string[]
  valueFormatter?: (value: number) => string
} & EmptyProps) {
  if (!data.links.some((l) => l.value > 0)) return <ChartEmpty title={emptyTitle} description={emptyDescription} />
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RSankey
        data={data}
        nodePadding={14}
        nodeWidth={10}
        margin={{ top: 8, right: 100, bottom: 8, left: 100 }}
        link={{ stroke: "hsl(var(--muted-foreground))", strokeOpacity: 0.3 }}
        node={(props) => {
          const p = props as unknown as { x: number; y: number; width: number; height: number; index: number; payload?: { name?: string; targetLinks?: unknown[] } }
          const isTerminal = (p.payload?.targetLinks?.length ?? 0) === 0
          return (
            <g>
              <rect x={p.x} y={p.y} width={p.width} height={p.height} fill={nodeColours[p.index % nodeColours.length]} rx={2} />
              <text x={isTerminal ? p.x - 6 : p.x + p.width + 6} y={p.y + p.height / 2} dy="0.32em" textAnchor={isTerminal ? "end" : "start"} fontSize={13} fill="hsl(var(--foreground))">
                {p.payload?.name}
              </text>
            </g>
          )
        }}
      >
        <Tooltip
          content={({ active, payload }) => {
            const entry = payload?.[0]?.payload as { name?: string; value: number; source?: { name: string }; target?: { name: string } } | undefined
            if (!active || !entry) return null
            const label = entry.source && entry.target ? `${entry.source.name} to ${entry.target.name}` : (entry.name ?? "")
            return (
              <div className="rounded-md border border-border bg-background px-3 py-2 text-sm shadow-md">
                <p className="font-medium text-foreground">{label}</p>
                <p className="tabular-nums text-muted-foreground">{valueFormatter ? valueFormatter(entry.value) : plain(entry.value)}</p>
              </div>
            )
          }}
        />
      </RSankey>
    </ResponsiveContainer>
  )
}

export function Radar({
  data,
  dataKey,
  nameKey = "name",
  height = 240,
  colour = ACCENT,
  valueFormatter,
  max,
  emptyTitle,
  emptyDescription,
}: {
  data: ChartDatum[]
  dataKey: string
  nameKey?: string
  height?: number
  colour?: string
  valueFormatter?: (value: number) => string
  max?: number
} & EmptyProps) {
  if (allZero(data, [dataKey])) return <ChartEmpty title={emptyTitle} description={emptyDescription} />
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RRadarChart data={data} margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
        <PolarGrid stroke={GRID} />
        <PolarAngleAxis dataKey={nameKey} tick={TICK} />
        <PolarRadiusAxis domain={max != null ? [0, max] : undefined} tick={false} axisLine={false} />
        <RRadar dataKey={dataKey} stroke={colour} fill={colour} fillOpacity={0.5} isAnimationActive={CHART_ANIMATION} />
        <Tooltip
          content={({ active, payload, label }) => (
            <ThemedTooltip
              active={active}
              payload={payload?.map((p) => ({ name: String(p.payload?.[nameKey] ?? label ?? dataKey), value: Number(p.value ?? 0), color: colour }))}
              label={String(label ?? "")}
              valueFormatter={valueFormatter}
            />
          )}
        />
      </RRadarChart>
    </ResponsiveContainer>
  )
}

export function Composed({
  data,
  xKey = "name",
  barKey,
  lineKey,
  height = 200,
  barColour = ACCENT,
  lineColour = ACCENT,
  valueFormatter,
  barValueFormatter,
  lineValueFormatter,
  barName,
  lineName,
  barInterval,
  emptyTitle,
  emptyDescription,
}: {
  data: ChartDatum[]
  xKey?: string
  barInterval?: number
  barKey: string
  lineKey: string
  height?: number
  barColour?: string
  lineColour?: string
  valueFormatter?: (value: number) => string
  barValueFormatter?: (value: number) => string
  lineValueFormatter?: (value: number) => string
  barName?: string
  lineName?: string
} & EmptyProps) {
  if (allZero(data, [barKey, lineKey])) return <ChartEmpty title={emptyTitle} description={emptyDescription} />
  const panel = Math.max(130, Math.round(height * 0.7))
  const heading = (text: string) => <p className="mb-1 text-sm font-medium text-foreground">{text}</p>
  return (
    <div className="space-y-4">
      <div>
        {heading(barName ?? barKey)}
        <BarChart data={data} dataKey={barKey} xKey={xKey} height={panel} colour={barColour} valueFormatter={barValueFormatter ?? valueFormatter} name={barName} layout="vertical" interval={barInterval} />
      </div>
      {lineKey !== barKey && (
        <div>
          {heading(lineName ?? lineKey)}
          <LineChart data={data} dataKey={lineKey} xKey={xKey} height={panel} colour={lineColour} valueFormatter={lineValueFormatter ?? valueFormatter} name={lineName} />
        </div>
      )}
    </div>
  )
}

export function Bubble({
  data,
  xKey,
  yKey,
  zKey,
  height = 220,
  colour = ACCENT,
  xFormatter,
  yFormatter,
  zFormatter,
  xLabel,
  yLabel,
  zLabel,
  emptyTitle,
  emptyDescription,
}: {
  data: ChartDatum[]
  xKey: string
  yKey: string
  zKey?: string
  height?: number
  colour?: string
  xFormatter?: (value: number) => string
  yFormatter?: (value: number) => string
  zFormatter?: (value: number) => string
  xLabel?: string
  yLabel?: string
  zLabel?: string
} & EmptyProps) {
  if (!data.length) return <ChartEmpty title={emptyTitle} description={emptyDescription} />
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RScatterChart margin={{ top: 8, right: 16, bottom: xLabel ? 8 : 0, left: 4 }}>
        <CartesianGrid stroke={GRID} />
        <XAxis type="number" dataKey={xKey} tick={TICK} tickLine={false} axisLine={AXIS_LINE} tickCount={TICK_COUNT} name={xLabel} tickFormatter={(v) => (xFormatter ?? formatTick)(Number(v))} height={xLabel ? 46 : 30} label={xTitle(xLabel)} />
        <YAxis type="number" dataKey={yKey} width={yLabel ? Y_AXIS_WIDTH + 18 : Y_AXIS_WIDTH} tick={TICK} tickLine={false} axisLine={false} tickCount={TICK_COUNT} name={yLabel} tickFormatter={(v) => (yFormatter ?? formatTick)(Number(v))} label={yTitle(yLabel)} />
        {zKey && <ZAxis type="number" dataKey={zKey} range={[40, 400]} name={zLabel ?? zKey} />}
        <Tooltip
          content={({ active, payload }) => {
            const p = payload?.[0]?.payload as ChartDatum | undefined
            if (!active || !p) return null
            const row = (label: string, v: string | number, f?: (n: number) => string) => (
              <p className="text-muted-foreground">{label}: <span className="font-medium tabular-nums text-foreground">{f ? f(Number(v)) : v}</span></p>
            )
            return (
              <div className="space-y-0.5 rounded-md border border-border bg-background px-3 py-2 text-sm shadow-md">
                {p.name !== undefined && <p className="font-medium text-foreground">{String(p.name)}</p>}
                {row(xLabel ?? xKey, p[xKey], xFormatter)}
                {row(yLabel ?? yKey, p[yKey], yFormatter)}
                {zKey && row(zLabel ?? zKey, p[zKey], zFormatter)}
              </div>
            )
          }}
          cursor={{ stroke: GRID }}
        />
        <Scatter data={data} fill={colour} fillOpacity={0.65} isAnimationActive={CHART_ANIMATION} />
      </RScatterChart>
    </ResponsiveContainer>
  )
}

export function StackedArea({
  data,
  xKey = "name",
  series,
  height = 220,
  colours = DEFAULT_CHART_COLOURS,
  valueFormatter,
  tickFormatter = formatTick,
  yLabel,
  legend = true,
  emptyTitle,
  emptyDescription,
}: {
  data: ChartDatum[]
  xKey?: string
  series: { key: string; name: string }[]
  legend?: boolean
  height?: number
  colours?: string[]
  valueFormatter?: (value: number) => string
  tickFormatter?: (value: number) => string
  yLabel?: string
} & EmptyProps) {
  if (allZero(data, series.map((s) => s.key))) return <ChartEmpty title={emptyTitle} description={emptyDescription} />
  const colourOf = (i: number) => colours[i % colours.length]
  return (
    <div>
      <ResponsiveContainer width="100%" height={height}>
        <RAreaChart data={data} margin={MARGIN}>
          <CartesianGrid stroke={GRID} vertical={false} />
          <XAxis dataKey={xKey} tick={TICK} tickLine={false} axisLine={AXIS_LINE} interval="preserveStartEnd" minTickGap={24} />
          <YAxis width={yLabel ? Y_AXIS_WIDTH + 18 : Y_AXIS_WIDTH} domain={[0, "auto"]} tick={TICK} tickLine={false} axisLine={false} tickCount={TICK_COUNT} tickFormatter={(v) => tickFormatter(Number(v))} label={yTitle(yLabel)} />
          <Tooltip
            content={({ active, payload, label }) => (
              <ThemedTooltip
                active={active}
                payload={payload
                  ?.map((p) => {
                    const i = series.findIndex((s) => s.key === p.dataKey)
                    return { name: series[i]?.name ?? String(p.dataKey), value: Number(p.value ?? 0), color: colourOf(i) }
                  })
                  .reverse()}
                label={String(label ?? "")}
                valueFormatter={valueFormatter}
              />
            )}
          />
          {series.map((s, i) => (
            <Area key={s.key} type="linear" dataKey={s.key} name={s.name} stackId="1" stroke={colourOf(i)} fill={colourOf(i)} fillOpacity={0.3} isAnimationActive={CHART_ANIMATION} />
          ))}
        </RAreaChart>
      </ResponsiveContainer>
      {legend && series.length > 1 && <SeriesLegend items={stackLegend(series, colours)} />}
    </div>
  )
}

export function stackLegend(series: { name: string }[], colours: string[] = DEFAULT_CHART_COLOURS) {
  return series.map((s, i) => ({ name: s.name, colour: colours[i % colours.length] })).reverse()
}

export function riverToStack(rows: [string, number, string][], label: (date: string) => string = (d) => d): { data: ChartDatum[]; series: { key: string; name: string }[] } {
  const names = [...new Set(rows.map((r) => r[2]))]
  const byDate = new Map<string, ChartDatum>()
  for (const [date, value, name] of rows) {
    const row = byDate.get(date) ?? { name: label(date), ...Object.fromEntries(names.map((_, i) => [`s${i}`, 0])) }
    row[`s${names.indexOf(name)}`] = Number(row[`s${names.indexOf(name)}`] ?? 0) + value
    byDate.set(date, row)
  }
  return {
    data: [...byDate.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, r]) => r),
    series: names.map((name, i) => ({ key: `s${i}`, name })),
  }
}

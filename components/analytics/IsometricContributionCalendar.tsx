"use client"

import { useEffect, useMemo, useState } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { Bounds, Grid, Html, OrbitControls, useBounds } from "@react-three/drei"
import * as THREE from "three"
import { useTheme } from "next-themes"
import { relativeLevel } from "./echarts-theme"
import type { CalendarHeatmapDatum } from "./CalendarHeatmap"

interface IsometricContributionCalendarProps {
  data: CalendarHeatmapDatum[]
  range?: [string, string]
  height?: number
  valueLabel?: string
  valueFormatter?: (value: number) => string
}

const CELL_SIZE = 0.82
const GAP = 0.18
const STEP = CELL_SIZE + GAP
const BASE_HEIGHT = 0.08
const LEVEL_HEIGHT_STEP = 0.32

const LIT_COLOUR = "#ffb020"

interface IsometricPalette {
  board: string
  backdrop: string
  trace: string
  blocks: Record<0 | 1 | 2 | 3 | 4, string>
}

const PALETTES: Record<"light" | "dark", IsometricPalette> = {
  dark: {
    board: "#0b3d2e",
    backdrop: "#031510",
    trace: "#3f7a63",
    blocks: { 0: "#134e3f", 1: "#1f6f5c", 2: "#2f9c82", 3: "#4fd9c1", 4: LIT_COLOUR },
  },
  light: {
    board: "#e2dcc4",
    backdrop: "#f1ede0",
    trace: "#b7ab86",
    blocks: { 0: "#cde3d1", 1: "#9bcda9", 2: "#5eab7c", 3: "#2e8a56", 4: LIT_COLOUR },
  },
}

function useIsometricPalette(): IsometricPalette {
  const { resolvedTheme } = useTheme()
  return PALETTES[resolvedTheme === "light" ? "light" : "dark"]
}

function toLocalDateISO(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function defaultRange(data: CalendarHeatmapDatum[]): [string, string] {
  const latest = data.length ? data.reduce((a, b) => (a.date > b.date ? a : b)).date : toLocalDateISO(new Date())
  const end = new Date(latest + "T00:00:00")
  const start = new Date(end)
  start.setDate(start.getDate() - 364)
  return [toLocalDateISO(start), toLocalDateISO(end)]
}

function mondayFirstDay(date: Date): number {
  return (date.getDay() + 6) % 7
}

interface Cell {
  date: string
  value: number
  level: 0 | 1 | 2 | 3 | 4
  week: number
  day: number
}

function buildCells(data: CalendarHeatmapDatum[], range: [string, string]): { cells: Cell[]; weeks: number } {
  const byDate = new Map(data.map((d) => [d.date, Number.isFinite(d.value) ? d.value : 0]))
  const max = Math.max(...data.map((d) => (Number.isFinite(d.value) ? d.value : 0)), 1)

  const [startIso, endIso] = range
  const start = new Date(startIso + "T00:00:00")
  const end = new Date(endIso + "T00:00:00")
  const gridStart = new Date(start)
  gridStart.setDate(gridStart.getDate() - mondayFirstDay(start))

  const cells: Cell[] = []
  const cursor = new Date(gridStart)
  let week = 0
  while (cursor <= end) {
    const iso = toLocalDateISO(cursor)
    if (cursor >= start) {
      const value = byDate.get(iso) ?? 0
      cells.push({ date: iso, value, level: relativeLevel(value, max), week, day: mondayFirstDay(cursor) })
    }
    if (mondayFirstDay(cursor) === 6) week++
    cursor.setDate(cursor.getDate() + 1)
  }
  return { cells, weeks: week + 1 }
}

function Block({
  cell,
  palette,
  valueLabel,
  valueFormatter,
  onHover,
}: {
  cell: Cell
  palette: IsometricPalette
  valueLabel?: string
  valueFormatter?: (value: number) => string
  onHover: (cell: Cell | null) => void
}) {
  const [hovered, setHovered] = useState(false)
  const blockHeight = BASE_HEIGHT + cell.level * LEVEL_HEIGHT_STEP
  const isLit = cell.level === 4
  const colour = isLit ? LIT_COLOUR : palette.blocks[cell.level]

  return (
    <mesh
      position={[cell.week * STEP, blockHeight / 2, cell.day * STEP]}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        onHover(cell)
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        setHovered(false)
        onHover(null)
      }}
    >
      <boxGeometry args={[CELL_SIZE, blockHeight, CELL_SIZE]} />
      <meshStandardMaterial
        color={colour}
        emissive={isLit ? new THREE.Color(LIT_COLOUR) : new THREE.Color("#000000")}
        emissiveIntensity={isLit ? (hovered ? 1.4 : 0.9) : 0}
        roughness={0.45}
        metalness={0.15}
      />
      {hovered && (
        <Html position={[0, blockHeight / 2 + 0.35, 0]} center distanceFactor={12} style={{ pointerEvents: "none" }}>
          <div className="rounded-md border border-border bg-card px-2 py-1 text-[11px] whitespace-nowrap shadow-md">
            <div className="text-foreground font-medium">{cell.date}</div>
            <div className="text-muted-foreground">
              {valueFormatter ? valueFormatter(cell.value) : cell.value.toLocaleString()}
              {valueLabel ? ` ${valueLabel}` : ""}
            </div>
          </div>
        </Html>
      )}
    </mesh>
  )
}

interface CamView {
  pos: [number, number, number]
  up?: [number, number, number]
  trigger: number
}

function Scene({
  data,
  range,
  valueLabel,
  valueFormatter,
  camView,
  controlsReady,
}: Omit<IsometricContributionCalendarProps, "height"> & { camView: CamView; controlsReady: boolean }) {
  const palette = useIsometricPalette()
  const resolvedRange = range ?? defaultRange(data)
  const { cells, weeks } = useMemo(() => buildCells(data, resolvedRange), [data, resolvedRange])
  const [, setActiveCell] = useState<Cell | null>(null)

  const width = weeks * STEP
  const depth = 7 * STEP
  const center: [number, number, number] = [width / 2 - STEP / 2, 0, depth / 2 - STEP / 2]
  const boardSpan = Math.max(width, depth)

  return (
    <>
      <color attach="background" args={[palette.backdrop]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[8, 12, 6]} intensity={1.3} />
      <directionalLight position={[-6, 4, -6]} intensity={0.4} />
      <OrbitControls makeDefault enabled={controlsReady} enablePan={false} minZoom={8} maxZoom={200} />
      <Bounds fit clip margin={1.03} maxDuration={0.6}>
        <CameraView pos={camView.pos} up={camView.up} trigger={camView.trigger} />
        <RefitOnInteractionEnd />
        <group position={[-center[0], 0, -center[2]]}>
          <mesh position={[center[0], -0.06, center[2]]} receiveShadow>
            <boxGeometry args={[width + STEP, 0.12, depth + STEP]} />
            <meshStandardMaterial color={palette.board} roughness={0.8} metalness={0.1} />
          </mesh>
          <Grid
            position={[center[0], 0.02, center[2]]}
            args={[width + STEP, depth + STEP]}
            cellSize={STEP}
            cellThickness={1.1}
            cellColor={palette.trace}
            sectionThickness={0}
            fadeDistance={boardSpan * 1.5}
            fadeStrength={1}
            infiniteGrid={false}
          />
          {cells.map((cell) => (
            <Block
              key={cell.date}
              cell={cell}
              palette={palette}
              valueLabel={valueLabel}
              valueFormatter={valueFormatter}
              onHover={setActiveCell}
            />
          ))}
        </group>
      </Bounds>
    </>
  )
}

const DEFAULT_CAM_POS: [number, number, number] = [22, 22, 22]

const VIEW_PRESETS: { label: string; pos: [number, number, number]; up?: [number, number, number] }[] = [
  { label: "isometric", pos: DEFAULT_CAM_POS },
  { label: "top", pos: [0.01, 40, 0.01], up: [0, 0, -1] },
]

function CameraView({ pos, up = [0, 1, 0], trigger }: { pos: [number, number, number]; up?: [number, number, number]; trigger: number }) {
  const { camera, controls } = useThree()
  const bounds = useBounds()
  const [px, py, pz] = pos
  const [ux, uy, uz] = up
  useEffect(() => {
    if (trigger === 0) return
    camera.position.set(px, py, pz)
    camera.up.set(ux, uy, uz)
    camera.lookAt(0, 0, 0)
    const c = controls as any
    if (c?.target) {
      c.target.set(0, 0, 0)
      c.object?.up?.set(ux, uy, uz)
      c.update?.()
    }
    bounds.refresh().fit()
  }, [trigger, px, py, pz, ux, uy, uz, camera, controls, bounds])
  return null
}

function RefitOnInteractionEnd() {
  const { controls } = useThree()
  const bounds = useBounds()
  useEffect(() => {
    const c = controls as any
    if (!c?.addEventListener) return
    const handler = () => bounds.refresh().fit()
    c.addEventListener("end", handler)
    return () => c.removeEventListener("end", handler)
  }, [controls, bounds])
  return null
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas")
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"))
  } catch {
    return false
  }
}

function Legend({ palette }: { palette: IsometricPalette }) {
  return (
    <div className="mt-1.5 flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
      <span>Less</span>
      {([0, 1, 2, 3, 4] as const).map((level) => (
        <span key={level} className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: palette.blocks[level] }} />
      ))}
      <span>More</span>
    </div>
  )
}

export default function IsometricContributionCalendar({
  data,
  range,
  height = 320,
  valueLabel,
  valueFormatter,
}: IsometricContributionCalendarProps) {
  const [webglOk] = useState(hasWebGL)
  const [camView, setCamView] = useState<CamView>({ pos: DEFAULT_CAM_POS, trigger: 0 })
  const [controlsReady, setControlsReady] = useState(false)
  const palette = useIsometricPalette()

  useEffect(() => {
    const t = setTimeout(() => setControlsReady(true), 700)
    return () => clearTimeout(t)
  }, [])

  const goTo = (pos: [number, number, number], up?: [number, number, number]) =>
    setCamView((v) => ({ pos, up, trigger: v.trigger + 1 }))

  if (!webglOk) {
    return (
      <div
        className="flex items-center justify-center rounded-lg border border-border text-xs text-muted-foreground"
        style={{ height }}
      >
        3D view isn&apos;t available in this browser
      </div>
    )
  }

  return (
    <div>
      <div style={{ height }}>
        <Canvas orthographic camera={{ position: DEFAULT_CAM_POS, zoom: 34, near: 0.1, far: 200 }} dpr={[1, 1.5]}>
          <Scene
            data={data}
            range={range}
            valueLabel={valueLabel}
            valueFormatter={valueFormatter}
            camView={camView}
            controlsReady={controlsReady}
          />
        </Canvas>
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span className="text-[10px] font-mono text-muted-foreground/40 shrink-0">drag · scroll to zoom</span>
        <div className="flex gap-1 flex-wrap justify-end">
          {VIEW_PRESETS.map(({ label, pos, up }) => {
            const active = camView.pos === pos
            return (
              <button
                key={label}
                type="button"
                disabled={!controlsReady}
                onClick={() => goTo(pos, up)}
                className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border/50 text-muted-foreground/70 hover:text-foreground hover:border-primary/50"
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>
      <Legend palette={palette} />
    </div>
  )
}

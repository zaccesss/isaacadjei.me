"use client"

import { useEffect, useRef, useState } from "react"
import type { Tone } from "./types"
import s from "../terminal.module.css"

type Cell = { ch: string; tone: Tone }
type Frame = Cell[][]

export interface SceneDef {
  id: string
  title: string
  summary: string
  draw: (c: Canvas, t: number) => void
}

class Canvas {
  readonly w: number
  readonly h: number
  readonly cells: Frame
  constructor(w: number, h: number) {
    this.w = w
    this.h = h
    this.cells = Array.from({ length: h }, () => Array.from({ length: w }, () => ({ ch: " ", tone: "fg" as Tone })))
  }
  put(x: number, y: number, text: string, tone: Tone) {
    const row = Math.round(y)
    if (row < 0 || row >= this.h) return
    const col = Math.round(x)
    for (let i = 0; i < text.length; i++) {
      const cx = col + i
      if (cx < 0 || cx >= this.w || text[i] === "\0") continue
      this.cells[row][cx] = { ch: text[i], tone }
    }
  }
  fill(y: number, ch: string, tone: Tone) {
    for (let x = 0; x < this.w; x++) this.put(x, y, ch, tone)
  }
}

function seeded(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const wrap = (v: number, span: number) => ((v % span) + span) % span

function drawSea(c: Canvas, t: number) {
  const surface = Math.max(3, Math.floor(c.h * 0.3))
  c.put(c.w - 7, 0, "\\ | /", "yellow")
  c.put(c.w - 7, 1, "- O -", "yellow")
  c.put(wrap(4 + t * 0.4, c.w + 10) - 8, 1, "( ~~ )", "white")
  for (let x = 0; x < c.w; x++) c.put(x, surface, (x + Math.floor(t * 0.6)) % 4 === 0 ? "^" : "~", "blue")
  const bx = wrap(t * 0.8, c.w + 12) - 10
  c.put(bx + 3, surface - 2, "|\\", "white")
  c.put(bx, surface - 1, "\\_____/", "white")
  const rand = seeded(11)
  const fish = Array.from({ length: Math.max(3, Math.floor(c.w / 12)) }, (_, i) => ({
    y: surface + 2 + Math.floor(rand() * Math.max(1, c.h - surface - 4)),
    x0: rand() * c.w,
    speed: 0.6 + rand() * 1.2,
    right: i % 2 === 0,
    tone: (["yellow", "magenta", "green", "red"] as Tone[])[i % 4],
  }))
  for (const f of fish) {
    const span = c.w + 6
    const x = f.right ? wrap(f.x0 + t * f.speed, span) - 3 : span - 3 - wrap(f.x0 + t * f.speed, span)
    c.put(x, f.y, f.right ? "><>" : "<><", f.tone)
  }
  for (let i = 0; i < 4; i++) {
    const bx2 = Math.floor((c.w / 5) * (i + 1))
    const depth = c.h - 2 - surface
    const y = c.h - 2 - wrap(t * 0.7 + i * 3, depth)
    c.put(bx2 + 1, y, i % 2 ? "o" : ".", "cyan")
  }
  for (let i = 0; i < 6; i++) {
    const wx = Math.floor((c.w / 6) * i + 2)
    const sway = (Math.floor(t * 0.5) + i) % 2
    c.put(wx, c.h - 3, sway ? ")" : "(", "green")
    c.put(wx, c.h - 2, sway ? "(" : ")", "green")
  }
  c.fill(c.h - 1, ".", "yellow")
}

function drawKoi(c: Canvas, t: number) {
  c.fill(0, "o", "dim")
  c.fill(c.h - 1, "o", "dim")
  for (let y = 1; y < c.h - 1; y++) {
    c.put(0, y, "o", "dim")
    c.put(c.w - 1, y, "o", "dim")
  }
  const rand = seeded(23)
  for (let i = 0; i < (c.w * c.h) / 40; i++) {
    c.put(1 + Math.floor(rand() * (c.w - 2)), 1 + Math.floor(rand() * (c.h - 2)), "~", "blue")
  }
  const pads = [
    [0.18, 0.3],
    [0.7, 0.25],
    [0.45, 0.72],
    [0.85, 0.7],
  ]
  for (const [px, py] of pads) {
    const x = Math.floor(px * c.w)
    const y = Math.floor(py * c.h)
    c.put(x, y, "(@@)", "green")
    c.put(x + 1, y - 1, "_", "green")
  }
  const koi: { rx: number; ry: number; speed: number; phase: number; tone: Tone }[] = [
    { rx: 0.36, ry: 0.32, speed: 0.12, phase: 0, tone: "red" },
    { rx: 0.28, ry: 0.22, speed: -0.09, phase: 2, tone: "yellow" },
    { rx: 0.2, ry: 0.3, speed: 0.15, phase: 4, tone: "white" },
  ]
  for (const k of koi) {
    const a = t * k.speed + k.phase
    const x = c.w / 2 + Math.cos(a) * k.rx * c.w - 3
    const y = c.h / 2 + Math.sin(a) * k.ry * c.h
    const goingRight = -Math.sin(a) * k.speed > 0
    c.put(x, y, goingRight ? "><(((°>" : "<°)))><", k.tone)
  }
  const cycle = wrap(t, 10)
  if (cycle < 4) {
    const rx = Math.floor(c.w * 0.3)
    const ry = Math.floor(c.h * 0.55)
    const r = Math.floor(cycle)
    c.put(rx - r, ry, "(" + " ".repeat(r * 2 + 1) + ")", "cyan")
  }
}

function drawStars(c: Canvas, t: number) {
  const rand = seeded(7)
  const count = Math.floor((c.w * c.h) / 18)
  for (let i = 0; i < count; i++) {
    const x = Math.floor(rand() * c.w)
    const y = Math.floor(rand() * (c.h - 2))
    const period = 6 + rand() * 10
    const on = wrap(t + rand() * period, period) < period * 0.7
    c.put(x, y, on ? (i % 5 === 0 ? "*" : ".") : i % 5 === 0 ? "+" : "\u00b7", i % 7 === 0 ? "cyan" : i % 3 === 0 ? "yellow" : "white")
  }
  const mx = Math.max(2, c.w - 12)
  c.put(mx, 1, " _..", "yellow")
  c.put(mx, 2, "(  '", "yellow")
  c.put(mx, 3, " `''", "yellow")
  const cycle = wrap(t, 20)
  if (cycle < 5) {
    const x = Math.floor(cycle * (c.w / 6))
    const y = 1 + Math.floor(cycle)
    c.put(x - 3, y, "--*", "yellow")
  }
  for (let x = 0; x < c.w; x++) {
    const hill = Math.round(Math.sin(x / 7) + Math.sin(x / 3.1) * 0.5)
    c.put(x, c.h - 2 + Math.max(-1, Math.min(0, hill)), "^", "green")
    c.put(x, c.h - 1, "#", "green")
  }
}

function drawLanterns(c: Canvas, t: number) {
  const lake = Math.max(4, Math.floor(c.h * 0.65))
  for (let x = 0; x < c.w; x++) {
    c.put(x, lake - 1, x % 9 < 5 ? "_" : "/", "dim")
    for (let y = lake; y < c.h; y++) {
      if ((x * 7 + y * 3 + Math.floor(t * 0.5)) % 11 === 0) c.put(x, y, "~", "blue")
    }
  }
  const rand = seeded(31)
  const n = Math.max(3, Math.floor(c.w / 10))
  for (let i = 0; i < n; i++) {
    const x = Math.floor(rand() * (c.w - 4)) + 1
    const speed = 0.25 + rand() * 0.25
    const start = rand() * lake
    const y = lake - 2 - wrap(start + t * speed, lake - 1)
    const tone: Tone = i % 3 === 0 ? "red" : "yellow"
    c.put(x, y, "[=]", tone)
    const ry = lake + Math.floor((lake - 2 - y) / 3)
    if (ry < c.h) c.put(x + 1, ry, Math.floor(t + i) % 2 ? ":" : "|", tone)
  }
}

export const SCENES: SceneDef[] = [
  { id: "sea", title: "sea", summary: "a calm sea under a sun, with fish, bubbles, weed and a small boat", draw: drawSea },
  { id: "koi-pond", title: "koi pond", summary: "a garden pond from above, with koi gliding under lily pads and a slow ripple", draw: drawKoi },
  { id: "starfield", title: "starfield", summary: "stars over hills, a crescent moon and a slow shooting star", draw: drawStars },
  { id: "lanterns", title: "lanterns", summary: "paper lanterns rising over a dark lake, with their reflections on the water", draw: drawLanterns },
]

export function findScene(raw: string): number {
  const key = raw.trim().toLowerCase().replace(/\s+/g, "-")
  return SCENES.findIndex((sc) => sc.id === key || sc.id.startsWith(key))
}

function rowRuns(row: Cell[]) {
  const runs: { text: string; tone: Tone }[] = []
  for (const cell of row) {
    const last = runs[runs.length - 1]
    if (last && (last.tone === cell.tone || cell.ch === " ")) last.text += cell.ch
    else runs.push({ text: cell.ch, tone: cell.tone })
  }
  return runs
}

const TONE_CLASS: Record<Tone, string> = {
  fg: s.fg, bold: s.bold, dim: s.dim, red: s.red, green: s.green, yellow: s.yellow,
  blue: s.blue, magenta: s.magenta, cyan: s.cyan, white: s.white,
}

const STILL_AT = 6
const TICK_MS = 250

export function ScenesView({
  start,
  themeName,
  reducedMotion,
  heightClass,
  onExit,
}: {
  start: number
  themeName: string
  reducedMotion: boolean
  heightClass: string
  onExit: (message: string) => void
}) {
  const [index, setIndex] = useState(start)
  const [paused, setPaused] = useState(false)
  const [t, setT] = useState(STILL_AT)
  const [size, setSize] = useState({ w: 40, h: 12 })
  const [said, setSaid] = useState("")
  const regionRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const probeRef = useRef<HTMLSpanElement>(null)
  const scene = SCENES[index]

  useEffect(() => {
    regionRef.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    const stage = stageRef.current
    const probe = probeRef.current
    if (!stage || !probe) return
    const measure = () => {
      const box = probe.getBoundingClientRect()
      const cw = box.width / 10 || 8
      const lh = box.height || 18
      setSize({
        w: Math.max(20, Math.min(80, Math.floor(stage.clientWidth / cw))),
        h: Math.max(8, Math.min(24, Math.floor(stage.clientHeight / lh))),
      })
    }
    const first = requestAnimationFrame(measure)
    const ro = new ResizeObserver(measure)
    ro.observe(stage)
    return () => {
      cancelAnimationFrame(first)
      ro.disconnect()
    }
  }, [])

  useEffect(() => {
    if (reducedMotion || paused) return
    const timer = setInterval(() => setT((v) => v + TICK_MS / 1000), TICK_MS)
    return () => clearInterval(timer)
  }, [reducedMotion, paused])

  const go = (step: number) => {
    const next = wrap(index + step, SCENES.length)
    setIndex(next)
    setSaid(`${SCENES[next].title}: ${SCENES[next].summary}`)
  }
  const togglePause = () => {
    if (reducedMotion) {
      setSaid("Reduced motion is on, so the scene is already a still frame.")
      return
    }
    setPaused((p) => !p)
    setSaid(paused ? "Playing." : "Paused.")
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    const k = e.key
    if (k === "n" || k === "N" || k === "ArrowRight") go(1)
    else if (k === "b" || k === "B" || k === "ArrowLeft") go(-1)
    else if (k === " ") togglePause()
    else if (k === "q" || k === "Q" || k === "Escape") onExit(`Closed zacess-scenes after ${scene.title}.`)
    else return
    e.preventDefault()
    e.stopPropagation()
  }

  const canvas = new Canvas(size.w, size.h)
  scene.draw(canvas, reducedMotion ? STILL_AT : t)
  const state = reducedMotion ? "still (reduced motion)" : paused ? "paused" : "playing"

  return (
    <div
      ref={regionRef}
      role="region"
      tabIndex={0}
      aria-label={`Zacess Scenes: ${scene.title}, ${scene.summary}. ${state}. Keys: n next, b back, Space pause, q quit.`}
      onKeyDown={onKeyDown}
      className={`${s.viewRegion} flex flex-col pt-2 ${heightClass}`}
    >
      <div ref={stageRef} className="relative flex-1 min-h-0 overflow-hidden px-1 sm:px-2" aria-hidden="true">
        <span ref={probeRef} className={`${s.probe} leading-[1.25]`}>0000000000</span>
        {canvas.cells.map((row, y) => (
          <div key={y} className="whitespace-pre leading-[1.25]">
            {rowRuns(row).map((run, i) => (
              <span key={i} className={TONE_CLASS[run.tone]}>
                {run.text}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className={`${s.nvimStatus} flex items-stretch text-xs leading-6 shrink-0`} aria-hidden="true">
        <span className={`${s.nvimMode} px-2 font-bold`}>SCENES</span>
        <span className="px-2 flex-1 min-w-0 truncate">
          {scene.title} {index + 1}/{SCENES.length}
        </span>
        <span className="px-2 hidden sm:inline truncate">{themeName}</span>
        <span className={`${s.nvimB} px-2`}>{state}</span>
      </div>
      <div className="flex flex-wrap gap-1 px-1 sm:px-2 pt-1 shrink-0">
        <button type="button" onClick={() => go(-1)} className={`${s.chip} min-h-11 px-3 rounded text-xs`}>
          b back
        </button>
        <button type="button" onClick={togglePause} aria-pressed={paused} className={`${s.chip} min-h-11 px-3 rounded text-xs`}>
          Space {paused ? "play" : "pause"}
        </button>
        <button type="button" onClick={() => go(1)} className={`${s.chip} min-h-11 px-3 rounded text-xs`}>
          n next
        </button>
        <button
          type="button"
          onClick={() => onExit(`Closed zacess-scenes after ${scene.title}.`)}
          className={`${s.chip} min-h-11 px-3 rounded text-xs`}
        >
          q quit
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {said}
      </p>
    </div>
  )
}

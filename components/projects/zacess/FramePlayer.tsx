"use client"

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react"
import { Pause, Play, SkipForward } from "lucide-react"
import MediaImage from "@/components/shared/MediaImage"
import type { FrameClip, PreviewStill } from "@/data/projects/zacess/previews"

export interface Frames {
  width: number
  height: number
  fps: number
  background: string
  frames: { x: number; y: number; text: string; colour: string }[][]
}

export const startsPlaying = (reduceMotion: boolean): boolean => !reduceMotion
export const shouldTick = (s: { playing: boolean; visible: boolean; loaded: boolean }): boolean => s.playing && s.visible && s.loaded
export const nextIndex = (i: number, n: number): number => (n > 0 ? (i + 1) % n : 0)
export const previewMode = (clips: readonly FrameClip[]): "frames" | "still" => (clips.length > 0 ? "frames" : "still")

const FONT = "15px ui-monospace, SFMono-Regular, Menlo, Consolas, 'DejaVu Sans Mono', monospace"
const ROW = 19

type Rect = [number, number, number, number]
const FULL: Rect[] = [[0, 0, 1, 1]]
const TL: Rect = [0, 0, 0.5, 0.5], TR: Rect = [0.5, 0, 1, 0.5], BL: Rect = [0, 0.5, 0.5, 1], BR: Rect = [0.5, 0.5, 1, 1]
const BLOCKS: Record<string, [Rect[], number]> = {
  "█": [FULL, 1], "▀": [[[0, 0, 1, 0.5]], 1], "▄": [[[0, 0.5, 1, 1]], 1],
  "▌": [[[0, 0, 0.5, 1]], 1], "▐": [[[0.5, 0, 1, 1]], 1],
  "▁": [[[0, 0.875, 1, 1]], 1], "▂": [[[0, 0.75, 1, 1]], 1], "▃": [[[0, 0.625, 1, 1]], 1],
  "▅": [[[0, 0.375, 1, 1]], 1], "▆": [[[0, 0.25, 1, 1]], 1], "▇": [[[0, 0.125, 1, 1]], 1],
  "▉": [[[0, 0, 0.875, 1]], 1], "▊": [[[0, 0, 0.75, 1]], 1], "▋": [[[0, 0, 0.625, 1]], 1],
  "▍": [[[0, 0, 0.375, 1]], 1], "▎": [[[0, 0, 0.25, 1]], 1], "▏": [[[0, 0, 0.125, 1]], 1],
  "▔": [[[0, 0, 1, 0.125]], 1], "▕": [[[0.875, 0, 1, 1]], 1],
  "░": [FULL, 0.25], "▒": [FULL, 0.5], "▓": [FULL, 0.75],
  "▖": [[BL], 1], "▗": [[BR], 1], "▘": [[TL], 1], "▝": [[TR], 1],
  "▙": [[TL, BL, BR], 1], "▚": [[TL, BR], 1], "▛": [[TL, TR, BL], 1],
  "▜": [[TL, TR, BR], 1], "▞": [[TR, BL], 1], "▟": [[TR, BL, BR], 1],
}

const REDUCE = "(prefers-reduced-motion: reduce)"
const subscribeReduce = (cb: () => void) => {
  const m = window.matchMedia(REDUCE)
  m.addEventListener("change", cb)
  return () => m.removeEventListener("change", cb)
}
const readReduce = () => window.matchMedia(REDUCE).matches

const cache = new Map<string, Promise<Frames>>()
function loadFrames(src: string): Promise<Frames> {
  let p = cache.get(src)
  if (!p) {
    p = fetch(src).then((r) => {
      if (!r.ok) throw new Error(String(r.status))
      return r.json() as Promise<Frames>
    })
    p.catch(() => cache.delete(src))
    cache.set(src, p)
  }
  return p
}

function drawFrame(canvas: HTMLCanvasElement, data: Frames, index: number) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  ctx.font = FONT
  const cellWidth = Math.ceil(ctx.measureText("M").width * 10) / 10
  const ratio = window.devicePixelRatio || 1
  const w = Math.round(data.width * cellWidth * ratio)
  const h = Math.round(data.height * ROW * ratio)
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w
    canvas.height = h
  }
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
  ctx.fillStyle = data.background
  ctx.fillRect(0, 0, data.width * cellWidth, data.height * ROW)
  ctx.font = FONT
  ctx.textBaseline = "middle"
  for (const run of data.frames[index] ?? []) {
    ctx.fillStyle = run.colour
    const chars = Array.from(run.text)
    for (let c = 0; c < chars.length; c++) {
      const ch = chars[c]
      if (ch === " ") continue
      const x = (run.x + c) * cellWidth
      const y = run.y * ROW
      const block = BLOCKS[ch]
      if (block) {
        ctx.globalAlpha = block[1]
        for (const [l, t, r, b] of block[0]) ctx.fillRect(x + l * cellWidth, y + t * ROW, (r - l) * cellWidth + 0.5, (b - t) * ROW + 0.5)
        ctx.globalAlpha = 1
      } else {
        ctx.fillText(ch, x, y + ROW / 2)
      }
    }
  }
}

interface Props {
  clips: readonly FrameClip[]
  still?: PreviewStill
  label: string
  nextText: string
}

const BUTTON =
  "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60"

export default function FramePlayer({ clips, still, label, nextText }: Props) {
  if (previewMode(clips) === "still") {
    if (!still) return null
    return (
      <MediaImage
        src={still.src}
        alt={still.alt}
        width={still.width}
        height={still.height}
        sizes="(max-width: 768px) 100vw, 720px"
        className="w-full h-auto rounded-md border border-border/60"
      />
    )
  }
  return <Player clips={clips} label={label} nextText={nextText} />
}

function Player({ clips, label, nextText }: { clips: readonly FrameClip[]; label: string; nextText: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [clip, setClip] = useState(0)
  const [loaded, setLoaded] = useState<{ src: string; data: Frames } | null>(null)
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const [choice, setChoice] = useState<boolean | null>(null)
  const reduceMotion = useSyncExternalStore(subscribeReduce, readReduce, () => true)
  const playing = choice ?? startsPlaying(reduceMotion)
  const [near, setNear] = useState(false)
  const [visible, setVisible] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [status, setStatus] = useState("")
  const frame = useRef(0)

  const src = clips[clip].src
  const data = loaded?.src === src ? loaded.data : null
  const failed = failedSrc === src

  useEffect(() => {
    const reduce = window.matchMedia(REDUCE)
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setChoice(false)
        setStatus("Paused")
      }
    }
    reduce.addEventListener("change", onChange)
    return () => reduce.removeEventListener("change", onChange)
  }, [])

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const nearObs = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setNear(true)
        nearObs.disconnect()
      }
    }, { rootMargin: "400px 0px" })
    const visObs = new IntersectionObserver((entries) => setVisible(entries[0]?.isIntersecting ?? false))
    nearObs.observe(el)
    visObs.observe(el)
    return () => {
      nearObs.disconnect()
      visObs.disconnect()
    }
  }, [])

  useEffect(() => {
    const onVis = () => setHidden(document.hidden)
    document.addEventListener("visibilitychange", onVis)
    return () => document.removeEventListener("visibilitychange", onVis)
  }, [])

  useEffect(() => {
    if (!near) return
    let live = true
    loadFrames(src)
      .then((json) => {
        if (!live) return
        frame.current = 0
        setLoaded({ src, data: json })
      })
      .catch(() => {
        if (!live) return
        setFailedSrc(src)
        setStatus("The animation could not load")
      })
    return () => {
      live = false
    }
  }, [near, src])

  useEffect(() => {
    if (data && canvasRef.current) drawFrame(canvasRef.current, data, frame.current)
  }, [data])

  useEffect(() => {
    if (!data || !shouldTick({ playing, visible: visible && !hidden, loaded: true })) return
    const id = window.setInterval(() => {
      frame.current = nextIndex(frame.current, data.frames.length)
      if (canvasRef.current) drawFrame(canvasRef.current, data, frame.current)
    }, 1000 / data.fps)
    return () => window.clearInterval(id)
  }, [data, playing, visible, hidden])

  const toggle = useCallback(() => {
    setStatus(playing ? "Paused" : "Playing")
    setChoice(!playing)
  }, [playing])

  const next = useCallback(() => {
    const n = nextIndex(clip, clips.length)
    setClip(n)
    setStatus(`Showing ${clips[n].label}`)
  }, [clip, clips])

  const current = clips[clip]
  return (
    <div ref={wrapRef} className="space-y-3">
      <div className="relative overflow-hidden rounded-md border border-border/60 bg-black" style={{ aspectRatio: "720 / 456" }}>
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`${label}: ${current.description}`}
          className="block h-full w-full object-contain"
          hidden={!data}
        />
        {!data && (
          <p className="absolute inset-0 flex items-center justify-center p-4 text-center text-sm text-white">
            {failed ? "The animation could not load. The description below says what it shows." : "The preview loads as you reach it"}
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className={BUTTON} onClick={toggle} aria-label={`${playing ? "Pause" : "Play"} the ${label}`}>
          {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
          {playing ? "Pause" : "Play"}
        </button>
        {clips.length > 1 && (
          <button type="button" className={BUTTON} onClick={next}>
            <SkipForward className="h-4 w-4" aria-hidden="true" />
            {nextText}
          </button>
        )}
        <p className="text-sm text-foreground/80">
          <span className="font-medium text-foreground">{current.label}</span>
          {clips.length > 1 && <span className="text-muted-foreground"> ({clip + 1} of {clips.length})</span>}
        </p>
      </div>
      <p className="text-sm text-muted-foreground">{current.description}.</p>
      <p className="sr-only" role="status" aria-live="polite">{status}</p>
    </div>
  )
}

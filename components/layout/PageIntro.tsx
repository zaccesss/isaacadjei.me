"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

const DRAW_MS = 3500
const HOLD_MS = 5000
const SEEN_KEY = "page-intro-seen"
const FADE_MS = 2000
const STRENGTH = 0.3
const HEADER_FALLBACK_PX = 65

type Painter = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void
function seeded(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let x = Math.imul(s ^ (s >>> 15), 1 | s)
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}
const ease = (t: number) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3)

function traces(seed: number): Painter {
  return (ctx, w, h, t) => {
    const rand = seeded(seed)
    const count = Math.round(Math.max(10, w / 70))
    for (let i = 0; i < count; i++) {
      const fromLeft = rand() < 0.5
      const dir = fromLeft ? 1 : -1
      let x = fromLeft ? 0 : w
      let y = rand() * h
      const points: [number, number][] = [[x, y]]
      const segments = 3 + Math.floor(rand() * 3)
      for (let s = 0; s < segments; s++) {
        const run = 30 + rand() * (w * 0.09)
        if (s % 2 === 0) x += dir * run
        else { const rise = (rand() < 0.5 ? -1 : 1) * (20 + rand() * 50); x += dir * Math.abs(rise); y += rise }
        points.push([x, y])
      }
      const lengths = points.slice(1).map(([px, py], n) => Math.hypot(px - points[n][0], py - points[n][1]))
      const total = lengths.reduce((a, b) => a + b, 0)
      let left = total * ease(t * 1.15 - rand() * 0.15)
      ctx.beginPath()
      ctx.moveTo(points[0][0], points[0][1])
      let end = points[0]
      for (let n = 0; n < lengths.length && left > 0; n++) {
        const part = Math.min(left / lengths[n], 1)
        end = [points[n][0] + (points[n + 1][0] - points[n][0]) * part, points[n][1] + (points[n + 1][1] - points[n][1]) * part]
        ctx.lineTo(end[0], end[1])
        left -= lengths[n]
      }
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(end[0], end[1], 3, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

function signal(seed: number): Painter {
  return (ctx, w, h, t) => {
    const rand = seeded(seed)
    const reach = w * ease(t)
    for (let line = 0; line < 3; line++) {
      const base = h * (0.22 + line * 0.28)
      const a = 18 + rand() * 30
      const f1 = 0.006 + rand() * 0.01
      const f2 = 0.02 + rand() * 0.03
      const phase = rand() * 6
      ctx.beginPath()
      for (let x = 0; x <= reach; x += 4) {
        const y = base + Math.sin(x * f1 + phase) * a + Math.sin(x * f2 + phase * 2) * a * 0.35
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    }
  }
}

function matrix(seed: number): Painter {
  return (ctx, w, h, t) => {
    const rand = seeded(seed)
    const gap = 34
    const cx = rand() * w
    const cy = rand() * h
    const reach = Math.hypot(w, h) * ease(t)
    for (let x = gap / 2; x < w; x += gap) {
      for (let y = gap / 2; y < h; y += gap) {
        const d = Math.hypot(x - cx, y - cy)
        if (d > reach) continue
        const glow = Math.max(0.15, 1 - (reach - d) / 260)
        ctx.globalAlpha = glow
        ctx.beginPath()
        ctx.arc(x, y, 1.6, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    ctx.globalAlpha = 1
  }
}

function graph(seed: number): Painter {
  return (ctx, w, h, t) => {
    const rand = seeded(seed)
    const count = Math.round(Math.max(24, (w * h) / 26000))
    const nodes = Array.from({ length: count }, () => [rand() * w, rand() * h] as const)
    const shown = Math.floor(count * ease(t))
    for (let i = 0; i < shown; i++) {
      const [x, y] = nodes[i]
      ctx.beginPath()
      ctx.arc(x, y, 2.2, 0, Math.PI * 2)
      ctx.fill()
      for (let j = 0; j < i; j++) {
        const d = Math.hypot(x - nodes[j][0], y - nodes[j][1])
        if (d > 170) continue
        ctx.globalAlpha = 1 - d / 170
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(nodes[j][0], nodes[j][1])
        ctx.stroke()
      }
      ctx.globalAlpha = 1
    }
  }
}

function contours(seed: number): Painter {
  return (ctx, w, h, t) => {
    const rand = seeded(seed)
    const peaks = 2 + Math.floor(rand() * 2)
    for (let p = 0; p < peaks; p++) {
      const cx = rand() * w
      const cy = rand() * h
      const rings = 7
      const wobble = [rand() * 6, rand() * 6, rand() * 6]
      const shown = rings * ease(t)
      for (let r = 0; r < shown; r++) {
        const radius = 40 + r * 46
        ctx.globalAlpha = Math.min(1, shown - r)
        ctx.beginPath()
        for (let a = 0; a <= Math.PI * 2 + 0.05; a += 0.08) {
          const bump = 1 + Math.sin(a * 3 + wobble[0]) * 0.12 + Math.sin(a * 5 + wobble[1]) * 0.06 + Math.sin(a * 2 + wobble[2]) * 0.08
          const x = cx + Math.cos(a) * radius * bump
          const y = cy + Math.sin(a) * radius * bump * 0.8
          if (a === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }
    }
    ctx.globalAlpha = 1
  }
}

const STYLES = [traces, signal, matrix, graph, contours]

const anyStyle = (not = -1) => {
  let pick = Math.floor(Math.random() * STYLES.length)
  if (pick === not) pick = (pick + 1) % STYLES.length
  return pick
}

let played = false

export default function PageIntro() {
  const pathname = usePathname()
  const canvas = useRef<HTMLCanvasElement>(null)
  const path = useRef(pathname)
  useEffect(() => {
    path.current = pathname
  }, [pathname])

  useEffect(() => {
    const el = canvas.current
    const ctx = el?.getContext("2d")
    if (!el || !ctx || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let frame = 0
    let current = -1
    const play = () => {
      current = anyStyle(current)
      const w = window.innerWidth
      const header = document.querySelector("header")?.getBoundingClientRect().height ?? HEADER_FALLBACK_PX
      const h = Math.max(window.innerHeight - header, 0)
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      el.width = w * ratio
      el.height = h * ratio
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      const colour = `hsl(${getComputedStyle(document.documentElement).getPropertyValue("--primary").trim()})`
      const paint = STYLES[current](Math.floor(Math.random() * 2 ** 31))
      let elapsed = 0
      let last = performance.now()
      const step = (now: number) => {
        if (!document.hidden) elapsed += Math.min(now - last, 50)
        last = now
        const fade = elapsed <= DRAW_MS + HOLD_MS ? 1 : 1 - (elapsed - DRAW_MS - HOLD_MS) / FADE_MS
        ctx.clearRect(0, 0, w, h)
        if (fade <= 0) {
          el.style.opacity = "0"
          played = true
          return
        }
        ctx.strokeStyle = colour
        ctx.fillStyle = colour
        ctx.lineWidth = 1.2
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        el.style.opacity = String(fade * STRENGTH)
        paint(ctx, w, h, Math.min(elapsed / DRAW_MS, 1))
        frame = requestAnimationFrame(step)
      }
      frame = requestAnimationFrame(step)
    }

    let seen = false
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === "1"
      if (!seen && path.current === "/") window.sessionStorage.setItem(SEEN_KEY, "1")
    } catch {
      // storage is unavailable in some private windows
    }
    if (!played && !seen && path.current === "/") play()

    return () => {
      cancelAnimationFrame(frame)
    }
  }, [])

  return <canvas ref={canvas} aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-[calc(4rem+1px)] -z-10 h-[calc(100dvh-4rem-1px)] w-screen opacity-0 page-intro-mask print:hidden" />
}

"use client"

import { useEffect, useRef, useState } from "react"
import { Download, Eraser, Pen, RotateCcw, Trash2 } from "lucide-react"
import type { Sketch, Stroke } from "@/lib/content/sketch"
import { SKETCH_LIMITS } from "@/lib/content/sketch"

const PALETTE = ["#111111", "#2445a8", "#c0392b", "#1e8449", "#d68910", "#8e44ad", "#17a2b8", "#e84393"]
const WIDTHS = [3, 6, 12] as const

type Props = { mode: "drawing" | "signature"; value: Sketch | null; onChange: (s: Sketch | null) => void }

export default function SketchPad({ mode, value, onChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const strokesRef = useRef<Stroke[]>(value?.s ?? [])
  const current = useRef<Stroke | null>(null)
  const [tool, setTool] = useState<"pen" | "eraser">("pen")
  const [colour, setColour] = useState(PALETTE[0])
  const [width, setWidth] = useState<number>(mode === "signature" ? 3 : 6)
  const [count, setCount] = useState(strokesRef.current.length)
  const W = 600
  const H = mode === "signature" ? 180 : 400

  function repaint() {
    const c = canvasRef.current
    const ctx = c?.getContext("2d")
    if (!c || !ctx) return
    ctx.clearRect(0, 0, W, H)
    for (const s of strokesRef.current) paint(ctx, s)
    if (current.current) paint(ctx, current.current)
  }
  function paint(ctx: CanvasRenderingContext2D, s: Stroke) {
    ctx.save()
    ctx.globalCompositeOperation = s.e ? "destination-out" : "source-over"
    ctx.strokeStyle = s.c
    ctx.lineWidth = s.w
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.beginPath()
    ctx.moveTo(s.p[0], s.p[1])
    for (let i = 2; i < s.p.length; i += 2) ctx.lineTo(s.p[i], s.p[i + 1])
    if (s.p.length === 2) ctx.lineTo(s.p[0], s.p[1])
    ctx.stroke()
    ctx.restore()
  }
  useEffect(repaint) // eslint-disable-line react-hooks/exhaustive-deps

  function commit() {
    const s = strokesRef.current
    setCount(s.length)
    onChange(s.length ? { w: W, h: H, s } : null)
  }
  function point(e: React.PointerEvent<HTMLCanvasElement>): [number, number] {
    const r = e.currentTarget.getBoundingClientRect()
    return [Math.round(((e.clientX - r.left) / r.width) * W), Math.round(((e.clientY - r.top) / r.height) * H)]
  }
  function down(e: React.PointerEvent<HTMLCanvasElement>) {
    if (strokesRef.current.length >= SKETCH_LIMITS.strokes) return
    e.currentTarget.setPointerCapture(e.pointerId)
    const [x, y] = point(e)
    const erase = tool === "eraser" && mode === "drawing"
    current.current = { c: erase ? "#ffffff" : colour, w: erase ? width * 3 : width, ...(erase ? { e: true as const } : {}), p: [x, y, x, y] }
    repaint()
  }
  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    const s = current.current
    if (!s) return
    const [x, y] = point(e)
    const lx = s.p[s.p.length - 2], ly = s.p[s.p.length - 1]
    if (Math.abs(x - lx) + Math.abs(y - ly) < 2) return
    s.p.push(x, y)
    repaint()
  }
  function up() {
    if (!current.current) return
    strokesRef.current = [...strokesRef.current, current.current]
    current.current = null
    commit()
  }
  function undo() {
    strokesRef.current = strokesRef.current.slice(0, -1)
    commit()
  }
  function clear() {
    strokesRef.current = []
    commit()
  }
  function download() {
    const out = document.createElement("canvas")
    out.width = W
    out.height = H + 28
    const ctx = out.getContext("2d")
    if (!ctx) return
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, out.width, out.height)
    for (const s of strokesRef.current) paint(ctx, s)
    ctx.fillStyle = "#64748b"
    ctx.font = "12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    ctx.textAlign = "right"
    ctx.fillText(`${mode === "signature" ? "Signed" : "Drawn"} at isaacadjei.me/guestbook`, W - 10, H + 18)
    out.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${mode}-from-isaacadjei.me.png`
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    }, "image/png")
  }

  const toolButton = "flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-md border px-3 text-sm"
  const on = "border-primary bg-accent font-semibold"
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2" role="toolbar" aria-label={mode === "signature" ? "Signature tools" : "Drawing tools"}>
        {mode === "drawing" && (
          <>
            <button type="button" className={`${toolButton} ${tool === "pen" ? on : ""}`} aria-pressed={tool === "pen"} onClick={() => setTool("pen")}>
              <Pen className="h-4 w-4" aria-hidden="true" /> Pen
            </button>
            <button type="button" className={`${toolButton} ${tool === "eraser" ? on : ""}`} aria-pressed={tool === "eraser"} onClick={() => setTool("eraser")}>
              <Eraser className="h-4 w-4" aria-hidden="true" /> Eraser
            </button>
          </>
        )}
        <div className="flex items-center gap-1" role="group" aria-label="Width">
          {WIDTHS.map((w) => (
            <button key={w} type="button" className={`${toolButton} ${width === w ? on : ""}`} aria-pressed={width === w} aria-label={`Width ${w}`} onClick={() => setWidth(w)}>
              <span className="rounded-full bg-foreground" style={{ width: w + 4, height: w + 4 }} aria-hidden="true" />
            </button>
          ))}
        </div>
        <button type="button" className={toolButton} onClick={undo} disabled={count === 0}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> Undo
        </button>
        <button type="button" className={toolButton} onClick={clear} disabled={count === 0}>
          <Trash2 className="h-4 w-4" aria-hidden="true" /> Clear
        </button>
        <button type="button" className={toolButton} onClick={download} disabled={count === 0}>
          <Download className="h-4 w-4" aria-hidden="true" /> Save as PNG
        </button>
      </div>
      {mode === "drawing" && (
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Colour">
          {PALETTE.map((c) => (
            <button
              key={c}
              type="button"
              className={`h-11 w-11 rounded-md border-2 ${colour === c && tool === "pen" ? "border-foreground ring-2 ring-primary" : "border-transparent"}`}
              style={{ background: c }}
              aria-label={`Colour ${c}`}
              aria-pressed={colour === c}
              onClick={() => { setColour(c); setTool("pen") }}
            />
          ))}
          <label className="flex min-h-11 items-center gap-2 rounded-md border px-3 text-sm">
            <input type="color" value={colour} onChange={(e) => { setColour(e.target.value); setTool("pen") }} aria-label="Any colour" className="h-8 w-10 cursor-pointer border-0 bg-transparent p-0" />
            Any colour
          </label>
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        role="img"
        aria-label={mode === "signature" ? "Signature area. Draw your signature here with a mouse, a finger or a pen." : "Drawing area. Draw here with a mouse, a finger or a pen."}
        className="w-full touch-none rounded-md border-2 border-dashed bg-white"
        style={{ aspectRatio: `${W} / ${H}`, cursor: tool === "eraser" ? "cell" : "crosshair" }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onPointerLeave={up}
      />
      <p className="text-xs text-muted-foreground" aria-live="polite">
        {count === 0 ? "Nothing drawn yet." : `${count} stroke${count === 1 ? "" : "s"}.`} The board is optional. Save as PNG keeps a copy for you.
      </p>
    </div>
  )
}

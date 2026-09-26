"use client"

import { useEffect } from "react"

const TILE_LIGHT = "#05070D"
const TILE_DARK = "#FAFAFA"
const DOT_LIGHT = "#5778DB"
const DOT_DARK = "#2445A8"

export default function FaviconAnimator() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const ua = navigator.userAgent
    const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(ua)
    if (isSafari) return

    const canvas = document.createElement("canvas")
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const link = document.createElement("link")
    link.rel = "icon"
    link.type = "image/png"
    document.head.appendChild(link)

    const darkMode = window.matchMedia("(prefers-color-scheme: dark)")

    function roundRect(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
      c.beginPath()
      c.moveTo(x + r, y)
      c.arcTo(x + w, y, x + w, y + h, r)
      c.arcTo(x + w, y + h, x, y + h, r)
      c.arcTo(x, y + h, x, y, r)
      c.arcTo(x, y, x + w, y, r)
      c.closePath()
    }

    let raf = 0
    let start = 0
    let last = 0

    function draw(t: number) {
      if (!ctx) return
      ctx.clearRect(0, 0, 64, 64)

      ctx.globalCompositeOperation = "source-over"
      ctx.fillStyle = darkMode.matches ? TILE_DARK : TILE_LIGHT
      roundRect(ctx, 5, 5, 54, 54, 13)
      ctx.fill()

      ctx.globalCompositeOperation = "destination-out"
      ctx.fillStyle = "#000000"
      ctx.font = "800 31px ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "alphabetic"
      ctx.fillText("ia", 26, 43)
      ctx.beginPath()
      ctx.arc(18, 21, 4.4, 0, Math.PI * 2)
      ctx.fill()

      ctx.globalCompositeOperation = "source-over"
      ctx.fillStyle = darkMode.matches ? DOT_DARK : DOT_LIGHT
      const swing = 0.5 + 0.5 * Math.sin(t * Math.PI)
      ctx.globalAlpha = 0.3 + 0.7 * swing
      ctx.beginPath()
      ctx.arc(18, 21, 4.4, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 0.3 + 0.7 * (1 - swing)
      ctx.beginPath()
      ctx.arc(45, 40, 3.6, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1

      link.href = canvas.toDataURL("image/png")
    }

    function loop(now: number) {
      if (!start) start = now
      if (now - last > 120) {
        last = now
        draw((now - start) / 1000)
      }
      raf = window.requestAnimationFrame(loop)
    }
    raf = window.requestAnimationFrame(loop)

    return () => {
      window.cancelAnimationFrame(raf)
      link.remove()
    }
  }, [])

  return null
}

"use client"

import { useEffect } from "react"

const TILE = "#05070D"
const EDGE = "rgba(250, 250, 250, 0.22)"
const LETTERS = "#FAFAFA"
const DOT = "#5778DB"

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
      ctx.save()
      ctx.scale(0.64, 0.64)

      roundRect(ctx, 6, 6, 88, 88, 22)
      ctx.fillStyle = TILE
      ctx.fill()
      roundRect(ctx, 6.75, 6.75, 86.5, 86.5, 21.25)
      ctx.strokeStyle = EDGE
      ctx.lineWidth = 1.5
      ctx.stroke()

      ctx.translate(50, 50)
      ctx.scale(0.92, 0.92)
      ctx.translate(-54, -50)

      ctx.strokeStyle = LETTERS
      ctx.lineWidth = 10
      ctx.lineCap = "round"
      ctx.beginPath()
      ctx.moveTo(31, 46)
      ctx.lineTo(31, 76)
      ctx.moveTo(72.5, 46)
      ctx.lineTo(72.5, 76)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(57.5, 61, 15, 0, Math.PI * 2)
      ctx.stroke()

      ctx.fillStyle = DOT
      const swing = 0.5 + 0.5 * Math.sin(t * Math.PI)
      ctx.globalAlpha = 0.35 + 0.65 * swing
      ctx.beginPath()
      ctx.arc(31, 29, 6, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 0.35 + 0.65 * (1 - swing)
      ctx.beginPath()
      ctx.arc(86, 73, 5.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1
      ctx.restore()

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

"use client"
import { useEffect } from "react"

export default function HashScroll() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id) return
    let stopped = false
    const stop = () => {
      stopped = true
    }
    const jump = () => {
      if (stopped) return
      document.getElementById(id)?.scrollIntoView({ block: "start" })
    }
    window.addEventListener("touchstart", stop, { once: true, passive: true })
    window.addEventListener("wheel", stop, { once: true, passive: true })
    window.addEventListener("keydown", stop, { once: true })
    const frame = requestAnimationFrame(jump)
    const timers = [400, 1200, 2500].map((ms) => window.setTimeout(jump, ms))
    return () => {
      cancelAnimationFrame(frame)
      timers.forEach(clearTimeout)
      window.removeEventListener("touchstart", stop)
      window.removeEventListener("wheel", stop)
      window.removeEventListener("keydown", stop)
    }
  }, [])
  return null
}

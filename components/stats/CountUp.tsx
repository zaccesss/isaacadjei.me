"use client"

import { useEffect, useRef, useState } from "react"

const DURATION_MS = 1000

function decimalsOf(n: number): number {
  const part = String(n).split(".")[1]
  return part ? Math.min(part.length, 2) : 0
}

export default function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState<string>(String(value))

  useEffect(() => {
    const el = ref.current
    if (!el || !Number.isFinite(value) || value === 0) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (typeof IntersectionObserver === "undefined") return

    const places = decimalsOf(value)
    let raf = 0
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        observer.disconnect()
        let start = 0
        const step = (now: number) => {
          if (!start) start = now
          const t = Math.min(1, (now - start) / DURATION_MS)
          const eased = 1 - Math.pow(1 - t, 3)
          setShown(t < 1 ? (value * eased).toFixed(places) : String(value))
          if (t < 1) raf = requestAnimationFrame(step)
        }
        raf = requestAnimationFrame(step)
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value])

  return (
    <span ref={ref} className="tabular-nums">
      <span aria-hidden="true">
        {shown}
        {suffix}
      </span>
      <span className="sr-only">
        {value}
        {suffix}
      </span>
    </span>
  )
}

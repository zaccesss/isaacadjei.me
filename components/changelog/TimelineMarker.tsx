"use client"

import { useEffect, useRef } from "react"

const ANCHOR = 0.38

export default function TimelineMarker() {
  const fill = useRef<HTMLSpanElement>(null)
  const dot = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const line = fill.current?.closest("ol")
    if (!line || !fill.current || !dot.current) return
    let frame = 0

    const place = () => {
      frame = 0
      if (!fill.current || !dot.current) return
      const box = line.getBoundingClientRect()
      const at = Math.min(Math.max(window.innerHeight * ANCHOR - box.top, 0), box.height)
      fill.current.style.height = `${at}px`
      dot.current.style.transform = `translateY(${at}px)`
      dot.current.style.opacity = at > 0 && at < box.height ? "1" : "0"
    }
    const ask = () => {
      if (!frame) frame = requestAnimationFrame(place)
    }

    place()
    window.addEventListener("scroll", ask, { passive: true })
    window.addEventListener("resize", ask)
    return () => {
      window.removeEventListener("scroll", ask)
      window.removeEventListener("resize", ask)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <>
      <span ref={fill} aria-hidden="true" className="pointer-events-none absolute -left-0.5 top-0 w-0.5 bg-primary motion-reduce:hidden" />
      <span
        ref={dot}
        aria-hidden="true"
        className="pointer-events-none absolute -left-[9px] -top-2 z-10 h-4 w-4 rounded-full bg-primary opacity-0 ring-4 ring-primary/25 transition-opacity duration-200 motion-reduce:hidden"
      />
    </>
  )
}

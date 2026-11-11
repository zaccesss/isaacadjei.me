"use client"

import { useEffect, useRef } from "react"

const ANCHOR = 0.38

interface Props {
  fillClass?: string
  dotClass?: string
}

export default function TimelineMarker({ fillClass = "-left-0.5 top-0", dotClass = "-left-[9px] -top-2 z-10" }: Props) {
  const fill = useRef<HTMLSpanElement>(null)
  const dot = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const line = fill.current?.closest<HTMLElement>("[data-timeline], ol")
    if (!line || !fill.current || !dot.current) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let frame = 0

    const place = () => {
      frame = 0
      if (!fill.current || !dot.current) return
      const box = line.getBoundingClientRect()
      const at = Math.min(Math.max(window.innerHeight * ANCHOR - box.top, 0), box.height)
      fill.current.style.height = `${at}px`
      dot.current.style.transform = `translateY(${at}px)`
      dot.current.style.opacity = at > 0 && at < box.height ? "1" : "0"
      line.querySelectorAll<HTMLElement>("[data-timeline-mark]").forEach((mark) => {
        const m = mark.getBoundingClientRect()
        mark.dataset.reached = String(m.top + m.height / 2 - box.top <= at)
      })
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
      <span ref={fill} aria-hidden="true" className={`pointer-events-none absolute w-0.5 bg-primary motion-reduce:hidden ${fillClass}`} />
      <span
        ref={dot}
        aria-hidden="true"
        className={`pointer-events-none absolute h-4 w-4 rounded-full bg-primary opacity-0 ring-4 ring-primary/25 transition-opacity duration-200 motion-reduce:hidden ${dotClass}`}
      />
    </>
  )
}

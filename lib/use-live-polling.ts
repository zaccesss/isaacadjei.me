"use client"

import { useEffect, useRef, useState, type RefObject } from "react"

export type PollMode = "off" | "live" | "idle"

export const IDLE_AFTER_MS = 3 * 60 * 1000

const INPUT_EVENTS = ["pointerdown", "pointermove", "keydown", "scroll", "wheel", "touchstart"] as const

export function useLiveMode(ref: RefObject<Element | null>, idleAfterMs: number = IDLE_AFTER_MS): PollMode {
  const [visible, setVisible] = useState(() => typeof document === "undefined" || !document.hidden)
  const [onScreen, setOnScreen] = useState(false)
  const [idle, setIdle] = useState(false)

  useEffect(() => {
    const update = () => setVisible(!document.hidden)
    document.addEventListener("visibilitychange", update)
    return () => document.removeEventListener("visibilitychange", update)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === "undefined") {
      const t = setTimeout(() => setOnScreen(true), 0)
      return () => clearTimeout(t)
    }
    const io = new IntersectionObserver((entries) => setOnScreen(entries.some((e) => e.isIntersecting)), { rootMargin: "200px" })
    io.observe(el)
    return () => io.disconnect()
  }, [ref])

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    let last = 0
    const arm = () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => setIdle(true), idleAfterMs)
    }
    const onInput = () => {
      const now = Date.now()
      if (now - last < 1000) return
      last = now
      setIdle(false)
      arm()
    }
    arm()
    for (const e of INPUT_EVENTS) window.addEventListener(e, onInput, { passive: true })
    return () => {
      if (timer) clearTimeout(timer)
      for (const e of INPUT_EVENTS) window.removeEventListener(e, onInput)
    }
  }, [idleAfterMs])

  if (!visible || !onScreen) return "off"
  return idle ? "idle" : "live"
}

export function schedule(fn: () => void, ms: number, lastRef: { current: number }): () => void {
  const run = () => {
    lastRef.current = Date.now()
    fn()
  }
  let interval: ReturnType<typeof setInterval> | undefined
  const wait = Math.max(0, ms - (Date.now() - lastRef.current))
  const first = setTimeout(() => {
    run()
    interval = setInterval(run, ms)
  }, wait)
  return () => {
    clearTimeout(first)
    if (interval) clearInterval(interval)
  }
}

export function usePoll(fn: () => void, ref: RefObject<Element | null>, liveMs: number, idleMs: number = liveMs * 4) {
  const mode = useLiveMode(ref)
  const saved = useRef(fn)
  const last = useRef(0)
  useEffect(() => {
    saved.current = fn
  }, [fn])
  useEffect(() => {
    if (mode === "off") return
    return schedule(() => saved.current(), mode === "live" ? liveMs : idleMs, last)
  }, [mode, liveMs, idleMs])
}

"use client"

import { useEffect, useRef } from "react"

export function useVisibleInterval(callback: () => void, ms: number) {
  const saved = useRef(callback)
  useEffect(() => {
    saved.current = callback
  }, [callback])

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined
    let last = 0
    const run = () => {
      last = Date.now()
      saved.current()
    }
    const start = () => {
      if (timer === undefined) timer = setInterval(run, ms)
    }
    const stop = () => {
      if (timer !== undefined) clearInterval(timer)
      timer = undefined
    }
    const onVisibility = () => {
      if (document.hidden) {
        stop()
        return
      }
      if (Date.now() - last >= ms) run()
      start()
    }

    const first = setTimeout(run, 0)
    if (!document.hidden) start()
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      clearTimeout(first)
      stop()
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [ms])
}

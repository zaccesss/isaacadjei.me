"use client"

import { useState, useLayoutEffect } from "react"

export function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0)

  useLayoutEffect(() => {
    let rafId = 0
    const handleScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => setScrollY(window.scrollY))
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return scrollY
}

export function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useLayoutEffect(() => {
    let rafId = 0
    const calc = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const current = window.scrollY
      setProgress(totalHeight > 0 ? (current / totalHeight) * 100 : 0)
    }
    const handleScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(calc)
    }
    calc()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return progress
}

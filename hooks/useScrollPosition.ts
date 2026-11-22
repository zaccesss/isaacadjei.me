"use client"

import { useState, useLayoutEffect } from "react"

export function useScrolledPast(threshold = 10) {
  const [past, setPast] = useState(false)

  useLayoutEffect(() => {
    let rafId = 0
    const check = () => setPast(window.scrollY > threshold)
    const handleScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(check)
    }
    check()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      cancelAnimationFrame(rafId)
    }
  }, [threshold])

  return past
}

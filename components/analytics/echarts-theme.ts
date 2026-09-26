"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

export interface EChartsColours {
  border: string
  primary: string
  muted: string
  mutedForeground: string
  foreground: string
  background: string
  card: string
}

const VARS: Record<keyof EChartsColours, string> = {
  border: "--border",
  primary: "--primary",
  muted: "--muted",
  mutedForeground: "--muted-foreground",
  foreground: "--foreground",
  background: "--background",
  card: "--card",
}

function toHslString(raw: string): string {
  const [h, s, l] = raw.split(/\s+/)
  return `hsl(${h}, ${s}, ${l})`
}

const FALLBACK: EChartsColours = {
  border: toHslString("214.3 31.8% 91.4%"),
  primary: toHslString("225 65% 40%"),
  muted: toHslString("210 40% 96.1%"),
  mutedForeground: toHslString("215.4 16.3% 46.9%"),
  foreground: toHslString("222.2 84% 4.9%"),
  background: toHslString("0 0% 100%"),
  card: toHslString("0 0% 100%"),
}

export function useEChartsColours(): EChartsColours {
  const { resolvedTheme } = useTheme()
  const [colours, setColours] = useState<EChartsColours>(FALLBACK)

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const styles = getComputedStyle(document.documentElement)
      const next = {} as EChartsColours
      for (const key of Object.keys(VARS) as (keyof EChartsColours)[]) {
        const raw = styles.getPropertyValue(VARS[key]).trim()
        next[key] = raw ? toHslString(raw) : FALLBACK[key]
      }
      setColours(next)
    })
    return () => cancelAnimationFrame(raf)
  }, [resolvedTheme])

  return colours
}

export function intensityScale(colours: EChartsColours): string[] {
  return [colours.border, "#93c5fd", "#60a5fa", "#3b82f6", colours.primary]
}

export function relativeLevel(value: number, max: number): 0 | 1 | 2 | 3 | 4 {
  if (value <= 0 || max <= 0) return 0
  const ratio = value / max
  if (ratio < 0.15) return 1
  if (ratio < 0.35) return 2
  if (ratio < 0.65) return 3
  return 4
}

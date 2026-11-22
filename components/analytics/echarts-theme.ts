"use client"

import { useEffect, useState } from "react"
import { CHART_LIGHT, chartHex } from "@/lib/ui/chart-palette"
import { useTheme } from "next-themes"

export interface EChartsColours {
  border: string
  primary: string
  muted: string
  mutedForeground: string
  foreground: string
  background: string
  card: string
  accent: string
}

const VARS: Record<Exclude<keyof EChartsColours, "accent">, string> = {
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
  mutedForeground: toHslString("215.3 19.3% 34.5%"),
  foreground: toHslString("222.2 84% 4.9%"),
  background: toHslString("0 0% 100%"),
  card: toHslString("0 0% 100%"),
  accent: CHART_LIGHT["chart-1"],
}

export function useEChartsColours(): EChartsColours {
  const { resolvedTheme } = useTheme()
  const [colours, setColours] = useState<EChartsColours>(FALLBACK)

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const styles = getComputedStyle(document.documentElement)
      const next = { ...FALLBACK }
      for (const key of Object.keys(VARS) as (keyof typeof VARS)[]) {
        const raw = styles.getPropertyValue(VARS[key]).trim()
        next[key] = raw ? toHslString(raw) : FALLBACK[key]
      }
      const accent = styles.getPropertyValue("--chart-1").trim()
      if (/^#[0-9a-f]{6}$/i.test(accent)) next.accent = accent
      setColours(next)
    })
    return () => cancelAnimationFrame(raf)
  }, [resolvedTheme])

  return colours
}

export function intensityScale(colours: EChartsColours): string[] {
  const hex = colours.accent
  const rgb = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(", ")
  return [colours.border, `rgba(${rgb}, 0.3)`, `rgba(${rgb}, 0.52)`, `rgba(${rgb}, 0.76)`, hex]
}

export function relativeLevel(value: number, max: number): 0 | 1 | 2 | 3 | 4 {
  if (value <= 0 || max <= 0) return 0
  const ratio = value / max
  if (ratio < 0.15) return 1
  if (ratio < 0.35) return 2
  if (ratio < 0.65) return 3
  return 4
}

export function useChartSeries(): string[] {
  const { resolvedTheme } = useTheme()
  return chartHex(resolvedTheme === "dark")
}

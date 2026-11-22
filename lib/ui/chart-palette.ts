export const CHART_LIGHT = {
  "chart-1": "#3b82f6", // blue, the accent series
  "chart-2": "#16a34a", // green
  "chart-3": "#d97706", // amber
  "chart-4": "#f43f5e", // rose
  "chart-5": "#8b5cf6", // violet
  "chart-6": "#0891b2", // cyan
  "chart-7": "#ea580c", // orange
  "chart-8": "#475569", // slate
  "chart-neutral": "#64748b", // the series that are not the point
} as const

export const CHART_DARK = {
  "chart-1": "#60a5fa",
  "chart-2": "#34d399",
  "chart-3": "#fbbf24",
  "chart-4": "#fb7185",
  "chart-5": "#a78bfa",
  "chart-6": "#22d3ee",
  "chart-7": "#fb923c",
  "chart-8": "#cbd5e1",
  "chart-neutral": "#94a3b8",
} as const

export type ChartToken = keyof typeof CHART_LIGHT

export const chartVar = (token: ChartToken) => `var(--${token})`
export const CHART_COLOURS = (["chart-1", "chart-2", "chart-3", "chart-4", "chart-5", "chart-6", "chart-7", "chart-8"] as const).map(chartVar)
export const CHART_NEUTRAL = chartVar("chart-neutral")

export function chartHex(dark: boolean): string[] {
  const set = dark ? CHART_DARK : CHART_LIGHT
  return (["chart-1", "chart-2", "chart-3", "chart-4", "chart-5", "chart-6", "chart-7", "chart-8"] as const).map((k) => set[k])
}

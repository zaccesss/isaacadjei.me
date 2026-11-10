import type { PublicStats } from "@/lib/stats/public-stats"

const DAY = 86400000
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0)

function isFlat(hours: number[]): boolean {
  const min = Math.min(...hours)
  return hours.length === 24 && min > 0 && Math.max(...hours) <= min * 2
}

export function hourName(h: number): string {
  const x = ((h % 24) + 24) % 24
  if (x === 0) return "midnight"
  if (x === 12) return "midday"
  return x < 12 ? `${x}am` : `${x - 12}pm`
}

export function dayName(date: string): string {
  const d = new Date(`${date}T12:00:00Z`)
  return Number.isNaN(d.getTime()) ? date : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })
}

export function longestRun(dates: Iterable<string>): { days: number; end: string } | null {
  const sorted = [...new Set(dates)].sort()
  let best: { days: number; end: string } | null = null
  let run = 0
  let prev = 0
  for (const d of sorted) {
    const t = Date.parse(`${d}T12:00:00Z`)
    run = run > 0 && t - prev === DAY ? run + 1 : 1
    prev = t
    if (!best || run > best.days) best = { days: run, end: d }
  }
  return best
}

export function peakWindow(hours: number[], width = 3): { start: number; end: number; share: number } | null {
  const total = sum(hours)
  if (hours.length !== 24 || total <= 0) return null
  let best = 0
  let bestSum = -1
  for (let s = 0; s < 24; s++) {
    let w = 0
    for (let i = 0; i < width; i++) w += hours[(s + i) % 24]
    if (w > bestSum) { bestSum = w; best = s }
  }
  return { start: best, end: (best + width) % 24, share: bestSum / total }
}

export function shareBetween(hours: number[], from: number, to: number): number {
  const total = sum(hours)
  if (total <= 0) return 0
  let part = 0
  for (let h = from; h !== to; h = (h + 1) % 24) part += hours[h] ?? 0
  return part / total
}

export function soundtrack(s: PublicStats): { data: { name: string; plays: number; coding: number }[]; summary: string | null } {
  const coding = s.coding.hourOfDay.map((x) => x.value)
  const plays = s.music.hours
  const data = Array.from({ length: 24 }, (_, h) => ({ name: hourName(h), plays: plays[h] ?? 0, coding: coding[h] ?? 0 }))
  if (sum(coding) < 20 || sum(plays) < 200) return { data, summary: null }
  const cp = peakWindow(coding, 1)
  const pp = peakWindow(plays, 1)
  const meanC = sum(coding) / 24
  const meanP = sum(plays) / 24
  const both = data.map((_, h) => coding[h] > meanC && plays[h] > meanP)
  let bestStart = -1
  let bestLen = 0
  for (let s0 = 0; s0 < 24; s0++) {
    if (!both[s0] || both[(s0 + 23) % 24]) continue
    let len = 0
    while (len < 24 && both[(s0 + len) % 24]) len++
    if (len > bestLen) { bestLen = len; bestStart = s0 }
  }
  if (bestStart === -1 && both.every(Boolean)) { bestStart = 0; bestLen = 24 }
  const peaks = !cp || !pp ? "" : isFlat(plays) ? `My listening stays almost level all day, while my coding peaks at ${hourName(cp.start)}.` : `My coding peaks at ${hourName(cp.start)} and my listening at ${hourName(pp.start)}.`
  const overlap = !isFlat(plays) && bestLen >= 2 && bestLen < 24 ? ` Both run above their usual level from ${hourName(bestStart)} to ${hourName(bestStart + bestLen)}.` : ""
  return { data, summary: `${peaks}${overlap}`.trim() || null }
}

const NOT_CODE = new Set(["markdown", "mdx", "other", "yaml", "json", "text", "plain text", "git config", "git", "gitignore file", "toml", "ini", "xml", "diff", "tsconfig", "public key", "tex", "graphviz (dot)", "tmux", "docker", "makefile"])
export function isCode(name: string): boolean {
  const n = name.trim().toLowerCase()
  return !NOT_CODE.has(n) && !n.startsWith("image")
}

export function londonOffsetHours(date: string): number {
  const noon = new Date(`${date}T12:00:00Z`)
  const londonHour = Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", hour: "2-digit", hour12: false }).format(noon))
  return (londonHour - 12 + 24) % 24
}

export function utcHoursToLondon(hours: number[], date: string): number[] {
  const off = londonOffsetHours(date)
  const out = Array(24).fill(0) as number[]
  hours.forEach((v, h) => { out[(h + off) % 24] += v ?? 0 })
  return out
}

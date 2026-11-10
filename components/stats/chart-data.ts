import type { RawPost, RawTIL, RawDated } from "@/lib/content/content-stats-compute"

type Named = { name: string; value: number }
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const DAY_WORDS: Record<string, string> = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday" }
const round = (n: number, d = 1) => Math.round(n * 10 ** d) / 10 ** d
const num = (n: number) => n.toLocaleString("en-GB")
const count = (n: number, unit: string) => `${num(n)} ${n === 1 && unit.endsWith("s") ? unit.slice(0, -1) : unit}`

export function cumulative(rows: Named[]): Named[] {
  let total = 0
  return rows.map((r) => ({ name: r.name, value: round((total += r.value)) }))
}

export function yearToDate(daily: { date: string; value: number }[]): Named[] {
  const last = daily.at(-1)?.date
  if (!last) return []
  const year = last.slice(0, 4)
  const rows = daily.filter((d) => d.date.startsWith(year)).map((d) => ({ name: shortDay(d.date), value: d.value }))
  return cumulative(rows)
}

function shortDay(date: string): string {
  const d = new Date(`${date}T12:00:00Z`)
  return Number.isNaN(d.getTime()) ? date : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" })
}

export function weekdayTotals(grid: { day: number; value: number }[]): Named[] {
  const totals = [0, 0, 0, 0, 0, 0, 0]
  for (const g of grid) if (g.day >= 0 && g.day < 7) totals[g.day] += g.value
  return DAYS.map((name, i) => ({ name, value: round(totals[i]) }))
}

export function fourWeekChange(weeks: { coding: number; gaming: number; plays: number; github: number }[]): Named[] {
  const areas: [string, "coding" | "gaming" | "plays" | "github"][] = [["Coding", "coding"], ["Gaming", "gaming"], ["Listening", "plays"], ["GitHub", "github"]]
  if (weeks.length < 8) return []
  const recent = weeks.slice(-4)
  const before = weeks.slice(-8, -4)
  const total = (ws: typeof weeks, k: (typeof areas)[number][1]) => ws.reduce((s, w) => s + w[k], 0)
  return areas
    .map(([name, k]) => ({ name, before: total(before, k), now: total(recent, k) }))
    .filter((a) => a.before > 0)
    .map((a) => ({ name: a.name, value: Math.round(((a.now - a.before) / a.before) * 100) }))
}

export function daysByAreas(activeDays: { value: number }[]): Named[] {
  const counts = [0, 0, 0, 0]
  for (const d of activeDays) if (d.value >= 1 && d.value <= 4) counts[d.value - 1]++
  return counts.map((value, i) => ({ name: i === 0 ? "1 area" : `${i + 1} areas`, value }))
}

export type WritingExtra = { weekdays: Named[]; lengthByKind: { name: string; values: number[] }[] }

export function writingExtra(posts: RawPost[], til: RawTIL[], notes: RawDated[], issues: RawDated[]): WritingExtra {
  const totals = [0, 0, 0, 0, 0, 0, 0]
  for (const { date } of [...posts, ...til, ...notes, ...issues]) {
    const d = new Date(`${date.slice(0, 10)}T12:00:00Z`)
    if (!Number.isNaN(d.getTime())) totals[(d.getUTCDay() + 6) % 7]++
  }
  const kinds = new Map<string, number[]>()
  for (const p of posts) if (p.readingTime > 0) kinds.set(p.type || "Other", [...(kinds.get(p.type || "Other") ?? []), p.readingTime])
  return {
    weekdays: DAYS.map((name, i) => ({ name, value: totals[i] })),
    lengthByKind: [...kinds.entries()].map(([name, values]) => ({ name: capitalise(name), values })).sort((a, b) => b.values.length - a.values.length).slice(0, 6),
  }
}

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export function weekdaySummary(rows: Named[], unit: string): string {
  if (rows.every((r) => r.value === 0)) return `Nothing to show by weekday yet.`
  const sorted = [...rows].sort((a, b) => b.value - a.value)
  const top = sorted[0]
  const low = sorted.at(-1)!
  return `Most on ${DAY_WORDS[top.name] ?? top.name} with ${count(top.value, unit)}, least on ${DAY_WORDS[low.name] ?? low.name} with ${count(low.value, unit)}.`
}

export function listSummary(rows: Named[], unit: string, format: (v: number) => string = num): string {
  return rows.map((r) => (format === num ? `${r.name}: ${count(r.value, unit)}` : `${r.name}: ${format(r.value)} ${unit}`).trim()).join(". ") + "."
}

export function spreadSummary(values: number[], unit: string, what: string): string {
  if (values.length === 0) return `No ${what} to show yet.`
  const sorted = [...values].sort((a, b) => a - b)
  const median = sorted[Math.floor(sorted.length / 2)]
  return `Across ${num(values.length)} ${what}, the middle value is ${num(median)} ${unit} and they range from ${num(sorted[0])} to ${num(sorted.at(-1)!)} ${unit}.`
}

export function totalSummary(rows: Named[], unit: string, from: string): string {
  const last = rows.at(-1)
  if (!last) return "Nothing to show yet."
  return `The running total climbs from ${from} to ${num(last.value)} ${unit} by ${last.name}.`
}

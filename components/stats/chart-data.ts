import type { RawPost, RawTIL, RawDated } from "@/lib/content/content-stats-compute"
import { ukShortDate } from "@/lib/time/short-date"

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

export function rangeSummary(rows: Named[], unit: string): string {
  if (!rows.some((r) => r.value !== 0)) return "Nothing to show yet."
  const top = rows.reduce((a, b) => (b.value > a.value ? b : a))
  const low = rows.reduce((a, b) => (b.value < a.value ? b : a))
  return `Highest in ${top.name} with ${count(top.value, unit)}, lowest in ${low.name} with ${count(low.value, unit)}.`
}

export function topSummary(rows: Named[], unit: string, n = 3): string {
  const top = rows.filter((r) => r.value > 0).sort((a, b) => b.value - a.value).slice(0, n).map((r) => `${r.name} with ${count(r.value, unit)}`)
  if (top.length === 0) return "Nothing to show yet."
  if (top.length === 1) return `Most is ${top[0]}.`
  return `Most is ${top[0]}, then ${top.length === 2 ? top[1] : `${top.slice(1, -1).join(", ")} and ${top.at(-1)}`}.`
}

export function boxSummary(groups: { name: string; values: number[] }[], unit: string): string {
  const parts = groups.filter((g) => g.values.length > 0).map((g) => {
    const sorted = [...g.values].sort((a, b) => a - b)
    return `${g.name} ${num(round(sorted[Math.floor(sorted.length / 2)]))} ${unit}`
  })
  return parts.length ? `The middle value for each: ${parts.join(", ")}.` : "Nothing to show yet."
}

export function gridSummary(grid: { day: number; hour: number; value: number }[], unit: string): string {
  const top = grid.reduce<(typeof grid)[number] | null>((a, b) => (!a || b.value > a.value ? b : a), null)
  if (!top || top.value <= 0) return "Nothing to show yet."
  return `Busiest on ${DAY_WORDS[DAYS[top.day]] ?? DAYS[top.day]} at ${String(top.hour).padStart(2, "0")}:00 with ${count(round(top.value), unit)}.`
}

export function calendarSummary(days: { date: string; value: number }[], unit: string): string {
  const active = days.filter((d) => d.value > 0)
  if (active.length === 0) return "Nothing to show yet."
  const top = active.reduce((a, b) => (b.value > a.value ? b : a))
  return `${count(active.length, "active days")}. The busiest was ${ukShortDate(top.date)} with ${count(round(top.value), unit)}.`
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]

export function monthName(key: string): string {
  const [y, m] = key.split("-").map(Number)
  return y && m >= 1 && m <= 12 ? `${MONTH_NAMES[m - 1]} ${y}` : key
}

export function weekName(key: string): string {
  const [m, d] = key.split("-").map(Number)
  return m >= 1 && m <= 12 && d ? `${d} ${MONTH_NAMES[m - 1]}` : key
}

export function relabel<T extends { name: string }>(rows: T[], label: (name: string) => string): T[] {
  return rows.map((r) => ({ ...r, name: label(r.name) }))
}

export function totalsSummary(rows: Record<string, unknown>[], series: { key: string; name: string }[], unit: string): string {
  const totals = series.map((s) => ({ name: s.name, value: round(rows.reduce((sum, r) => sum + (Number(r[s.key]) || 0), 0)) }))
  if (!totals.some((t) => t.value > 0)) return "Nothing to show yet."
  return `In total: ${totals.map((t) => `${t.name} ${count(t.value, unit)}`.trim()).join(", ")}.`
}

export function treeTotals(tree: { name: string; value?: number; children?: { value?: number }[] }[]): Named[] {
  return tree.map((t) => ({ name: t.name, value: round(t.children?.length ? t.children.reduce((s, c) => s + (c.value ?? 0), 0) : (t.value ?? 0)) }))
}

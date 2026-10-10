import { unstable_cache } from "next/cache"
import { supabase } from "@/lib/supabase"
import { readAll } from "@/lib/supabase-read-all"
import { publicEditorName } from "@/lib/wakatime-editors"
import { summarise, type GameSessionRow, type PlaytimeRow, type GenreRow, type GamingSummary } from "@/lib/gaming"

export type Named = { name: string; value: number }
export type Week = { name: string; coding: number; gaming: number; plays: number; github: number }

export type PublicStats = {
  weeks: Week[]
  coding: {
    hours30: number
    activeDays30: number
    streak: number
    totalHours: number
    languages: Named[]
    editors: Named[]
    weekdays: Named[]
    months: Named[]
    hourOfDay: Named[]
  }
  music: { plays30: number; totalPlays: number; months: Named[]; grid: { day: number; hour: number; value: number }[]; weekdays: Named[] }
  gaming: GamingSummary
  github: { total30: number; total365: number; months: Named[] }
  applications: { total: number; countries: Named[]; months: Named[] }
}

const DAY = 86400000
const round = (n: number, d = 1) => Math.round(n * 10 ** d) / 10 ** d

function weekKey(d: Date): string {
  const wd = (d.getUTCDay() + 6) % 7
  return new Date(d.getTime() - wd * DAY).toISOString().slice(5, 10)
}

async function compute(): Promise<PublicStats> {
  const now = Date.now()
  const iso = (days: number) => new Date(now - days * DAY).toISOString()
  const date = (days: number) => iso(days).slice(0, 10)
  const twelveWeeks = Array.from({ length: 12 }, (_, i) => weekKey(new Date(now - (11 - i) * 7 * DAY)))
  const weekIndex = new Map(twelveWeeks.map((w, i) => [w, i]))
  const weeks: Week[] = twelveWeeks.map((name) => ({ name, coding: 0, gaming: 0, plays: 0, github: 0 }))

  const [waka, plays, sessionsRes, playtimeRes, genresRes, ghDays, apps, geocodes] = await Promise.all([
    supabase.from("wakatime_daily").select("date, total_seconds, languages, editors, hours").gte("date", date(365)).order("date"),
    readAll<{ played_at: string }>("listening_history", "played_at", { column: "played_at", value: iso(365) }),
    supabase.from("game_sessions").select("id, device, game, started_at, last_seen, ended_at, samples, cpu_sum, gpu_sum, peak_cpu, peak_gpu").gte("started_at", iso(90)).limit(2000),
    supabase.from("game_playtime").select("platform, game, minutes, last_played").order("minutes", { ascending: false }).limit(50),
    supabase.from("game_genres").select("game, genres"),
    supabase.from("github_contributions_days").select("date, count").gte("date", date(365)),
    supabase.from("applications").select("location, created_at").limit(6000),
    supabase.from("location_geocodes").select("location, country_code"),
  ])

  const wakaRows = (waka.data ?? []) as { date: string; total_seconds: number; languages: { name: string; total_seconds: number }[] | null; editors: { name: string; total_seconds: number }[] | null; hours: number[] | null }[]
  const lang = new Map<string, number>()
  const editor = new Map<string, number>()
  const weekday = [0, 0, 0, 0, 0, 0, 0]
  const month = new Map<string, number>()
  const hourOfDay = Array(24).fill(0) as number[]
  let s30 = 0
  let active30 = 0
  let total = 0
  const cutoff30 = date(30)
  const activeDates = new Set<string>()
  for (const r of wakaRows) {
    total += r.total_seconds
    if (r.total_seconds > 0) activeDates.add(r.date)
    if (r.date >= cutoff30) { s30 += r.total_seconds; if (r.total_seconds > 0) active30++ }
    const d = new Date(`${r.date}T12:00:00Z`)
    weekday[(d.getUTCDay() + 6) % 7] += r.total_seconds
    month.set(r.date.slice(0, 7), (month.get(r.date.slice(0, 7)) ?? 0) + r.total_seconds)
    for (const l of r.languages ?? []) lang.set(l.name, (lang.get(l.name) ?? 0) + l.total_seconds)
    for (const e of r.editors ?? []) { const k = publicEditorName(e.name); editor.set(k, (editor.get(k) ?? 0) + e.total_seconds) }
    if (Array.isArray(r.hours) && r.hours.length === 24) r.hours.forEach((v, h) => { hourOfDay[h] += v ?? 0 })
    const w = weekIndex.get(weekKey(d))
    if (w != null) weeks[w].coding += r.total_seconds / 3600
  }
  let streak = 0
  for (let cur = new Date(now); activeDates.has(cur.toISOString().slice(0, 10)); cur = new Date(cur.getTime() - DAY)) streak++
  const top = (m: Map<string, number>, n = 8, div = 3600): Named[] => [...m.entries()].map(([name, v]) => ({ name, value: round(v / div) })).sort((a, b) => b.value - a.value).slice(0, n)

  const fmtHour = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", hour: "2-digit", hour12: false })
  const fmtDay = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", weekday: "short" })
  const dayIndex: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 }
  const grid = new Map<string, number>()
  const playMonth = new Map<string, number>()
  const playWeekday = [0, 0, 0, 0, 0, 0, 0]
  let plays30 = 0
  for (const p of plays) {
    const at = new Date(p.played_at)
    if (p.played_at >= iso(30)) plays30++
    const d = dayIndex[fmtDay.format(at)] ?? 0
    const h = Number(fmtHour.format(at)) % 24
    grid.set(`${d}|${h}`, (grid.get(`${d}|${h}`) ?? 0) + 1)
    playWeekday[d]++
    playMonth.set(p.played_at.slice(0, 7), (playMonth.get(p.played_at.slice(0, 7)) ?? 0) + 1)
    const w = weekIndex.get(weekKey(at))
    if (w != null) weeks[w].plays++
  }

  const gaming = summarise((sessionsRes.data ?? []) as GameSessionRow[], (playtimeRes.data ?? []) as PlaytimeRow[], (genresRes.data ?? []) as GenreRow[])
  for (const s of (sessionsRes.data ?? []) as GameSessionRow[]) {
    const w = weekIndex.get(weekKey(new Date(s.started_at)))
    if (w != null) weeks[w].gaming += (new Date(s.ended_at ?? s.last_seen).getTime() - new Date(s.started_at).getTime()) / 3600000 + 2 / 60
  }

  const gh = (ghDays.data ?? []) as { date: string; count: number }[]
  const ghMonth = new Map<string, number>()
  let g30 = 0
  let g365 = 0
  for (const r of gh) {
    g365 += r.count
    if (r.date >= cutoff30) g30 += r.count
    ghMonth.set(r.date.slice(0, 7), (ghMonth.get(r.date.slice(0, 7)) ?? 0) + r.count)
    const w = weekIndex.get(weekKey(new Date(`${r.date}T12:00:00Z`)))
    if (w != null) weeks[w].github += r.count
  }

  const codeOf = new Map(((geocodes.data ?? []) as { location: string; country_code: string | null }[]).map((g) => [g.location, g.country_code]))
  const names = new Intl.DisplayNames(["en"], { type: "region" })
  const country = new Map<string, number>()
  const appMonth = new Map<string, number>()
  const appRows = (apps.data ?? []) as { location: string | null; created_at: string }[]
  for (const a of appRows) {
    const cc = a.location ? codeOf.get(a.location) : null
    if (cc) { const n = names.of(cc.toUpperCase()) ?? cc; country.set(n, (country.get(n) ?? 0) + 1) }
    appMonth.set(a.created_at.slice(0, 7), (appMonth.get(a.created_at.slice(0, 7)) ?? 0) + 1)
  }
  const sortedMonths = (m: Map<string, number>, n = 12): Named[] => [...m.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-n).map(([name, value]) => ({ name, value }))

  return {
    weeks: weeks.map((w) => ({ ...w, coding: round(w.coding), gaming: round(w.gaming) })),
    coding: {
      hours30: round(s30 / 3600),
      activeDays30: active30,
      streak,
      totalHours: Math.round(total / 3600),
      languages: top(lang),
      editors: top(editor, 6),
      weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((name, i) => ({ name, value: round(weekday[i] / 3600) })),
      months: sortedMonths(new Map([...month.entries()].map(([k, v]) => [k, round(v / 3600)]))),
      hourOfDay: hourOfDay.map((v, h) => ({ name: `${h}`, value: round(v / 3600) })),
    },
    music: {
      plays30,
      totalPlays: plays.length,
      months: sortedMonths(playMonth),
      grid: [...grid.entries()].map(([k, value]) => { const [day, hour] = k.split("|").map(Number); return { day, hour, value } }),
      weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((name, i) => ({ name, value: playWeekday[i] })),
    },
    gaming,
    github: { total30: g30, total365: g365, months: sortedMonths(ghMonth) },
    applications: { total: appRows.length, countries: [...country.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 25), months: sortedMonths(appMonth) },
  }
}

export const getPublicStats = unstable_cache(compute, ["public-stats-v1"], { revalidate: 3600 })

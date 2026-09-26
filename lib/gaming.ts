export type GameSessionRow = {
  id: string
  device: "ps5" | "pc"
  game: string
  game_image: string | null
  started_at: string
  last_seen: string
  ended_at: string | null
  samples: number
  cpu_sum: number
  gpu_sum: number
  peak_cpu: number | null
  peak_gpu: number | null
}
export type PlaytimeRow = { platform: "ps5" | "pc"; game: string; minutes: number; last_played: string | null }

const POLL_MIN = 2
export const sessionMinutes = (s: GameSessionRow) =>
  Math.max(POLL_MIN, (new Date(s.ended_at ?? s.last_seen).getTime() - new Date(s.started_at).getTime()) / 60000 + POLL_MIN)

const round = (n: number, d = 1) => Math.round(n * 10 ** d) / 10 ** d
const hours = (min: number) => round(min / 60)
const LONDON = "Europe/London"

function londonParts(d: Date): { day: number; hour: number } {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: LONDON, weekday: "short", hour: "2-digit", hourCycle: "h23" }).formatToParts(d)
  const wd = parts.find((p) => p.type === "weekday")!.value
  const hour = Number(parts.find((p) => p.type === "hour")!.value)
  return { day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(wd), hour }
}

function weekStart(d: Date): string {
  const { day } = londonParts(d)
  const m = new Date(d.getTime() - day * 86400000)
  return m.toISOString().slice(0, 10)
}

export type GamingSummary = {
  totalHours: number
  sessions: number
  games: number
  longestHours: number
  averageSessionMin: number
  byGame: { name: string; hours: number; sessions: number }[]
  byDevice: { name: string; value: number }[]
  weekly: { name: string; hours: number }[]
  heatmap: { day: number; hour: number; value: number }[]
  longest: { game: string; device: string; date: string; minutes: number }[]
  load: { name: string; cpu: number; gpu: number; hours: number; peakCpu: number; peakGpu: number }[]
  lifetime: { name: string; hours: number; platform: string }[]
  genres: { name: string; value: number; basis: "tracked" | "lifetime" }[]
}

export type GenreRow = { game: string; genres: string[] }

export function summarise(rows: GameSessionRow[], playtime: PlaytimeRow[], genreRows: GenreRow[] = []): GamingSummary {
  const genreOf = new Map(genreRows.map((g) => [g.game, g.genres]))
  const byGameMap = new Map<string, { min: number; n: number }>()
  const deviceMin = { ps5: 0, pc: 0 }
  const weeklyMap = new Map<string, number>()
  const grid = new Map<string, number>()
  const loadMap = new Map<string, { min: number; cpu: number; gpu: number; samples: number; peakCpu: number; peakGpu: number }>()
  let total = 0
  let longest = 0

  for (const s of rows) {
    const min = sessionMinutes(s)
    total += min
    longest = Math.max(longest, min)
    const g = byGameMap.get(s.game) ?? { min: 0, n: 0 }
    byGameMap.set(s.game, { min: g.min + min, n: g.n + 1 })
    deviceMin[s.device] += min
    const wk = weekStart(new Date(s.started_at))
    weeklyMap.set(wk, (weeklyMap.get(wk) ?? 0) + min)
    const start = new Date(s.started_at).getTime()
    for (let t = 0; t < min; t += POLL_MIN) {
      const { day, hour } = londonParts(new Date(start + t * 60000))
      const key = `${day}|${hour}`
      grid.set(key, (grid.get(key) ?? 0) + POLL_MIN)
    }
    if (s.device === "pc" && s.samples > 0) {
      const l = loadMap.get(s.game) ?? { min: 0, cpu: 0, gpu: 0, samples: 0, peakCpu: 0, peakGpu: 0 }
      loadMap.set(s.game, {
        min: l.min + min,
        cpu: l.cpu + Number(s.cpu_sum),
        gpu: l.gpu + Number(s.gpu_sum),
        samples: l.samples + s.samples,
        peakCpu: Math.max(l.peakCpu, Number(s.peak_cpu ?? 0)),
        peakGpu: Math.max(l.peakGpu, Number(s.peak_gpu ?? 0)),
      })
    }
  }

  const genreMin = new Map<string, number>()
  const basis: "tracked" | "lifetime" = rows.length ? "tracked" : "lifetime"
  const source: [string, number][] = rows.length ? [...byGameMap.entries()].map(([g, v]) => [g, v.min]) : playtime.map((p) => [p.game, p.minutes])
  for (const [game, min] of source) for (const g of genreOf.get(game) ?? []) genreMin.set(g, (genreMin.get(g) ?? 0) + min)

  return {
    totalHours: hours(total),
    sessions: rows.length,
    games: byGameMap.size,
    longestHours: hours(longest),
    averageSessionMin: rows.length ? Math.round(total / rows.length) : 0,
    byGame: [...byGameMap.entries()].map(([name, v]) => ({ name, hours: hours(v.min), sessions: v.n })).sort((a, b) => b.hours - a.hours).slice(0, 10),
    byDevice: [
      { name: "PS5", value: hours(deviceMin.ps5) },
      { name: "Gaming PC", value: hours(deviceMin.pc) },
    ].filter((d) => d.value > 0),
    weekly: [...weeklyMap.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([name, min]) => ({ name: name.slice(5), hours: hours(min) })),
    heatmap: [...grid.entries()].map(([k, v]) => {
      const [day, hour] = k.split("|").map(Number)
      return { day, hour, value: hours(v) }
    }),
    longest: [...rows]
      .map((s) => ({ game: s.game, device: s.device === "pc" ? "Gaming PC" : "PS5", date: s.started_at.slice(0, 10), minutes: Math.round(sessionMinutes(s)) }))
      .sort((a, b) => b.minutes - a.minutes)
      .slice(0, 8),
    load: [...loadMap.entries()]
      .map(([name, l]) => ({ name, cpu: round(l.cpu / l.samples), gpu: round(l.gpu / l.samples), hours: hours(l.min), peakCpu: round(l.peakCpu), peakGpu: round(l.peakGpu) }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 10),
    genres: [...genreMin.entries()].map(([name, min]) => ({ name, value: hours(min), basis })).sort((a, b) => b.value - a.value).slice(0, 12),
    lifetime: [...playtime].sort((a, b) => b.minutes - a.minutes).slice(0, 10).map((p) => ({ name: p.game, hours: Math.round(p.minutes / 60), platform: p.platform === "ps5" ? "PS5" : "PC" })),
  }
}

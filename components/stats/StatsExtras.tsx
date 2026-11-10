"use client"

import { BarChart, Composed, StatCard } from "@/components/analytics"
import CountUp from "@/components/stats/CountUp"
import { Card } from "@/components/stats/StatsCharts"
import { ChartMarkers } from "@/components/stats/ChartMarkers"
import type { PublicStats } from "@/lib/stats/public-stats"
import { dayName, soundtrack } from "@/lib/stats/stats-helpers"
import { placeOnMonths, type Milestone } from "@/lib/stats/stats-milestone-place"

const CODING_LINE = "#ea580c"

export type RecordKey = "streak" | "codingDay" | "githubWeek" | "gamingSession" | "playsDay"

function Sub({ children }: { children: string }) {
  return <span className="block mt-0.5 text-xs font-normal text-muted-foreground">{children}</span>
}

export function RecordsRow({ s, show }: { s: PublicStats; show: RecordKey[] }) {
  const r = s.records
  const longest = s.gaming.longest[0]
  const cards: { key: RecordKey; label: string; value: number; suffix: string; sub: string }[] = []
  for (const k of show) {
    if (k === "streak" && r?.longestStreak && r.longestStreak.days >= 2)
      cards.push({ key: k, label: "Longest coding streak", value: r.longestStreak.days, suffix: " days", sub: `ending ${dayName(r.longestStreak.end)}` })
    if (k === "codingDay" && r?.biggestDay && r.biggestDay.hours >= 1)
      cards.push({ key: k, label: "Biggest coding day", value: r.biggestDay.hours, suffix: " h", sub: dayName(r.biggestDay.date) })
    if (k === "githubWeek" && r?.githubWeek && r.githubWeek.count >= 5)
      cards.push({ key: k, label: "Busiest GitHub week", value: r.githubWeek.count, suffix: " contributions", sub: `week of ${dayName(r.githubWeek.week)}` })
    if (k === "gamingSession" && longest && longest.minutes >= 30)
      cards.push({ key: k, label: "Longest gaming session", value: Math.round((longest.minutes / 60) * 10) / 10, suffix: " h", sub: `${longest.game}, ${dayName(longest.date)}` })
    if (k === "playsDay" && r?.playsDay && r.playsDay.count >= 20)
      cards.push({ key: k, label: "Most plays in a day", value: r.playsDay.count, suffix: " plays", sub: dayName(r.playsDay.date) })
  }
  if (cards.length === 0) return null
  return (
    <section aria-label="Records and streaks" className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Records and streaks</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {cards.map((c) => (
          <StatCard key={c.key} label={c.label} value={<><CountUp value={c.value} suffix={c.suffix} /><Sub>{c.sub}</Sub></>} />
        ))}
      </div>
    </section>
  )
}

export function SoundtrackCard({ s }: { s: PublicStats }) {
  const { data, summary } = soundtrack(s)
  if (!summary) return null
  return (
    <Card title="Soundtrack to my code" note="by hour of the day, London time, last year" wide>
      <div role="img" aria-label={`Plays as bars and coding hours as a line for each hour of the day. ${summary}`}>
        <Composed data={data} xKey="name" barKey="plays" lineKey="coding" barName="Plays" lineName="Coding hours" lineColour={CODING_LINE} lineValueFormatter={(v) => `${v} h`} height={220} />
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground" aria-hidden>
        <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-primary" />Bars: plays</span>
        <span className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-4 rounded" style={{ background: CODING_LINE }} />Line: coding hours</span>
      </div>
      <p className="mt-2 text-sm text-foreground">{summary}</p>
    </Card>
  )
}

export function GitHubMonths({ s, milestones = [] }: { s: PublicStats; milestones?: Milestone[] }) {
  const months = s.github.months
  if (s.github.total365 === 0) return null
  const markers = placeOnMonths(milestones, months.map((m) => m.name))
  return (
    <Card title="Public contributions by month" note={markers.length ? "last 12 months, numbered lines are launches" : "last 12 months"} wide>
      <ChartMarkers markers={markers} count={months.length} axis="band" top={4} bottom={months.length > 5 ? 54 : 30}>
        <BarChart data={months} dataKey="value" xKey="name" height={220} name="Contributions" />
      </ChartMarkers>
    </Card>
  )
}

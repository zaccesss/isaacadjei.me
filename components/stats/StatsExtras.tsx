"use client"

import { BarChart, Composed, StatCard, columnAxisHeight } from "@/components/analytics"
import { seriesTable, tableOf } from "@/components/analytics/chart-table"
import { AREA_COLOUR, Card } from "@/components/stats/StatsCharts"
import { monthName, rangeSummary, relabel } from "@/components/stats/chart-data"
import { ChartMarkers } from "@/components/stats/ChartMarkers"
import type { PublicStats } from "@/lib/stats/public-stats"
import { dayName, soundtrack } from "@/lib/stats/stats-helpers"
import { placeOnMonths, type Milestone } from "@/lib/stats/stats-milestone-place"

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
      <h2 className="text-lg font-semibold">Records and streaks</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {cards.map((c) => (
          <StatCard key={c.key} label={c.label} value={<>{`${c.value.toLocaleString("en-GB")}${c.suffix ?? ""}`}<Sub>{c.sub}</Sub></>} />
        ))}
      </div>
    </section>
  )
}

export function SoundtrackCard({ s }: { s: PublicStats }) {
  const { data, summary } = soundtrack(s)
  if (!summary) return null
  return (
    <Card title="Soundtrack to my code" note="plays and coding hours by hour of the day, London time, last year" wide table={seriesTable(data, "Hour", [{ key: "plays", name: "Plays" }, { key: "coding", name: "Coding hours" }])}>
      <Composed data={data} xKey="name" barKey="plays" lineKey="coding" barName="Plays" lineName="Coding hours" barColour={AREA_COLOUR.listening} lineColour={AREA_COLOUR.coding} lineValueFormatter={(v) => `${v} h`} height={220} />
      <p className="mt-2 text-sm text-foreground">{summary}</p>
    </Card>
  )
}

export function GitHubMonths({ s, milestones = [] }: { s: PublicStats; milestones?: Milestone[] }) {
  const months = s.github.months
  if (s.github.total365 === 0) return null
  const markers = placeOnMonths(milestones, months.map((m) => m.name))
  const shown = relabel(months, monthName)
  return (
    <Card title="Public contributions by month" note={markers.length ? "last 12 months, numbered lines are launches" : "last 12 months"} wide alt={rangeSummary(shown, "contributions")} table={tableOf(shown, ["Month", "Contributions"])}>
      <ChartMarkers markers={markers} count={months.length} axis="band" top={8} bottom={columnAxisHeight(shown.map((m) => m.name))}>
        <BarChart colour={AREA_COLOUR.github} data={shown} dataKey="value" xKey="name" height={220} name="Contributions" layout="vertical" />
      </ChartMarkers>
    </Card>
  )
}

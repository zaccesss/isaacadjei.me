"use client"

import type { ReactNode } from "react"
import {
  BarChart, LineChart, StackedArea, GridHeatmap, Composed, StatCard, CalendarHeatmap, Histogram, BoxPlot, PieChart, Treemap, Radar, RadialClock, WordCloud,
  SeriesLegend, riverToStack, stackLegend, columnAxisHeight, useChartSeries, useEChartsColours, DEFAULT_CHART_COLOURS, type TreeNode,
} from "@/components/analytics"
import { Sunburst } from "@/components/analytics/AdvancedCharts"
import EChart from "@/components/analytics/EChart"
import ChartFrame, { type ChartTable } from "@/components/analytics/ChartFrame"
import { seriesTable, tableOf } from "@/components/analytics/chart-table"
import { chartVar } from "@/lib/ui/chart-palette"
import EmptyState from "@/components/shared/EmptyState"
import { Choropleth } from "@/components/analytics/GeoCharts"
import { ChartMarkers } from "@/components/stats/ChartMarkers"
import type { PublicStats } from "@/lib/stats/public-stats"
import { placeOnMonths, placeOnWeeks, type Milestone } from "@/lib/stats/stats-milestone-place"
import type { getContentStats } from "@/lib/content/content-stats"
import {
  cumulative, yearToDate, weekdayTotals, fourWeekChange, daysByAreas, weekdaySummary, listSummary, spreadSummary, totalSummary,
  rangeSummary, topSummary, boxSummary, gridSummary, calendarSummary, totalsSummary, treeTotals, monthName, weekName, relabel, type WritingExtra,
} from "@/components/stats/chart-data"

type Content = ReturnType<typeof getContentStats>
type Named = { name: string; value: number }
const h = (v: number) => `${v} h`
const signed = (v: number) => `${v > 0 ? "+" : ""}${v}%`
const pct = (v: number) => `${v}%`
const count = (v: number) => v.toLocaleString("en-GB")

const PIE_PARTS = 6
const foldedTable = (rows: Named[], columns: [string, string], format?: (v: number) => string) =>
  rows.filter((r) => r.value > 0).length > PIE_PARTS ? tableOf(rows, columns, format ? { format } : {}) : undefined

const treeTable = (tree: TreeNode[], columns: [string, string, string], format: (v: number) => string = count): ChartTable => ({
  columns,
  rows: tree.flatMap((g) => (g.children ?? []).map((c) => [g.name, c.name, format(c.value ?? 0)])),
})

export const AREA_COLOUR = {
  coding: chartVar("chart-1"),
  listening: chartVar("chart-2"),
  github: chartVar("chart-3"),
  gaming: chartVar("chart-4"),
  writing: chartVar("chart-5"),
  applications: chartVar("chart-6"),
} as const

export function Card({ title, note, children, wide = false, alt, table }: { title: string; note?: string; children: ReactNode; wide?: boolean; alt?: string; table?: ChartTable }) {
  return (
    <div className={`min-w-0 rounded-2xl border border-border/60 bg-card p-5 ${wide ? "col-span-full" : ""}`}>
      <ChartFrame title={title} unit={note} table={table}>{children}</ChartFrame>
      {alt && <p className="sr-only">{alt}</p>}
    </div>
  )
}
const Grid = ({ children }: { children: ReactNode }) => <div className="grid gap-4 md:grid-cols-2">{children}</div>
const Tiles = ({ children }: { children: ReactNode }) => <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{children}</div>
const empty = (n: number) => n === 0
const nothingYet = (what: string) => <EmptyState title={`No ${what} to show yet`} description="This fills in once the first figures are in." />

export function HubOverview({ s, c, milestones = [] }: { s: PublicStats; c: Content; milestones?: Milestone[] }) {
  return (
    <div className="space-y-4">
      <Tiles>
        <StatCard label="Coding, last 30 days" value={h(s.coding.hours30)} />
        <StatCard label="Coding streak" value={`${count(s.coding.streak)} ${s.coding.streak === 1 ? "day" : "days"}`} />
        <StatCard label="Plays, last 30 days" value={count(s.music.plays30)} />
        <StatCard label="Gaming, last 90 days" value={h(s.gaming.totalHours)} />
        <StatCard label="GitHub, last 30 days" value={count(s.github.total30)} />
        <StatCard label="Posts and TILs" value={count(c.postCount + c.tilCount)} />
      </Tiles>
      <WeeklyComparison s={s} milestones={milestones} />
    </div>
  )
}

export function WeeklyComparison({ s, milestones = [] }: { s: PublicStats; milestones?: Milestone[] }) {
  const markers = placeOnWeeks(milestones, s.weeks.map((w) => w.name))
  const weeks = relabel(s.weeks, weekName)
  const series = [{ key: "coding", name: "Coding" }, { key: "gaming", name: "Gaming" }]
  const weekColours = [AREA_COLOUR.coding, AREA_COLOUR.gaming]
  return (
    <Grid>
      <Card title="Coding against gaming" note={markers.length ? "hours per week, last 12 weeks, numbered lines are launches" : "hours per week, last 12 weeks"} wide alt={totalsSummary(weeks, series, "hours")} table={seriesTable(weeks, "Week of", series)}>
        <ChartMarkers markers={markers} count={s.weeks.length} axis="point">
          <StackedArea data={weeks} xKey="name" series={series} colours={weekColours} height={220} valueFormatter={h} legend={false} />
        </ChartMarkers>
        <SeriesLegend items={stackLegend(series, weekColours)} />
      </Card>
      <Card title="Listening" note="plays per week" alt={rangeSummary(weeks.map((w) => ({ name: w.name, value: w.plays })), "plays")} table={tableOf(weeks, ["Week of", "Plays"], { key: "plays" })}>
        <LineChart colour={AREA_COLOUR.listening} data={weeks} dataKey="plays" xKey="name" height={180} dots name="Plays" />
      </Card>
      <Card title="GitHub" note="contributions per week" alt={rangeSummary(weeks.map((w) => ({ name: w.name, value: w.github })), "contributions")} table={tableOf(weeks, ["Week of", "Contributions"], { key: "github" })}>
        <BarChart colour={AREA_COLOUR.github} data={weeks} dataKey="github" xKey="name" height={180} name="Contributions" interval={1} />
      </Card>
    </Grid>
  )
}

export function CodingMore({ s, milestones = [], afterTiles }: { s: PublicStats; milestones?: Milestone[]; afterTiles?: ReactNode }) {
  const c = s.coding
  if (empty(c.totalHours)) return nothingYet("coding")
  const daily = c.daily.map((d) => d.value)
  const soFar = yearToDate(c.daily)
  return (
    <div className="space-y-4">
      <Tiles>
        <StatCard label="Last 30 days" value={h(c.hours30)} />
        <StatCard label="Active days, last 30" value={count(c.activeDays30)} />
        <StatCard label="Hours in the last year" value={count(c.totalHours)} />
      </Tiles>
      {afterTiles}
      <Grid>
        <CodingLanguages s={s} />
        <CodingPatterns s={s} milestones={milestones} />
        {c.daily.length > 0 && (
          <Card title="Every day of the last year" note="hours per day" wide alt={calendarSummary(c.daily, "hours")}>
            <CalendarHeatmap data={c.daily} valueLabel="hours" valueFormatter={h} />
          </Card>
        )}
        <Card title="Which days I code" note="hours by weekday" alt={weekdaySummary(c.weekdays, "hours")} table={tableOf(c.weekdays, ["Weekday", "Hours"])}>
          <Radar colour={AREA_COLOUR.coding} data={c.weekdays} dataKey="value" nameKey="name" height={240} valueFormatter={h} />
        </Card>
        <Card title="Editors" note="share of time" alt={topSummary(c.editors, "hours")} table={foldedTable(c.editors, ["Editor", "Hours"], h)}>
          <PieChart data={c.editors} valueFormatter={h} centreLabel="Hours" />
        </Card>
        {daily.length > 0 && (
          <Card title="How long my coding days are" note="days by hours coded, days I coded only" alt={spreadSummary(daily, "hours", "days I coded")}>
            <Histogram values={daily} height={200} valueFormatter={h} />
          </Card>
        )}
        {soFar.length > 1 && (
          <Card title="Hours so far this year" note="running total from 1 January" alt={totalSummary(soFar, "hours", "1 January")} table={tableOf(soFar, ["Day", "Hours so far"])}>
            <LineChart colour={AREA_COLOUR.coding} data={soFar} dataKey="value" xKey="name" height={200} valueFormatter={h} name="Hours so far" />
          </Card>
        )}
        {c.projects.length > 0 && (
          <Card title="Public projects I work on" note="hours, public repositories only" alt={topSummary(c.projects, "hours")} table={tableOf(c.projects, ["Project", "Hours"])}>
            <BarChart colour={AREA_COLOUR.coding} data={c.projects} dataKey="value" xKey="name" height={220} valueFormatter={h} name="Hours" />
          </Card>
        )}
        {c.systems.length > 0 && (
          <Card title="Where I code" note="hours by operating system" alt={topSummary(c.systems, "hours")}>
            <PieChart data={c.systems} valueFormatter={h} centreLabel="Hours" />
          </Card>
        )}
      </Grid>
    </div>
  )
}

export function CodingLanguages({ s }: { s: PublicStats }) {
  const c = s.coding
  if (c.languages.length === 0) return null
  const months = riverToStack(c.languageMonths, (iso) => monthName(iso.slice(0, 7)))
  return (
    <>
      <Card title="Languages" note="hours in code, docs and config left out" wide={c.languageGroups.length === 0} alt={topSummary(c.languages, "hours")} table={tableOf(c.languages, ["Language", "Hours"])}>
        <Treemap data={c.languages} height={240} valueFormatter={h} />
      </Card>
      {c.languageGroups.length > 0 && (
        <Card title="What the languages are for" note="hours, inner ring is the kind" alt={topSummary(treeTotals(c.languageGroups), "hours")} table={treeTable(c.languageGroups, ["Kind", "Language", "Hours"], h)}>
          <Sunburst data={c.languageGroups} height={240} />
        </Card>
      )}
      {c.languageMonths.length > 0 && (
        <Card title="How my languages shift" note="hours per month, top six" wide alt={totalsSummary(months.data, months.series, "hours")} table={seriesTable(months.data, "Month", months.series)}>
          <LanguageRiver data={c.languageMonths} />
        </Card>
      )}
    </>
  )
}

function LanguageRiver({ data }: { data: [string, number, string][] }) {
  const colours = useEChartsColours()
  const series = useChartSeries()
  const names = [...new Set(data.map((d) => d[2]))]
  return (
    <>
      <EChart
        style={{ height: 280, width: "100%" }}
        opts={{ renderer: "svg" }}
        notMerge
        option={{
          tooltip: { trigger: "axis", backgroundColor: colours.card, borderColor: colours.border, textStyle: { color: colours.foreground, fontSize: 13 } },
          color: series,
          singleAxis: { type: "time", top: 12, bottom: 36, axisLabel: { color: colours.mutedForeground, fontSize: 13, margin: 10 }, axisLine: { lineStyle: { color: colours.border } } },
          series: [{ type: "themeRiver", data, label: { show: false } }],
        }}
      />
      <SeriesLegend items={names.map((name, i) => ({ name, colour: DEFAULT_CHART_COLOURS[i % DEFAULT_CHART_COLOURS.length] }))} />
    </>
  )
}

export function CodingPatterns({ s, milestones = [] }: { s: PublicStats; milestones?: Milestone[] }) {
  const c = s.coding
  if (empty(c.totalHours)) return null
  const markers = placeOnMonths(milestones, c.months.map((m) => m.name))
  const months = relabel(c.months, monthName)
  const hours = c.hourOfDay.map((x) => x.value)
  return (
    <>
      <Card title="Hours by month" note={markers.length ? "last 12 months, numbered lines are launches" : "last 12 months"} alt={rangeSummary(months, "hours")} table={tableOf(months, ["Month", "Hours"])}>
        <ChartMarkers markers={markers} count={c.months.length} axis="point">
          <LineChart colour={AREA_COLOUR.coding} data={months} dataKey="value" xKey="name" height={200} dots valueFormatter={h} name="Hours" />
        </ChartMarkers>
      </Card>
      <Card title="My coding clock" note="hours by hour of the day, London time">
        <RadialClock hours={hours} height={240} valueFormatter={h} />
      </Card>
    </>
  )
}

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]

function WeekdayMonthGrid({ data }: { data: { month: string; day: number; value: number }[] }) {
  const months = [...new Set(data.map((d) => d.month))].slice(-12)
  const max = Math.max(...data.map((d) => d.value), 1)
  const at = new Map(data.map((d) => [`${d.month}|${d.day}`, d.value]))
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  return (
    <div className="relative overflow-x-auto focus-visible:outline-2 focus-visible:outline-ring" tabIndex={0} role="region" aria-label="Plays by weekday for each month">
      <table className="border-separate text-sm text-muted-foreground" style={{ borderSpacing: 3 }}>
        <caption className="sr-only">Plays by weekday for each month</caption>
        <thead>
          <tr><th scope="col" className="sr-only">Day</th>{months.map((m) => <th key={m} scope="col" className="px-0.5 font-normal">{MONTH_SHORT[Number(m.slice(5, 7)) - 1] ?? m}</th>)}</tr>
        </thead>
        <tbody>
          {days.map((d, i) => (
            <tr key={d}>
              <th scope="row" className="pr-1 text-left font-normal">{d}</th>
              {months.map((m) => {
                const v = at.get(`${m}|${i}`) ?? 0
                return (
                  <td key={m} title={`${d}, ${monthName(m)}: ${v} ${v === 1 ? "play" : "plays"}`} className="h-5 w-8 rounded-[3px] bg-primary" style={{ opacity: v === 0 ? 0.08 : 0.2 + (v / max) * 0.8 }}>
                    <span className="sr-only">{v} {v === 1 ? "play" : "plays"}</span>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function MusicMore({ s }: { s: PublicStats }) {
  const m = s.music
  if (empty(m.totalPlays)) return nothingYet("listening")
  const playsSoFar = relabel(cumulative(m.months), monthName)
  return (
    <div className="space-y-4">
      <Tiles>
        <StatCard label="Plays, last 30 days" value={count(m.plays30)} />
        <StatCard label="Plays, last year" value={count(m.totalPlays)} />
        <StatCard label="Busiest weekday" value={[...m.weekdays].sort((a, b) => b.value - a.value)[0]?.name ?? "-"} />
      </Tiles>
      <Grid>
        <MusicPatterns s={s} />
        <Card title="My listening clock" note="plays by hour of the day, London time">
          <RadialClock hours={m.hours} height={240} valueLabel="plays" />
        </Card>
        {m.weekdayMonths.length > 0 && (
          <Card title="Weekdays month by month" note="plays, stronger colour means more" wide alt="Every month's plays for each weekday, listed in the table in this card.">
            <WeekdayMonthGrid data={m.weekdayMonths} />
          </Card>
        )}
        <Card title="Which days I listen" note="plays by weekday" alt={weekdaySummary(m.weekdays, "plays")} table={tableOf(m.weekdays, ["Weekday", "Plays"])}>
          <Radar colour={AREA_COLOUR.listening} data={m.weekdays} dataKey="value" nameKey="name" height={240} valueFormatter={(v) => `${count(v)} plays`} />
        </Card>
        {(m.perDay ?? []).length > 0 && (
          <Card title="How much I play in a day" note="days by plays, days with music only" alt={spreadSummary(m.perDay, "plays", "days with music")}>
            <Histogram values={m.perDay} height={200} />
          </Card>
        )}
        {playsSoFar.length > 1 && (
          <Card title="Plays adding up" note="running total, last 12 months" alt={totalSummary(playsSoFar, "plays", "the first month shown")} table={tableOf(playsSoFar, ["Month", "Plays so far"])}>
            <LineChart colour={AREA_COLOUR.listening} data={playsSoFar} dataKey="value" xKey="name" height={200} dots name="Plays so far" />
          </Card>
        )}
      </Grid>
    </div>
  )
}

export function MusicPatterns({ s }: { s: PublicStats }) {
  const m = s.music
  if (empty(m.totalPlays)) return null
  const months = relabel(m.months, monthName)
  return (
    <>
      <Card title="When I listen" note="weekday by hour, London time" wide alt={gridSummary(m.grid, "plays")}>
        <GridHeatmap data={m.grid} height={220} valueLabel="plays" />
      </Card>
      <Card title="Plays by month" note="last 12 months" alt={rangeSummary(months, "plays")} table={tableOf(months, ["Month", "Plays"])}>
        <BarChart colour={AREA_COLOUR.listening} data={months} dataKey="value" xKey="name" height={200} name="Plays" />
      </Card>
    </>
  )
}

export function GamingMore({ s }: { s: PublicStats }) {
  const g = s.gaming
  if (g.sessions === 0) return nothingYet("gaming")
  const days = weekdayTotals(g.heatmap)
  const weekly = relabel(g.weekly, weekName)
  const genres = g.genres.map((x) => ({ name: x.name, value: x.value }))
  return (
    <div className="space-y-4">
      <Grid>
        <Card title="When I play" note="hours, weekday by hour" wide alt={gridSummary(g.heatmap, "hours")}><GridHeatmap data={g.heatmap} height={220} valueLabel="hours" /></Card>
        <Card title="Weekly hours" note="last 90 days" alt={rangeSummary(weekly.map((w) => ({ name: w.name, value: w.hours })), "hours")} table={tableOf(weekly, ["Week of", "Hours"], { key: "hours" })}>
          <LineChart colour={AREA_COLOUR.gaming} data={weekly} dataKey="hours" xKey="name" height={200} dots valueFormatter={h} name="Hours" />
        </Card>
        <Card title="PS5 against gaming PC" note="hours, last 90 days" alt={topSummary(g.byDevice, "hours")}>
          <PieChart data={g.byDevice} valueFormatter={h} centreLabel="Hours" />
        </Card>
        {g.genres.length > 0 && (
          <Card title="Time by genre" note={g.genres[0].basis === "tracked" ? "hours, tracked sessions" : "hours, lifetime playtime"} wide alt={topSummary(genres, "hours")} table={tableOf(genres, ["Genre", "Hours"])}>
            <Treemap data={genres} height={220} valueFormatter={h} />
          </Card>
        )}
        {g.lifetime.length > 0 && (
          <Card title="Lifetime playtime" note="hours, most played, from my accounts" wide alt={topSummary(g.lifetime.map((x) => ({ name: x.name, value: x.hours })), "hours")} table={tableOf(g.lifetime, ["Game", "Hours"], { key: "hours" })}>
            <BarChart colour={AREA_COLOUR.gaming} data={g.lifetime} dataKey="hours" xKey="name" height={220} valueFormatter={h} name="Hours" />
          </Card>
        )}
        {s.gamingMore.deviceTree.length > 0 && (
          <Card title="What I play on each device" note="hours, inner ring is the device" alt={topSummary(treeTotals(s.gamingMore.deviceTree), "hours")} table={treeTable(s.gamingMore.deviceTree, ["Device", "Game", "Hours"], h)}>
            <Sunburst data={s.gamingMore.deviceTree} height={260} />
          </Card>
        )}
        {s.gamingMore.lengths.length > 0 && (
          <Card title="How long I play" note="session length in minutes, last 90 days" alt={spreadSummary(s.gamingMore.lengths, "minutes", "sessions")}>
            <Histogram values={s.gamingMore.lengths} height={220} valueFormatter={(v) => `${v} min`} unit="session" />
          </Card>
        )}
        {days.some((d) => d.value > 0) && (
          <Card title="Which days I play" note="hours by weekday, last 90 days, London time" alt={weekdaySummary(days, "hours")} table={tableOf(days, ["Weekday", "Hours"])}>
            <BarChart colour={AREA_COLOUR.gaming} data={days} dataKey="value" xKey="name" height={200} valueFormatter={h} name="Hours" />
          </Card>
        )}
        {(s.gamingMore.deviceLengths ?? []).length > 0 && (
          <Card title="Session length on each device" note="minutes, the box is the middle half of my sessions" alt={boxSummary(s.gamingMore.deviceLengths, "minutes")}>
            <BoxPlot groups={s.gamingMore.deviceLengths} height={200} unit="session" valueFormatter={(v) => `${Math.round(v)} min`} />
          </Card>
        )}
      </Grid>
    </div>
  )
}

export function GitHubPatterns({ s }: { s: PublicStats }) {
  const g = s.github
  if (g.total365 === 0) return nothingYet("contributions")
  return (
    <Grid>
      {(g.weekdays ?? []).some((d) => d.value > 0) && (
        <Card title="Which days I contribute" note="public contributions by weekday, last year" alt={weekdaySummary(g.weekdays, "contributions")} table={tableOf(g.weekdays, ["Weekday", "Contributions"])}>
          <BarChart colour={AREA_COLOUR.github} data={g.weekdays} dataKey="value" xKey="name" height={200} name="Contributions" />
        </Card>
      )}
      {(g.runs ?? []).some((d) => d.value > 0) && (
        <Card title="How long my streaks last" note="runs of days in a row with a contribution, by length in days" alt={listSummary(g.runs, "runs")} table={tableOf(g.runs, ["Length in days", "Runs"])}>
          <BarChart colour={AREA_COLOUR.github} data={g.runs} dataKey="value" xKey="name" height={200} name="Runs" />
        </Card>
      )}
    </Grid>
  )
}

export function ApplicationsMore({ s }: { s: PublicStats }) {
  const a = s.applications
  if (empty(a.total)) return nothingYet("opportunities")
  const months = relabel(a.months, monthName)
  const regionMonths = a.regionMonths.map((r) => ({ ...r, name: monthName(String(r.name)) }))
  const regions = a.regions.map((r) => ({ key: r, name: r }))
  const categories = a.categories ?? []
  return (
    <div className="space-y-4">
      <Grid>
        <Card title="Where they go, by country" note="opportunities, stronger colour means more" wide alt={topSummary(a.countries, "opportunities")} table={tableOf(a.countries, ["Country", "Opportunities"])}>
          <Choropleth data={a.countries} height={320} valueLabel="opportunities" />
        </Card>
        <Card title="Top countries" note="opportunities" alt={topSummary(a.countries.slice(0, 8), "opportunities")} table={tableOf(a.countries.slice(0, 8), ["Country", "Opportunities"])}>
          <BarChart colour={AREA_COLOUR.applications} data={a.countries.slice(0, 8)} dataKey="value" xKey="name" height={200} name="Opportunities" />
        </Card>
        <Card title="Opportunities tracked by month" note="last 12 months" alt={rangeSummary(months, "opportunities")} table={tableOf(months, ["Month", "Opportunities"])}>
          <BarChart colour={AREA_COLOUR.applications} data={months} dataKey="value" xKey="name" height={200} name="Opportunities" />
        </Card>
        {a.regions.length > 0 && (
          <Card title="Regions month by month" note="opportunities, last 12 months" wide alt={totalsSummary(regionMonths, regions, "opportunities")} table={seriesTable(regionMonths, "Month", regions)}>
            <StackedArea data={regionMonths} xKey="name" series={regions} height={240} />
          </Card>
        )}
        {categories.length > 0 && (
          <Card title="Which fields they are in" note="top ten fields, opportunities" wide alt={listSummary(categories, "opportunities")} table={tableOf(categories, ["Field", "Opportunities"])}>
            <Treemap data={categories} height={240} />
          </Card>
        )}
        {a.regionTree.length > 0 && (
          <Card title="Regions and their countries" note="opportunities, inner ring is the region" alt={topSummary(treeTotals(a.regionTree), "opportunities")} table={treeTable(a.regionTree, ["Region", "Country", "Opportunities"])}>
            <Sunburst data={a.regionTree} height={260} />
          </Card>
        )}
        {(a.types ?? []).length > 0 && (
          <Card title="What kind of opportunity" note="internships, placements, graduate schemes and the rest" alt={listSummary(a.types, "opportunities")} table={tableOf(a.types, ["Kind", "Opportunities"])}>
            <BarChart colour={AREA_COLOUR.applications} data={a.types} dataKey="value" xKey="name" height={200} name="Opportunities" />
          </Card>
        )}
      </Grid>
    </div>
  )
}

export function WritingStats({ c, milestones = [], extra }: { c: Content; milestones?: Milestone[]; extra?: WritingExtra }) {
  const markers = placeOnMonths(milestones, c.postsByMonth.map((m) => m.name))
  const posts = relabel(c.postsByMonth, monthName)
  const til = relabel(c.tilByMonth, monthName)
  const short = relabel(c.shortByMonth, monthName)
  const shortSeries = [{ key: "notes", name: "Notes" }, { key: "issues", name: "Issues" }]
  const reading = c.reading.filter((r) => r.value > 0)
  return (
    <div className="space-y-4">
      <Tiles>
        <StatCard label="Blog posts" value={count(c.postCount)} />
        <StatCard label="TIL entries" value={count(c.tilCount)} />
        <StatCard label="Notes" value={count(c.noteCount)} />
        <StatCard label="Newsletter issues" value={count(c.issueCount)} />
        <StatCard label="Projects" value={count(c.projectCount)} />
      </Tiles>
      <Grid>
        <Card title="Posts by month" note={markers.length ? "posts, numbered lines are launches" : "posts"} alt={rangeSummary(posts, "posts")} table={tableOf(posts, ["Month", "Posts"])}>
          <ChartMarkers markers={markers} count={c.postsByMonth.length} axis="band" top={8} bottom={columnAxisHeight(posts.map((p) => p.name))}>
            <BarChart colour={AREA_COLOUR.writing} data={posts} dataKey="value" xKey="name" height={200} name="Posts" layout="vertical" />
          </ChartMarkers>
        </Card>
        <Card title="TIL entries by month" note="entries" alt={rangeSummary(til, "entries")} table={tableOf(til, ["Month", "Entries"])}>
          <BarChart colour={AREA_COLOUR.writing} data={til} dataKey="value" xKey="name" height={200} name="Entries" />
        </Card>
        <Card title="Notes and newsletter by month" note="notes and issues, one panel each" alt={totalsSummary(short, shortSeries, "")} table={seriesTable(short, "Month", shortSeries)}>
          <Composed data={short} xKey="name" barKey="notes" lineKey="issues" barName="Notes" lineName="Issues" height={200} />
        </Card>
        <Card title="Kinds of post" note="posts" alt={listSummary(c.postTypes, "posts")} table={foldedTable(c.postTypes, ["Kind", "Posts"])}>
          <PieChart data={c.postTypes} centreLabel="Posts" />
        </Card>
        <Card title="What I write about" note="posts per tag" wide alt={topSummary(c.tags, "posts")} table={tableOf(c.tags, ["Tag", "Posts"])}>
          <Treemap data={c.tags} height={240} />
        </Card>
        <Card title="How long the posts are" note="posts by reading time" alt={listSummary(reading, "posts")} table={foldedTable(reading, ["Reading time", "Posts"])}>
          <PieChart data={reading} centreLabel="Posts" sort={false} />
        </Card>
        <Card title="What I read, watch and listen to" note="items I have logged" alt={listSummary(c.consumed, "items")} table={tableOf(c.consumed, ["Kind", "Items"])}>
          <BarChart colour={AREA_COLOUR.writing} data={c.consumed} dataKey="value" xKey="name" height={200} name="Items" />
        </Card>
        <Card title="Technologies I use in projects" note="projects using each, bigger means more" wide alt={topSummary(c.techs, "projects")}>
          <WordCloud words={c.techs.map((t) => ({ text: t.name, value: t.value }))} height={240} valueLabel="projects" />
        </Card>
        <Card title="What I learn" note="TIL entries per category" alt={topSummary(c.tilCategories, "entries")} table={tableOf(c.tilCategories, ["Category", "Entries"])}>
          <Treemap data={c.tilCategories} height={220} />
        </Card>
        <Card title="Projects by kind" note="projects" alt={listSummary(c.projectsByCategory, "projects")} table={foldedTable(c.projectsByCategory, ["Kind", "Projects"])}>
          <PieChart data={c.projectsByCategory} centreLabel="Projects" />
        </Card>
        {extra && extra.weekdays.some((d) => d.value > 0) && (
          <Card title="Which days I publish" note="posts, TILs, notes and issues by weekday" alt={weekdaySummary(extra.weekdays, "pieces")} table={tableOf(extra.weekdays, ["Weekday", "Pieces"])}>
            <BarChart colour={AREA_COLOUR.writing} data={extra.weekdays} dataKey="value" xKey="name" height={200} name="Pieces" />
          </Card>
        )}
        {extra && extra.lengthByKind.length > 0 && (
          <Card title="How long each kind of post is" note="reading time in minutes, the box is the middle half" alt={boxSummary(extra.lengthByKind, "minutes")}>
            <BoxPlot groups={extra.lengthByKind} height={200} unit="post" valueFormatter={(v) => `${Math.round(v)} min`} />
          </Card>
        )}
      </Grid>
    </div>
  )
}

export function OverviewMore({ s, c }: { s: PublicStats; c: Content }) {
  const peak = (key: "coding" | "gaming" | "plays" | "github") => Math.max(...s.weeks.map((w) => w[key]), 1)
  const mean = (key: "coding" | "gaming" | "plays" | "github") => Math.round((s.weeks.reduce((sum, w) => sum + w[key] / peak(key), 0) / Math.max(s.weeks.length, 1)) * 100)
  const mix = [
    { name: "Coding", value: mean("coding") },
    { name: "Gaming", value: mean("gaming") },
    { name: "Listening", value: mean("plays") },
    { name: "GitHub", value: mean("github") },
  ]
  const months = new Map<string, { name: string; posts: number; til: number }>()
  for (const p of c.postsByMonth) months.set(p.name, { name: p.name, posts: p.value, til: 0 })
  for (const t of c.tilByMonth) months.set(t.name, { ...(months.get(t.name) ?? { name: t.name, posts: 0 }), til: t.value })
  const written = relabel([...months.values()].sort((a, b) => a.name.localeCompare(b.name)).slice(-12), monthName)
  const change = fourWeekChange(s.weeks)
  const fullness = daysByAreas(s.activeDays)
  return (
    <Grid>
      {s.activeDays.length > 0 && (
        <Card title="My year at a glance" note="how many of coding, listening, gaming and GitHub I did each day" wide alt={calendarSummary(s.activeDays, "areas active")}>
          <CalendarHeatmap data={s.activeDays} valueLabel="areas active" />
        </Card>
      )}
      <Card title="My activity mix" note="average week against my busiest week, percent" alt={listSummary(mix, "", pct)} table={tableOf(mix, ["Area", "Percent"], { format: pct })}>
        <Radar colour={chartVar("chart-7")} data={mix} dataKey="value" nameKey="name" height={240} max={100} valueFormatter={pct} />
      </Card>
      <Card title="What I publish" note="posts and TILs per month over the last year, one panel each" alt={totalsSummary(written, [{ key: "posts", name: "Posts" }, { key: "til", name: "TILs" }], "")} table={seriesTable(written, "Month", [{ key: "posts", name: "Posts" }, { key: "til", name: "TILs" }])}>
        <Composed data={written.map((m) => ({ ...m, name: m.name.slice(0, 3) }))} xKey="name" barKey="posts" lineKey="til" barColour={AREA_COLOUR.writing} lineColour={AREA_COLOUR.writing} barInterval={2} barName="Posts" lineName="TILs" height={240} />
      </Card>
      <Card title="Listening by weekday" note="plays, last year" alt={weekdaySummary(s.music.weekdays, "plays")} table={tableOf(s.music.weekdays, ["Weekday", "Plays"])}>
        <BarChart colour={AREA_COLOUR.listening} data={s.music.weekdays} dataKey="value" xKey="name" height={200} name="Plays" />
      </Card>
      <Card title="Coding by weekday" note="hours, last year" alt={weekdaySummary(s.coding.weekdays, "hours")} table={tableOf(s.coding.weekdays, ["Weekday", "Hours"])}>
        <BarChart colour={AREA_COLOUR.coding} data={s.coding.weekdays} dataKey="value" xKey="name" height={200} valueFormatter={h} name="Hours" />
      </Card>
      {change.length > 0 && (
        <Card title="This month against last" note="last four weeks against the four before, percent change" alt={listSummary(change, "", signed)} table={tableOf(change, ["Area", "Change"], { format: signed })}>
          <BarChart data={change} dataKey="value" xKey="name" height={200} valueFormatter={signed} tickFormatter={signed} name="Change" layout="vertical" />
          <p className="mt-1 text-sm text-muted-foreground">Bars above the line went up, bars below it went down.</p>
        </Card>
      )}
      {fullness.some((d) => d.value > 0) && (
        <Card title="How full my days are" note="days in the last year by how many areas were active" alt={listSummary(fullness, "days")} table={tableOf(fullness, ["Areas active", "Days"])}>
          <BarChart colour={chartVar("chart-6")} data={fullness} dataKey="value" xKey="name" height={200} name="Days" />
        </Card>
      )}
    </Grid>
  )
}

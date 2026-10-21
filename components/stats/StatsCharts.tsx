"use client"

import type { ReactNode } from "react"
import { BarChart, LineChart, PieChart, Treemap, StackedArea, Radar, GridHeatmap, Composed, StatCard, CalendarHeatmap, RadialClock, Histogram } from "@/components/analytics"
import { Sunburst, ThemeRiver } from "@/components/analytics/AdvancedCharts"
import { Choropleth } from "@/components/analytics/GeoCharts"
import { WordCloud } from "@/components/analytics"
import type { PublicStats } from "@/lib/public-stats"
import type { getContentStats } from "@/lib/content-stats"

type Content = ReturnType<typeof getContentStats>
const h = (v: number) => `${v} h`

function Card({ title, note, children, wide = false }: { title: string; note?: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className={`min-w-0 rounded-2xl border border-border/60 bg-card p-5 shadow-xs ${wide ? "sm:col-span-2" : ""}`}>
      <div className="flex items-baseline justify-between gap-2 mb-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        {note && <span className="text-[11px] text-muted-foreground">{note}</span>}
      </div>
      {children}
    </div>
  )
}
const Grid = ({ children }: { children: ReactNode }) => <div className="grid gap-4 sm:grid-cols-2">{children}</div>
const Tiles = ({ children }: { children: ReactNode }) => <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{children}</div>
const empty = (n: number) => n === 0

export function HubOverview({ s, c }: { s: PublicStats; c: Content }) {
  return (
    <div className="space-y-4">
      <Tiles>
        <StatCard label="Coding, last 30 days" value={`${s.coding.hours30} h`} />
        <StatCard label="Coding streak" value={`${s.coding.streak} ${s.coding.streak === 1 ? "day" : "days"}`} />
        <StatCard label="Plays, last 30 days" value={s.music.plays30} />
        <StatCard label="Gaming, last 90 days" value={`${s.gaming.totalHours} h`} />
        <StatCard label="GitHub, last 30 days" value={s.github.total30} />
        <StatCard label="Posts and TILs" value={c.postCount + c.tilCount} />
      </Tiles>
      <WeeklyComparison s={s} />
    </div>
  )
}

export function WeeklyComparison({ s }: { s: PublicStats }) {
  return (
    <Grid>
      <Card title="Coding against gaming" note="hours per week, last 12 weeks" wide>
        <StackedArea data={s.weeks} xKey="name" series={[{ key: "coding", name: "Coding" }, { key: "gaming", name: "Gaming" }]} height={220} valueFormatter={h} />
      </Card>
      <Card title="Listening" note="plays per week">
        <LineChart data={s.weeks} dataKey="plays" xKey="name" height={180} dots />
      </Card>
      <Card title="GitHub" note="contributions per week">
        <BarChart data={s.weeks} dataKey="github" xKey="name" height={180} />
      </Card>
    </Grid>
  )
}

export function CodingMore({ s }: { s: PublicStats }) {
  const c = s.coding
  if (empty(c.totalHours)) return null
  return (
    <div className="space-y-4">
      <Tiles>
        <StatCard label="Last 30 days" value={`${c.hours30} h`} />
        <StatCard label="Active days, last 30" value={c.activeDays30} />
        <StatCard label="Hours in the last year" value={c.totalHours} />
      </Tiles>
      <Grid>
        <CodingPatterns s={s} />
        <Card title="Which days I code" note="hours by weekday"><Radar data={c.weekdays} dataKey="value" nameKey="name" height={220} /></Card>
        <Card title="Languages" note="share of time"><Treemap data={c.languages} height={220} valueFormatter={h} /></Card>
        <Card title="Editors" note="share of time"><PieChart data={c.editors} height={200} valueFormatter={h} /></Card>
        {c.projects.length > 0 && <Card title="Public projects I work on" note="hours, public repositories only"><BarChart data={c.projects} dataKey="value" xKey="name" height={220} valueFormatter={h} /></Card>}
        {c.systems.length > 0 && <Card title="Where I code" note="hours by operating system"><PieChart data={c.systems} height={200} valueFormatter={h} /></Card>}
        {c.daily.length > 0 && <Card title="Every day of the last year" note="hours per day" wide><CalendarHeatmap data={c.daily} valueLabel="hours" valueFormatter={h} /></Card>}
        <Card title="My coding clock" note="hours by hour of the day, London time"><RadialClock hours={c.hourOfDay.map((x) => x.value)} height={240} valueLabel="hours" valueFormatter={h} /></Card>
        {c.languageGroups.length > 0 && <Card title="What the languages are for" note="inner ring is the kind, hours"><Sunburst data={c.languageGroups} height={260} /></Card>}
        {c.languageMonths.length > 0 && <Card title="How my languages shift" note="hours per month, top six" wide><ThemeRiver data={c.languageMonths} height={240} /></Card>}
      </Grid>
    </div>
  )
}

export function CodingPatterns({ s }: { s: PublicStats }) {
  const c = s.coding
  if (empty(c.totalHours)) return null
  return (
    <>
      <Card title="Hours by month" note="last 12 months"><LineChart data={c.months} dataKey="value" xKey="name" height={200} dots valueFormatter={h} /></Card>
      <Card title="Time of day" note="hours by hour, London time"><BarChart data={c.hourOfDay} dataKey="value" xKey="name" height={200} valueFormatter={h} /></Card>
    </>
  )
}

function WeekdayMonthGrid({ data }: { data: { month: string; day: number; value: number }[] }) {
  const months = [...new Set(data.map((d) => d.month))].slice(-12)
  const max = Math.max(...data.map((d) => d.value), 1)
  const at = new Map(data.map((d) => [`${d.month}|${d.day}`, d.value]))
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  return (
    <div className="overflow-x-auto">
      <table className="text-[10px] text-muted-foreground border-separate" style={{ borderSpacing: 3 }}>
        <caption className="sr-only">Plays by weekday for each month</caption>
        <thead>
          <tr><th scope="col" className="sr-only">Day</th>{months.map((m) => <th key={m} scope="col" className="font-normal px-0.5">{m.slice(5)}</th>)}</tr>
        </thead>
        <tbody>
          {days.map((d, i) => (
            <tr key={d}>
              <th scope="row" className="font-normal text-left pr-1">{d}</th>
              {months.map((m) => {
                const v = at.get(`${m}|${i}`) ?? 0
                return (
                  <td key={m} title={`${d}, ${m}: ${v} plays`} className="h-5 w-7 rounded-[3px] bg-primary" style={{ opacity: v === 0 ? 0.08 : 0.2 + (v / max) * 0.8 }}>
                    <span className="sr-only">{v} plays</span>
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
  if (empty(m.totalPlays)) return null
  return (
    <div className="space-y-4">
      <Tiles>
        <StatCard label="Plays, last 30 days" value={m.plays30} />
        <StatCard label="Plays, last year" value={m.totalPlays} />
        <StatCard label="Busiest weekday" value={[...m.weekdays].sort((a, b) => b.value - a.value)[0]?.name ?? "-"} />
      </Tiles>
      <Grid>
        <MusicPatterns s={s} />
        <Card title="Which days I listen" note="plays by weekday"><Radar data={m.weekdays} dataKey="value" nameKey="name" height={220} /></Card>
        <Card title="My listening clock" note="plays by hour of the day, London time"><RadialClock hours={m.hours} height={240} valueLabel="plays" /></Card>
        {m.weekdayMonths.length > 0 && <Card title="Weekdays month by month" note="plays, stronger colour means more" wide><WeekdayMonthGrid data={m.weekdayMonths} /></Card>}
      </Grid>
    </div>
  )
}

export function MusicPatterns({ s }: { s: PublicStats }) {
  const m = s.music
  if (empty(m.totalPlays)) return null
  return (
    <>
      <Card title="When I listen" note="weekday by hour, London time" wide><GridHeatmap data={m.grid} height={220} valueLabel="plays" /></Card>
      <Card title="Plays by month" note="last 12 months"><BarChart data={m.months} dataKey="value" xKey="name" height={200} /></Card>
    </>
  )
}

export function GamingMore({ s }: { s: PublicStats }) {
  const g = s.gaming
  if (g.sessions === 0) return null
  return (
    <div className="space-y-4">
      <Grid>
        <Card title="PS5 against gaming PC" note="hours, last 90 days"><PieChart data={g.byDevice} height={200} valueFormatter={h} /></Card>
        {g.genres.length > 0 && <Card title="Time by genre" note={g.genres[0].basis === "tracked" ? "tracked sessions" : "lifetime playtime"}><Treemap data={g.genres.map((x) => ({ name: x.name, value: x.value }))} height={200} valueFormatter={h} /></Card>}
        <Card title="Weekly hours" note="last 90 days"><LineChart data={g.weekly} dataKey="hours" xKey="name" height={200} dots valueFormatter={h} /></Card>
        <Card title="When I play" note="weekday by hour"><GridHeatmap data={g.heatmap} height={200} valueLabel="hours" /></Card>
        {g.lifetime.length > 0 && <Card title="Lifetime playtime" note="most played, from my accounts" wide><BarChart data={g.lifetime} dataKey="hours" xKey="name" height={220} valueFormatter={h} /></Card>}
        {s.gamingMore.deviceTree.length > 0 && <Card title="What I play on each device" note="inner ring is the device, hours"><Sunburst data={s.gamingMore.deviceTree} height={260} /></Card>}
        {s.gamingMore.lengths.length > 0 && <Card title="How long I play" note="session length in minutes, last 90 days"><Histogram values={s.gamingMore.lengths} height={220} valueFormatter={(v) => `${v} min`} /></Card>}
      </Grid>
    </div>
  )
}

export function ApplicationsMore({ s }: { s: PublicStats }) {
  const a = s.applications
  if (empty(a.total)) return null
  return (
    <div className="space-y-4">
      <Grid>
        <Card title="Where they go, by country" note="stronger colour means more opportunities" wide><Choropleth data={a.countries} height={320} valueLabel="opportunities" /></Card>
        <Card title="Top countries"><BarChart data={a.countries.slice(0, 8)} dataKey="value" xKey="name" height={200} /></Card>
        <Card title="Opportunities tracked by month" note="last 12 months"><Composed data={a.months} xKey="name" barKey="value" lineKey="value" height={200} /></Card>
        {a.regions.length > 0 && <Card title="Regions month by month" note="opportunities, last 12 months" wide><StackedArea data={a.regionMonths} xKey="name" series={a.regions.map((r) => ({ key: r, name: r }))} height={240} /></Card>}
        {a.regionTree.length > 0 && <Card title="Regions and their countries" note="inner ring is the region"><Sunburst data={a.regionTree} height={260} /></Card>}
      </Grid>
    </div>
  )
}

export function WritingStats({ c }: { c: Content }) {
  return (
    <div className="space-y-4">
      <Tiles>
        <StatCard label="Blog posts" value={c.postCount} />
        <StatCard label="TIL entries" value={c.tilCount} />
        <StatCard label="Notes" value={c.noteCount} />
        <StatCard label="Newsletter issues" value={c.issueCount} />
        <StatCard label="Projects" value={c.projectCount} />
      </Tiles>
      <Grid>
        <Card title="Posts by month"><BarChart data={c.postsByMonth} dataKey="value" xKey="name" height={200} /></Card>
        <Card title="TIL entries by month"><BarChart data={c.tilByMonth} dataKey="value" xKey="name" height={200} colour="#6366f1" /></Card>
        <Card title="Notes and newsletter by month" note="notes as bars, issues as the line"><Composed data={c.shortByMonth} xKey="name" barKey="notes" lineKey="issues" barName="Notes" lineName="Issues" height={200} /></Card>
        <Card title="What I write about" note="post tags"><Treemap data={c.tags} height={220} /></Card>
        <Card title="How long the posts are" note="reading time"><PieChart data={c.reading.filter((r) => r.value > 0)} height={200} /></Card>
        <Card title="Kinds of post"><PieChart data={c.postTypes} height={200} /></Card>
        <Card title="What I learn" note="TIL categories"><Treemap data={c.tilCategories} height={200} /></Card>
        <Card title="Projects by kind"><PieChart data={c.projectsByCategory} height={200} /></Card>
        <Card title="Technologies I use in projects"><WordCloud words={c.techs.map((t) => ({ text: t.name, value: t.value }))} /></Card>
        <Card title="What I read, watch and listen to" note="items I have logged" wide><BarChart data={c.consumed} dataKey="value" xKey="name" height={200} /></Card>
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
  const written = [...months.values()].sort((a, b) => a.name.localeCompare(b.name)).slice(-12)
  return (
    <Grid>
      {s.activeDays.length > 0 && <Card title="My year at a glance" note="how many of coding, listening, gaming and GitHub I did each day" wide><CalendarHeatmap data={s.activeDays} valueLabel="areas active" /></Card>}
      <Card title="My activity mix" note="average week against my busiest week, percent"><Radar data={mix} dataKey="value" nameKey="name" height={240} /></Card>
      <Card title="What I publish" note="posts and TILs per month"><Composed data={written} xKey="name" barKey="posts" lineKey="til" barName="Posts" lineName="TILs" height={240} /></Card>
      <Card title="Listening by weekday" note="plays, last year"><BarChart data={s.music.weekdays} dataKey="value" xKey="name" height={200} /></Card>
      <Card title="Coding by weekday" note="hours, last year"><BarChart data={s.coding.weekdays} dataKey="value" xKey="name" height={200} valueFormatter={h} /></Card>
    </Grid>
  )
}

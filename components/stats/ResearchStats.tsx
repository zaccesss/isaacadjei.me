"use client"

import Link from "next/link"
import { BarChart, Composed, LineChart, PieChart, Radar, StatCard, WordCloud } from "@/components/analytics"
import { seriesTable, tableOf } from "@/components/analytics/chart-table"
import { Card } from "@/components/stats/StatsCharts"
import { listSummary, rangeSummary, topSummary, totalSummary, weekdaySummary } from "@/components/stats/chart-data"
import type { ResearchStats as Stats } from "@/lib/stats/research-stats"

const fmt = new Intl.NumberFormat("en-GB")
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const longDate = (iso: string) => {
  const [year, month, day] = iso.split("-").map(Number)
  return `${day} ${MONTHS[month - 1]} ${year}`
}
const short = (title: string) => title.split(/[:(]/)[0].trim()

function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-semibold">{children}</h2>
}
const SECTION_LINK = "inline-flex min-h-11 items-center text-sm font-medium text-primary underline underline-offset-4"
const Grid = ({ children }: { children: React.ReactNode }) => <div className="grid gap-4 md:grid-cols-2">{children}</div>
const Tiles = ({ children }: { children: React.ReactNode }) => <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{children}</div>

export function ResearchStats({ s }: { s: Stats }) {
  const { publications: pubs, research } = s
  const counted = pubs.rows.filter((r) => r.views !== null)
  const views = counted.map((r) => ({ name: short(r.name), value: r.views ?? 0 }))
  const downloads = counted.map((r) => ({ name: short(r.name), value: r.downloads ?? 0 }))
  const sideBySide = research.depth.map((d) => ({ name: d.name, value: d.materials + d.references + (research.papersByGroup.find((g) => g.name === d.name)?.value ?? 0) }))
  const depthSeries = [{ key: "materials", name: "Open materials" }, { key: "references", name: "Links" }]

  return (
    <div className="space-y-10">
      <section className="space-y-4" aria-labelledby="stats-publications">
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <Heading><span id="stats-publications">Publications</span></Heading>
          <Link href="/publications" className={SECTION_LINK}>Open the publications</Link>
        </div>
        <Tiles>
          <StatCard label="Publications" value={pubs.count} scope="all-time" />
          {pubs.views !== null && <StatCard label="Views on Zenodo" value={fmt.format(pubs.views)} scope="all-time" />}
          {pubs.downloads !== null && <StatCard label="Downloads" value={fmt.format(pubs.downloads)} scope="all-time" />}
          <StatCard label="Kinds of record" value={pubs.kinds.length} scope="all-time" />
        </Tiles>
        <Grid>
          {counted.length > 0 && (
            <Card title="Views by record" note="views, from Zenodo, refreshed daily" alt={topSummary(views, "views")} table={tableOf(views, ["Record", "Views"])}>
              <BarChart data={views} dataKey="value" xKey="name" height={220} name="Views" />
            </Card>
          )}
          {counted.length > 0 && (
            <Card title="Downloads by record" note="downloads, from Zenodo, refreshed daily" alt={topSummary(downloads, "downloads")} table={tableOf(downloads, ["Record", "Downloads"])}>
              <BarChart data={downloads} dataKey="value" xKey="name" height={220} name="Downloads" />
            </Card>
          )}
          <Card title="Kinds of record" note="records" alt={listSummary(pubs.kinds, "records")}>
            <PieChart data={pubs.kinds} centreLabel="Records" />
          </Card>
          <Card title="What they are about" note="records per keyword, bigger means more" alt={topSummary(pubs.keywords, "records")}>
            <WordCloud words={pubs.keywords.map((k) => ({ text: k.name, value: k.value }))} height={240} valueLabel="records" />
          </Card>
          <Card title="Every record" wide alt={`${pubs.rows.length} records, each with its kind, year, views and downloads in the table.`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th scope="col" className="py-2 pr-3 font-medium">Record</th>
                    <th scope="col" className="py-2 pr-3 font-medium">Kind</th>
                    <th scope="col" className="py-2 pr-3 font-medium">Year</th>
                    <th scope="col" className="py-2 pr-3 text-right font-medium">Views</th>
                    <th scope="col" className="py-2 text-right font-medium">Downloads</th>
                  </tr>
                </thead>
                <tbody>
                  {pubs.rows.map((r) => (
                    <tr key={r.id} className="border-b last:border-0">
                      <th scope="row" className="py-2 pr-3 text-left font-medium">
                        <Link href={`/publications/${r.id}`} className="text-primary hover:underline underline-offset-4">{short(r.name)}</Link>
                      </th>
                      <td className="py-2 pr-3 text-muted-foreground">{r.kind}</td>
                      <td className="py-2 pr-3 text-muted-foreground">{r.year}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{r.views === null ? "Not counted" : fmt.format(r.views)}</td>
                      <td className="py-2 text-right tabular-nums">{r.downloads === null ? "Not counted" : fmt.format(r.downloads)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </Grid>
      </section>

      <section className="space-y-4" aria-labelledby="stats-research">
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <Heading><span id="stats-research">Research</span></Heading>
          <Link href="/research" className={SECTION_LINK}>Open the research</Link>
        </div>
        <Tiles>
          <StatCard label="Lines of research" value={research.lines} scope="current" />
          <StatCard label="Papers behind them" value={research.papers} scope="current" />
          <StatCard label="Open materials" value={research.materials} scope="current" />
          <StatCard label="Interests" value={research.interests} scope="current" />
        </Tiles>
        <Grid>
          <Card title="How far each line has got" note="lines of research by stage" alt={listSummary(research.stages, "lines")}>
            <PieChart data={research.stages} centreLabel="Lines" sort={false} />
          </Card>
          <Card title="Papers behind each line" note="papers" alt={listSummary(research.papersByGroup, "papers")} table={tableOf(research.papersByGroup, ["Line", "Papers"])}>
            <BarChart data={research.papersByGroup} dataKey="value" xKey="name" height={200} name="Papers" />
          </Card>
          <Card title="What each line has in the open" note="materials and links, one panel each" alt={research.depth.map((d) => `${d.name}: ${d.materials} open materials and ${d.references} links`).join(". ")} table={seriesTable(research.depth, "Line", depthSeries)}>
            <Composed data={research.depth} xKey="name" barKey="materials" lineKey="references" barName="Open materials" lineName="Links" height={200} />
          </Card>
          {research.depth.length > 2 && (
            <Card title="Lines side by side" note="papers, materials and links added together" alt={listSummary(sideBySide, "items")} table={tableOf(sideBySide, ["Line", "Items"])}>
              <Radar data={sideBySide} dataKey="value" nameKey="name" height={240} />
            </Card>
          )}
        </Grid>
      </section>

    </div>
  )
}

export function ReleaseStats({ releases }: { releases: Stats["releases"] }) {
  return (
    <div className="space-y-10">
      <section className="space-y-4" aria-labelledby="stats-releases">
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <Heading><span id="stats-releases">Releases of this site</span></Heading>
          <Link href="/changelog" className={SECTION_LINK}>Open the changelog</Link>
        </div>
        <Tiles>
          <StatCard label="Releases" value={releases.total} scope="all-time" />
          <StatCard label="Months of releases" value={releases.byMonth.length} scope="all-time" />
          <StatCard label="Changes listed" value={fmt.format(releases.lines)} scope="all-time" />
          {releases.busiest && <StatCard label={`Busiest month, ${releases.busiest.name}`} value={releases.busiest.value} scope="all-time" />}
        </Tiles>
        {releases.first && releases.latest && (
          <p className="text-sm text-muted-foreground">
            First release on {longDate(releases.first)}. The latest is {releases.latest.version} on {longDate(releases.latest.date)}.
          </p>
        )}
        <Grid>
          <Card title="Releases by month" note="releases" wide alt={rangeSummary(releases.byMonth.map((m) => ({ name: m.name, value: m.total })), "releases")} table={tableOf(releases.byMonth, ["Month", "Releases"], { key: "total" })}>
            <BarChart data={releases.byMonth} dataKey="total" xKey="name" height={220} name="Releases" />
          </Card>
          <Card title="Releases adding up" note="running total" alt={releases.growth.length ? totalSummary(releases.growth, "releases", releases.growth[0].name) : undefined} table={tableOf(releases.growth, ["Month", "Releases so far"])}>
            <LineChart data={releases.growth} dataKey="value" xKey="name" height={200} dots name="Releases so far" />
          </Card>
          <Card title="Kinds of change" note="lines in the changelog" alt={listSummary(releases.kinds, "lines")} table={releases.kinds.length > 6 ? tableOf(releases.kinds, ["Kind", "Lines"]) : undefined}>
            <PieChart data={releases.kinds} centreLabel="Lines" />
          </Card>
          <Card title="Size of release" note="releases, from the version number" alt={listSummary(releases.sizes, "releases")}>
            <PieChart data={releases.sizes} centreLabel="Releases" sort={false} />
          </Card>
          <Card title="Changes listed by month" note="changelog lines" alt={rangeSummary(releases.linesByMonth, "changes")} table={tableOf(releases.linesByMonth, ["Month", "Changes"])}>
            <BarChart data={releases.linesByMonth} dataKey="value" xKey="name" height={200} name="Changes" />
          </Card>
          <Card title="Which days I release" note="releases by weekday" wide alt={weekdaySummary(releases.weekdays, "releases")} table={tableOf(releases.weekdays, ["Weekday", "Releases"])}>
            <BarChart data={releases.weekdays} dataKey="value" xKey="name" height={200} name="Releases" />
          </Card>
        </Grid>
      </section>
    </div>
  )
}

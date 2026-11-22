"use client"

import { useEffect, useState } from "react"
import { CalendarHeatmap, BarChart, ChartFrame, RadialClock, Treemap, WordCloud, tableOf, useAnalyticsPeriod } from "@/components/analytics"
import { calendarSummary } from "@/components/stats/chart-data"
import { Music2 } from "lucide-react"

type MusicHistoryData = { totalPlays: number; daily: { date: string; count: number }[]; hourly: number[] }
type GenreDatum = { genre: string; value: number }
type EraDatum = { decade: string; count: number }
type ArtistDatum = { rank: number; name: string }

export default function MusicHistory() {
  const { period } = useAnalyticsPeriod()
  const [result, setResult] = useState<{ period: typeof period; data: MusicHistoryData | null } | null>(null)
  const loading = result === null || result.period !== period
  const data = result?.period === period ? result.data : null
  const [genres, setGenres] = useState<GenreDatum[] | null>(null)
  const [eras, setEras] = useState<EraDatum[] | null>(null)
  const [artists, setArtists] = useState<ArtistDatum[] | null>(null)

  useEffect(() => {
    const ctrl = new AbortController()
    fetch(`/api/stats/music-history?period=${period}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setResult({ period, data: d }))
      .catch(() => { if (!ctrl.signal.aborted) setResult({ period, data: null }) })
    return () => ctrl.abort()
  }, [period])

  useEffect(() => {
    fetch("/api/spotify-top")
      .then((r) => (r.ok ? r.json() : { genres: [], eras: [], artists: [] }))
      .then((d) => {
        setGenres(d.genres ?? [])
        setEras(d.eras ?? [])
        setArtists(d.artists ?? [])
      })
      .catch(() => { setGenres([]); setEras([]); setArtists([]) })
  }, [])

  const daily = data?.daily.map((d) => ({ date: d.date, value: d.count })) ?? []
  const genreRows = (genres ?? []).map((g) => ({ name: g.genre, value: Math.round(g.value) }))
  const artistWords = (artists ?? []).map((a) => ({ text: a.name, value: (artists?.length ?? 0) - a.rank + 1 }))
  const eraRows = (eras ?? []).map((e) => ({ name: e.decade, value: e.count }))

  return (
    <div className="space-y-6 rounded-2xl border border-border/60 bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Music2 aria-hidden className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-base font-semibold">Listening history</h2>
        </div>
        {data && <span className="text-sm tabular-nums text-muted-foreground">{data.totalPlays.toLocaleString("en-GB")} plays</span>}
      </div>

      {loading && (
        <div className="space-y-3" aria-busy="true">
          {[1, 2].map((i) => <div key={i} className="h-32 rounded-xl bg-muted/60" />)}
        </div>
      )}

      {!loading && !data && <p className="text-sm text-muted-foreground">Could not load listening history right now.</p>}

      {!loading && data && (
        <div className="grid gap-6 md:grid-cols-2">
          <ChartFrame className="md:col-span-2" title="Daily plays" unit="plays per day" summary={<span className="sr-only">{calendarSummary(daily, "plays")}</span>}>
            <CalendarHeatmap data={daily} valueLabel="plays" height={140} cellSize={10} />
          </ChartFrame>
          <ChartFrame title="Listening clock" unit="plays by hour, London time" empty={!data.hourly.some((v) => v > 0)} emptyTitle="No plays in this period">
            <RadialClock hours={data.hourly} valueLabel="plays" height={240} />
          </ChartFrame>
          {genreRows.length > 0 && (
            <ChartFrame title="Genres" unit="rank weighted across my top artists, not period filtered" table={tableOf(genreRows, ["Genre", "Rank weight"])}>
              <Treemap data={genreRows} height={240} />
            </ChartFrame>
          )}
          {artistWords.length > 0 && (
            <ChartFrame title="Top artists" unit="bigger means higher in Spotify's own ranking, not period filtered">
              <WordCloud words={artistWords} height={240} valueLabel="rank weight" />
            </ChartFrame>
          )}
          {eraRows.length > 0 && (
            <ChartFrame title="Top tracks by release decade" unit="tracks, not period filtered" table={tableOf(eraRows, ["Decade", "Tracks"])}>
              <BarChart data={eraRows} dataKey="value" xKey="name" height={200} name="Tracks" valueFormatter={(v) => `${v} track${v === 1 ? "" : "s"}`} />
            </ChartFrame>
          )}
        </div>
      )}
    </div>
  )
}

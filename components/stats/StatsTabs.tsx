"use client"

import { useState, useSyncExternalStore } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { ArrowRight } from "lucide-react"
import { HubOverview, OverviewMore, CodingMore, MusicMore, GamingMore, ApplicationsMore, WritingStats } from "./StatsCharts"
import { HubCards } from "./HubCards"
import { OpenSourceStats } from "./OpenSourceStats"
import type { OpenSourceStats as OSStats } from "@/lib/open-source"
import { AnalyticsPeriodProvider, PeriodSelector } from "@/components/analytics"
import type { PublicStats } from "@/lib/public-stats"
import type { getContentStats } from "@/lib/content-stats"

type Content = ReturnType<typeof getContentStats>

function PanelLoading() {
  return <div className="h-40 rounded-2xl border border-border/60 bg-muted/30 animate-pulse motion-reduce:animate-none" />
}
const WakatimeStats = dynamic(() => import("@/components/lab/WakatimeStats"), { ssr: false, loading: PanelLoading })
const SpotifyAnalytics = dynamic(() => import("@/components/lab/SpotifyAnalytics"), { ssr: false, loading: PanelLoading })
const MusicHistory = dynamic(() => import("./MusicHistory"), { ssr: false, loading: PanelLoading })
const GamingPanel = dynamic(() => import("@/components/lab/GamingPanel"), { ssr: false, loading: PanelLoading })
const GamingHistory = dynamic(() => import("./GamingHistory").then((m) => m.GamingHistory), { ssr: false, loading: PanelLoading })
const PublicApplicationsMap = dynamic(() => import("./PublicApplicationsMap").then((m) => m.PublicApplicationsMap), { ssr: false, loading: PanelLoading })
const TopLocationsChart = dynamic(() => import("./TopLocationsChart"), { ssr: false, loading: PanelLoading })
const GitHubActivityChart = dynamic(() => import("./GitHubActivityChart"), { ssr: false, loading: PanelLoading })
const GitHubYearlyChart = dynamic(() => import("./GitHubYearlyChart"), { ssr: false, loading: PanelLoading })
const GitHubStats = dynamic(() => import("@/components/shared/GitHubStats"), { ssr: false, loading: PanelLoading })

const TABS = [
  { id: "overview", label: "Overview", page: null, blurb: "" },
  { id: "coding", label: "Coding", page: "/stats/coding", blurb: "How much I code, in what and when, with the live editor panel." },
  { id: "github", label: "GitHub", page: "/stats/github", blurb: "Contributions day by day and year by year." },
  { id: "music", label: "Music", page: "/stats/music", blurb: "What I listen to and when, from my top tracks down to the hour." },
  { id: "gaming", label: "Gaming", page: "/stats/gaming", blurb: "Live status for my PS5 and gaming PC and how I have been playing." },
  { id: "applications", label: "Applications", page: "/stats/applications", blurb: "Where my job search reaches: a live map of cities and the countries behind it, counts only." },
  { id: "writing", label: "Writing and projects", page: "/stats/writing", blurb: "What I write and build, month by month." },
  { id: "open-source", label: "Open source", page: "/open-source", blurb: "What I have contributed to open source projects, with a link to each piece of work on the full page." },
] as const
type Tab = (typeof TABS)[number]["id"]

const noSubscribe = () => () => {}
const readHash = () => window.location.hash.slice(1)
const serverHash = () => ""
const asTab = (hash: string): Tab => (TABS.some((t) => t.id === hash) ? hash : "overview") as Tab

function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{children}</h2>
}

export function StatsTabs({ s, c, os }: { s: PublicStats; c: Content; os: OSStats }) {
  const hash = useSyncExternalStore(noSubscribe, readHash, serverHash)
  const [chosen, setTab] = useState<Tab | null>(null)
  const tab = chosen ?? asTab(hash)
  const active = TABS.find((t) => t.id === tab)!
  const choose = (id: Tab) => {
    setTab(id)
    try {
      window.history.replaceState(null, "", id === "overview" ? window.location.pathname : `#${id}`)
    } catch {
      // the address just keeps its old hash; the tab still changes
    }
  }
  return (
    <div className="space-y-6">
      <div className="flex gap-1.5 flex-wrap border-b border-border pb-3" role="tablist" aria-label="Stats areas">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => choose(t.id)}
            className={`text-sm px-3.5 py-1.5 min-h-11 rounded-full border transition-colors ${tab === t.id ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {active.page && (
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <p className="text-sm text-muted-foreground max-w-xl">{active.blurb}</p>
          <Link href={active.page} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline underline-offset-2">
            Open the {active.label.toLowerCase()} page <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      )}

      {tab === "overview" && (
        <div className="space-y-8">
          <section className="space-y-3"><Heading>At a glance</Heading><HubOverview s={s} c={c} /></section>
          <section className="space-y-3"><Heading>Explore each area</Heading><HubCards s={s} c={c} /></section>
          <section className="space-y-3"><Heading>How it all compares</Heading><OverviewMore s={s} c={c} /></section>
        </div>
      )}

      {tab !== "overview" && tab !== "writing" && tab !== "applications" && tab !== "open-source" ? (
        <AnalyticsPeriodProvider defaultPeriod="30d">
          <div className="space-y-8">
            <div className="flex justify-end"><PeriodSelector /></div>
            {tab === "coding" && <><CodingMore s={s} /><WakatimeStats /></>}
            {tab === "github" && <><GitHubStats /><GitHubActivityChart /><GitHubYearlyChart /></>}
            {tab === "music" && <><MusicMore s={s} /><MusicHistory /><SpotifyAnalytics /></>}
            {tab === "gaming" && <><GamingPanel /><GamingHistory /><GamingMore s={s} /></>}
          </div>
        </AnalyticsPeriodProvider>
      ) : null}
      {tab === "applications" && (
        <div className="space-y-8">
          <PublicApplicationsMap />
          <ApplicationsMore s={s} />
          <TopLocationsChart />
        </div>
      )}
      {tab === "writing" && <WritingStats c={c} />}
      {tab === "open-source" && <OpenSourceStats s={os} />}
    </div>
  )
}

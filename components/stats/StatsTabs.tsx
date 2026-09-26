"use client"

import { useState } from "react"
import Link from "next/link"
import { HubOverview, OverviewMore, CodingMore, MusicMore, GamingMore, ApplicationsMore, WritingStats } from "./StatsCharts"
import { HubCards } from "./HubCards"
import type { PublicStats } from "@/lib/public-stats"
import type { getContentStats } from "@/lib/content-stats"

type Content = ReturnType<typeof getContentStats>

const TABS = [
  { id: "overview", label: "Overview", page: null },
  { id: "coding", label: "Coding", page: "/stats/coding" },
  { id: "music", label: "Music", page: "/stats/music" },
  { id: "gaming", label: "Gaming", page: "/stats/gaming" },
  { id: "applications", label: "Applications", page: "/stats/applications" },
  { id: "writing", label: "Writing and projects", page: "/stats/writing" },
] as const
type Tab = (typeof TABS)[number]["id"]

function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{children}</h2>
}

export function StatsTabs({ s, c }: { s: PublicStats; c: Content }) {
  const [tab, setTab] = useState<Tab>("overview")
  const active = TABS.find((t) => t.id === tab)!
  return (
    <div className="space-y-6">
      <div className="flex gap-1.5 flex-wrap border-b border-border pb-3" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`text-sm px-3.5 py-1.5 rounded-full border transition-colors ${tab === t.id ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="space-y-8">
          <section className="space-y-3"><Heading>At a glance</Heading><HubOverview s={s} c={c} /></section>
          <section className="space-y-3"><Heading>How it all compares</Heading><OverviewMore s={s} c={c} /></section>
          <section className="space-y-3"><Heading>Go deeper</Heading><HubCards s={s} c={c} /></section>
        </div>
      )}
      {tab === "coding" && <CodingMore s={s} />}
      {tab === "music" && <MusicMore s={s} />}
      {tab === "gaming" && <GamingMore s={s} />}
      {tab === "applications" && <ApplicationsMore s={s} />}
      {tab === "writing" && <WritingStats c={c} />}

      {active.page && (
        <p className="text-sm text-muted-foreground">
          Want the live panels and the period selector? <Link href={active.page} className="text-primary underline underline-offset-2">Open the {active.label.toLowerCase()} page</Link>.
        </p>
      )}
    </div>
  )
}

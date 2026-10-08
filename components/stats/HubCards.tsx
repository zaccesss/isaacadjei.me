"use client"

import Link from "next/link"
import { ArrowRight, Code2, Gamepad2, MapPinned, Music2, PenLine } from "lucide-react"
import { FaGithub as Github } from "react-icons/fa6"
import type { PublicStats } from "@/lib/public-stats"
import type { getContentStats } from "@/lib/content-stats"

type Content = ReturnType<typeof getContentStats>

function Spark({ values, colour }: { values: number[]; colour: string }) {
  const w = 160
  const h = 44
  const max = Math.max(...values, 1)
  const step = w / Math.max(values.length - 1, 1)
  const pts = values.map((v, i) => [i * step, h - 4 - (v / max) * (h - 8)] as const)
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ")
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-11" preserveAspectRatio="none" aria-hidden>
      <path d={`${line} L${w},${h} L0,${h} Z`} fill={colour} fillOpacity={0.18} />
      <path d={line} fill="none" stroke={colour} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

function Equaliser({ values, colour }: { values: number[]; colour: string }) {
  const max = Math.max(...values, 1)
  return (
    <div className="flex items-end gap-1 h-11" aria-hidden>
      {values.map((v, i) => (
        <span key={i} className="flex-1 rounded-sm" style={{ height: `${Math.max((v / max) * 100, 8)}%`, background: colour, opacity: 0.55 + (v / max) * 0.45 }} />
      ))}
    </div>
  )
}

function ContributionGrid({ values }: { values: number[] }) {
  const max = Math.max(...values, 1)
  return (
    <div className="grid grid-flow-col grid-rows-3 gap-1 h-11" aria-hidden>
      {values.flatMap((v, i) => [0, 1, 2].map((r) => (
        <span key={`${i}-${r}`} className="rounded-[3px] bg-emerald-500" style={{ opacity: v === 0 ? 0.12 : 0.2 + Math.min((v / max) * (1 - r * 0.25), 1) * 0.8 }} />
      )))}
    </div>
  )
}

function Chips({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((t) => <span key={t} className="text-[11px] rounded-md bg-muted px-2 py-0.5 font-medium text-foreground/80">{t}</span>)}
    </div>
  )
}

type CardProps = { href: string; label: string; icon: React.ComponentType<{ className?: string }>; tint: string; headline: string; sub: string; children: React.ReactNode }

function HubCard({ href, label, icon: Icon, tint, headline, sub, children }: CardProps) {
  return (
    <Link href={href} className={`group relative overflow-hidden rounded-2xl border border-border/60 p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40 bg-linear-to-br ${tint}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="rounded-xl border border-border/60 bg-background/70 p-2.5 backdrop-blur-sm"><Icon className="h-5 w-5 text-primary" /></div>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 group-hover:text-primary transition-all" />
      </div>
      <div className="mt-4 space-y-0.5">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold tracking-tight">{headline}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
      <div className="mt-4">{children}</div>
    </Link>
  )
}

export function HubCards({ s, c }: { s: PublicStats; c: Content }) {
  const codingWeeks = s.weeks.map((w) => w.coding)
  const playWeeks = s.weeks.map((w) => w.plays)
  const gitWeeks = s.weeks.map((w) => w.github)
  const gameWeeks = s.weeks.map((w) => w.gaming)
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <HubCard href="/stats/coding" label="Coding" icon={Code2} tint="from-blue-500/10 via-card to-card" headline={`${s.coding.hours30} h`} sub={`in the last 30 days, ${s.coding.streak} day streak`}>
        <Spark values={codingWeeks} colour="#3b82f6" />
        <div className="mt-3"><Chips items={s.coding.languages.slice(0, 3).map((l) => l.name)} /></div>
      </HubCard>
      <HubCard href="/stats/music" label="Music" icon={Music2} tint="from-green-500/10 via-card to-card" headline={`${s.music.plays30} plays`} sub="in the last 30 days">
        <Equaliser values={playWeeks} colour="#1db954" />
      </HubCard>
      <HubCard href="/stats/github" label="GitHub" icon={Github} tint="from-emerald-500/10 via-card to-card" headline={`${s.github.total30}`} sub={`contributions in 30 days, ${s.github.total365} this year`}>
        <ContributionGrid values={gitWeeks} />
      </HubCard>
      <HubCard href="/stats/gaming" label="Gaming" icon={Gamepad2} tint="from-rose-500/10 via-card to-card" headline={`${s.gaming.totalHours} h`} sub={`played in 90 days across ${s.gaming.games} games`}>
        <Spark values={gameWeeks} colour="#e11d48" />
        <div className="mt-3"><Chips items={(s.gaming.genres.length ? s.gaming.genres : s.gaming.byGame).slice(0, 3).map((g) => g.name)} /></div>
      </HubCard>
      <HubCard href="/stats/applications" label="Applications" icon={MapPinned} tint="from-violet-500/10 via-card to-card" headline={`${s.applications.countries.length} countries`} sub="where my job search has reached, counts only">
        <Chips items={s.applications.countries.slice(0, 4).map((x) => x.name)} />
      </HubCard>
      <HubCard href="/stats/writing" label="Writing and projects" icon={PenLine} tint="from-amber-500/10 via-card to-card" headline={`${c.postCount + c.tilCount} pieces`} sub={`${c.postCount} posts, ${c.tilCount} TILs and ${c.projectCount} projects`}>
        <Chips items={c.tags.slice(0, 4).map((t) => t.name)} />
      </HubCard>
    </div>
  )
}

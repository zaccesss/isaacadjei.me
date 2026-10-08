import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { ConsumedSummary, ConsumedYearSummary } from "@/data/consumed/summary"
import type { ConsumedCollection } from "@/data/consumed/collections"
import { TAG_LINK_CLASS } from "@/components/shared/Tag"
import { normTag } from "@/lib/tags"
import { SummaryCard } from "./SummaryCard"

export type HubOverviewProps = {
  year: ConsumedYearSummary
  picks: ConsumedSummary[]
  collections: (ConsumedCollection & { count: number })[]
}

const SECTION_LABEL = "text-xs font-mono text-muted-foreground uppercase tracking-widest"

export function HubOverview({ year, picks, collections }: HubOverviewProps) {
  return (
    <div className="space-y-12">
      {year.total > 0 && (
        <section aria-labelledby="consumed-year" className="space-y-3">
          <h2 id="consumed-year" className={SECTION_LABEL}>{year.year} so far</h2>
          <dl className="grid grid-cols-3 sm:grid-cols-6 gap-px overflow-hidden rounded-xl border border-border/60 bg-border/60">
            {year.counts.map((c) => (
              <div key={c.category} className="bg-card px-3 py-3">
                <dt className="text-xs text-muted-foreground">{c.label}</dt>
                <dd className="text-2xl font-semibold tabular-nums">{c.count}</dd>
              </div>
            ))}
          </dl>
          {year.topTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-muted-foreground mr-1">Top tags</span>
              {year.topTags.map((t) => (
                <Link key={t.tag} href={`/tags/${normTag(t.tag)}`} className={TAG_LINK_CLASS}>
                  {t.tag}
                  <span className="ml-1 tabular-nums text-muted-foreground">{t.count}</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {picks.length > 0 && (
        <section aria-labelledby="consumed-start-here" className="space-y-3">
          <div className="space-y-1">
            <h2 id="consumed-start-here" className="text-2xl font-semibold tracking-tight">Start here</h2>
            <p className="text-sm text-muted-foreground">The strongest things on this list, if you only open a few.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {picks.map((p) => <SummaryCard key={p.key} item={p} />)}
          </div>
        </section>
      )}

      {collections.some((c) => c.count > 0) && (
        <section id="collections" aria-labelledby="consumed-collections" className="space-y-3 scroll-mt-24">
          <h2 id="consumed-collections" className="text-2xl font-semibold tracking-tight">Collections</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {collections.filter((c) => c.count > 0).map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/consumed/collections/${c.slug}`}
                  className="group flex h-full flex-col gap-1 rounded-xl border border-border/60 bg-card p-4 hover:border-border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold group-hover:text-primary group-hover:underline underline-offset-2">{c.title}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground tabular-nums">
                      {c.count} {c.count === 1 ? "item" : "items"}
                      <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </span>
                  </span>
                  <span className="text-xs text-muted-foreground leading-relaxed">{c.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

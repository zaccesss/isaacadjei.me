"use client"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { type PodcastEntry, type ConsumedTotals } from "@/data/consumed/types"
import ListControls from "@/components/shared/lists/ListControls"
import { Pagination } from "@/components/shared/lists/Pagination"
import { CONSUMED_PAGE_SIZES, useConsumedList } from "@/components/consumed/useConsumedList"
import { ConsumedCategoryTabs } from "@/components/consumed/ConsumedCategoryTabs"
import { PodcastCard } from "@/components/consumed/PodcastCard"
import PageHeader from "@/components/layout/PageHeader"

export default function PodcastsContent({ podcasts, totals }: { podcasts: PodcastEntry[]; totals: ConsumedTotals }) {
  const searchParams = useSearchParams()
  const preview = searchParams.get("preview") === "1"
  const { query, groups, filtered, paginated, page, totalPages, perPage, setPerPage } = useConsumedList(podcasts, {
    storageKey: "podcasts",
    preview,
    text: (p) => [p.title, p.show],
    facet: { key: "show", label: "Show", kind: "multi", values: (p) => [p.show] },
  })

  return (
    <div className="container py-24 space-y-10">
      <div className="max-w-2xl space-y-6">
        <Link
          href="/consumed"
          className="inline-flex min-h-11 items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Consumed
        </Link>
        <PageHeader
          title="Audio"
          description="Podcast episodes and shows listened to this year. Play them directly here where possible. Spans a wide range of topics: engineering, technology, culture, faith and long-form conversation."
        >
          <p className="text-sm text-muted-foreground tabular-nums">
            {filtered.length} {filtered.length === 1 ? "item" : "items"}
          </p>
        </PageHeader>
      </div>

      <ListControls
        query={query}
        groups={groups}
        searchLabel="Search audio"
        searchPlaceholder="Search podcasts by title or show..."
        resultCount={filtered.length}
        itemLabel={{ one: "episode", many: "episodes" }}
      />

      <ConsumedCategoryTabs active="audio" counts={{ ...totals, audio: filtered.length }} />

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">No audio match these filters.</p>
      ) : (
        <div id="consumed-list" className="scroll-mt-24 grid grid-cols-1 md:grid-cols-2 gap-5">
          {paginated.map((p) => <PodcastCard key={p.spotifyId} podcast={p} />)}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={query.setPage}
        totalItems={filtered.length}
        pageSize={perPage}
        pageSizeOptions={CONSUMED_PAGE_SIZES}
        onPageSizeChange={(n) => {
          setPerPage(n)
          query.setPage(1)
        }}
        scrollTargetId="consumed-list"
        itemLabel="episodes"
        label="Audio pages"
      />
    </div>
  )
}

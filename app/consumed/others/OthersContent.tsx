"use client"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Globe } from "lucide-react"
import { type LinkEntry, type ConsumedTotals } from "@/data/consumed/types"
import ListControls from "@/components/shared/ListControls"
import { Pagination } from "@/components/shared/Pagination"
import { CONSUMED_PAGE_SIZES, useConsumedList } from "@/components/consumed/useConsumedList"
import { ConsumedCategoryTabs } from "@/components/consumed/ConsumedCategoryTabs"
import { LinkCard } from "@/components/consumed/LinkCard"

export default function OthersContent({ others, totals }: { others: LinkEntry[]; totals: ConsumedTotals }) {
  const searchParams = useSearchParams()
  const preview = searchParams.get("preview") === "1"
  const { query, groups, filtered, paginated, page, totalPages, perPage, setPerPage } = useConsumedList(others, {
    storageKey: "others",
    preview,
    text: (o) => [o.title, o.source, ...o.tags],
    facet: { key: "tag", label: "Tags", kind: "multi", values: (o) => o.tags },
  })

  return (
    <div className="container py-24 space-y-10">
      <div className="space-y-4 max-w-2xl">
        <Link href="/consumed" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Consumed
        </Link>
        <div className="flex items-center gap-3">
          <Globe className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-4xl font-bold tracking-tight">Others</h1>
          <span className="text-xs font-mono text-muted-foreground">
            {filtered.length}
          </span>
        </div>
        <p className="text-base text-muted-foreground leading-relaxed">
          Tools, repos, extensions and miscellaneous finds that do not fit neatly into any other category. Things discovered while building, studying or just browsing.
        </p>
      </div>

      <ListControls
        query={query}
        groups={groups}
        searchLabel="Search others"
        searchPlaceholder="Search others by title, source or tag..."
        resultCount={filtered.length}
        itemLabel={{ one: "item", many: "items" }}
      />

      <ConsumedCategoryTabs active="others" counts={{ ...totals, others: filtered.length }} />

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">No others match these filters.</p>
      ) : (
        <div id="consumed-list" className="scroll-mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((o) => (
            <LinkCard key={o.title} item={o} category="others" />
          ))}
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
        itemLabel="items"
        label="Other item pages"
      />
    </div>
  )
}

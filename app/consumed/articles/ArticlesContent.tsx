"use client"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Newspaper } from "lucide-react"
import { type LinkEntry, type ConsumedTotals } from "@/data/consumed/types"
import ListControls from "@/components/shared/ListControls"
import { Pagination } from "@/components/shared/Pagination"
import { CONSUMED_PAGE_SIZES, useConsumedList } from "@/components/consumed/useConsumedList"
import { ConsumedCategoryTabs } from "@/components/consumed/ConsumedCategoryTabs"
import { LinkCard } from "@/components/consumed/LinkCard"

export default function ArticlesContent({ articles, totals }: { articles: LinkEntry[]; totals: ConsumedTotals }) {
  const searchParams = useSearchParams()
  const preview = searchParams.get("preview") === "1"
  const { query, groups, filtered, paginated, page, totalPages, perPage, setPerPage } = useConsumedList(articles, {
    storageKey: "articles",
    preview,
    text: (a) => [a.title, a.source, ...a.tags],
    facet: { key: "tag", label: "Tags", kind: "multi", values: (a) => a.tags },
  })

  return (
    <div className="container py-24 space-y-10">
      <div className="space-y-4 max-w-2xl">
        <Link href="/consumed" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Consumed
        </Link>
        <div className="flex items-center gap-3">
          <Newspaper className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-4xl font-bold tracking-tight">Articles</h1>
          <span className="text-xs font-mono text-muted-foreground">
            {filtered.length}
          </span>
        </div>
        <p className="text-base text-muted-foreground leading-relaxed">
          Essays and long-form writing worth reading. Things that made me think or changed my perspective. Covers software, hardware, career, culture, faith and general ideas.
        </p>
      </div>

      <ListControls
        query={query}
        groups={groups}
        searchLabel="Search articles"
        searchPlaceholder="Search articles by title, source or tag..."
        resultCount={filtered.length}
        itemLabel={{ one: "article", many: "articles" }}
      />

      <ConsumedCategoryTabs active="articles" counts={{ ...totals, articles: filtered.length }} />

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">No articles match these filters.</p>
      ) : (
        <div id="consumed-list" className="scroll-mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((a) => (
            <LinkCard key={a.title} item={a} category="articles" />
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
        itemLabel="articles"
        label="Article pages"
      />
    </div>
  )
}

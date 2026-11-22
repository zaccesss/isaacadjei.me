"use client"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { type ResourceEntry, type ConsumedTotals } from "@/data/consumed/types"
import ListControls from "@/components/shared/lists/ListControls"
import { Pagination } from "@/components/shared/lists/Pagination"
import { CONSUMED_PAGE_SIZES, useConsumedList } from "@/components/consumed/useConsumedList"
import { ConsumedCategoryTabs } from "@/components/consumed/ConsumedCategoryTabs"
import { ResourceCard } from "@/components/consumed/ResourceCard"
import PageHeader from "@/components/layout/PageHeader"

export default function ResourcesContent({ resources, totals }: { resources: ResourceEntry[]; totals: ConsumedTotals }) {
  const searchParams = useSearchParams()
  const preview = searchParams.get("preview") === "1"
  const { query, groups, filtered, paginated, page, totalPages, perPage, setPerPage } = useConsumedList(resources, {
    storageKey: "resources",
    preview,
    text: (r) => [r.title, r.category, r.description],
    facet: { key: "type", label: "Type", kind: "single", values: (r) => [r.category] },
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
          title="Resources"
          description="Websites, tools, documentation and learning platforms worth returning to. The places I keep coming back to when studying, building or debugging."
        >
          <p className="text-sm text-muted-foreground tabular-nums">
            {filtered.length} {filtered.length === 1 ? "item" : "items"}
          </p>
        </PageHeader>
      </div>

      <ListControls
        query={query}
        groups={groups}
        searchLabel="Search resources"
        searchPlaceholder="Search resources by title or category..."
        resultCount={filtered.length}
        itemLabel={{ one: "resource", many: "resources" }}
      />

      <ConsumedCategoryTabs active="resources" counts={{ ...totals, resources: filtered.length }} />

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">No resources match these filters.</p>
      ) : (
        <div id="consumed-list" className="scroll-mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((r) => (
            <ResourceCard key={r.title} resource={r} />
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
        itemLabel="resources"
        label="Resource pages"
      />
    </div>
  )
}

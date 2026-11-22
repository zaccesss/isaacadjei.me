"use client"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { type BookEntry, type ConsumedTotals } from "@/data/consumed/types"
import ListControls from "@/components/shared/lists/ListControls"
import { Pagination } from "@/components/shared/lists/Pagination"
import { CONSUMED_PAGE_SIZES, useConsumedList } from "@/components/consumed/useConsumedList"
import { ConsumedCategoryTabs } from "@/components/consumed/ConsumedCategoryTabs"
import { BookCard } from "@/components/consumed/BookCard"
import PageHeader from "@/components/layout/PageHeader"

export default function BooksContent({ books, totals }: { books: BookEntry[]; totals: ConsumedTotals }) {
  const searchParams = useSearchParams()
  const preview = searchParams.get("preview") === "1"
  const { query, groups, filtered, paginated, page, totalPages, perPage, setPerPage } = useConsumedList(books, {
    storageKey: "books",
    preview,
    text: (b) => [b.title, b.author, b.genre],
    facet: { key: "genre", label: "Genre", kind: "multi", values: (b) => [b.genre] },
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
          title="Books"
          description="Books read or worked through this year. A mix of engineering, software, embedded systems, science and life. Links go to Amazon UK or a free version where one exists."
        >
          <p className="text-sm text-muted-foreground tabular-nums">
            {filtered.length} {filtered.length === 1 ? "item" : "items"}
          </p>
        </PageHeader>
      </div>

      <ListControls
        query={query}
        groups={groups}
        searchLabel="Search books"
        searchPlaceholder="Search books by title, author or genre..."
        resultCount={filtered.length}
        itemLabel={{ one: "book", many: "books" }}
      />

      <ConsumedCategoryTabs active="books" counts={{ ...totals, books: filtered.length }} />

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">No books match these filters.</p>
      ) : (
        <div id="consumed-list" className="scroll-mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((b) => <BookCard key={b.title} book={b} />)}
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
        itemLabel="books"
        label="Book pages"
      />
    </div>
  )
}

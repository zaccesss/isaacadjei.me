"use client"

import { ArrowRight } from "lucide-react"
import { fieldScore } from "@/lib/search"
import { Pagination, usePageSize, LIST_PAGE_SIZES } from "@/components/shared/Pagination"
import ListControls, { type FilterGroup } from "@/components/shared/ListControls"
import { countedOptions, monthOptions, sortItems, useListQuery, yearOptions } from "@/components/shared/useListQuery"
import type { NewsletterIssue } from "@/lib/newsletter"

const LIST_ID = "newsletter-issue-list"

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default function RecentIssues({ issues }: { issues: NewsletterIssue[] }) {
  const query = useListQuery("newest")
  const [perPage, setPerPage] = usePageSize("newsletter", LIST_PAGE_SIZES)

  const search = query.search.trim().toLowerCase()
  const year = query.get("year")
  const month = query.get("month")
  const activeTags = query.getAll("tag")
  const activeKind = query.get("kind")
  const time = (i: NewsletterIssue) => new Date(i.publishDate).getTime()

  const matches = issues
    .filter(
      (i) =>
        !search ||
        i.title.toLowerCase().includes(search) ||
        (i.subtitle ?? "").toLowerCase().includes(search) ||
        i.tags.some((t) => t.toLowerCase().includes(search)),
    )
    .filter((i) => !year || String(new Date(i.publishDate).getFullYear()) === year)
    .filter((i) => !month || String(new Date(i.publishDate).getMonth() + 1) === month)
    .filter((i) => activeTags.length === 0 || activeTags.every((t) => i.tags.includes(t)))
    .filter((i) => !activeKind || i.kind === activeKind)
  const filtered =
    search && !query.get("sort")
      ? [...matches].sort((a, b) => fieldScore(b.title, search) - fieldScore(a.title, search))
      : sortItems(matches, query.sort, time, (i) => i.title)

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const page = Math.min(query.page, totalPages)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  const groups: FilterGroup[] = [
    {
      key: "kind",
      label: "Type",
      kind: "single",
      options: issues.some((i) => i.kind === "outside")
        ? [{ value: "letter", label: "Letters" }, { value: "outside", label: "Outside" }]
        : [],
    },
    { key: "tag", label: "Tags", kind: "multi", options: countedOptions(issues.flatMap((i) => i.tags)) },
    { key: "year", label: "Year", kind: "single", options: yearOptions(issues.map((i) => new Date(i.publishDate).getFullYear())) },
    { key: "month", label: "Month", kind: "single", options: monthOptions(issues.map((i) => new Date(i.publishDate).getMonth())) },
  ]

  return (
    <section id="recent-issues" className="space-y-6 scroll-mt-28" aria-label="Issues">

      {issues.length > 0 && (
        <ListControls
          query={query}
          groups={groups}
          searchLabel="Search issues"
          searchPlaceholder="Search issues…"
          resultCount={filtered.length}
          itemLabel={{ one: "issue", many: "issues" }}
        />
      )}

      {issues.length === 0 && (
        <div className="rounded-lg border border-dashed border-border/60 bg-muted/10 px-6 py-8 text-center space-y-2">
          <p className="text-sm font-medium">No issues published yet</p>
          <p className="text-xs text-muted-foreground">
            Subscribe above to be first when the first issue goes out.
          </p>
        </div>
      )}

      {issues.length > 0 && filtered.length === 0 && (
        <p className="text-sm text-muted-foreground py-4 text-center">No issues match these filters.</p>
      )}

      {filtered.length > 0 && (
        <div id={LIST_ID} className="space-y-3 scroll-mt-24">
          {paginated.map((issue) => (
            <a
              key={issue.id}
              href={issue.href}
              className="group flex items-start gap-4 rounded-lg border border-border/60 bg-muted/20 px-4 py-4 hover:border-primary/40 hover:bg-muted/30 transition-all"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {issue.title}
                </p>
                {issue.subtitle && (
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {issue.subtitle}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <p className="text-[11px] font-mono text-muted-foreground">
                    {formatDate(issue.publishDate)}
                  </p>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {issue.label}
                    {issue.itemCount > 0 && ` · ${issue.itemCount} ${issue.itemCount === 1 ? "item" : "items"}`}
                  </span>
                </div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" aria-hidden="true" />
            </a>
          ))}

          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={query.setPage}
            totalItems={filtered.length}
            pageSize={perPage}
            pageSizeOptions={LIST_PAGE_SIZES}
            onPageSizeChange={(n) => {
              setPerPage(n)
              query.setPage(1)
            }}
            scrollTargetId={LIST_ID}
            itemLabel="issues"
            label="Newsletter issue pages"
            className="pt-2"
          />
        </div>
      )}
    </section>
  )
}

"use client"

import { useEffect, useState } from "react"
import { ArrowRight, ExternalLink, Newspaper } from "lucide-react"
import { fieldScore } from "@/lib/search"
import { Pagination, usePageSize } from "@/components/shared/Pagination"
import ListControls, { type FilterGroup } from "@/components/shared/ListControls"
import { monthOptions, sortItems, useListQuery, yearOptions } from "@/components/shared/useListQuery"
import type { NewsletterIssue } from "@/app/api/newsletter-issues/route"

const PAGE_SIZES = [10, 20, 50]
const LIST_ID = "newsletter-issue-list"

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default function RecentIssues() {
  const [issues, setIssues] = useState<NewsletterIssue[]>([])
  const [loading, setLoading] = useState(true)
  const query = useListQuery("newest")
  const [perPage, setPerPage] = usePageSize("newsletter", PAGE_SIZES)

  useEffect(() => {
    fetch("/api/newsletter-issues")
      .then((r) => r.json())
      .then((data) => {
        setIssues(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const search = query.search.trim().toLowerCase()
  const year = query.get("year")
  const month = query.get("month")
  const status = query.get("status")
  const time = (i: NewsletterIssue) => new Date(i.publishDate).getTime()

  const matches = issues
    .filter((i) => !search || i.title.toLowerCase().includes(search) || (i.subtitle ?? "").toLowerCase().includes(search))
    .filter((i) => !year || String(new Date(i.publishDate).getFullYear()) === year)
    .filter((i) => !month || String(new Date(i.publishDate).getMonth() + 1) === month)
    .filter((i) => !status || (status === "live" ? i.status === "confirmed" : i.status !== "confirmed"))
  const filtered =
    search && !query.get("sort")
      ? [...matches].sort((a, b) => fieldScore(b.title, search) - fieldScore(a.title, search))
      : sortItems(matches, query.sort, time, (i) => i.title)

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const page = Math.min(query.page, totalPages)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  const hasArchived = issues.some((i) => i.status !== "confirmed")
  const hasLive = issues.some((i) => i.status === "confirmed")
  const groups: FilterGroup[] = [
    {
      key: "status",
      label: "Status",
      kind: "single",
      options: hasLive && hasArchived ? [{ value: "live", label: "Live" }, { value: "archived", label: "Archived" }] : [],
    },
    { key: "year", label: "Year", kind: "single", options: yearOptions(issues.map((i) => new Date(i.publishDate).getFullYear())) },
    { key: "month", label: "Month", kind: "single", options: monthOptions(issues.map((i) => new Date(i.publishDate).getMonth())) },
  ]

  return (
    <section id="recent-issues" className="space-y-4 scroll-mt-28">
      <div className="flex items-center gap-2">
        <Newspaper className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold">Recent issues</h2>
      </div>

      {!loading && issues.length > 0 && (
        <ListControls
          query={query}
          groups={groups}
          searchLabel="Search issues"
          searchPlaceholder="Search issues…"
          resultCount={filtered.length}
          itemLabel={{ one: "issue", many: "issues" }}
        />
      )}

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-lg bg-muted/40 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && issues.length === 0 && (
        <div className="rounded-lg border border-dashed border-border/60 bg-muted/10 px-6 py-8 text-center space-y-2">
          <p className="text-sm font-medium">No issues published yet</p>
          <p className="text-xs text-muted-foreground">
            Subscribe above to be first when the first issue goes out.
          </p>
        </div>
      )}

      {!loading && issues.length > 0 && filtered.length === 0 && (
        <p className="text-sm text-muted-foreground py-4 text-center">No issues match these filters.</p>
      )}

      {!loading && filtered.length > 0 && (
        <div id={LIST_ID} className="space-y-3 scroll-mt-24">
          {paginated.map((issue) => {
            const external = !issue.href.startsWith("/")
            return (
            <a
              key={issue.id}
              href={issue.href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex items-start gap-4 rounded-lg border border-border/60 bg-muted/20 px-4 py-4 hover:border-primary/40 hover:bg-muted/30 transition-all"
            >
              {issue.thumbnailUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={issue.thumbnailUrl}
                  alt=""
                  className="w-16 h-16 rounded-md object-cover shrink-0 border border-border/40"
                  loading="lazy"
                />
              )}
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
                  {issue.status === "confirmed" ? (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-green-700 dark:text-green-400">
                      Live
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Archived
                    </span>
                  )}
                </div>
              </div>
              {external ? (
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" aria-hidden="true" />
              ) : (
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" aria-hidden="true" />
              )}
            </a>
            )
          })}

          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={query.setPage}
            totalItems={filtered.length}
            pageSize={perPage}
            pageSizeOptions={PAGE_SIZES}
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

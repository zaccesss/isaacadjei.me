"use client"

import { useEffect } from "react"
import { relevanceScore } from "@/lib/content/search"
import Link from "@/components/shared/IntentLink"
import { Archive, ArrowLeft, Calendar, Clock, Rss } from "lucide-react"
import Tag, { postTypeLabelClass } from "@/components/shared/lists/Tag"
import { POST_TYPES, RENAMED_POST_TYPES, type BlogCard } from "@/data/blog/meta"
import type { PostType } from "@/data/blog"
import { Pagination, usePageSize, LIST_PAGE_SIZES } from "@/components/shared/lists/Pagination"
import ListControls, { type FilterGroup } from "@/components/shared/lists/ListControls"
import { countedOptions, monthOptions, sortItems, useListQuery, withRenamedValues, yearOptions } from "@/components/shared/lists/useListQuery"

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

const LIST_ID = "blog-post-list"

const ARCHIVE_PATH = "/blog/archive"

export default function BlogPage({
  posts,
  view = "main",
  archiveCount,
}: {
  posts: BlogCard[]
  view?: "main" | "archive"
  archiveCount: number
}) {
  const isArchive = view === "archive"
  const urlQuery = useListQuery("newest")
  const [perPage, setPerPage] = usePageSize("blog", LIST_PAGE_SIZES)

  const renamedTo = RENAMED_POST_TYPES.get(urlQuery.get("type"))
  const { update } = urlQuery
  useEffect(() => {
    if (renamedTo) update({ type: renamedTo }, { replace: true, keepPage: true })
  }, [renamedTo, update])
  const query = withRenamedValues(urlQuery, "type", RENAMED_POST_TYPES)
  const activeType = (query.get("type") || "all") as PostType | "all"
  const activeTags = query.getAll("tag")
  const activeYear = query.get("year")
  const activeMonth = query.get("month")
  const q = query.search.toLowerCase().trim()

  const time = (p: BlogCard) => new Date(p.date).getTime()
  const matches = posts
    .filter((p) => activeType === "all" || p.type === activeType)
    .filter((p) => !activeYear || String(new Date(p.date).getFullYear()) === activeYear)
    .filter((p) => !activeMonth || String(new Date(p.date).getMonth() + 1) === activeMonth)
    .filter((p) => activeTags.length === 0 || activeTags.every((t) => p.tags.includes(t)))
    .filter((p) => !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)))
  const filtered =
    q && !query.get("sort")
      ? [...matches].sort((a, b) => relevanceScore(b.title, b.description, q) - relevanceScore(a.title, a.description, q) || time(b) - time(a))
      : sortItems(matches, query.sort, time, (p) => p.title)

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const page = Math.min(query.page, totalPages)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  const typesPresent = new Set(posts.map((p) => p.type))
  const groups: FilterGroup[] = [
    {
      key: "type",
      label: "Type",
      kind: "single",
      options: POST_TYPES.filter((t) => t.value !== "all" && typesPresent.has(t.value)).map((t) => ({ value: t.value, label: t.label })),
    },
    { key: "tag", label: "Tags", kind: "multi", options: countedOptions(posts.flatMap((p) => p.tags)) },
    { key: "year", label: "Year", kind: "single", options: yearOptions(posts.map((p) => new Date(p.date).getFullYear())) },
    { key: "month", label: "Month", kind: "single", options: monthOptions(posts.map((p) => new Date(p.date).getMonth())) },
  ]

  return (
    <div className="container max-w-4xl py-24 space-y-12">
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-4xl font-bold tracking-tight">{isArchive ? "Archive" : "Writing"}</h1>
          <a
            href="/blog/feed.xml"
            title="RSS feed"
            aria-label="Blog RSS feed"
            className="inline-flex items-center gap-1.5 text-base font-medium text-primary hover:text-primary/70 transition-colors shrink-0"
          >
            <Rss className="h-5 w-5 shrink-0" />
            Feed
          </a>
        </div>
        {isArchive ? (
          <>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Older posts I have moved off the main list. Each one is still at its own address.
            </p>
            <Link
              href="/blog"
              className="body-link inline-flex min-h-11 items-center gap-1.5 text-base font-medium"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
              Back to current writing
            </Link>
          </>
        ) : (
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Engineering and tech write-ups, project breakdowns, explainers and journal entries.
            Everything I build, learn and think about.
          </p>
        )}
      </section>

      <ListControls
        query={query}
        groups={groups}
        searchLabel={isArchive ? "Search archived posts" : "Search posts"}
        searchPlaceholder={isArchive ? "Search archived posts…" : "Search posts…"}
        resultCount={filtered.length}
        itemLabel={{ one: "post", many: "posts" }}
        panelExtra={archiveCount > 0 && (
          <Link href={isArchive ? "/blog" : ARCHIVE_PATH} className="inline-flex min-h-11 items-center gap-1.5 text-sm body-link">
            <Archive className="h-4 w-4 shrink-0" aria-hidden="true" />
            {isArchive ? "Back to current writing" : `Archive (${archiveCount} older ${archiveCount === 1 ? "post" : "posts"})`}
          </Link>
        )}
      />

      {filtered.length > 0 ? (
        <div id={LIST_ID} className="space-y-6 scroll-mt-24">
          {paginated.map((post) => {
            return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block rounded-lg border transition-all overflow-hidden border-border/60 bg-muted/40 hover:bg-muted/60 hover:border-primary/40"
            >
              <div className="space-y-3 px-6 py-5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={postTypeLabelClass(post.type)}>
                  {POST_TYPES.find((t) => t.value === post.type)?.label ?? post.type}
                </span>
              </div>

              <div className="space-y-1">
                <h2 className="text-lg font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {post.description}
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  {formatDate(post.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  {post.readingTime} min read
                </span>
              </div>

              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              )}
              </div>
            </Link>
            )
          })}

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
            itemLabel="posts"
            label="Blog post pages"
            className="pt-4"
          />
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border/60 p-12 text-center space-y-2">
          <p className="text-sm font-medium">No posts match these filters.</p>
          <p className="text-xs text-muted-foreground">Try another type or tag. Clearing the search also helps.</p>
        </div>
      )}

      {!isArchive && archiveCount > 0 && (
        <p className="text-base text-muted-foreground">
          Older posts are in the{" "}
          <Link
            href={ARCHIVE_PATH}
            className="body-link inline-flex min-h-11 items-center"
          >
            archive
          </Link>
          .
        </p>
      )}

    </div>
  )
}

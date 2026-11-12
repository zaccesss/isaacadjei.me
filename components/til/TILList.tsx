"use client"

import { useMemo } from "react"
import Link from "@/components/shared/IntentLink"
import { computeReadingTime } from "@/lib/utils"
import type { TILEntry } from "@/data/til"
import { relevanceScore } from "@/lib/content/search"
import { Pagination, usePageSize, LIST_PAGE_SIZES } from "@/components/shared/lists/Pagination"
import ListControls, { type FilterGroup } from "@/components/shared/lists/ListControls"
import { countedOptions, monthOptions, sortItems, useListQuery, yearOptions } from "@/components/shared/lists/useListQuery"
import Tag, { tilCategoryLabelClass } from "@/components/shared/lists/Tag"
import { ukShortDate } from "@/lib/time/short-date"
import { stripLinks } from "@/lib/content/markdown-links"

function tilReadingTime(entry: TILEntry): number {
  const blocks: { type: string; text?: string; code?: string }[] = [
    { type: "p", text: entry.body },
    ...(entry.detail ?? []).map((b) => ({
      type: b.type,
      text: "text" in b ? (b as { text: string }).text : undefined,
      code: "code" in b ? (b as { code: string }).code : undefined,
    })),
  ]
  return computeReadingTime(blocks)
}

const LIST_ID = "til-entry-list"

export const CATEGORY_STYLES: Record<string, string> = {
  "C":                          "bg-[#00599C]/10 text-[#00599C] dark:text-[#60a5fa]",
  "Embedded":                   "bg-[#16a34a]/10 text-[#16a34a] dark:text-[#4ade80]",
  "Git":                        "bg-[#F05032]/10 text-[#F05032] dark:text-[#fb923c]",
  "CSS":                        "bg-[#1572B6]/10 text-[#1572B6] dark:text-[#38bdf8]",
  "Next.js":                    "bg-gray-900/10 text-gray-800 dark:text-gray-200",
  "TypeScript":                 "bg-[#3178C6]/10 text-[#3178C6] dark:text-[#93c5fd]",
  "Algorithms & Data Structures": "bg-violet-600/10 text-violet-600 dark:text-violet-400",
  "Security":                   "bg-red-600/10 text-red-600 dark:text-red-400",
  "Hardware":                   "bg-amber-600/10 text-amber-600 dark:text-amber-400",
  "Electronics":                "bg-cyan-700/10 text-cyan-700 dark:text-cyan-300",
  "AI/ML":                      "bg-purple-600/10 text-purple-600 dark:text-purple-400",
  "Python":                     "bg-[#f59e0b]/10 text-[#f59e0b] dark:text-[#fcd34d]",
  "Linux":                      "bg-yellow-400/10 text-[#b45309] dark:text-[#fde68a]",
  "Architecture":               "bg-orange-600/10 text-orange-600 dark:text-orange-400",
  "Database":                   "bg-emerald-600/10 text-emerald-600 dark:text-emerald-400",
  "Web":                        "bg-sky-600/10 text-sky-600 dark:text-sky-400",
  "Music":                      "bg-pink-600/10 text-pink-600 dark:text-pink-400",
  "Fitness":                    "bg-teal-600/10 text-teal-600 dark:text-teal-400",
  "Cooking":                    "bg-rose-600/10 text-rose-600 dark:text-rose-400",
  "Faith":                      "bg-yellow-600/10 text-yellow-600 dark:text-yellow-400",
  "Life":                       "bg-indigo-600/10 text-indigo-600 dark:text-indigo-400",
  "OOP":                        "bg-cyan-600/10 text-cyan-600 dark:text-cyan-400",
}

const formatDate = ukShortDate

interface Props {
  entries: TILEntry[]
}

function countMatches(text: string, q: string): number {
  if (!q) return 0
  let count = 0
  let pos = 0
  const lower = text.toLowerCase()
  while ((pos = lower.indexOf(q, pos)) !== -1) { count++; pos++ }
  return count
}

function highlight(text: string, q: string): React.ReactNode {
  if (!q) return text
  const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"))
  return parts.map((part, i) =>
    part.toLowerCase() === q.toLowerCase()
      ? <mark key={i} className="bg-primary/20 text-foreground rounded-[2px] px-px">{part}</mark>
      : part
  )
}

export default function TILList({ entries }: Props) {
  const query = useListQuery("newest")
  const [perPage, setPerPage] = usePageSize("til", LIST_PAGE_SIZES)
  const search = query.search
  const category = query.get("category") || "all"
  const tags = query.getAll("tag")
  const year = query.get("year")
  const month = query.get("month")
  const sortParam = query.get("sort")

  const categories = useMemo(() => {
    const seen = new Set<string>()
    entries.forEach(e => seen.add(e.category))
    return Array.from(seen).sort()
  }, [entries])

  const filtered = (() => {
    const q = search.toLowerCase().trim()
    const matches = entries.filter(e => {
      if (category !== "all" && e.category !== category) return false
      if (tags.length > 0 && !tags.every(t => (e.tags ?? []).includes(t))) return false
      if (year && String(new Date(e.date).getFullYear()) !== year) return false
      if (month && String(new Date(e.date).getMonth() + 1) !== month) return false
      if (q) {
        const plain = stripLinks(e.body)
        return e.title.toLowerCase().includes(q) || plain.toLowerCase().includes(q) || (e.tags ?? []).some(t => t.toLowerCase().includes(q))
      }
      return true
    })
    if (q && !sortParam) {
      return matches.slice().sort(
        (a, b) => relevanceScore(b.title, stripLinks(b.body), q) - relevanceScore(a.title, stripLinks(a.body), q)
      )
    }
    return sortItems(matches, query.sort, e => new Date(e.date).getTime(), e => e.title)
  })()

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const page = Math.min(query.page, totalPages)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  const groups: FilterGroup[] = [
    { key: "category", label: "Category", kind: "single", options: categories.map(c => ({ value: c, label: c })) },
    { key: "tag", label: "Tags", kind: "multi", options: countedOptions(entries.flatMap(e => e.tags ?? [])) },
    { key: "year", label: "Year", kind: "single", options: yearOptions(entries.map(e => new Date(e.date).getFullYear())) },
    { key: "month", label: "Month", kind: "single", options: monthOptions(entries.map(e => new Date(e.date).getMonth())) },
  ]

  return (
    <div className="space-y-8">
      <ListControls
        query={query}
        groups={groups}
        searchLabel="Search entries"
        searchPlaceholder="Search entries…"
        resultCount={filtered.length}
        itemLabel={{ one: "entry", many: "entries" }}
      />

      <div id={LIST_ID} className="space-y-4 scroll-mt-24">
        {paginated.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">No entries match.</p>
        ) : (
          paginated.map(entry => {
            const q = search.toLowerCase().trim()
            const plainBody = stripLinks(entry.body)
            return (
              <Link
                key={entry.id}
                href={`/til/${entry.id}`}
                className="group block space-y-2 rounded-lg border border-border/60 bg-muted/20 px-6 py-5 transition-all hover:border-primary/40 hover:bg-muted/30"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={tilCategoryLabelClass(entry.category)}>{entry.category}</span>
                  <time dateTime={entry.date} className="text-xs text-muted-foreground font-mono">
                    {formatDate(entry.date)}
                  </time>
                  <span className="text-xs text-muted-foreground font-mono">{tilReadingTime(entry)} min read</span>
                </div>

                <h2 className="text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                  {highlight(entry.title, q)}
                </h2>

                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {highlight(plainBody, q)}
                </p>

                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    {entry.tags.map(tag => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                )}
              </Link>
            )
          })
        )}
      </div>

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
        itemLabel="entries"
        label="TIL entry pages"
        className="pt-2"
      />
    </div>
  )
}

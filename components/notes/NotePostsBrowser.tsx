"use client"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Tag from "@/components/shared/Tag"
import { relevanceScore } from "@/lib/search"
import { Pagination, usePageSize } from "@/components/shared/Pagination"
import ListControls, { type FilterGroup } from "@/components/shared/ListControls"
import { countedOptions, monthOptions, sortItems, useListQuery, yearOptions } from "@/components/shared/useListQuery"

export interface NotePostCard {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
}

const PAGE_SIZES = [10, 20, 50]
const LIST_ID = "note-post-list"

function formatNoteDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
}

const yearOf = (date: string) => Number(date.slice(0, 4))
const monthOf = (date: string) => Number(date.slice(5, 7)) - 1

export default function NotePostsBrowser({ notes }: { notes: NotePostCard[] }) {
  const query = useListQuery("newest")
  const [perPage, setPerPage] = usePageSize("notes", PAGE_SIZES)

  const tags = query.getAll("tag")
  const year = query.get("year")
  const month = query.get("month")
  const q = query.search.toLowerCase().trim()

  const matches = notes
    .filter((n) => tags.length === 0 || tags.every((t) => n.tags.includes(t)))
    .filter((n) => !year || String(yearOf(n.date)) === year)
    .filter((n) => !month || String(monthOf(n.date) + 1) === month)
    .filter((n) => !q || n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q) || n.tags.some((t) => t.toLowerCase().includes(q)))
  const filtered =
    q && !query.get("sort")
      ? [...matches].sort((a, b) => relevanceScore(b.title, b.description, q) - relevanceScore(a.title, a.description, q))
      : sortItems(matches, query.sort, (n) => Date.parse(n.date), (n) => n.title)

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const page = Math.min(query.page, totalPages)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  const groups: FilterGroup[] = [
    { key: "tag", label: "Tags", kind: "multi", options: countedOptions(notes.flatMap((n) => n.tags)) },
    { key: "year", label: "Year", kind: "single", options: yearOptions(notes.map((n) => yearOf(n.date))) },
    { key: "month", label: "Month", kind: "single", options: monthOptions(notes.map((n) => monthOf(n.date))) },
  ]

  return (
    <div className="space-y-6">
      <ListControls
        query={query}
        groups={groups}
        searchLabel="Search notes"
        searchPlaceholder="Search notes…"
        resultCount={filtered.length}
        itemLabel={{ one: "note", many: "notes" }}
      />

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">No notes match these filters.</p>
      ) : (
        <ul id={LIST_ID} className="space-y-4 scroll-mt-24">
          {paginated.map((note) => (
            <li key={note.slug}>
              <Link
                href={`/notes/${note.slug}`}
                className="group block rounded-lg border border-border/60 bg-muted/20 px-6 py-5 hover:border-primary/40 hover:bg-muted/30 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <time dateTime={note.date} className="block text-xs text-muted-foreground font-mono">
                      {formatNoteDate(note.date)}
                    </time>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">{note.title}</h3>
                    <p className="text-sm text-muted-foreground">{note.description}</p>
                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {note.tags.map((t) => <Tag key={t}>{t}</Tag>)}
                      </div>
                    )}
                  </div>
                  <ArrowRight
                    className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

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
        itemLabel="notes"
        label="Note pages"
      />
    </div>
  )
}

"use client"
import { usePageSize, GRID_PAGE_SIZES } from "@/components/shared/Pagination"
import type { FilterGroup } from "@/components/shared/ListControls"
import { countedOptions, monthOptions, sortItems, useListQuery, yearOptions } from "@/components/shared/useListQuery"
import { MONTH_NUMBER, isMonthAvailable, type Month } from "@/data/consumed/types"

type Dated = { title: string; month: Month; year: number; day?: number }

export const CONSUMED_PAGE_SIZES = GRID_PAGE_SIZES

interface Options<T> {
  storageKey: string
  preview: boolean
  text: (item: T) => string[]
  facet?: { key: string; label: string; kind: "single" | "multi"; values: (item: T) => string[] }
}

export function useConsumedList<T extends Dated>(items: T[], { storageKey, preview, text, facet }: Options<T>) {
  const query = useListQuery("newest")
  const [perPage, setPerPage] = usePageSize(`consumed-${storageKey}`, CONSUMED_PAGE_SIZES)

  const year = query.get("year")
  const month = query.get("month")
  const facetValues = facet ? query.getAll(facet.key) : []
  const q = query.search.toLowerCase().trim()

  const time = (i: T) => Date.UTC(i.year, MONTH_NUMBER[i.month], i.day ?? 1)
  const live = items.filter((i) => isMonthAvailable(i.month, i.year, preview, i.day))
  const filtered = sortItems(
    live
      .filter((i) => !year || String(i.year) === year)
      .filter((i) => !month || String(MONTH_NUMBER[i.month] + 1) === month)
      .filter((i) => !facet || facetValues.length === 0 || (facet.kind === "multi"
        ? facetValues.every((v) => facet.values(i).includes(v))
        : facetValues.some((v) => facet.values(i).includes(v))))
      .filter((i) => !q || text(i).some((t) => t.toLowerCase().includes(q))),
    query.sort,
    time,
    (i) => i.title,
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const page = Math.min(query.page, totalPages)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  const groups: FilterGroup[] = [
    ...(facet ? [{ key: facet.key, label: facet.label, kind: facet.kind, options: countedOptions(live.flatMap(facet.values)) }] : []),
    { key: "year", label: "Year", kind: "single", options: yearOptions(live.map((i) => i.year)) },
    { key: "month", label: "Month", kind: "single", options: monthOptions(live.map((i) => MONTH_NUMBER[i.month])) },
  ]

  return { query, groups, filtered, paginated, page, totalPages, perPage, setPerPage }
}

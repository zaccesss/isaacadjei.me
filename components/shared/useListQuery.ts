"use client"
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react"

export type SortKey = "newest" | "oldest" | "az" | "za" | "default"

export const SORT_LABELS: Record<SortKey, string> = {
  default: "Featured first",
  newest: "Newest first",
  oldest: "Oldest first",
  az: "A to Z",
  za: "Z to A",
}

const CHANGE_EVENT = "listquerychange"

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange)
  window.addEventListener(CHANGE_EVENT, onChange)
  return () => {
    window.removeEventListener("popstate", onChange)
    window.removeEventListener(CHANGE_EVENT, onChange)
  }
}

const readSearch = () => window.location.search
const serverSearch = () => ""

export type QueryChanges = Record<string, string | string[] | null | undefined>

function writeUrl(changes: QueryChanges, { replace = false, keepPage = false } = {}) {
  const params = new URLSearchParams(window.location.search)
  for (const [key, value] of Object.entries(changes)) {
    params.delete(key)
    if (Array.isArray(value)) value.filter(Boolean).forEach((v) => params.append(key, v))
    else if (value) params.set(key, value)
  }
  if (!keepPage && !("page" in changes)) params.delete("page")
  const qs = params.toString()
  const url = `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`
  try {
    if (replace) window.history.replaceState(window.history.state, "", url)
    else window.history.pushState(window.history.state, "", url)
  } catch {
    // Safari throws once a page makes too many history calls in a short window; the view still updates below
  }
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

export interface ListQuery {
  search: string
  setSearch: (value: string) => void
  get: (key: string) => string
  getAll: (key: string) => string[]
  sort: SortKey
  page: number
  update: (changes: QueryChanges, opts?: { replace?: boolean; keepPage?: boolean }) => void
  setPage: (page: number) => void
  clearAll: (keys: string[]) => void
}

export function useListQuery(defaultSort: SortKey = "newest"): ListQuery {
  const raw = useSyncExternalStore(subscribe, readSearch, serverSearch)
  const params = useMemo(() => new URLSearchParams(raw), [raw])
  const [draft, setDraft] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  const setSearch = useCallback((value: string) => {
    setDraft(value)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      writeUrl({ q: value.trim() ? value : null }, { replace: true })
      setDraft(null)
    }, 300)
  }, [])

  const update = useCallback((changes: QueryChanges, opts?: { replace?: boolean; keepPage?: boolean }) => {
    writeUrl(changes, opts)
  }, [])

  const setPage = useCallback((page: number) => {
    writeUrl({ page: page > 1 ? String(page) : null })
  }, [])

  const clearAll = useCallback((keys: string[]) => {
    if (timer.current) clearTimeout(timer.current)
    setDraft(null)
    writeUrl(Object.fromEntries([...keys, "q", "sort"].map((k) => [k, null])))
  }, [])

  const sortParam = params.get("sort") as SortKey | null
  const sort: SortKey = sortParam && sortParam in SORT_LABELS ? sortParam : defaultSort
  const pageParam = parseInt(params.get("page") ?? "1", 10)
  const page = draft !== null ? 1 : Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1

  return {
    search: draft ?? params.get("q") ?? "",
    setSearch,
    get: (key) => params.get(key) ?? "",
    getAll: (key) => params.getAll(key),
    sort,
    page,
    update,
    setPage,
    clearAll,
  }
}

export function sortItems<T>(items: T[], sort: SortKey, time: (item: T) => number, title: (item: T) => string): T[] {
  if (sort === "default") return items
  const copy = [...items]
  if (sort === "newest") return copy.sort((a, b) => time(b) - time(a))
  if (sort === "oldest") return copy.sort((a, b) => time(a) - time(b))
  const dir = sort === "az" ? 1 : -1
  return copy.sort((a, b) => dir * title(a).localeCompare(title(b), "en-GB", { sensitivity: "base" }))
}

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

export function yearOptions(years: number[]) {
  return [...new Set(years)].filter(Number.isFinite).sort((a, b) => b - a).map((y) => ({ value: String(y), label: String(y) }))
}

export function monthOptions(months: number[]) {
  return [...new Set(months)].filter((m) => m >= 0 && m < 12).sort((a, b) => a - b).map((m) => ({ value: String(m + 1), label: MONTH_NAMES[m] }))
}

export function countedOptions(values: string[]) {
  const counts = new Map<string, number>()
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1)
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([value, count]) => ({ value, label: value, count }))
}

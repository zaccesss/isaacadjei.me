import { isLive } from "@/lib/schedule"

export type Month =
  | "January" | "February" | "March" | "April" | "May" | "June"
  | "July" | "August" | "September" | "October" | "November" | "December"

export const MONTH_NUMBER: Record<Month, number> = {
  January: 0, February: 1, March: 2,    April: 3,
  May: 4,     June: 5,     July: 6,     August: 7,
  September: 8, October: 9, November: 10, December: 11,
}

export function isMonthAvailable(month: Month, year: number, preview: boolean, day?: number): boolean {
  if (preview || process.env.NODE_ENV === "development") return true
  const mm = String(MONTH_NUMBER[month] + 1).padStart(2, "0")
  const dd = String(day ?? 1).padStart(2, "0")
  return isLive(`${year}-${mm}-${dd}`)
}

export function isConsumedAvailable(item: { month: Month; year: number; day?: number }): boolean {
  return isMonthAvailable(item.month, item.year, false, item.day)
}

export function liveConsumed<T extends { month: Month; year: number; day?: number }>(items: T[]): T[] {
  return items.filter(isConsumedAvailable)
}

export type ConsumedTotals = Record<"videos" | "audio" | "books" | "articles" | "resources" | "others", number>

export function sortByRecency<T extends { year: number; month: Month; day?: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.year - a.year || MONTH_NUMBER[b.month] - MONTH_NUMBER[a.month] || (b.day ?? 0) - (a.day ?? 0))
}

export function yearsFrom(...lists: { year: number }[][]): number[] {
  const years = new Set<number>()
  for (const list of lists) for (const item of list) years.add(item.year)
  if (years.size === 0) years.add(new Date().getFullYear())
  return [...years].sort((a, b) => b - a)
}

export const MONTH_CHIP: Record<Month, string> = {
  January:   "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  February:  "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  March:     "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  April:     "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  May:       "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  June:      "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
  July:      "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  August:    "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
  September: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  October:   "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  November:  "bg-lime-500/10 text-lime-600 dark:text-lime-400 border-lime-500/20",
  December:  "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
}

export const MONTHS: Month[] = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

export type LedToLink = { label: string; href: string; date?: string }

export type ConsumedExtras = {
  pick?: true
  ledTo?: LedToLink[]
}

export function liveLedTo(links: LedToLink[] | undefined): LedToLink[] {
  return (links ?? []).filter((l) => isLive(l.date))
}

export function bookCoverUrl(isbn: string | undefined): string | undefined {
  return isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg?default=false` : undefined
}

export function siteIconUrl(url: string): string {
  return `https://www.google.com/s2/favicons?domain=${siteHost(url)}&sz=64`
}

export function siteHost(url: string): string {
  return url.replace(/^https?:\/\//, "").split("/")[0].replace(/^www\./, "")
}

export function youtubeThumbUrl(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
}

export type VideoEntry = ConsumedExtras & {
  id: string
  title: string
  channel: string
  month: Month
  day?: number
  year: number
  uploaded: string
  tags: string[]
  description?: string
  isPlaylist?: true
}

export type PodcastEntry = ConsumedExtras & {
  spotifyId: string
  embedType: "episode" | "show"
  title: string
  show: string
  month: Month
  day?: number
  year: number
  description?: string
}

export type BookEntry = ConsumedExtras & {
  title: string
  author: string
  genre: string
  genreColor: string
  month: Month
  day?: number
  year: number
  note: string
  link?: string
  isbn?: string
  takeaway?: string
}

export type ResourceEntry = ConsumedExtras & {
  title: string
  description: string
  url: string
  image?: string
  category: "Docs" | "Course" | "Tool" | "Blog" | "Reference"
  categoryColor: string
  month: Month
  day?: number
  year: number
}

export type LinkEntry = ConsumedExtras & {
  title: string
  source: string
  url: string
  image?: string
  description: string
  month: Month
  day?: number
  year: number
  tags: string[]
}

export const RESOURCE_CHIP: Record<ResourceEntry["category"], string> = {
  Docs:      "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  Course:    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  Tool:      "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  Blog:      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Reference: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
}

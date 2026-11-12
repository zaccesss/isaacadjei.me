import { books } from "./books"
import { videos } from "./videos"
import { podcasts } from "./podcasts"
import { articles } from "./articles"
import { resources } from "./resources"
import { others } from "./others"
import { consumedForPage } from "./index"
import {
  liveLedTo, bookCoverUrl, youtubeThumbUrl, siteHost, sortByRecency, MONTH_NUMBER,
  type LedToLink, type Month, type BookEntry, type VideoEntry, type PodcastEntry, type LinkEntry, type ResourceEntry,
} from "./types"
import { CONSUMED_COLLECTIONS, type ConsumedCollection } from "./collections"
import { consumedSlug } from "@/lib/content/tags"
import { londonToday } from "@/lib/time/schedule"

export type ConsumedCategory = "books" | "videos" | "podcasts" | "articles" | "resources" | "others"

export type ConsumedLog = {
  books: BookEntry[]
  videos: VideoEntry[]
  podcasts: PodcastEntry[]
  articles: LinkEntry[]
  resources: ResourceEntry[]
  others: LinkEntry[]
}

const LOG: ConsumedLog = { books, videos, podcasts, articles, resources, others }

export type ConsumedSummary = {
  key: string
  category: ConsumedCategory
  title: string
  href: string
  byline: string
  description: string
  image?: string
  imageKind?: "cover" | "thumb" | "preview"
  sourceUrl?: string
  tags: string[]
  ledTo: LedToLink[]
  pick: boolean
  month: Month
  year: number
  day?: number
}

function linksFor(links: LedToLink[] | undefined): LedToLink[] {
  return process.env.NODE_ENV === "development" ? links ?? [] : liveLedTo(links)
}

export function consumedItemsForPage<T extends { month: Month; year: number; day?: number; ledTo?: LedToLink[] }>(items: T[]): T[] {
  return consumedForPage(items).map((item) => (item.ledTo ? { ...item, ledTo: linksFor(item.ledTo) } : item))
}

type Base = { title: string; month: Month; year: number; day?: number; pick?: true; ledTo?: LedToLink[] }

function base(category: ConsumedCategory, item: Base) {
  return {
    key: `${category}:${item.title}`,
    category,
    title: item.title,
    href: `/consumed/${category}/${consumedSlug(item.title)}`,
    ledTo: linksFor(item.ledTo),
    pick: item.pick === true,
    month: item.month,
    year: item.year,
    day: item.day,
  }
}

function summaries(log: ConsumedLog = LOG): ConsumedSummary[] {
  return [
    ...consumedForPage(log.books).map((b): ConsumedSummary => ({
      ...base("books", b), byline: b.author, description: b.note, tags: [b.genre],
      image: bookCoverUrl(b.isbn), imageKind: b.isbn ? "cover" : undefined,
    })),
    ...consumedForPage(log.videos).map((v): ConsumedSummary => ({
      ...base("videos", v), byline: v.channel, description: v.description ?? "", tags: v.tags,
      image: v.isPlaylist ? undefined : youtubeThumbUrl(v.id), imageKind: v.isPlaylist ? undefined : "thumb",
    })),
    ...consumedForPage(log.podcasts).map((p): ConsumedSummary => ({
      ...base("podcasts", p), byline: p.show, description: p.description ?? "", tags: [],
    })),
    ...consumedForPage(log.articles).map((a): ConsumedSummary => ({
      ...base("articles", a), byline: a.source, description: a.description, tags: a.tags,
      image: a.image, imageKind: "preview", sourceUrl: a.url,
    })),
    ...consumedForPage(log.resources).map((r): ConsumedSummary => ({
      ...base("resources", r), byline: siteHost(r.url), description: r.description, tags: [r.category],
      image: r.image, imageKind: "preview", sourceUrl: r.url,
    })),
    ...consumedForPage(log.others).map((o): ConsumedSummary => ({
      ...base("others", o), byline: o.source, description: o.description, tags: o.tags,
      image: o.image, imageKind: "preview", sourceUrl: o.url,
    })),
  ]
}

const newestFirst = (a: ConsumedSummary, b: ConsumedSummary) =>
  b.year - a.year || MONTH_NUMBER[b.month] - MONTH_NUMBER[a.month] || (b.day ?? 0) - (a.day ?? 0)

const CATEGORY_ORDER: ConsumedCategory[] = ["books", "videos", "articles", "resources", "podcasts", "others"]

export function consumedPicks(log: ConsumedLog = LOG): ConsumedSummary[] {
  return summaries(log)
    .filter((s) => s.pick)
    .sort((a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category) || newestFirst(a, b))
}

function inCollection(c: ConsumedCollection, s: ConsumedSummary): boolean {
  const tags = new Set(c.tags.map((t) => t.toLowerCase()))
  const topical = s.category === "resources" ? [] : s.tags
  return topical.some((t) => tags.has(t.toLowerCase())) || (c.titles ?? []).includes(s.title)
}

export function consumedCollectionItems(c: ConsumedCollection, log: ConsumedLog = LOG): ConsumedSummary[] {
  return summaries(log).filter((s) => inCollection(c, s)).sort(newestFirst)
}

export type ConsumedCollectionCard = { slug: string; title: string; description: string; count: number }

export function consumedCollectionCounts(log: ConsumedLog = LOG, collections: ConsumedCollection[] = CONSUMED_COLLECTIONS): ConsumedCollectionCard[] {
  const all = summaries(log)
  return collections.map((c) => ({
    slug: c.slug,
    title: c.title,
    description: c.description,
    count: all.filter((s) => inCollection(c, s)).length,
  }))
}

export type ConsumedYearSummary = {
  year: number
  counts: { category: ConsumedCategory; label: string; count: number }[]
  total: number
  topTags: { tag: string; count: number }[]
}

const PLURAL: Record<ConsumedCategory, string> = {
  books: "Books", videos: "Videos", podcasts: "Podcasts", articles: "Articles", resources: "Resources", others: "Others",
}

export function consumedYearSummary(log: ConsumedLog = LOG): ConsumedYearSummary {
  const year = Number(londonToday().slice(0, 4))
  const items = summaries(log).filter((s) => s.year === year)
  const counts = (Object.keys(PLURAL) as ConsumedCategory[]).map((category) => ({
    category, label: PLURAL[category], count: items.filter((s) => s.category === category).length,
  }))
  const tagCounts = new Map<string, number>()
  for (const s of items) {
    if (s.category === "resources") continue
    for (const t of s.tags) tagCounts.set(t.toLowerCase(), (tagCounts.get(t.toLowerCase()) ?? 0) + 1)
  }
  const topTags = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 5)
    .map(([tag, count]) => ({ tag, count }))
  return { year, counts, total: items.length, topTags }
}

export type ConsumedHubProps = {
  videos: VideoEntry[]
  podcasts: PodcastEntry[]
  books: BookEntry[]
  resources: ResourceEntry[]
  articles: LinkEntry[]
  others: LinkEntry[]
  overview: { year: ConsumedYearSummary; picks: ConsumedSummary[]; collections: ConsumedCollectionCard[] }
}

export function consumedHubProps(log: ConsumedLog = LOG, collections: ConsumedCollection[] = CONSUMED_COLLECTIONS): ConsumedHubProps {
  return {
    videos: consumedItemsForPage(log.videos),
    podcasts: consumedItemsForPage(log.podcasts),
    books: consumedItemsForPage(log.books),
    resources: consumedItemsForPage(log.resources),
    articles: consumedItemsForPage(log.articles),
    others: consumedItemsForPage(log.others),
    overview: { year: consumedYearSummary(log), picks: consumedPicks(log), collections: consumedCollectionCounts(log, collections) },
  }
}

export type ConsumedEntry =
  | { type: "book"; item: BookEntry }
  | { type: "video"; item: VideoEntry }
  | { type: "podcast"; item: PodcastEntry }
  | { type: "link"; item: LinkEntry }
  | { type: "resource"; item: ResourceEntry }

export function isConsumedCategory(category: string): category is ConsumedCategory {
  return Object.hasOwn(PLURAL, category)
}

export function consumedEntryForPage(category: string, slug: string, log: ConsumedLog = LOG): ConsumedEntry | null {
  const find = <T extends { title: string; month: Month; year: number; day?: number; ledTo?: LedToLink[] }>(items: T[]) =>
    consumedItemsForPage(items).find((i) => consumedSlug(i.title) === slug)
  if (category === "books") {
    const item = find(log.books)
    return item ? { type: "book", item } : null
  }
  if (category === "videos") {
    const item = find(log.videos)
    return item ? { type: "video", item } : null
  }
  if (category === "podcasts") {
    const item = find(log.podcasts)
    return item ? { type: "podcast", item } : null
  }
  if (category === "articles") {
    const item = find(log.articles)
    return item ? { type: "link", item } : null
  }
  if (category === "resources") {
    const item = find(log.resources)
    return item ? { type: "resource", item } : null
  }
  if (category === "others") {
    const item = find(log.others)
    return item ? { type: "link", item } : null
  }
  return null
}

export type ConsumedNeighbour = { title: string; href: string }

export function consumedNeighbours(
  category: ConsumedCategory,
  title: string,
  log: ConsumedLog = LOG,
): { prev: ConsumedNeighbour | null; next: ConsumedNeighbour | null } {
  const entries: { title: string; month: Month; year: number; day?: number }[] = log[category]
  const sorted = sortByRecency(consumedForPage(entries))
  const at = sorted.findIndex((i) => i.title === title)
  if (at === -1) return { prev: null, next: null }
  const link = (item: { title: string } | undefined): ConsumedNeighbour | null =>
    item ? { title: item.title, href: `/consumed/${category}/${consumedSlug(item.title)}` } : null
  return { prev: link(sorted[at - 1]), next: link(sorted[at + 1]) }
}

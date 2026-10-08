import { books } from "./books"
import { videos } from "./videos"
import { podcasts } from "./podcasts"
import { articles } from "./articles"
import { resources } from "./resources"
import { others } from "./others"
import { consumedForPage } from "./index"
import { liveLedTo, bookCoverUrl, youtubeThumbUrl, siteHost, MONTH_NUMBER, type LedToLink, type Month } from "./types"
import { CONSUMED_COLLECTIONS, type ConsumedCollection } from "./collections"
import { consumedSlug } from "@/lib/tags"
import { londonToday } from "@/lib/schedule"

export type ConsumedCategory = "books" | "videos" | "podcasts" | "articles" | "resources" | "others"

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

function summaries(): ConsumedSummary[] {
  return [
    ...consumedForPage(books).map((b): ConsumedSummary => ({
      ...base("books", b), byline: b.author, description: b.note, tags: [b.genre],
      image: bookCoverUrl(b.isbn), imageKind: b.isbn ? "cover" : undefined,
    })),
    ...consumedForPage(videos).map((v): ConsumedSummary => ({
      ...base("videos", v), byline: v.channel, description: v.description ?? "", tags: v.tags,
      image: v.isPlaylist ? undefined : youtubeThumbUrl(v.id), imageKind: v.isPlaylist ? undefined : "thumb",
    })),
    ...consumedForPage(podcasts).map((p): ConsumedSummary => ({
      ...base("podcasts", p), byline: p.show, description: p.description ?? "", tags: [],
    })),
    ...consumedForPage(articles).map((a): ConsumedSummary => ({
      ...base("articles", a), byline: a.source, description: a.description, tags: a.tags,
      image: a.image, imageKind: "preview", sourceUrl: a.url,
    })),
    ...consumedForPage(resources).map((r): ConsumedSummary => ({
      ...base("resources", r), byline: siteHost(r.url), description: r.description, tags: [r.category],
      image: r.image, imageKind: "preview", sourceUrl: r.url,
    })),
    ...consumedForPage(others).map((o): ConsumedSummary => ({
      ...base("others", o), byline: o.source, description: o.description, tags: o.tags,
      image: o.image, imageKind: "preview", sourceUrl: o.url,
    })),
  ]
}

const newestFirst = (a: ConsumedSummary, b: ConsumedSummary) =>
  b.year - a.year || MONTH_NUMBER[b.month] - MONTH_NUMBER[a.month] || (b.day ?? 0) - (a.day ?? 0)

const CATEGORY_ORDER: ConsumedCategory[] = ["books", "videos", "articles", "resources", "podcasts", "others"]

export function consumedPicks(): ConsumedSummary[] {
  return summaries()
    .filter((s) => s.pick)
    .sort((a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category) || newestFirst(a, b))
}

function inCollection(c: ConsumedCollection, s: ConsumedSummary): boolean {
  const tags = new Set(c.tags.map((t) => t.toLowerCase()))
  const topical = s.category === "resources" ? [] : s.tags
  return topical.some((t) => tags.has(t.toLowerCase())) || (c.titles ?? []).includes(s.title)
}

export function consumedCollectionItems(c: ConsumedCollection): ConsumedSummary[] {
  return summaries().filter((s) => inCollection(c, s)).sort(newestFirst)
}

export function consumedCollectionCounts(): (ConsumedCollection & { count: number })[] {
  const all = summaries()
  return CONSUMED_COLLECTIONS.map((c) => ({ ...c, count: all.filter((s) => inCollection(c, s)).length }))
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

export function consumedYearSummary(): ConsumedYearSummary {
  const year = Number(londonToday().slice(0, 4))
  const items = summaries().filter((s) => s.year === year)
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

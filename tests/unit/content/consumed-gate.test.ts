import { afterEach, describe, expect, it, vi } from "vitest"
import sitemap from "@/app/sitemap"
import { getPostBySlug, posts } from "@/data/blog"
import { articles } from "@/data/consumed/articles"
import { books } from "@/data/consumed/books"
import { CONSUMED_COLLECTIONS, type ConsumedCollection } from "@/data/consumed/collections"
import { others } from "@/data/consumed/others"
import { podcasts } from "@/data/consumed/podcasts"
import { resources } from "@/data/consumed/resources"
import {
  consumedCollectionCounts, consumedCollectionItems, consumedEntryForPage, consumedHubProps, consumedItemsForPage,
  consumedNeighbours, consumedPicks, consumedYearSummary, type ConsumedCategory, type ConsumedLog,
} from "@/data/consumed/summary"
import { MONTH_NUMBER, type LedToLink, type Month } from "@/data/consumed/types"
import { videos } from "@/data/consumed/videos"
import { getPublishedIssues } from "@/data/newsletter"
import { consumedSlug } from "@/lib/content/tags"
import { londonToday } from "@/lib/time/schedule"

type Dated = { title: string; month: Month; year: number; day?: number; ledTo?: LedToLink[] }

const CATEGORIES: ConsumedCategory[] = ["books", "videos", "podcasts", "articles", "resources", "others"]

function listedOn(entry: { month: Month; year: number; day?: number }): string {
  const mm = String(MONTH_NUMBER[entry.month] + 1).padStart(2, "0")
  const dd = String(entry.day ?? 1).padStart(2, "0")
  return `${entry.year}-${mm}-${dd}`
}

function setDay(day: string) {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(`${day}T12:00:00Z`))
}

function dayBefore(day: string): string {
  return new Date(Date.parse(`${day}T12:00:00Z`) - 86_400_000).toISOString().slice(0, 10)
}

function strings(value: unknown, path = ""): { path: string; text: string }[] {
  if (typeof value === "string") return [{ path, text: value }]
  if (Array.isArray(value)) return value.flatMap((v, i) => strings(v, `${path}[${i}]`))
  if (value && typeof value === "object") return Object.entries(value).flatMap(([k, v]) => strings(v, path ? `${path}.${k}` : k))
  return []
}

afterEach(() => {
  vi.useRealTimers()
})

const TODAY = "2026-11-12"

const video = (title: string, month: Month, year: number, day?: number, tags = ["example"]) =>
  ({ id: consumedSlug(title), title, channel: "Example channel", month, day, year, uploaded: "2020-01-01", tags })
const podcast = (title: string, month: Month, year: number, day?: number) =>
  ({ spotifyId: consumedSlug(title), embedType: "episode" as const, title, show: "Example show", month, day, year })
const book = (title: string, month: Month, year: number, day?: number) =>
  ({ title, author: "Example author", genre: "example", genreColor: "", month, day, year, note: `Note on ${title}`, pick: true as const })
const link = (title: string, month: Month, year: number, day?: number, ledTo?: LedToLink[]) =>
  ({ title, source: "Example source", url: `https://example.com/${consumedSlug(title)}`, description: `About ${title}`, month, day, year, tags: ["example"], ledTo })
const resource = (title: string, month: Month, year: number, day?: number) =>
  ({ title, description: `About ${title}`, url: `https://example.com/${consumedSlug(title)}`, category: "Docs" as const, categoryColor: "", month, day, year })

const LOG: ConsumedLog = {
  videos: [
    video("Example video from last month", "October", 2026, 20),
    video("Example video with a month only", "November", 2026),
    video("Example video out today", "November", 2026, 12),
    video("Example video due tomorrow", "November", 2026, 13, ["example", "tomorrow-only"]),
    video("Example video due next month", "December", 2026),
    video("Example video due next year", "January", 2027, 3),
  ],
  podcasts: [
    podcast("Example podcast that is out", "November", 2026, 2),
    podcast("Example podcast due tomorrow", "November", 2026, 13),
  ],
  books: [
    book("Example book that is out", "September", 2026, 5),
    book("Example book due next month", "December", 2026),
  ],
  articles: [
    link("Example article that is out", "November", 2026, 10, [
      { label: "Example post that is out", href: "/blog/example-post-out", date: "2026-11-01" },
      { label: "Example post due tomorrow", href: "/blog/example-post-due", date: "2026-11-13" },
    ]),
    link("Example article due tomorrow", "November", 2026, 13),
  ],
  resources: [
    resource("Example resource that is out", "November", 2026, 12),
    resource("Example resource due tomorrow", "November", 2026, 13),
  ],
  others: [link("Example link due next year", "January", 2027)],
}

const COLLECTIONS: ConsumedCollection[] = [
  {
    slug: "example",
    title: "Example collection",
    description: "A made-up collection",
    tags: ["example"],
    titles: ["Example podcast that is out", "Example podcast due tomorrow", "Example resource that is out", "Example resource due tomorrow"],
  },
]

const everything = (log: ConsumedLog): Dated[] => CATEGORIES.flatMap((c) => log[c] as Dated[])
const OUT = everything(LOG).filter((e) => listedOn(e) <= TODAY).map((e) => e.title)
const DUE = everything(LOG).filter((e) => listedOn(e) > TODAY).map((e) => e.title)

function prepared(log: ConsumedLog, collections: ConsumedCollection[]) {
  return {
    hub: consumedHubProps(log, collections),
    collections: collections.map((c) => consumedCollectionItems(c, log)),
    lists: CATEGORIES.map((c) => consumedItemsForPage(log[c] as Dated[])),
    neighbours: CATEGORIES.flatMap((c) => (log[c] as Dated[]).map((e) => consumedNeighbours(c, e.title, log))),
    entries: CATEGORIES.flatMap((c) => (log[c] as Dated[]).map((e) => consumedEntryForPage(c, consumedSlug(e.title), log))),
  }
}

describe("the Consumed pages on a fixed day, with made-up entries", () => {
  it("keeps the made-up log honest: some entries are out and some are due", () => {
    expect(OUT).toHaveLength(7)
    expect(DUE).toHaveLength(8)
    expect(DUE.every((t) => t.includes("due"))).toBe(true)
    expect(OUT.some((t) => t.includes("due"))).toBe(false)
  })

  it("sends nothing that names an entry or a post dated after today", () => {
    setDay(TODAY)
    const sent = JSON.stringify(prepared(LOG, COLLECTIONS))
    expect(DUE.filter((t) => sent.includes(t))).toEqual([])
    expect(DUE.filter((t) => sent.includes(consumedSlug(t)))).toEqual([])
    expect(sent).not.toContain("due")
    expect(OUT.filter((t) => !sent.includes(t))).toEqual([])
  })

  it("gives the newest live entry no newer neighbour", () => {
    setDay(TODAY)
    expect(consumedNeighbours("videos", "Example video out today", LOG)).toEqual({
      prev: null,
      next: { title: "Example video with a month only", href: "/consumed/videos/example-video-with-a-month-only" },
    })
    expect(consumedNeighbours("videos", "Example video with a month only", LOG)).toEqual({
      prev: { title: "Example video out today", href: "/consumed/videos/example-video-out-today" },
      next: { title: "Example video from last month", href: "/consumed/videos/example-video-from-last-month" },
    })
    expect(consumedNeighbours("podcasts", "Example podcast that is out", LOG)).toEqual({ prev: null, next: null })
  })

  it("gives a scheduled entry no page and no neighbours", () => {
    setDay(TODAY)
    for (const c of CATEGORIES) {
      for (const e of (LOG[c] as Dated[]).filter((x) => listedOn(x) > TODAY)) {
        expect(consumedEntryForPage(c, consumedSlug(e.title), LOG)).toBeNull()
        expect(consumedNeighbours(c, e.title, LOG)).toEqual({ prev: null, next: null })
      }
    }
    expect(consumedEntryForPage("videos", "example-video-out-today", LOG)?.item.title).toBe("Example video out today")
    expect(consumedEntryForPage("nowhere", "example-video-out-today", LOG)).toBeNull()
  })

  it("sends the hub a collection's card fields and a count of live entries, never its list of titles", () => {
    setDay(TODAY)
    const cards = consumedCollectionCounts(LOG, COLLECTIONS)
    expect(cards).toEqual([{ slug: "example", title: "Example collection", description: "A made-up collection", count: 7 }])
    expect(consumedHubProps(LOG, COLLECTIONS).overview.collections).toEqual(cards)
    expect(consumedCollectionItems(COLLECTIONS[0], LOG).map((s) => s.title).sort()).toEqual([...OUT].sort())
  })

  it("counts live entries only in the year strip and Start here", () => {
    setDay(TODAY)
    const year = consumedYearSummary(LOG)
    expect(year.total).toBe(7)
    expect(Object.fromEntries(year.counts.map((c) => [c.category, c.count]))).toEqual({
      books: 1, videos: 3, podcasts: 1, articles: 1, resources: 1, others: 0,
    })
    expect(year.topTags.map((t) => t.tag)).toEqual(["example"])
    expect(consumedPicks(LOG).map((p) => p.title)).toEqual(["Example book that is out"])
  })

  it("drops a Led to link whose post is not live yet", () => {
    setDay(TODAY)
    const [article] = consumedItemsForPage(LOG.articles)
    expect(article.ledTo).toEqual([{ label: "Example post that is out", href: "/blog/example-post-out", date: "2026-11-01" }])
  })

  it("opens the gate the moment an entry's day starts", () => {
    setDay("2026-11-13")
    expect(consumedNeighbours("videos", "Example video out today", LOG).prev).toEqual({
      title: "Example video due tomorrow",
      href: "/consumed/videos/example-video-due-tomorrow",
    })
    expect(consumedEntryForPage("videos", "example-video-due-tomorrow", LOG)).not.toBeNull()
    const sent = JSON.stringify(prepared(LOG, COLLECTIONS))
    expect(sent).toContain("Example podcast due tomorrow")
    expect(sent).toContain("Example post due tomorrow")
    expect(sent).not.toContain("Example video due next month")
    expect(sent).not.toContain("Example link due next year")
    setDay("2026-11-30")
    expect(consumedEntryForPage("books", "example-book-due-next-month", LOG)).toBeNull()
    setDay("2026-12-01")
    expect(consumedEntryForPage("books", "example-book-due-next-month", LOG)).not.toBeNull()
  })
})

const REAL: ConsumedLog = { books, videos, podcasts, articles, resources, others }

type Hidden = { name: string; category: ConsumedCategory; title: string; href: string }

function hiddenOn(day: string): Hidden[] {
  return CATEGORIES.flatMap((category) =>
    (REAL[category] as Dated[]).flatMap((e, i) =>
      listedOn(e) > day ? [{ name: `${category} #${i}`, category, title: e.title, href: `/consumed/${category}/${consumedSlug(e.title)}` }] : [],
    ),
  )
}

const CREDIT = /\.(channel|show|author|source|byline|genre|category)$|\.tags\[\d+\]$/

function leaksOn(day: string): string[] {
  const hidden = hiddenOn(day)
  const liveTitles = new Set(everything(REAL).filter((e) => listedOn(e) <= day).map((e) => e.title))
  const found: string[] = []

  const sent = strings({
    hub: consumedHubProps(),
    collections: CONSUMED_COLLECTIONS.map((c) => consumedCollectionItems(c)),
    picks: consumedPicks(),
    lists: CATEGORIES.map((c) => consumedItemsForPage(REAL[c] as Dated[])),
  })
  for (const h of hidden) {
    const hits = sent.filter((s) =>
      s.text.includes(h.href) ||
      (!liveTitles.has(h.title) && !CREDIT.test(s.path) && (s.text === h.title || s.text.endsWith(`:${h.title}`))))
    for (const hit of hits) found.push(`${h.name} is named at ${hit.path}`)
  }

  for (const h of hidden) {
    if (consumedEntryForPage(h.category, consumedSlug(h.title))) found.push(`${h.name} has a page`)
  }
  for (const category of CATEGORIES) {
    const hiddenTitles = new Set(hidden.filter((h) => h.category === category).map((h) => h.title))
    ;(REAL[category] as Dated[]).forEach((e, i) => {
      if (listedOn(e) > day) return
      const { prev, next } = consumedNeighbours(category, e.title)
      if (prev && hiddenTitles.has(prev.title)) found.push(`${category} #${i} has a Newer link to a hidden entry`)
      if (next && hiddenTitles.has(next.title)) found.push(`${category} #${i} has an Older link to a hidden entry`)
    })
  }
  return found
}

describe("the Consumed pages over the real log", () => {
  it("runs with the gate on, as production does", () => {
    expect(process.env.NODE_ENV).not.toBe("development")
  })

  it("names no entry dated after today in the hub's props, a collection, a list or a previous and next link", () => {
    expect(leaksOn(londonToday())).toEqual([])
  })

  it("names no entry on the eve of the next one to come or of the last", () => {
    const later = [...new Set(everything(REAL).map(listedOn))].filter((d) => d > londonToday()).sort()
    const eves = [...new Set(later.length ? [dayBefore(later[0]), dayBefore(later[later.length - 1])] : [])]
    for (const day of eves) {
      setDay(day)
      expect(leaksOn(day)).toEqual([])
    }
  }, 30_000)

  it("gives the newest live entry of each kind no Newer link and the oldest no Older link", () => {
    const day = londonToday()
    for (const category of CATEGORIES) {
      const live = (REAL[category] as Dated[]).filter((e) => listedOn(e) <= day)
      if (live.length === 0) continue
      const links = live.map((e) => consumedNeighbours(category, e.title))
      expect(links.filter((l) => l.prev === null)).toHaveLength(1)
      expect(links.filter((l) => l.next === null)).toHaveLength(1)
      const newest = live[links.findIndex((l) => l.prev === null)]
      expect(live.every((e) => listedOn(e) <= listedOn(newest))).toBe(true)
    }
  })

  it("counts live entries only on each collection card and sends the card fields alone", () => {
    for (const card of consumedHubProps().overview.collections) {
      expect(Object.keys(card).sort()).toEqual(["count", "description", "slug", "title"])
      const collection = CONSUMED_COLLECTIONS.find((c) => c.slug === card.slug)
      expect(collection).toBeDefined()
      if (collection) expect(card.count).toBe(consumedCollectionItems(collection).length)
    }
  })

  it("shows nothing before the first entry and everything once every date has passed", () => {
    setDay("2000-01-01")
    expect(strings(consumedHubProps().overview.picks)).toEqual([])
    expect(CATEGORIES.map((c) => consumedItemsForPage(REAL[c] as Dated[]).length)).toEqual(CATEGORIES.map(() => 0))
    expect(consumedHubProps().overview.collections.map((c) => c.count)).toEqual(CONSUMED_COLLECTIONS.map(() => 0))
    setDay("2099-01-01")
    expect(CATEGORIES.map((c) => consumedItemsForPage(REAL[c] as Dated[]).length)).toEqual(CATEGORIES.map((c) => REAL[c].length))
    expect(leaksOn("2099-01-01")).toEqual([])
  }, 30_000)

  it("lists no entry dated after today in the sitemap", () => {
    const hidden = new Set(hiddenOn(londonToday()).map((h) => h.href))
    expect(sitemap().filter((entry) => hidden.has(new URL(entry.url).pathname)).length).toBe(0)
  })

  it("gathers nothing dated after today into the worth list of a live letter", () => {
    const today = londonToday()
    const early = getPublishedIssues().flatMap((issue) => issue.worth.filter((w) => w.date > today).map(() => issue.date))
    expect(early).toEqual([])
  })

  it("dates every Led to link to a post no earlier than the post itself", () => {
    const wrong: string[] = []
    for (const category of CATEGORIES) {
      ;(REAL[category] as Dated[]).forEach((e, i) => {
        for (const l of e.ledTo ?? []) {
          const slug = l.href.match(/^\/blog\/([^/?#]+)/)?.[1]
          if (!slug) continue
          const post = posts.find((p) => p.slug === slug)
          if (!post || !post.published || !l.date || l.date < post.date.slice(0, 10)) wrong.push(`${category} #${i}`)
        }
      })
    }
    expect(wrong).toEqual([])
  })

  it("links every Led to post shown today to a post that is live", () => {
    const shown = [...CATEGORIES.flatMap((c) => consumedItemsForPage(REAL[c] as Dated[])), ...consumedPicks()]
    const dead = shown
      .flatMap((e) => e.ledTo ?? [])
      .map((l) => l.href.match(/^\/blog\/([^/?#]+)/)?.[1])
      .filter((slug) => slug && !getPostBySlug(slug))
    expect(dead.length).toBe(0)
  })
})

import { describe, expect, it } from "vitest"
import { videos } from "@/data/consumed/videos"
import { podcasts } from "@/data/consumed/podcasts"
import { books } from "@/data/consumed/books"
import { articles } from "@/data/consumed/articles"
import { resources } from "@/data/consumed/resources"
import { others } from "@/data/consumed/others"
import { MONTH_NUMBER, type Month } from "@/data/consumed/types"

function listedOn(entry: { year: number; month: Month; day?: number }): string {
  const mm = String(MONTH_NUMBER[entry.month] + 1).padStart(2, "0")
  const dd = String(entry.day ?? 1).padStart(2, "0")
  return `${entry.year}-${mm}-${dd}`
}

describe("consumed videos", () => {
  it("gives every video a real upload date", () => {
    const bad = videos.filter((v) => !/^\d{4}-\d{2}-\d{2}$/.test(v.uploaded) || Number.isNaN(Date.parse(v.uploaded)))
    expect(bad.map((v) => v.id)).toEqual([])
  })

  it("never lists a video before the day it was uploaded", () => {
    const early = videos.filter((v) => listedOn(v) < v.uploaded).map((v) => `${v.id} ${listedOn(v)} < ${v.uploaded}`)
    expect(early).toEqual([])
  })

  it("keeps the file in date order so each entry sits under its month heading", () => {
    const dates = videos.map(listedOn)
    expect(dates).toEqual([...dates].sort())
  })
})

const DATES = {
  videos: videos.map(listedOn),
  articles: articles.map(listedOn),
  books: books.map(listedOn),
  podcasts: podcasts.map(listedOn),
  resources: resources.map(listedOn),
  others: others.map(listedOn),
}

function repeats(values: string[]): string[] {
  const seen = new Set<string>()
  const twice = new Set<string>()
  for (const value of values) (seen.has(value) ? twice : seen).add(value)
  return [...twice]
}

function address(url: string): string {
  return url.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "")
}

describe("consumed log", () => {
  it("keeps every file in date order from November 2026", () => {
    const unordered = Object.entries(DATES)
      .filter(([, dates]) => {
        const recent = dates.filter((d) => d >= "2026-11")
        return recent.join() !== [...recent].sort().join()
      })
      .map(([kind]) => kind)
    expect(unordered).toEqual([])
  })

  it("has no repeated id or address in any file", () => {
    expect(repeats(videos.map((v) => v.id))).toEqual([])
    expect(repeats(podcasts.map((p) => p.spotifyId))).toEqual([])
    expect(repeats(articles.map((a) => address(a.url)))).toEqual([])
    expect(repeats(resources.map((r) => address(r.url)))).toEqual([])
    expect(repeats(others.map((o) => address(o.url)))).toEqual([])
    expect(repeats(books.map((b) => `${b.title} | ${b.author}`.toLowerCase()))).toEqual([])
    expect(repeats(books.flatMap((b) => (b.isbn ? [b.isbn] : [])))).toEqual([])
    expect(repeats(books.flatMap((b) => (b.link ? [address(b.link)] : [])))).toEqual([])
  })

  it("has no repeated title within a kind, so every entry page has its own address", () => {
    const lower = (items: { title: string }[]) => items.map((i) => i.title.toLowerCase())
    for (const list of [videos, podcasts, books, articles, resources, others]) expect(repeats(lower(list))).toEqual([])
  })
})

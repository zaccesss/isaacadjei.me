export * from "./types"
export * from "./videos"
export * from "./podcasts"
export * from "./books"
export * from "./music"
export * from "./resources"
export * from "./articles"
export * from "./others"

import { videos } from "./videos"
import { podcasts } from "./podcasts"
import { books } from "./books"
import { resources } from "./resources"
import { articles } from "./articles"
import { others } from "./others"
import { liveConsumed, type ConsumedTotals, type Month } from "./types"

export function consumedForPage<T extends { month: Month; year: number; day?: number }>(items: T[]): T[] {
  return process.env.NODE_ENV === "development" ? items : liveConsumed(items)
}

export function consumedTotals(): ConsumedTotals {
  return {
    videos: consumedForPage(videos).length,
    audio: consumedForPage(podcasts).length,
    books: consumedForPage(books).length,
    articles: consumedForPage(articles).length,
    resources: consumedForPage(resources).length,
    others: consumedForPage(others).length,
  }
}

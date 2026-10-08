import { getPublishedPosts } from "@/data/blog"
import { getPublishedNotes } from "@/data/notes"
import { getPublishedTILEntries } from "@/data/til"
import { allChannel, blogItems, noteItems, tilItems } from "@/lib/feeds"
import { rssResponse } from "@/lib/rss"
import { cacheUntilMidnight } from "@/lib/schedule"

export const dynamic = "force-dynamic"

export function GET(request: Request) {
  const items = [
    ...blogItems(getPublishedPosts()),
    ...tilItems(getPublishedTILEntries()),
    ...noteItems(getPublishedNotes()),
  ]
  return rssResponse(request, allChannel, items, cacheUntilMidnight())
}

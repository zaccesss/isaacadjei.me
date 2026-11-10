import { getPublishedTILEntries } from "@/data/til"
import { tilChannel, tilItems } from "@/lib/content/feeds"
import { rssResponse } from "@/lib/content/rss"
import { cacheUntilMidnight } from "@/lib/time/schedule"

export const dynamic = "force-dynamic"

export function GET(request: Request) {
  return rssResponse(request, tilChannel, tilItems(getPublishedTILEntries(), true), cacheUntilMidnight())
}

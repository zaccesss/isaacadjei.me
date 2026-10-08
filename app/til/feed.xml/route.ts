import { getPublishedTILEntries } from "@/data/til"
import { tilChannel, tilItems } from "@/lib/feeds"
import { rssResponse } from "@/lib/rss"
import { cacheUntilMidnight } from "@/lib/schedule"

export const dynamic = "force-dynamic"

export function GET(request: Request) {
  return rssResponse(request, tilChannel, tilItems(getPublishedTILEntries(), true), cacheUntilMidnight())
}

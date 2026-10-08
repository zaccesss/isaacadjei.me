import { getPublishedPosts } from "@/data/blog"
import { blogChannel, blogItems } from "@/lib/feeds"
import { rssResponse } from "@/lib/rss"
import { cacheUntilMidnight } from "@/lib/schedule"

export const dynamic = "force-dynamic"

export function GET(request: Request) {
  return rssResponse(request, blogChannel, blogItems(getPublishedPosts(), true), cacheUntilMidnight())
}

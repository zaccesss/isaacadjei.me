import { getPublishedPosts } from "@/data/blog"
import { blogChannel, blogItems } from "@/lib/content/feeds"
import { rssResponse } from "@/lib/content/rss"
import { cacheUntilMidnight } from "@/lib/time/schedule"

export const dynamic = "force-dynamic"

export function GET(request: Request) {
  return rssResponse(request, blogChannel, blogItems(getPublishedPosts(), true), cacheUntilMidnight())
}

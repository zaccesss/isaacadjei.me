import { getPublishedPosts } from "@/data/blog"
import { getPublishedNotes } from "@/data/notes"
import { getPublishedTILEntries } from "@/data/til"
import { allChannel, blogItems, newsletterItems, noteItems, tilItems } from "@/lib/feeds"
import { fetchNewsletterIssues } from "@/lib/newsletter"
import { rssResponse } from "@/lib/rss"
import { cacheUntilMidnight } from "@/lib/schedule"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const items = [
    ...blogItems(getPublishedPosts()),
    ...tilItems(getPublishedTILEntries()),
    ...noteItems(getPublishedNotes()),
    ...newsletterItems(await fetchNewsletterIssues()),
  ]
  return rssResponse(request, allChannel, items, cacheUntilMidnight())
}

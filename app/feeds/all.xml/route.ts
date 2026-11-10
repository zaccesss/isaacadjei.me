import { getPublishedPosts } from "@/data/blog"
import { getPublishedNotes } from "@/data/notes"
import { getPublishedTILEntries } from "@/data/til"
import { allChannel, blogItems, newsletterItems, noteItems, tilItems } from "@/lib/content/feeds"
import { fetchNewsletterIssues } from "@/lib/newsletter/newsletter"
import { rssResponse } from "@/lib/content/rss"
import { cacheUntilMidnight } from "@/lib/time/schedule"

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

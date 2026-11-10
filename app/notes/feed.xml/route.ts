import { getPublishedNotes } from "@/data/notes"
import { notesChannel, noteItems } from "@/lib/content/feeds"
import { rssResponse } from "@/lib/content/rss"
import { cacheUntilMidnight } from "@/lib/time/schedule"

export const dynamic = "force-dynamic"

export function GET(request: Request) {
  return rssResponse(request, notesChannel, noteItems(getPublishedNotes()), cacheUntilMidnight())
}

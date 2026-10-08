import { getPublishedNotes } from "@/data/notes"
import { notesChannel, noteItems } from "@/lib/feeds"
import { rssResponse } from "@/lib/rss"
import { cacheUntilMidnight } from "@/lib/schedule"

export const dynamic = "force-dynamic"

export function GET(request: Request) {
  return rssResponse(request, notesChannel, noteItems(getPublishedNotes()), cacheUntilMidnight())
}

import { NextResponse, type NextRequest } from "next/server"
import { supabase } from "@/lib/core/supabase"
import { buildEventsIcal, feedWindow, type FeedDeadline, type FeedEvent } from "@/lib/calendar/events-ical"
import { FINISHED_DEADLINE_IN } from "@/lib/uni/deadline-status"
import { secretEquals } from "@/lib/security/secure-compare"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const expected = process.env.EVENTS_FEED_KEY
  if (!expected || !secretEquals(req.nextUrl.searchParams.get("key"), expected)) {
    return new NextResponse(null, { status: 404 })
  }
  const { from, to } = feedWindow()
  const [events, deadlines] = await Promise.all([
    supabase
      .from("calendar_events")
      .select("id, title, start_at, end_at, location, description, all_day")
      .eq("is_deleted", false)
      .gte("start_at", from.toISOString())
      .lte("start_at", to.toISOString())
      .order("start_at"),
    supabase
      .from("uni_deadlines")
      .select("id, title, due_date, status, type")
      .not("status", "in", FINISHED_DEADLINE_IN)
      .gte("due_date", from.toISOString())
      .lte("due_date", to.toISOString())
      .order("due_date"),
  ])
  if (events.error || deadlines.error) return new NextResponse(null, { status: 503 })
  return new NextResponse(buildEventsIcal((events.data ?? []) as FeedEvent[], (deadlines.data ?? []) as FeedDeadline[]), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Cache-Control": "private, max-age=3600",
      "Content-Disposition": "attachment; filename=\"dashboard-events.ics\"",
    },
  })
}

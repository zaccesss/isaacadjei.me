import { escapeIcal, foldLine } from "@/lib/calendar/routine-ical"
import { isDeadlineFinished } from "@/lib/uni/deadline-status"

export const FEED_DAYS_BACK = 7
export const FEED_DAYS_AHEAD = 92
const DAY_STYLE_TIMES = new Set(["00:00", "23:59"])
const DEADLINE_MINUTES = 15
const UID_HOST = "events.isaacadjei.me"

export type FeedEvent = {
  id: string
  title: string
  start_at: string
  end_at: string | null
  location: string | null
  description: string | null
  all_day: boolean | null
}

export type FeedDeadline = {
  id: string
  title: string
  due_date: string
  status: string
  type: string | null
}

const pad = (n: number) => String(n).padStart(2, "0")

function utcStamp(d: Date): string {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
}

function londonParts(d: Date): { date: string; time: string } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(d)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00"
  return { date: `${get("year")}${get("month")}${get("day")}`, time: `${get("hour")}:${get("minute")}` }
}

function nextDay(yyyymmdd: string): string {
  const d = new Date(Date.UTC(+yyyymmdd.slice(0, 4), +yyyymmdd.slice(4, 6) - 1, +yyyymmdd.slice(6, 8) + 1))
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`
}

function vevent(lines: (string | null)[]): string {
  return ["BEGIN:VEVENT", ...lines.filter((l): l is string => l !== null).map(foldLine), "END:VEVENT"].join("\r\n")
}

function eventToVevent(e: FeedEvent, stamp: string): string | null {
  const start = new Date(e.start_at)
  if (Number.isNaN(start.getTime())) return null
  const end = e.end_at ? new Date(e.end_at) : null
  const common = [
    `UID:event-${e.id}@${UID_HOST}`,
    `DTSTAMP:${stamp}`,
    `SUMMARY:${escapeIcal(e.title)}`,
    e.location ? `LOCATION:${escapeIcal(e.location)}` : null,
    e.description ? `DESCRIPTION:${escapeIcal(e.description)}` : null,
  ]
  if (e.all_day) {
    const first = londonParts(start).date
    let after = nextDay(first)
    if (end && !Number.isNaN(end.getTime())) {
      const last = londonParts(end)
      const exclusive = last.time === "00:00" ? last.date : nextDay(last.date)
      if (exclusive > after) after = exclusive
    }
    return vevent([...common, `DTSTART;VALUE=DATE:${first}`, `DTEND;VALUE=DATE:${after}`])
  }
  const finish = end && !Number.isNaN(end.getTime()) && end > start ? end : new Date(start.getTime() + 60 * 60000)
  return vevent([...common, `DTSTART:${utcStamp(start)}`, `DTEND:${utcStamp(finish)}`])
}

function deadlineToVevent(d: FeedDeadline, stamp: string): string | null {
  const due = new Date(d.due_date)
  if (Number.isNaN(due.getTime())) return null
  const { date, time } = londonParts(due)
  const common = [
    `UID:deadline-${d.id}@${UID_HOST}`,
    `DTSTAMP:${stamp}`,
    `SUMMARY:${escapeIcal(`Due: ${d.title}`)}`,
    `DESCRIPTION:${escapeIcal(`Due ${time === "00:00" ? "on the day" : `at ${time}`}. Status: ${d.status.replace(/_/g, " ")}.`)}`,
    "CATEGORIES:Deadline",
  ]
  if (DAY_STYLE_TIMES.has(time)) {
    return vevent([...common, `DTSTART;VALUE=DATE:${date}`, `DTEND;VALUE=DATE:${nextDay(date)}`])
  }
  return vevent([...common, `DTSTART:${utcStamp(due)}`, `DTEND:${utcStamp(new Date(due.getTime() + DEADLINE_MINUTES * 60000))}`])
}

export function feedWindow(now: Date = new Date()): { from: Date; to: Date } {
  return { from: new Date(now.getTime() - FEED_DAYS_BACK * 86400000), to: new Date(now.getTime() + FEED_DAYS_AHEAD * 86400000) }
}

export function buildEventsIcal(events: FeedEvent[], deadlines: FeedDeadline[], now: Date = new Date()): string {
  const stamp = utcStamp(now)
  const body = [
    ...events.map((e) => eventToVevent(e, stamp)),
    ...deadlines.filter((d) => !isDeadlineFinished(d.status)).map((d) => deadlineToVevent(d, stamp)),
  ].filter((v): v is string => v !== null)
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Isaac Adjei//Dashboard events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Dashboard",
    "X-WR-TIMEZONE:Europe/London",
    "X-WR-CALDESC:Events and open deadlines from the dashboard",
    "REFRESH-INTERVAL;VALUE=DURATION:PT1H",
    "X-PUBLISHED-TTL:PT1H",
    ...body,
    "END:VCALENDAR",
  ].join("\r\n")
}

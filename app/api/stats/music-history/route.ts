import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { publicApiLimiter, checkRateLimit, getIp } from "@/lib/ratelimit"

export const dynamic = "force-dynamic"

type Row = { played_at: string }

function periodCutoffDays(period: string): number | null {
  if (period === "24h") return 1
  if (period === "7d") return 7
  if (period === "30d") return 30
  if (period === "90d") return 90
  if (period === "1y") return 365
  return null
}

export async function GET(req: Request) {
  if (!await checkRateLimit(publicApiLimiter, getIp(req))) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  const { searchParams } = new URL(req.url)
  const period = searchParams.get("period") ?? "1y"
  const days = periodCutoffDays(period)
  const cutoff = new Date(Date.now() - (days ?? 3650) * 86400000).toISOString()

  const { count } = await supabase.from("listening_history").select("id", { count: "exact", head: true }).gte("played_at", cutoff)
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / 1000))
  const pages = await Promise.all(
    Array.from({ length: totalPages }, (_, i) =>
      supabase.from("listening_history").select("played_at").gte("played_at", cutoff).range(i * 1000, i * 1000 + 999),
    ),
  )
  const rows = pages.flatMap((p) => (p.data as Row[] | null) ?? [])

  const hourFmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", hour: "2-digit", hour12: false })
  const dailyCounts = new Map<string, number>()
  const hourly = Array(24).fill(0) as number[]

  for (const r of rows) {
    const day = r.played_at.slice(0, 10)
    dailyCounts.set(day, (dailyCounts.get(day) ?? 0) + 1)
    const hour = Number(hourFmt.format(new Date(r.played_at)))
    hourly[hour]++
  }

  const daily = Array.from(dailyCounts.entries()).map(([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date))

  return NextResponse.json(
    { totalPlays: rows.length, daily, hourly },
    { headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" } },
  )
}

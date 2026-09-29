import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { publicApiLimiter, checkRateLimit, getIp } from "@/lib/ratelimit"
import { summarise, type GameSessionRow, type PlaytimeRow, type GenreRow } from "@/lib/gaming"

export const dynamic = "force-dynamic"

function periodCutoffDays(period: string): number | null {
  if (period === "24h") return 1
  if (period === "7d") return 7
  if (period === "30d") return 30
  if (period === "90d") return 90
  if (period === "1y") return 365
  return null
}

export async function GET(req: Request) {
  if (!(await checkRateLimit(publicApiLimiter, getIp(req)))) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  const { searchParams } = new URL(req.url)
  const period = searchParams.get("period") ?? "30d"
  const days = periodCutoffDays(period)
  const cutoff = new Date(Date.now() - (days ?? 3650) * 86400000).toISOString()

  const [{ data: sessions }, { data: playtime }, { data: genres }] = await Promise.all([
    supabase
      .from("game_sessions")
      .select("id, device, game, started_at, last_seen, ended_at, samples, cpu_sum, gpu_sum, peak_cpu, peak_gpu")
      .gte("started_at", cutoff)
      .order("started_at", { ascending: false })
      .limit(3000),
    supabase.from("game_playtime").select("platform, game, minutes, last_played").order("minutes", { ascending: false }).limit(200),
    supabase.from("game_genres").select("game, genres"),
  ])

  const summary = summarise((sessions ?? []) as GameSessionRow[], (playtime ?? []) as PlaytimeRow[], (genres ?? []) as GenreRow[])
  return NextResponse.json(summary, { headers: { "Cache-Control": "no-store" } })
}

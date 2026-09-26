import { NextResponse } from "next/server"

export const runtime = "edge"
export const dynamic = "force-dynamic"

export async function GET() {
  let dbOk = false
  try {
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
    if (url && key) {
      const res = await fetch(`${url}/rest/v1/config?select=key&limit=1`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      })
      dbOk = res.ok
    }
  } catch {
    dbOk = false
  }

  return NextResponse.json(
    { status: dbOk ? "ok" : "degraded", db: dbOk, time: new Date().toISOString() },
    { status: dbOk ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  )
}

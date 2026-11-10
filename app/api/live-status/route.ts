import { NextResponse } from "next/server"
import { getLiveSnapshot } from "@/lib/integrations/live-status"
import { cdnCache } from "@/lib/core/cdn-cache"

export async function GET() {
  const snapshot = await getLiveSnapshot()
  return NextResponse.json(snapshot, { headers: cdnCache(60) })
}

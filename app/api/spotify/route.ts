import { NextResponse } from "next/server"
import { getSpotify } from "@/lib/live-status"
import { cdnCache } from "@/lib/cdn-cache"

export async function GET() {
  return NextResponse.json(await getSpotify(), { headers: cdnCache(10) })
}

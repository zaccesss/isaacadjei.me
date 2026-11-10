import { NextResponse } from "next/server"
import { getSpotify } from "@/lib/integrations/live-status"
import { cdnCache } from "@/lib/core/cdn-cache"

export async function GET() {
  return NextResponse.json(await getSpotify(), { headers: cdnCache(15) })
}

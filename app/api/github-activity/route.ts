import { NextResponse } from "next/server"
import { getGithubActivity } from "@/lib/integrations/live-status"
import { cdnCache } from "@/lib/core/cdn-cache"

export async function GET() {
  return NextResponse.json(await getGithubActivity(), { headers: cdnCache(30) })
}

import { NextResponse } from "next/server"
import { getGithubActivity } from "@/lib/live-status"
import { cdnCache } from "@/lib/cdn-cache"

export async function GET() {
  return NextResponse.json(await getGithubActivity(), { headers: cdnCache(30) })
}

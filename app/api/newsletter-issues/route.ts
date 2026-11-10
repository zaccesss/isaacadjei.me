import { NextResponse } from "next/server"
import { cdnCache } from "@/lib/core/cdn-cache"
import { publicApiLimiter, checkRateLimit, getIp } from "@/lib/core/ratelimit"
import { fetchNewsletterIssues, type NewsletterIssue } from "@/lib/newsletter/newsletter"

export type { NewsletterIssue }

export async function GET(req: Request) {
  if (!await checkRateLimit(publicApiLimiter, getIp(req))) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }
  try {
    const issues = await fetchNewsletterIssues()
    return NextResponse.json(issues, { headers: cdnCache(600, 3600) })
  } catch {
    return NextResponse.json([], { headers: { "Cache-Control": "no-store" } })
  }
}

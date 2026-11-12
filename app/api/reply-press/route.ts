import { NextRequest, NextResponse } from "next/server"
import { redis } from "@/lib/core/redis"
import { replyPressLimiter, checkRateLimit, getIp } from "@/lib/core/ratelimit"
import { getPublishedPosts } from "@/data/blog"
import { getIssueBySlug } from "@/data/newsletter"
import { getPublishedNotes } from "@/data/notes"
import { getPublishedTILEntries } from "@/data/til"
import { isReplyNetwork, replyPage, replyPressKey, replySeenKey } from "@/lib/content/reply-presses"
import { asksNotToBeCounted } from "@/lib/content/no-count"

function pageKey(path: string): string | null {
  const page = replyPage(path)
  if (!page) return null
  if (page.section === "blog") return getPublishedPosts().some((p) => p.slug === page.slug) ? page.slug : null
  if (page.section === "til") return getPublishedTILEntries().some((e) => e.id === page.slug) ? `til-${page.slug}` : null
  if (page.section === "notes") return getPublishedNotes().some((n) => n.slug === page.slug) ? `note-${page.slug}` : null
  const issue = getIssueBySlug(page.slug)
  return issue ? `newsletter-${issue.id}` : null
}

const done = () => new NextResponse(null, { status: 204 })

const MAX_BODY = 400
const SEEN_SECONDS = 24 * 60 * 60

async function visitorHash(ip: string): Promise<string | null> {
  const salt = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
  if (!salt) return null
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${salt}.${ip}`))
  return Array.from(new Uint8Array(digest).slice(0, 6), (b) => b.toString(16).padStart(2, "0")).join("")
}

function sameSite(req: NextRequest): boolean {
  const origin = req.headers.get("origin")
  if (!origin) return true
  try {
    return new URL(origin).host === req.headers.get("host")
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  if (asksNotToBeCounted(req.headers.get("cookie"))) return done()
  if (!sameSite(req)) return done()
  const declared = Number(req.headers.get("content-length") ?? 0)
  if (!Number.isFinite(declared) || declared > MAX_BODY) return done()
  let body: unknown
  try {
    const text = await req.text()
    if (text.length > MAX_BODY) return done()
    body = JSON.parse(text)
  } catch {
    return done()
  }
  const { path, network } = (typeof body === "object" && body !== null ? body : {}) as { path?: unknown; network?: unknown }
  if (typeof path !== "string" || !isReplyNetwork(network)) return done()
  const key = pageKey(path)
  if (!key || !redis) return done()
  const ip = getIp(req)
  const visitor = await visitorHash(ip)
  if (!visitor) return done()
  if (!(await checkRateLimit(replyPressLimiter, ip))) return done()
  try {
    const first = await redis.set(replySeenKey(visitor, key, network), 1, { nx: true, ex: SEEN_SECONDS })
    if (first) await redis.incr(replyPressKey(key, network))
  } catch (e) {
    console.error("[reply-press]", e)
  }
  return done()
}

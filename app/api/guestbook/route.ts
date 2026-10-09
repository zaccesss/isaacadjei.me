import { createHash } from "node:crypto"
import { NextResponse } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { stripHtmlTags } from "@/lib/strip-html-tags"
import { supabase } from "@/lib/supabase"
import { recordActivity } from "@/lib/activity"

let ratelimit: Ratelimit | null = null
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    ratelimit = new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(3, "1 h"), prefix: "guestbook_rl" })
  } catch (e) {
    console.error("Guestbook ratelimit init failed:", e)
  }
}

const json = (body: unknown, init?: ResponseInit) => NextResponse.json(body, init)

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
    if (ratelimit) {
      try {
        const { success } = await ratelimit.limit(ip)
        if (!success) return json({ error: "You have signed a few times already. Please try again later." }, { status: 429 })
      } catch (rlErr) {
        console.error("Guestbook rate limit check failed, allowing request:", rlErr)
      }
    }

    const body = await request.json()
    const { _hp, turnstileToken } = body ?? {}
    if (_hp) return json({ success: true })

    const secret = process.env.TURNSTILE_SECRET_KEY
    if (secret) {
      if (!turnstileToken) return json({ error: "Please complete the verification." }, { status: 400 })
      try {
        const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ secret, response: turnstileToken }),
          signal: AbortSignal.timeout(5000),
        })
        const data = (await res.json()) as { success?: boolean }
        if (!data.success) return json({ error: "Verification failed. Please try the check again." }, { status: 400 })
      } catch (e) {
        console.error("Guestbook Turnstile request failed, allowing request:", e)
      }
    }

    const name = stripHtmlTags(String(body?.name ?? "")).trim().slice(0, 60)
    const message = stripHtmlTags(String(body?.message ?? "")).trim().slice(0, 280)
    const rawSite = String(body?.website ?? "").trim()
    const website = /^https?:\/\/[^\s]+$/i.test(rawSite) ? rawSite.slice(0, 200) : null
    if (!name || !message) return json({ error: "Please add your name and a message." }, { status: 400 })

    const salt = process.env.AUTH_SECRET ?? "guestbook"
    const ipHash = createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32)
    const { error } = await supabase.from("guestbook_entries").insert({ name, message, website, ip_hash: ipHash })
    if (error) {
      console.error("Guestbook insert failed:", error.message)
      return json({ error: "Something went wrong. Please try again." }, { status: 500 })
    }
    await recordActivity("guestbook.entry", name)
    return json({ success: true })
  } catch (e) {
    console.error("Guestbook request failed:", e)
    return json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}

import { createHash } from "node:crypto"
import { NextResponse } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { stripHtmlTags } from "@/lib/content/strip-html-tags"
import { supabase } from "@/lib/core/supabase"
import { recordActivity } from "@/lib/core/activity"

let ratelimit: Ratelimit | null = null
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    ratelimit = new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(3, "1 h"), prefix: "friends_rl" })
  } catch (e) {
    console.error("Friend request ratelimit init failed:", e)
  }
}

const json = (body: unknown, init?: ResponseInit) => NextResponse.json(body, init)
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
    if (ratelimit) {
      try {
        const { success } = await ratelimit.limit(ip)
        if (!success) return json({ error: "You have sent a few requests already. Please try again later." }, { status: 429 })
      } catch (rlErr) {
        console.error("Friend request rate limit check failed, allowing request:", rlErr)
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
        console.error("Friend request Turnstile request failed, allowing request:", e)
      }
    }

    const kind = body?.kind === "penpal" ? "penpal" : "friend"
    const name = stripHtmlTags(String(body?.name ?? "")).trim().slice(0, 60)
    const email = String(body?.email ?? "").trim().toLowerCase().slice(0, 254)
    const note = stripHtmlTags(String(body?.note ?? "")).trim().slice(0, 500)
    const rawSite = String(body?.website ?? "").trim()
    const website = /^https:\/\/[^\s]+$/i.test(rawSite) ? rawSite.slice(0, 200) : null
    if (!name || !EMAIL.test(email)) return json({ error: "Please add your name and a valid email address." }, { status: 400 })
    const showOnPage = kind === "friend" && body?.showOnPage === true && website !== null
    const wantsLetters = kind === "penpal" || body?.wantsLetters === true

    const salt = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "friends"
    const ipHash = createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32)
    const { error } = await supabase.from("friend_requests").insert({
      kind, name, email, website, note, show_on_page: showOnPage, wants_letters: wantsLetters, ip_hash: ipHash,
    })
    if (error) {
      console.error("Friend request insert failed:", error.message)
      return json({ error: "Something went wrong. Please try again." }, { status: 500 })
    }
    await recordActivity("friends.request", kind)
    return json({ success: true })
  } catch (e) {
    console.error("Friend request failed:", e)
    return json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}

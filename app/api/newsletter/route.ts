import { NextResponse } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { sendConfirmEmail } from "@/lib/newsletter-subscribe"

function json(body: unknown, init?: ResponseInit): NextResponse {
  return NextResponse.json(body, {
    ...init,
    headers: { "Cache-Control": "no-store", ...(init?.headers ?? {}) },
  })
}

let ratelimit: Ratelimit | null = null
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(3, "1 h"),
      prefix: "newsletter_rl",
    })
  } catch (e) {
    console.error("Newsletter ratelimit init failed:", e)
  }
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"

    if (ratelimit) {
      try {
        const { success } = await ratelimit.limit(ip)
        if (!success) {
          return json({ error: "Too many requests. Please try again later." }, { status: 429 })
        }
      } catch (rlErr) {
        console.error("Newsletter rate limit check failed, allowing request:", rlErr)
      }
    }

    const body = await request.json()
    const { email } = body

    if (!email || typeof email !== "string") {
      return json({ error: "Email is required." }, { status: 400 })
    }
    if (email.length > 254) {
      return json({ error: "Invalid email address." }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return json({ error: "Invalid email address." }, { status: 400 })
    }

    if (!(await sendConfirmEmail(email.trim().toLowerCase()))) {
      return json({ error: "Newsletter service unavailable." }, { status: 500 })
    }

    return json({ success: true })
  } catch (err) {
    console.error("Newsletter route error:", err)
    return json({ error: "Something went wrong." }, { status: 500 })
  }
}

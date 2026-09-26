import { NextResponse } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { stripHtmlTags } from "@/lib/strip-html-tags"

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
      limiter: Ratelimit.slidingWindow(3, "10 m"),
      prefix: "contact_rl",
    })
  } catch (e) {
    console.error("Ratelimit init failed:", e)
  }
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"

    if (ratelimit) {
      try {
        const { success } = await ratelimit.limit(ip)
        if (!success) {
          return json(
            { error: "Too many requests. Please try again later." },
            { status: 429 }
          )
        }
      } catch (rlErr) {
        console.error("Rate limit check failed, allowing request:", rlErr)
      }
    }

    const body = await request.json()
    const { name, email, subject, message, _hp, turnstileToken } = body

    if (_hp) {
      return json({ success: true })
    }

    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY
    if (turnstileSecret) {
      if (!turnstileToken) {
        return json({ error: "Please complete the verification." }, { status: 400 })
      }
      try {
        const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ secret: turnstileSecret, response: turnstileToken }),
          signal: AbortSignal.timeout(5000),
        })
        const verifyData = (await verifyRes.json()) as {
          success?: boolean
          "error-codes"?: string[]
        }
        if (!verifyData.success) {
          const codes = verifyData["error-codes"] ?? []
          console.error("Turnstile siteverify failed:", codes)

          let message = "Verification failed. Please complete the check again and send."
          if (codes.includes("hostname-mismatch")) {
            message =
              "Captcha domain mismatch. In Cloudflare Turnstile, add both isaacadjei.me and www.isaacadjei.me to the widget hostnames."
          } else if (
            codes.includes("timeout-or-duplicate") ||
            codes.includes("invalid-input-response")
          ) {
            message = "Captcha expired or was already used. Please verify again, then send."
          } else if (
            codes.includes("invalid-input-secret") ||
            codes.includes("missing-input-secret")
          ) {
            message = "Server captcha configuration error."
          }
          return json({ error: message }, { status: 400 })
        }
      } catch (tsErr) {
        console.error("Turnstile verification failed, allowing request:", tsErr)
      }
    }

    if (!name || !email || !subject || !message) {
      return json({ error: "All fields are required." }, { status: 400 })
    }
    if (name.length > 100 || subject.length > 200 || message.length > 5000 || email.length > 254) {
      return json({ error: "Input too long." }, { status: 400 })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return json({ error: "Invalid email address." }, { status: 400 })
    }

    const safeName = stripHtmlTags(name)
    const safeEmail = stripHtmlTags(email)
    const safeSubject = stripHtmlTags(subject)
    const safeMessage = stripHtmlTags(message)

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      return json({ success: true })
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "Portfolio Contact <contact@isaacadjei.me>",
        to: ["contact@isaacadjei.me"],
        reply_to: safeEmail,
        subject: `[Portfolio] ${safeSubject}`,
        html: `
          <p><strong>From:</strong> ${safeName} &lt;${safeEmail}&gt;</p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <hr />
          <p>${safeMessage.replace(/\n/g, "<br />")}</p>
        `,
      }),
      signal: AbortSignal.timeout(8000),
    })

    if (!res.ok) {
      const error = await res.text()
      console.error("Resend error:", res.status, error)
      return json({ error: "Failed to send message." }, { status: 500 })
    }

    return json({ success: true })
  } catch (err) {
    console.error("Contact route error:", err)
    return json({ error: "Something went wrong." }, { status: 500 })
  }
}

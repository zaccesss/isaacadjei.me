import { createHmac } from "crypto"
import { secretEquals } from "@/lib/secure-compare"

const SITE = "https://www.isaacadjei.me"
const LINK_TTL_SECONDS = 3 * 24 * 3600

function secret(): string | undefined {
  return process.env.NEWSLETTER_SECRET || process.env.AUTH_SECRET || undefined
}

function sign(email: string, expires: number, key: string): string {
  return createHmac("sha256", key).update(`newsletter:${email}:${expires}`).digest("base64url")
}

export function confirmUrl(email: string, now: number = Date.now()): string | null {
  const key = secret()
  if (!key) return null
  const expires = Math.floor(now / 1000) + LINK_TTL_SECONDS
  const params = new URLSearchParams({ e: email, x: String(expires), s: sign(email, expires, key) })
  return `${SITE}/newsletter/confirm?${params}`
}

export function verifyConfirm(params: URLSearchParams, now: number = Date.now()): string | null {
  const key = secret()
  const email = params.get("e")
  const expires = Number(params.get("x"))
  const sig = params.get("s")
  if (!key || !email || !sig || !Number.isFinite(expires)) return null
  if (expires < Math.floor(now / 1000)) return null
  return secretEquals(sig, sign(email, expires, key)) ? email : null
}

function apiKey(): string | undefined {
  return process.env.RESEND_NEWSLETTER_API_KEY || process.env.RESEND_API_KEY || undefined
}

export async function sendConfirmEmail(email: string): Promise<boolean> {
  const key = apiKey()
  const link = confirmUrl(email)
  if (!key || !link) return false
  const html = `<!doctype html><html lang="en-GB"><body style="margin:0;padding:24px 12px;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;">
<tr><td style="padding:28px 32px;">
<p style="margin:0 0 12px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#2445a8;font-family:Menlo,Consolas,monospace;">Isaac Adjei · Newsletter</p>
<h1 style="margin:0 0 12px;font-size:22px;color:#020817;">Confirm your subscription</h1>
<p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#020817;">Thanks for signing up. Tap the button to confirm this is your address and the next issue will arrive in the next couple of weeks.</p>
<p style="margin:0 0 20px;"><a href="${link}" style="display:inline-block;padding:12px 20px;background:#2445a8;color:#ffffff;border-radius:8px;font-weight:600;font-size:15px;text-decoration:none;">Confirm my subscription</a></p>
<p style="margin:0;font-size:13px;line-height:1.6;color:#64748b;">The link works for three days. If you did not sign up, ignore this email and nothing happens.</p>
</td></tr></table></td></tr></table></body></html>`
  const text = `Confirm your subscription to Isaac Adjei's newsletter:\n\n${link}\n\nThe link works for three days. If you did not sign up, ignore this email and nothing happens.`
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Isaac Adjei <newsletter@isaacadjei.me>",
      to: [email],
      subject: "Confirm your subscription",
      html,
      text,
    }),
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) console.error("[newsletter] confirmation email failed", res.status, await res.text().catch(() => ""))
  return res.ok
}

export async function addSubscriber(email: string): Promise<boolean> {
  const key = apiKey()
  const segmentId = process.env.RESEND_NEWSLETTER_SEGMENT_ID
  if (!key || !segmentId) return false
  const headers = { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }
  const created = await fetch("https://api.resend.com/contacts", {
    method: "POST",
    headers,
    body: JSON.stringify({ email, unsubscribed: false, segments: [{ id: segmentId }] }),
    signal: AbortSignal.timeout(8000),
  })
  if (created.ok) return true
  const contact = encodeURIComponent(email)
  const updated = await fetch(`https://api.resend.com/contacts/${contact}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ unsubscribed: false }),
    signal: AbortSignal.timeout(8000),
  })
  const added = await fetch(`https://api.resend.com/contacts/${contact}/segments/${segmentId}`, {
    method: "POST",
    headers,
    signal: AbortSignal.timeout(8000),
  })
  if (!updated.ok || !added.ok) {
    console.error("[newsletter] add subscriber failed", created.status, updated.status, added.status)
    return false
  }
  return true
}

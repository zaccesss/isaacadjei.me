import { NextResponse } from "next/server"
import { createHmac, timingSafeEqual } from "node:crypto"
import { countEvent, type Engagement } from "@/lib/newsletter-engagement"
import { recordActivity } from "@/lib/activity"

const EVENTS: Record<string, keyof Engagement> = {
  "email.delivered": "delivered",
  "email.opened": "opened",
  "email.clicked": "clicked",
  "email.bounced": "bounced",
}

function verified(secret: string, id: string, timestamp: string, signatures: string, body: string): boolean {
  const sent = Number(timestamp)
  if (!Number.isFinite(sent) || Math.abs(Date.now() / 1000 - sent) > 300) return false
  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64")
  const expected = createHmac("sha256", key).update(`${id}.${timestamp}.${body}`).digest()
  return signatures.split(" ").some((part) => {
    const sig = Buffer.from(part.split(",")[1] ?? "", "base64")
    return sig.length === expected.length && timingSafeEqual(sig, expected)
  })
}

export async function POST(req: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET
  if (!secret) return NextResponse.json({ error: "RESEND_WEBHOOK_SECRET not set" }, { status: 503 })
  const body = await req.text()
  const id = req.headers.get("svix-id")
  const timestamp = req.headers.get("svix-timestamp")
  const signatures = req.headers.get("svix-signature")
  if (!id || !timestamp || !signatures || !verified(secret, id, timestamp, signatures, body)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  let event: { type?: string; data?: { broadcast_id?: string; to?: string[] | string; email?: string; unsubscribed?: boolean } }
  try {
    event = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }
  const type = event.type ?? ""
  const data = event.data ?? {}

  const what = EVENTS[type]
  if (what && data.broadcast_id) {
    const to = Array.isArray(data.to) ? data.to[0] : data.to
    if (to) await countEvent(data.broadcast_id, what, to)
  } else if (type === "contact.updated" && data.unsubscribed) {
    await recordActivity("newsletter.unsubscribe")
  } else if (type === "email.complained" && data.broadcast_id) {
    await recordActivity("newsletter.complaint")
  }
  return NextResponse.json({ ok: true })
}

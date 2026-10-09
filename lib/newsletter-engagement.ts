import { createHash } from "node:crypto"
import { redis } from "@/lib/redis"

export type Engagement = { delivered: number; opened: number; clicked: number; bounced: number }

const KEEP = 400 * 24 * 3600
const key = (broadcastId: string, what: string) => `newsletter:engagement:${broadcastId}:${what}`

export function recipientHash(email: string): string {
  const salt = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || ""
  return createHash("sha256").update(`${salt}.${email.trim().toLowerCase()}`).digest("hex").slice(0, 16)
}

export async function countEvent(broadcastId: string, what: keyof Engagement, email: string): Promise<void> {
  if (!redis) return
  const k = key(broadcastId, what)
  await redis.sadd(k, recipientHash(email))
  await redis.expire(k, KEEP)
}

export async function engagementFor(broadcastId: string): Promise<Engagement | null> {
  if (!redis) return null
  try {
    const [delivered, opened, clicked, bounced] = await Promise.all(
      (["delivered", "opened", "clicked", "bounced"] as const).map((w) => redis!.scard(key(broadcastId, w))),
    )
    return { delivered, opened, clicked, bounced }
  } catch {
    return null
  }
}

import { NextRequest, NextResponse } from "next/server"
import { redis } from "@/lib/redis"
import { publicApiLimiter, checkRateLimit, getIp } from "@/lib/ratelimit"

export const PRESET_TYPES = [
  "👍","❤️","🔥","💡","🤯","🎉","💯","🎯",
  "👎","😄","😕","😢","🚀","👀","🙌","😮","💪","🧠","✨","🌟","🙏","😍","🤝","😎","🫶","🥹","🫠","🤌",
] as const
export type ReactionType = (typeof PRESET_TYPES)[number]

const PRESET_DEFAULTS: Record<string, 0> = Object.fromEntries(PRESET_TYPES.map((t) => [t, 0]))

const VALID_SLUG = /^[a-z0-9-]{1,120}$/

function reactionKey(slug: string, type: string) {
  return `reactions:${slug}:${type}`
}

function customSetKey(slug: string) {
  return `reactions:${slug}:_custom`
}

function isValidType(type: string): boolean {
  if ((PRESET_TYPES as readonly string[]).includes(type)) return true
  if (type.length === 0 || type.length > 8) return false
  if (/^[\x00-\x7F]*$/.test(type)) return false
  return /\p{Extended_Pictographic}/u.test(type)
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug")
  if (!slug || !VALID_SLUG.test(slug)) return NextResponse.json({ error: "slug required" }, { status: 400 })

  if (!redis) {
    return NextResponse.json(
      { presets: PRESET_DEFAULTS, custom: {} },
      { headers: { "Cache-Control": "no-store" } }
    )
  }

  const presetKeys = PRESET_TYPES.map((t) => reactionKey(slug, t))
  const [presetCounts, customEmojis] = await Promise.all([
    redis.mget<number[]>(...presetKeys),
    redis.smembers<string[]>(customSetKey(slug)),
  ])

  const presets = Object.fromEntries(
    PRESET_TYPES.map((t, i) => [t, presetCounts[i] ?? 0])
  )

  let custom: Record<string, number> = {}
  if (customEmojis.length > 0) {
    const customCounts = await redis.mget<number[]>(
      ...customEmojis.map((e) => reactionKey(slug, e))
    )
    custom = Object.fromEntries(
      customEmojis.map((e, i) => [e, customCounts[i] ?? 0])
    )
  }

  return NextResponse.json(
    { presets, custom },
    { headers: { "Cache-Control": "no-store" } }
  )
}

export async function POST(req: NextRequest) {
  if (!(await checkRateLimit(publicApiLimiter, getIp(req)))) {
    return NextResponse.json({ error: "rate limited" }, { status: 429 })
  }
  try {
    const body = await req.json() as { slug: string; type: string; action?: string }
    const { slug, type } = body
    const action = body.action ?? "react"

    if (!slug || !type || !VALID_SLUG.test(slug)) {
      return NextResponse.json({ error: "slug and type required" }, { status: 400 })
    }
    if (!isValidType(type)) {
      return NextResponse.json({ error: "invalid reaction type" }, { status: 400 })
    }

    if (!redis) {
      return NextResponse.json({ count: 0 }, { headers: { "Cache-Control": "no-store" } })
    }

    const key = reactionKey(slug, type)
    const isCustom = !(PRESET_TYPES as readonly string[]).includes(type)

    let newCount: number
    if (action === "unreact") {
      const current = (await redis.get<number>(key)) ?? 0
      newCount = current > 0 ? await redis.decr(key) : 0
      if (isCustom && newCount <= 0) {
        await redis.srem(customSetKey(slug), type)
      }
    } else {
      newCount = await redis.incr(key)
      if (isCustom) {
        await redis.sadd(customSetKey(slug), type)
      }
    }

    return NextResponse.json(
      { count: Math.max(0, newCount) },
      { headers: { "Cache-Control": "no-store" } }
    )
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 })
  }
}

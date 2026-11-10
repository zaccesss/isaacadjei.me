import { Ratelimit, type Duration } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

function makeRedis(): Redis | null {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      return Redis.fromEnv()
    } catch {
      return null
    }
  }
  return null
}

const redis = makeRedis()

function makeLimiter(requests: number, window: Duration, prefix: string): Ratelimit | null {
  if (!redis) return null
  try {
    return new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(requests, window), prefix })
  } catch {
    return null
  }
}

export const publicApiLimiter = makeLimiter(30, "60 s", "pub_api_rl")

export const heavyApiLimiter = makeLimiter(10, "60 s", "heavy_api_rl")

export async function checkRateLimit(
  limiter: Ratelimit | null,
  ip: string,
): Promise<boolean> {
  if (!limiter) return true
  try {
    const { success } = await limiter.limit(ip)
    return success
  } catch {
    return true
  }
}

export function getIp(req: Request): string {
  const fwd = (req.headers as Headers).get("x-forwarded-for")
  return fwd?.split(",")[0]?.trim() ?? "unknown"
}

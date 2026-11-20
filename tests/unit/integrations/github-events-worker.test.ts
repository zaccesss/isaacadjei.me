import { createHmac } from "crypto"
import { afterEach, describe, expect, it, vi } from "vitest"
import worker from "../../../workers/github-events/src/index"

const SECRET = "test-webhook-secret"
const SITE = "https://isaacadjei.me/api/github-events"
const DELIVERY = "0f5c2c1e-1a2b-4c3d-8e9f-0a1b2c3d4e5f"
const env = {
  GITHUB_APP_WEBHOOK_SECRET: SECRET,
  SUPABASE_URL: "https://db.example.com",
  SUPABASE_SERVICE_ROLE_KEY: "sb_secret_test",
  DISCORD_BOT_TOKEN: "bot-token",
  DISCORD_CHANNEL_GITHUB: "100000000000000001",
  DISCORD_CHANNEL_ERRORS: "100000000000000002",
  UPSTASH_REDIS_REST_URL: "https://redis.example.com",
  UPSTASH_REDIS_REST_TOKEN: "redis-token",
  CLOUDFLARE_ZONE_ID: "zone",
  CLOUDFLARE_PURGE_TOKEN: "purge-token",
}

const repository = { full_name: "zaccesss/footprints", default_branch: "main", html_url: "https://github.com/zaccesss/footprints", owner: { login: "zaccesss" } }
const merged = {
  action: "closed",
  repository,
  sender: { login: "zaccesss" },
  pull_request: { number: 12, title: "Fix the ledger", merged: true, html_url: "https://github.com/zaccesss/footprints/pull/12", base: { ref: "main" } },
}

function delivery(event: string, payload: unknown, secret = SECRET) {
  const body = JSON.stringify(payload)
  const signature = `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`
  return new Request(SITE, {
    method: "POST",
    headers: { "x-github-event": event, "x-github-delivery": DELIVERY, "x-hub-signature-256": signature, "Content-Type": "application/json" },
    body,
  })
}

function network(answers: Partial<Record<string, () => Response>> = {}) {
  const calls: { url: string; body: string }[] = []
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const request = input instanceof Request ? input : new Request(String(input), init)
    const url = request.url
    calls.push({ url, body: await request.clone().text() })
    const host = new URL(url).host
    if (answers[host]) return answers[host]!()
    if (host === "redis.example.com") return Response.json({ result: "OK" })
    return new Response("{}", { status: 200 })
  })
  vi.stubGlobal("fetch", fetchMock)
  return calls
}

const ctx = () => {
  const waiting: Promise<unknown>[] = []
  return { waitUntil: (p: Promise<unknown>) => void waiting.push(p), waiting }
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe("github-events Worker", () => {
  it("saves the row and posts the line itself, so the site never sees the delivery", async () => {
    const calls = network()
    const res = await worker.fetch(delivery("pull_request", merged), env, ctx())
    expect(await res.json()).toEqual({ ok: true, posted: true })
    const hosts = calls.map((c) => new URL(c.url).host)
    expect(hosts).toEqual(["db.example.com", "redis.example.com", "discord.com"])
    expect(JSON.parse(calls[0].body)).toMatchObject({ delivery: DELIVERY, event: "pull_request", repo: "zaccesss/footprints", outcome: "merged" })
    expect(JSON.parse(calls[2].body).content).toContain("Fix the ledger")
    expect(calls.some((c) => c.url === SITE)).toBe(false)
  })

  it("refuses a delivery with a wrong signature", async () => {
    const calls = network()
    const res = await worker.fetch(delivery("pull_request", merged, "someone-else"), env, ctx())
    expect(res.status).toBe(401)
    expect(calls).toHaveLength(0)
  })

  it("hands the delivery to the site when the row cannot be saved", async () => {
    const calls = network({ "db.example.com": () => new Response("down", { status: 503 }) })
    await worker.fetch(delivery("pull_request", merged), env, ctx())
    expect(calls.at(-1)?.url).toBe(SITE)
    expect(calls.some((c) => new URL(c.url).host === "discord.com")).toBe(false)
  })

  it("gives the claim back and hands the delivery to the site when Discord refuses the post", async () => {
    const calls = network({ "discord.com": () => new Response("blocked", { status: 429 }) })
    await worker.fetch(delivery("pull_request", merged), env, ctx())
    const redisCommands = calls.filter((c) => new URL(c.url).host === "redis.example.com").map((c) => JSON.parse(c.body)[0])
    expect(redisCommands).toEqual(["SET", "DEL"])
    expect(calls.at(-1)?.url).toBe(SITE)
  })

  it("does not post a delivery another copy already claimed", async () => {
    let redisCalls = 0
    const calls = network({ "redis.example.com": () => Response.json({ result: redisCalls++ === 0 ? null : 1 }) })
    const res = await worker.fetch(delivery("pull_request", merged), env, ctx())
    expect(await res.json()).toMatchObject({ posted: false, reason: "seen" })
    expect(calls.some((c) => new URL(c.url).host === "discord.com")).toBe(false)
  })

  it("empties the cache twice when a production deploy of the site succeeds", async () => {
    vi.useFakeTimers()
    const calls = network()
    const context = ctx()
    const deploy = {
      repository: { ...repository, full_name: "zaccesss/example-portfolio" },
      deployment: { environment: "Production" },
      deployment_status: { state: "success" },
      sender: { login: "vercel[bot]" },
    }
    await worker.fetch(delivery("deployment_status", deploy), env, context)
    await vi.advanceTimersByTimeAsync(21_000)
    await Promise.all(context.waiting)
    expect(calls.filter((c) => c.url.includes("/purge_cache"))).toHaveLength(2)
  })

  it("only filters until the secrets are set, as before", async () => {
    const calls = network()
    const edited = { ...merged, action: "edited" }
    const res = await worker.fetch(delivery("pull_request", edited), {}, ctx())
    expect(await res.json()).toMatchObject({ posted: false, reason: "not kept" })
    expect(calls).toHaveLength(0)
    await worker.fetch(delivery("pull_request", merged), {}, ctx())
    expect(calls.map((c) => c.url)).toEqual([SITE])
  })
})

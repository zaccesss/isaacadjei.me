import { beforeEach, describe, expect, it, vi } from "vitest"

const store = vi.hoisted(() => ({
  seen: new Set<string>(),
  counts: new Map<string, number>(),
  limited: [] as string[],
}))

vi.mock("@/lib/core/redis", () => ({
  redis: {
    set: async (key: string) => {
      if (store.seen.has(key)) return null
      store.seen.add(key)
      return "OK"
    },
    incr: async (key: string) => {
      const next = (store.counts.get(key) ?? 0) + 1
      store.counts.set(key, next)
      return next
    },
  },
}))
vi.mock("@/lib/core/ratelimit", () => ({
  replyPressLimiter: null,
  checkRateLimit: async (_limiter: unknown, ip: string) => {
    store.limited.push(ip)
    return true
  },
  getIp: () => "203.0.113.7",
}))

import { NextRequest } from "next/server"
import { POST } from "@/app/api/reply-press/route"
import { getPublishedPosts } from "@/data/blog"
import { replyPressKey } from "@/lib/content/reply-presses"

const slug = getPublishedPosts()[0].slug
const press = (body: string, headers: Record<string, string> = {}) =>
  POST(new NextRequest("https://example.test/api/reply-press", { method: "POST", body, headers: { "Content-Type": "application/json", ...headers } }))
const good = JSON.stringify({ path: `/blog/${slug}`, network: "mastodon" })
const countKey = replyPressKey(slug, "mastodon")

beforeEach(() => {
  store.seen.clear()
  store.counts.clear()
  store.limited.length = 0
  vi.stubEnv("AUTH_SECRET", "a-test-secret")
  vi.stubEnv("NEXTAUTH_SECRET", "")
})

describe("the reply press route", () => {
  it("counts one visitor once on one link, however often it is pressed", async () => {
    expect((await press(good)).status).toBe(204)
    expect((await press(good)).status).toBe(204)
    expect(store.counts.get(countKey)).toBe(1)
  })

  it("stores a hash and never the address itself", async () => {
    await press(good)
    expect(store.seen.size).toBe(1)
    for (const key of store.seen) expect(key).not.toContain("203.0.113.7")
  })

  it("stores nothing and counts nothing when the server has no secret to salt the hash with", async () => {
    vi.stubEnv("AUTH_SECRET", "")
    expect((await press(good)).status).toBe(204)
    expect(store.seen.size).toBe(0)
    expect(store.counts.size).toBe(0)
    expect(store.limited).toEqual([])
  })

  it("turns away a body that declares itself too long without reading it", async () => {
    const req = new NextRequest("https://example.test/api/reply-press", { method: "POST", body: good, headers: { "Content-Length": "5000" } })
    const read = vi.spyOn(req, "text")
    expect((await POST(req)).status).toBe(204)
    expect(read).not.toHaveBeenCalled()
    expect(store.counts.size).toBe(0)
  })

  it("turns away a long body that declared no length", async () => {
    const long = JSON.stringify({ path: `/blog/${slug}`, network: "mastodon", pad: "x".repeat(500) })
    const req = new NextRequest("https://example.test/api/reply-press", { method: "POST", body: long })
    req.headers.delete("content-length")
    expect((await POST(req)).status).toBe(204)
    expect(store.counts.size).toBe(0)
  })

  it("does not count a page that is not live or a network it does not know", async () => {
    await press(JSON.stringify({ path: "/blog/no-such-post-here", network: "mastodon" }))
    await press(JSON.stringify({ path: `/blog/${slug}`, network: "elsewhere" }))
    await press("not json")
    expect(store.counts.size).toBe(0)
  })

  it("drops a press sent from another site", async () => {
    await press(good, { origin: "https://elsewhere.test", host: "example.test" })
    expect(store.counts.size).toBe(0)
  })

  it("counts nothing for a browser that asks not to be counted and gives the same empty answer", async () => {
    const req = new NextRequest("https://example.test/api/reply-press", { method: "POST", body: good, headers: { "Content-Type": "application/json", cookie: "theme=dark; no_count=1" } })
    const read = vi.spyOn(req, "text")
    const res = await POST(req)
    expect(res.status).toBe(204)
    expect(await res.text()).toBe("")
    expect(read).not.toHaveBeenCalled()
    expect(store.limited).toEqual([])
    expect(store.seen.size).toBe(0)
    expect(store.counts.size).toBe(0)
  })

  it("still counts a browser whose cookies do not ask", async () => {
    expect((await press(good, { cookie: "theme=dark; no_count=0; xno_count=1" })).status).toBe(204)
    expect(store.limited).toEqual(["203.0.113.7"])
    expect(store.counts.get(countKey)).toBe(1)
  })
})

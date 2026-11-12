import { beforeEach, describe, expect, it, vi } from "vitest"

const store = vi.hoisted(() => ({
  limiterKeys: [] as string[],
  expired: [] as string[],
  already: 0,
  tables: [] as string[],
  rows: [] as Record<string, unknown>[],
}))

vi.mock("@/lib/core/redis", () => ({
  redis: {
    incr: async (key: string) => {
      store.limiterKeys.push(key)
      return store.already + store.limiterKeys.length
    },
    expire: async (key: string) => {
      store.expired.push(key)
      return 1
    },
  },
}))
vi.mock("@/lib/core/supabase", () => ({
  supabase: {
    from: (table: string) => {
      store.tables.push(table)
      return {
        upsert: async (row: Record<string, unknown>) => {
          store.rows.push(row)
          return { error: null }
        },
      }
    },
  },
}))

import { NextRequest } from "next/server"
import { POST } from "@/app/api/blog/read-event/route"

const ADDRESS = "203.0.113.7"
const good = JSON.stringify({ slug: "a-made-up-post", depth: 50, type: "note" })
const request = (body: string, headers: Record<string, string> = {}) =>
  new NextRequest("https://example.test/api/blog/read-event", { method: "POST", body, headers: { "Content-Type": "application/json", "x-forwarded-for": ADDRESS, ...headers } })

beforeEach(() => {
  store.limiterKeys.length = 0
  store.expired.length = 0
  store.already = 0
  store.tables.length = 0
  store.rows.length = 0
  vi.stubEnv("AUTH_SECRET", "a-test-secret")
})

describe("the read event route", () => {
  it("stores one read mark as before when the browser has not asked to be left out", async () => {
    const res = await POST(request(good))
    expect(res.status).toBe(204)
    expect(await res.text()).toBe("")
    expect(store.limiterKeys).toEqual([`blog:read-event:${ADDRESS}`])
    expect(store.expired).toEqual([`blog:read-event:${ADDRESS}`])
    expect(store.tables).toEqual(["blog_read_events"])
    expect(store.rows).toHaveLength(1)
    expect(store.rows[0]).toMatchObject({ slug: "a-made-up-post", depth: 50, post_type: "note" })
    expect(store.rows[0].ip_hash).toMatch(/^[0-9a-f]{12}$/)
    expect(JSON.stringify(store.rows[0])).not.toContain(ADDRESS)
  })

  it("stores nothing for a browser that asks not to be counted and gives the same empty answer", async () => {
    const req = request(good, { cookie: "no_count=1" })
    const read = vi.spyOn(req, "json")
    const res = await POST(req)
    expect(res.status).toBe(204)
    expect(await res.text()).toBe("")
    expect(read).not.toHaveBeenCalled()
    expect(store.limiterKeys).toEqual([])
    expect(store.expired).toEqual([])
    expect(store.tables).toEqual([])
    expect(store.rows).toEqual([])
  })

  it("hears the request among other cookies", async () => {
    expect((await POST(request(good, { cookie: "theme=dark; no_count=1; page_size=20" }))).status).toBe(204)
    expect(store.limiterKeys).toEqual([])
    expect(store.rows).toEqual([])
  })

  it("still counts a browser whose cookies do not ask", async () => {
    for (const cookie of ["theme=dark", "no_count=0", "xno_count=1"]) {
      expect((await POST(request(good, { cookie }))).status).toBe(204)
    }
    expect(store.limiterKeys).toHaveLength(3)
    expect(store.rows).toHaveLength(3)
  })

  it("still turns away a bad event and an address over the limit, as before", async () => {
    await POST(request("not json"))
    await POST(request(JSON.stringify({ slug: "Not A Slug", depth: 50 })))
    await POST(request(JSON.stringify({ slug: "a-made-up-post", depth: 40 })))
    expect(store.limiterKeys).toEqual([])
    expect(store.rows).toEqual([])
    store.already = 60
    expect((await POST(request(good))).status).toBe(204)
    expect(store.limiterKeys).toHaveLength(1)
    expect(store.rows).toEqual([])
  })
})

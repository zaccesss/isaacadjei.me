import { describe, expect, it } from "vitest"
import { feedEdgeCache, rssResponse } from "@/lib/content/rss"

const channel = { title: "Test", description: "Test feed", path: "/blog", feedPath: "/blog/feed.xml" }

describe("feed caching", () => {
  it("keeps every feed response out of Cloudflare", () => {
    expect(feedEdgeCache("public, max-age=3600, s-maxage=3600")["Cloudflare-CDN-Cache-Control"]).toBe("no-store")
  })

  it("moves the CDN lifetime into Vercel-CDN-Cache-Control", () => {
    expect(feedEdgeCache("public, max-age=120, s-maxage=900")["Vercel-CDN-Cache-Control"]).toBe("public, s-maxage=900")
    expect(feedEdgeCache("public, max-age=3600")["Vercel-CDN-Cache-Control"]).toBe("public, s-maxage=3600")
    expect(feedEdgeCache("no-store")["Vercel-CDN-Cache-Control"]).toBeUndefined()
  })

  it("sends both headers on the XML and the HTML answers", () => {
    for (const accept of ["application/atom+xml", "text/html"]) {
      const res = rssResponse(new Request("https://isaacadjei.me/blog/feed.xml", { headers: { accept } }), channel, [], "public, max-age=600, s-maxage=600")
      expect(res.headers.get("Vary")).toBe("Accept")
      expect(res.headers.get("Vercel-CDN-Cache-Control")).toBe("public, s-maxage=600")
      expect(res.headers.get("Cloudflare-CDN-Cache-Control")).toBe("no-store")
    }
  })
})

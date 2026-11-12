import { afterEach, describe, expect, it, vi } from "vitest"
import { commentLinks, socialHandles } from "@/lib/content/comment-links"
import { commentLead } from "@/components/blog/CommentOnLinks"
import { profileLinks } from "@/data/links"
import { SITE_URL } from "@/lib/constants"

const textOf = (href: string): string | null => {
  const url = new URL(href)
  if (url.hash) return decodeURIComponent(url.hash.slice("#text=".length))
  return url.searchParams.get("text") ?? url.searchParams.get("message")
}

describe("socialHandles", () => {
  it("reads each handle from the profile links", () => {
    const h = socialHandles()
    const url = (icon: string) => profileLinks.find((l) => l.icon === icon)!.url
    expect(url("bluesky")).toContain(h.bluesky!.slice(1))
    expect(url("twitter")).toContain(h.x!.slice(1))
    expect(url("substack")).toBe(`https://substack.com/${h.substack}`)
    const [, user, host] = h.mastodon!.split("@")
    expect(url("mastodon")).toBe(`https://${host}/@${user}`)
  })
})

describe("commentLinks", () => {
  const links = commentLinks("/blog/some-post")
  const text = (network: string) => textOf(links.find((l) => l.network === network)!.href)

  it("offers Bluesky, Substack, Mastodon and X in that order", () => {
    expect(links.map((l) => l.network)).toEqual(["Bluesky", "Substack", "Mastodon", "X"])
  })

  it("fills in the handle, the page's full address and a line to start from", () => {
    const h = socialHandles()
    expect(text("Bluesky")).toBe(`Reading ${h.bluesky} ${SITE_URL}/blog/some-post\n\nMy thought: `)
    expect(text("Mastodon")).toBe(`Reading ${h.mastodon} ${SITE_URL}/blog/some-post\n\nMy thought: `)
    expect(text("X")).toBe(`Reading ${h.x} ${SITE_URL}/blog/some-post\n\nMy thought: `)
  })

  it("ends every text on the colon and one space, so the cursor lands where the reader types", () => {
    for (const l of links) {
      expect(textOf(l.href)).toMatch(/My thought: $/)
      if (l.network === "Substack") expect(l.href).toContain("My%20thought%3A%20&restackUrl=")
      else expect(l.href.endsWith("%0A%0AMy%20thought%3A%20")).toBe(true)
    }
  })

  it("opens each network's own compose page over https", () => {
    expect(links.map((l) => new URL(l.href).origin)).toEqual(["https://bsky.app", "https://substack.com", "https://share.joinmastodon.org", "https://x.com"])
    expect(links.map((l) => new URL(l.href).pathname)).toEqual(["/intent/compose", "/home", "/", "/intent/tweet"])
  })

  it("opens the Substack note composer with the text as its message and the page as a card", () => {
    const href = links.find((l) => l.network === "Substack")!.href
    const url = new URL(href)
    expect(href.startsWith("https://substack.com/home?action=compose&message=")).toBe(true)
    expect([...url.searchParams.keys()]).toEqual(["action", "message", "restackUrl"])
    expect(url.searchParams.get("action")).toBe("compose")
    expect(url.searchParams.get("restackUrl")).toBe(`${SITE_URL}/blog/some-post`)
    expect(href.endsWith(`&restackUrl=${encodeURIComponent(`${SITE_URL}/blog/some-post`)}`)).toBe(true)
  })

  it("keeps the address out of the Substack text, since the card already shows it", () => {
    const h = socialHandles()
    expect(text("Substack")).toBe(`${h.substack} My thought: `)
    expect(text("Substack")).not.toContain(SITE_URL)
  })

  it("leaves the address in the text on Bluesky, Mastodon and X, which have no value for it", () => {
    for (const l of links.filter((x) => x.network !== "Substack")) {
      expect(textOf(l.href)).toContain(`${SITE_URL}/blog/some-post`)
      expect(l.href).not.toContain("restackUrl")
    }
  })

  it("encodes the text, so a new line or a space never breaks the address", () => {
    for (const l of links) expect(l.href).not.toMatch(/[\s\n]/)
  })

  it("encodes an ampersand and a question mark, so a title in the address stays inside the text", () => {
    const path = "/blog/why & how? a title"
    for (const l of commentLinks(path)) {
      if (l.network === "Substack") {
        expect(new URL(l.href).searchParams.get("restackUrl")).toBe(`${SITE_URL}${path}`)
        expect(l.href.slice(l.href.indexOf("restackUrl=") + "restackUrl=".length)).not.toMatch(/[&?]/)
        expect(l.href).toContain("why%20%26%20how%3F%20a%20title")
        continue
      }
      expect(textOf(l.href)).toContain(`${SITE_URL}${path}\n\nMy thought: `)
      const sent = l.href.slice(l.href.search(/(text|message)=/))
      expect(sent).toContain("why%20%26%20how%3F%20a%20title")
      expect(sent).not.toMatch(/[&?]/)
    }
  })

  it("keeps the text short enough for X", () => {
    const counted = text("X")!.replace(`${SITE_URL}/blog/some-post`, "x".repeat(23))
    expect(counted.length).toBeLessThanOrEqual(80)
  })
})

describe("commentLinks on the other kinds of writing", () => {
  const paths = ["/til/volatile-keyword", "/notes/some-note", "/newsletter/some-issue"]

  it("offers the same four networks for a TIL, a note and a newsletter issue", () => {
    for (const path of paths) {
      expect(commentLinks(path).map((l) => l.network), path).toEqual(["Bluesky", "Substack", "Mastodon", "X"])
    }
  })

  it("puts that page's own full address in every link: in the text on three networks and as the card on Substack", () => {
    for (const path of paths) {
      for (const l of commentLinks(path)) {
        if (l.network === "Substack") expect(new URL(l.href).searchParams.get("restackUrl"), path).toBe(`${SITE_URL}${path}`)
        else expect(textOf(l.href), `${path} on ${l.network}`).toContain(` ${SITE_URL}${path}\n\nMy thought: `)
      }
    }
  })

  it("keeps each address apart, so a reply to a note never names a post", () => {
    const addresses = paths.map((path) => textOf(commentLinks(path)[0].href))
    expect(new Set(addresses).size).toBe(paths.length)
    for (const text of addresses) expect(text).not.toContain("/blog/")
    const cards = paths.map((path) => new URL(commentLinks(path)[1].href).searchParams.get("restackUrl"))
    expect(new Set(cards).size).toBe(paths.length)
  })
})

describe("commentLead", () => {
  it("opens with Or only when the comment box sits above the line", () => {
    expect(commentLead(true)).toBe("Or comment on")
    expect(commentLead(false)).toBe("Comment on")
  })
})

describe("commentLinks with a profile missing", () => {
  afterEach(() => {
    vi.doUnmock("@/data/links")
    vi.resetModules()
  })

  it("leaves out a network that has no profile link", async () => {
    vi.resetModules()
    vi.doMock("@/data/links", () => ({ profileLinks: profileLinks.filter((l) => l.icon !== "substack" && l.icon !== "twitter") }))
    const fresh = await import("@/lib/content/comment-links")
    expect(fresh.socialHandles().substack).toBeNull()
    expect(fresh.commentLinks("/blog/some-post").map((l) => l.network)).toEqual(["Bluesky", "Mastodon"])
  })
})

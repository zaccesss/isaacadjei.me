import { describe, expect, it } from "vitest"
import { commentLinks } from "@/lib/content/comment-links"
import { REPLY_NETWORKS, isReplyNetwork, opensLink, parseReplyPressKey, replyNetworkOf, replyPage, replyPressKey, replySeenKey } from "@/lib/content/reply-presses"

describe("replyNetworkOf", () => {
  it("names the network of every link the page really draws", () => {
    const links = commentLinks("/blog/some-post")
    expect(links.length).toBeGreaterThan(0)
    for (const link of links) expect(replyNetworkOf(link.href)).toBe(link.network.toLowerCase())
  })

  it("ignores every other link", () => {
    for (const href of ["https://isaacadjei.me/blog/x", "https://x.com/someone", "https://substack.com/@someone", "/blog/x", "", "mailto:a@example.com"]) {
      expect(replyNetworkOf(href)).toBeNull()
    }
  })
})

describe("opensLink", () => {
  it("counts a primary press, which is also what a keyboard press on a link fires", () => {
    expect(opensLink("click", 0)).toBe(true)
  })

  it("counts a middle press, which opens the link in a new tab", () => {
    expect(opensLink("auxclick", 1)).toBe(true)
  })

  it("does not count a right press, which only opens the menu", () => {
    expect(opensLink("auxclick", 2)).toBe(false)
    expect(opensLink("contextmenu", 2)).toBe(false)
  })

  it("does not count any other button or event", () => {
    for (const button of [3, 4]) expect(opensLink("auxclick", button)).toBe(false)
    expect(opensLink("click", 1)).toBe(false)
    expect(opensLink("auxclick", 0)).toBe(false)
    expect(opensLink("mousedown", 0)).toBe(false)
  })
})

describe("replyPage", () => {
  it("accepts the four kinds of writing", () => {
    expect(replyPage("/blog/a-post")).toEqual({ section: "blog", slug: "a-post" })
    expect(replyPage("/til/a-til")).toEqual({ section: "til", slug: "a-til" })
    expect(replyPage("/notes/a-note/")).toEqual({ section: "notes", slug: "a-note" })
    expect(replyPage("/newsletter/an-issue")).toEqual({ section: "newsletter", slug: "an-issue" })
  })

  it("refuses any other path, so nothing else can mint a key", () => {
    for (const path of ["/", "/blog", "/blog/", "/about", "/blog/a/b", "/blog/A-Post", "/blog/a post", "/projects/x", "/blog/../x", `/blog/${"a".repeat(121)}`, "blog/a-post"]) {
      expect(replyPage(path)).toBeNull()
    }
  })
})

describe("press keys", () => {
  it("round trips a page key and a network, colons in the page key included", () => {
    for (const network of REPLY_NETWORKS) {
      expect(parseReplyPressKey(replyPressKey("newsletter-issue-04", network))).toEqual({ pageKey: "newsletter-issue-04", network })
    }
    expect(parseReplyPressKey(replyPressKey("odd:key", "x"))).toEqual({ pageKey: "odd:key", network: "x" })
  })

  it("does not read a key of another shape as a count", () => {
    expect(parseReplyPressKey("reactions:a-post:fire")).toBeNull()
    expect(parseReplyPressKey("replies:a-post:threads")).toBeNull()
    expect(parseReplyPressKey("replies::x")).toBeNull()
    expect(parseReplyPressKey(replySeenKey("abc123", "a-post", "x"))).toBeNull()
    expect(replySeenKey("abc123", "a-post", "x").startsWith("replies:")).toBe(false)
  })

  it("only knows the four networks", () => {
    expect(REPLY_NETWORKS).toEqual(["bluesky", "substack", "mastodon", "x"])
    expect(isReplyNetwork("bluesky")).toBe(true)
    expect(isReplyNetwork("threads")).toBe(false)
    expect(isReplyNetwork(3)).toBe(false)
  })
})

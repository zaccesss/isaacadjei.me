import { describe, expect, it } from "vitest"
import type { BlogPost } from "@/data/blog"
import type { NotePost } from "@/data/notes"
import type { TILEntry } from "@/data/til"
import type { NewsletterIssue } from "@/lib/newsletter/newsletter"
import { blogItems, newsletterItems, noteItems, tilItems, allChannel } from "@/lib/content/feeds"
import { buildAtomXml, buildRssHtml, type RssItem } from "@/lib/content/rss"
import { SITE_URL } from "@/lib/constants"
import { GET as feedXsl } from "@/app/feed.xsl/route"

const post = { title: "A post", slug: "a-post", date: "2026-11-01", description: "About a post.", tags: ["C"], type: "blog" } as unknown as BlogPost
const til = { id: "a-til", title: "A TIL", date: "2026-11-02", body: "Short body.", category: "C", tags: ["C"] } as unknown as TILEntry
const note = { title: "A note", slug: "a-note", date: "2026-11-03", description: "About a note.", tags: ["Plans"] } as unknown as NotePost
const issue = (kind: string, n: number): NewsletterIssue =>
  ({ id: `issue-${n}`, title: `Issue ${n}`, subtitle: "An issue.", publishDate: `2026-11-0${n}`, href: `/newsletter/slug-${n}`, webUrl: `${SITE_URL}/newsletter/issue-${n}`, label: kind, thumbnailUrl: null }) as unknown as NewsletterIssue
const issues = [issue("Letter", 4), issue("Midweek", 5), issue("Outside", 6)]

const BASE = "https://example.test"
const everything: RssItem[] = [...blogItems([post]), ...tilItems([til]), ...noteItems([note]), ...newsletterItems(issues)]
const xml = buildAtomXml(allChannel, everything, BASE)
const entries = xml.split("<entry>").slice(1)
const entryFor = (path: string) => entries.find((e) => e.includes(`rel="alternate" type="text/html" href="${BASE}${path}"`))!

describe("feed items", () => {
  it("gives every kind of writing its reactions and its place to answer", () => {
    expect(blogItems([post])[0].discussion).toBe("comments")
    expect(blogItems([post], true)[0].discussion).toBe("comments")
    expect(noteItems([note])[0].discussion).toBe("comments")
    expect(tilItems([til])[0].discussion).toBe("reply")
    expect(tilItems([til], true)[0].discussion).toBe("reply")
    expect(newsletterItems(issues).map((i) => i.discussion)).toEqual(["comments", "comments", "comments"])
  })

  it("keeps each entry's address and id as they were", () => {
    expect(blogItems([post])[0]).toMatchObject({ url: "/blog/a-post", date: "2026-11-01" })
    expect(tilItems([til])[0]).toMatchObject({ url: "/til/a-til", date: "2026-11-02" })
    expect(noteItems([note])[0]).toMatchObject({ url: "/notes/a-note", date: "2026-11-03" })
    expect(blogItems([post])[0].id ?? tilItems([til])[0].id ?? noteItems([note])[0].id).toBeUndefined()
    expect(newsletterItems(issues)[0]).toMatchObject({ id: `${SITE_URL}/newsletter/issue-4`, url: "/newsletter/slug-4" })
  })
})

describe("the Atom feed", () => {
  it("links every entry to #comments and #reactions on its own page", () => {
    expect(entries).toHaveLength(6)
    for (const path of ["/blog/a-post", "/til/a-til", "/notes/a-note", "/newsletter/slug-4", "/newsletter/slug-5", "/newsletter/slug-6"]) {
      const entry = entryFor(path)
      expect(entry, path).toContain(`<link rel="replies" type="text/html" title="${path.startsWith("/til/") ? "Reply" : "Comments"}" href="${BASE}${path}#comments" />`)
      expect(entry, path).toContain(`<link rel="related" type="text/html" title="Reactions" href="${BASE}${path}#reactions" />`)
    }
  })

  it("labels a TIL's second link Reply and no other entry's", () => {
    expect(xml.match(/title="Reply"/g)).toHaveLength(1)
    expect(xml.match(/title="Comments"/g)).toHaveLength(5)
  })

  it("leaves the ids, the dates and the order untouched by the extra links", () => {
    const bare = buildAtomXml(allChannel, everything.map((i) => ({ ...i, discussion: undefined })), BASE)
    const fixed = (feed: string) => feed.match(/<(id|published|updated)>[^<]*<\/\1>/g)
    expect(fixed(xml)).toEqual(fixed(bare))
    expect(xml.match(/<id>[^<]*<\/id>/g)).toEqual([
      `<id>${SITE_URL.replace(/\/$/, "")}/feed.xml</id>`,
      `<id>${SITE_URL}/newsletter/issue-6</id>`,
      `<id>${SITE_URL}/newsletter/issue-5</id>`,
      `<id>${SITE_URL}/newsletter/issue-4</id>`,
      `<id>${SITE_URL.replace(/\/$/, "")}/notes/a-note</id>`,
      `<id>${SITE_URL.replace(/\/$/, "")}/til/a-til</id>`,
      `<id>${SITE_URL.replace(/\/$/, "")}/blog/a-post</id>`,
    ])
  })

  it("writes no such link for an item with no sections", () => {
    const plain = buildAtomXml(allChannel, [{ title: "Bare", url: "/x", date: "2026-11-01", description: "" }], BASE)
    expect(plain).not.toContain('rel="replies"')
    expect(plain).not.toContain('rel="related"')
  })
})

describe("the feed's browser view", () => {
  const html = buildRssHtml(allChannel, everything, BASE)

  it("shows Reactions and Comments under every entry, with Reply on a TIL", () => {
    expect(html.match(/#reactions">Reactions<\/a>/g)).toHaveLength(6)
    expect(html.match(/#comments">Comments<\/a>/g)).toHaveLength(5)
    expect(html).toContain(`<a href="${BASE}/til/a-til#reactions">Reactions</a><a href="${BASE}/til/a-til#comments">Reply</a>`)
    expect(html).toContain(`<a href="${BASE}/newsletter/slug-5#reactions">Reactions</a><a href="${BASE}/newsletter/slug-5#comments">Comments</a>`)
  })

  it("describes a cover in the post's own words and names the title only when it has none", () => {
    const described = { ...post, cover_image: "/images/blog/a-post.webp", cover_alt: "A breadboard with two transistors and a small speaker" } as unknown as BlogPost
    const bare = { ...post, title: "Another post", slug: "another-post", cover_image: "/images/blog/another-post.webp" } as unknown as BlogPost
    const blank = { ...post, title: "A third post", slug: "a-third-post", cover_image: "/images/blog/a-third-post.webp", cover_alt: "  " } as unknown as BlogPost
    const page = buildRssHtml(allChannel, blogItems([described, bare, blank]), BASE)
    expect(page).toContain('alt="A breadboard with two transistors and a small speaker"')
    expect(page).not.toContain('alt="Cover image for A post"')
    expect(page).toContain('alt="Cover image for Another post"')
    expect(page).toContain('alt="Cover image for A third post"')
    expect(blogItems([{ ...post, cover_alt: "A picture that is not there" } as unknown as BlogPost])[0].imageAlt).toBeUndefined()
  })
})

function targetSize(css: string, selector: string, axis: "height" | "width"): number {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const rule = css.match(new RegExp(`(?:^|[\\s}])${escaped}\\s*\\{([^}]*)\\}`))?.[1] ?? ""
  const sizes = [...rule.matchAll(new RegExp(`(?:^|[\\s;])(?:min-)?${axis}:\\s*([\\d.]+)rem`, "g"))].map((m) => Number(m[1]) * 16)
  return Math.max(0, ...sizes)
}

describe("the targets in the feed views", () => {
  const many: RssItem[] = Array.from({ length: 45 }, (_, n) => ({ title: `Item ${n}`, url: `/x/${n}`, date: "2026-11-01", description: "", discussion: "comments" as const }))
  const page = buildRssHtml(allChannel, many, BASE)

  it("draws the links and the page buttons this checks", () => {
    expect(page).toContain('class="discussion"')
    expect(page).toContain('<a class="page-btn" href="?page=2"')
  })

  it("makes Reactions, Comments and Reply at least 44 pixels each way in the browser view", () => {
    expect(targetSize(page, ".discussion a", "height")).toBeGreaterThanOrEqual(44)
    expect(targetSize(page, ".discussion a", "width")).toBeGreaterThanOrEqual(44)
    expect(page).toMatch(/\.discussion a \{[^}]*display: inline-flex; align-items: center;/)
  })

  it("makes every page button at least 44 pixels each way", () => {
    expect(targetSize(page, ".page-btn", "height")).toBeGreaterThanOrEqual(44)
    expect(targetSize(page, ".page-btn", "width")).toBeGreaterThanOrEqual(44)
  })

  it("lets both rows wrap, so a narrow screen never scrolls sideways", () => {
    expect(page).toMatch(/\.discussion \{[^}]*flex-wrap: wrap;/)
    expect(page).toMatch(/\.pagination \{[^}]*flex-wrap: wrap;/)
  })

  it("gives the XSL view the same rule for its links", async () => {
    const xsl = await feedXsl().text()
    expect(xsl).toContain('<p class="discussion">')
    expect(targetSize(xsl, ".discussion a", "height")).toBeGreaterThanOrEqual(44)
    expect(targetSize(xsl, ".discussion a", "width")).toBeGreaterThanOrEqual(44)
    expect(xsl).toMatch(/\.discussion \{[^}]*flex-wrap: wrap;/)
    const rule = (css: string) => css.match(/\.discussion a \{[^}]*\}/)?.[0]
    expect(rule(xsl)).toBe(rule(page))
  })
})

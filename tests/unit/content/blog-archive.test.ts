import { describe, expect, it } from "vitest"
import { getAdjacentPosts, getArchivedPosts, getFeaturedPosts, getMainListPosts, getPostBySlug, getPublishedPosts, posts } from "@/data/blog"
import { PINNED_POSTS } from "@/data/blog/meta"
import { isLive } from "@/lib/time/schedule"

const ARCHIVED_SLUGS = [
  "iot-security-gaps",
  "spi-vs-i2c",
  "typescript-patterns-that-actually-matter",
  "business-analytics-data-to-decisions",
  "fpga-vhdl-introduction",
  "uart-bare-metal",
  "rtos-fundamentals",
  "javascript-event-loop",
  "dma-bare-metal",
  "interrupt-driven-embedded-design",
  "real-time-web-data",
  "writing-for-engineers",
  "reading-datasheets",
  "python-type-annotations",
  "ariane-5-flight-501-overflow",
  "how-the-transistor-got-small",
  "hubble-mirror-flaw",
  "how-gps-works-relativity",
]

const slugs = (list: { slug: string }[]) => list.map((p) => p.slug).sort()

describe("blog archive", () => {
  const live = posts.filter((p) => p.published && isLive(p.date))
  const main = getMainListPosts()
  const archived = getArchivedPosts()

  it("keeps archived posts off the main list", () => {
    expect(main.length).toBeGreaterThan(0)
    expect(main.every((p) => !p.archived)).toBe(true)
  })

  it("puts only archived posts in the archive", () => {
    expect(archived.length).toBeGreaterThan(0)
    expect(archived.every((p) => p.archived === true)).toBe(true)
  })

  it("splits the live posts into two sets with nothing shared and nothing lost", () => {
    const mainSlugs = new Set(main.map((p) => p.slug))
    expect(archived.some((p) => mainSlugs.has(p.slug))).toBe(false)
    expect(slugs([...main, ...archived])).toEqual(slugs(live))
    expect(slugs(getPublishedPosts())).toEqual(slugs(live))
  })

  it("marks exactly the 18 chosen posts as archived", () => {
    expect(ARCHIVED_SLUGS).toHaveLength(18)
    expect(slugs(posts.filter((p) => p.archived))).toEqual([...ARCHIVED_SLUGS].sort())
    expect(slugs(archived)).toEqual([...ARCHIVED_SLUGS].sort())
  })

  it("never archives Thank You, Stanmore", () => {
    const post = posts.find((p) => p.slug === "thank-you-stanmore")
    expect(post).toBeDefined()
    expect(post?.archived).toBeUndefined()
    expect(main.some((p) => p.slug === "thank-you-stanmore")).toBe(true)
  })

  it("leaves scheduled and unpublished posts out of both views", () => {
    const notLive = posts.filter((p) => !p.published || !isLive(p.date)).map((p) => p.slug)
    const shown = new Set([...main, ...archived].map((p) => p.slug))
    expect(notLive.filter((slug) => shown.has(slug))).toEqual([])
  })

  it("keeps an archived post reachable at its address and in the previous and next links", () => {
    for (const slug of ARCHIVED_SLUGS) expect(getPostBySlug(slug)?.slug).toBe(slug)
    const neighbours = getPublishedPosts().flatMap((p) => {
      const { prev, next } = getAdjacentPosts(p.slug)
      return [prev?.slug, next?.slug]
    })
    expect(ARCHIVED_SLUGS.every((slug) => neighbours.includes(slug))).toBe(true)
  })

  it("never features an archived post", () => {
    expect(getFeaturedPosts().some((p) => p.archived)).toBe(false)
  })
})

describe("the pinned row on the home page", () => {
  it("names three posts, each once", () => {
    expect(PINNED_POSTS).toHaveLength(3)
    expect(new Set(PINNED_POSTS).size).toBe(3)
  })

  it("names only posts that exist, are published and are not archived, so the row is never short", () => {
    for (const slug of PINNED_POSTS) {
      const post = posts.find((p) => p.slug === slug)
      expect(post, slug).toBeDefined()
      expect(post?.published, slug).toBe(true)
      expect(post?.archived ?? false, slug).toBe(false)
      expect(isLive(post?.date ?? ""), slug).toBe(true)
    }
    const main = getMainListPosts().map((p) => p.slug)
    expect(PINNED_POSTS.filter((slug) => !main.includes(slug))).toEqual([])
  })
})

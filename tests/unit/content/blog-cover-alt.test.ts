import { describe, expect, it } from "vitest"
import { posts } from "@/data/blog"

const MIN_LENGTH = 20

const slugs = (list: { slug: string }[]) => list.map((p) => p.slug).sort()

describe("blog cover descriptions", () => {
  const withCover = posts.filter((p) => p.published && p.cover_image)

  it("finds published posts with a cover to check", () => {
    expect(withCover.length).toBeGreaterThan(0)
  })

  it("gives every cover a description long enough to say what it shows", () => {
    const short = withCover.filter((p) => (p.cover_alt ?? "").trim().length < MIN_LENGTH)
    expect(slugs(short)).toEqual([])
  })

  it("never reuses the post title as the description", () => {
    const same = withCover.filter((p) => (p.cover_alt ?? "").trim().toLowerCase() === p.title.trim().toLowerCase())
    expect(slugs(same)).toEqual([])
  })
})

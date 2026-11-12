import { describe, expect, it } from "vitest"
import { buildHeadingIds } from "@/components/shared/markdown/ContentBlocks"
import { notePosts } from "@/data/notes"
import {
  COMMENTS_SECTION,
  REACTIONS_SECTION,
  REPLY_SECTION,
  TOC_ACTIVE_LINE,
  TOC_MIN_HEADINGS,
  activeHeadingIndex,
  collectTocHeadings,
  hasToc,
  scrollTopToReveal,
  tocEntries,
  type TocHeading,
} from "@/lib/content/toc"

describe("activeHeadingIndex", () => {
  it("marks nothing before the first heading reaches the line", () => {
    expect(activeHeadingIndex([400, 900, 1500], 120)).toBe(-1)
  })

  it("marks the last heading that has passed the line", () => {
    expect(activeHeadingIndex([-800, 96, 700], 120)).toBe(1)
    expect(activeHeadingIndex([-2000, -900, -10], 120)).toBe(2)
  })

  it("keeps a heading marked through a long section with no heading on screen", () => {
    expect(activeHeadingIndex([-3000, 2500], 120)).toBe(0)
  })

  it("marks the last heading on screen at the end of the page", () => {
    expect(activeHeadingIndex([-900, 300, 520], 120, true, 800)).toBe(2)
    expect(activeHeadingIndex([-900, 300, 520], 120, false, 800)).toBe(0)
  })

  it("ignores a heading below the window at the end of the page", () => {
    expect(activeHeadingIndex([-900, 300, 950], 120, true, 800)).toBe(1)
  })

  it("copes with no headings", () => {
    expect(activeHeadingIndex([], 120, true, 800)).toBe(-1)
  })
})

describe("scrollTopToReveal", () => {
  it("leaves the list alone when the entry is in view", () => {
    expect(scrollTopToReveal(100, 44, 0, 400)).toBe(0)
  })

  it("scrolls down far enough to show an entry below the fold", () => {
    expect(scrollTopToReveal(600, 44, 0, 400)).toBe(252)
  })

  it("scrolls up to an entry above the visible part and never past the start", () => {
    expect(scrollTopToReveal(100, 44, 300, 400)).toBe(92)
    expect(scrollTopToReveal(4, 44, 300, 400)).toBe(0)
  })
})

describe("collectTocHeadings", () => {
  const content = [
    { type: "p", text: "Opening" },
    { type: "h2", text: "First part" },
    { type: "h3", text: "A detail" },
    { type: "code", text: "x = 1" },
    { type: "h2", text: "First part" },
  ]

  it("lists the h2 and h3 blocks with the ids the renderer gives them", () => {
    expect(collectTocHeadings(content, buildHeadingIds(content))).toEqual([
      { id: "first-part", text: "First part", level: 2 },
      { id: "a-detail", text: "A detail", level: 3 },
      { id: "first-part-1", text: "First part", level: 2 },
    ])
  })

  it("shows a contents list from three headings", () => {
    const headings = collectTocHeadings(content, buildHeadingIds(content))
    expect(TOC_MIN_HEADINGS).toBe(3)
    expect(hasToc(headings)).toBe(true)
    expect(hasToc(headings.slice(0, 2))).toBe(false)
  })

  it("gives every note heading an id that is unique on its page", () => {
    for (const note of notePosts) {
      const ids = collectTocHeadings(note.content, buildHeadingIds(note.content)).map((h) => h.id)
      expect(new Set(ids).size, note.slug).toBe(ids.length)
      expect(ids.every((id) => id.length > 0), note.slug).toBe(true)
    }
  })
})

describe("tocEntries", () => {
  const headings: TocHeading[] = [
    { id: "one", text: "One", level: 2 },
    { id: "two", text: "Two", level: 3 },
    { id: "three", text: "Three", level: 2 },
  ]

  it("ends the list with Reactions and Comments as top-level entries", () => {
    expect(tocEntries(headings, [REACTIONS_SECTION, COMMENTS_SECTION]).slice(-2)).toEqual([
      { id: "reactions", text: "Reactions", level: 2 },
      { id: "comments", text: "Comments", level: 2 },
    ])
    expect(tocEntries(headings, [REACTIONS_SECTION, COMMENTS_SECTION])).toHaveLength(5)
  })

  it("names a TIL's last entry Reply and keeps the id the section has on the page", () => {
    expect(tocEntries(headings, [REACTIONS_SECTION, REPLY_SECTION]).at(-1)).toEqual({ id: "comments", text: "Reply", level: 2 })
  })

  it("keeps the headings as they are when the page has no closing sections", () => {
    expect(tocEntries(headings)).toEqual(headings)
  })

  it("does not let the sections make up the minimum, so a short page still has no list", () => {
    expect(tocEntries(headings.slice(0, 2), [REACTIONS_SECTION, COMMENTS_SECTION])).toEqual([])
    expect(tocEntries([], [REACTIONS_SECTION, COMMENTS_SECTION])).toEqual([])
  })

  it("leaves out a section whose id a heading already has, so no two entries share a target", () => {
    const clash: TocHeading[] = [...headings, { id: "comments", text: "Comments", level: 2 }]
    const ids = tocEntries(clash, [REACTIONS_SECTION, COMMENTS_SECTION]).map((h) => h.id)
    expect(ids).toEqual(["one", "two", "three", "comments", "reactions"])
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("marks the sections as current like any heading", () => {
    expect(activeHeadingIndex([-3000, -2000, -900, 96, 400], TOC_ACTIVE_LINE)).toBe(3)
    expect(activeHeadingIndex([-3400, -2400, -1300, -300, 96], TOC_ACTIVE_LINE)).toBe(4)
    expect(activeHeadingIndex([-3200, -2200, -1100, 150, 420], TOC_ACTIVE_LINE, true, 800)).toBe(4)
  })
})

export interface TocHeading {
  id: string
  text: string
  level: 2 | 3
}

export const TOC_MIN_HEADINGS = 3

export const TOC_ACTIVE_LINE = 120

export function hasToc(headings: readonly TocHeading[]): boolean {
  return headings.length >= TOC_MIN_HEADINGS
}

export interface TocSection {
  id: string
  text: string
}

export const REACTIONS_SECTION: TocSection = { id: "reactions", text: "Reactions" }
export const COMMENTS_SECTION: TocSection = { id: "comments", text: "Comments" }
export const REPLY_SECTION: TocSection = { id: "comments", text: "Reply" }

export function tocEntries(headings: readonly TocHeading[], sections: readonly TocSection[] = []): TocHeading[] {
  if (!hasToc(headings)) return []
  const taken = new Set(headings.map((h) => h.id))
  const extra = sections.filter((s) => !taken.has(s.id)).map((s): TocHeading => ({ id: s.id, text: s.text, level: 2 }))
  return [...headings, ...extra]
}

export function collectTocHeadings(
  content: readonly { type: string; text?: string }[],
  headingIds: ReadonlyMap<number, string>,
): TocHeading[] {
  const headings: TocHeading[] = []
  content.forEach((block, i) => {
    if (block.type !== "h2" && block.type !== "h3") return
    const id = headingIds.get(i)
    if (!id || !block.text) return
    headings.push({ id, text: block.text, level: block.type === "h2" ? 2 : 3 })
  })
  return headings
}

export function activeHeadingIndex(tops: readonly number[], line: number, atPageEnd = false, windowHeight = 0): number {
  let active = -1
  for (let i = 0; i < tops.length; i++) {
    if (tops[i] <= line) active = i
  }
  if (atPageEnd) {
    for (let i = tops.length - 1; i > active; i--) {
      if (tops[i] < windowHeight) return i
    }
  }
  return active
}

export function scrollTopToReveal(entryTop: number, entryHeight: number, scrollTop: number, viewHeight: number, pad = 8): number {
  if (entryTop - pad < scrollTop) return Math.max(0, entryTop - pad)
  if (entryTop + entryHeight + pad > scrollTop + viewHeight) return entryTop + entryHeight + pad - viewHeight
  return scrollTop
}

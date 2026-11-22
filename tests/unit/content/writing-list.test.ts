import { describe, expect, it } from "vitest"
import { firstSentence, pickWriting, type WritingItem } from "@/lib/content/writing-list"

const item = (kind: WritingItem["kind"], date: string, n = 1): WritingItem => ({ kind, title: `a-made-up-${kind}-${n}`, summary: "", date, href: `/${kind}/${n}` })

describe("pickWriting", () => {
  it("lists the newest first and stops at the row count", () => {
    const rows = pickWriting([item("Blog post", "2026-11-01"), item("Note", "2026-11-20"), item("Newsletter", "2026-11-10")], 2)
    expect(rows.map((r) => r.kind)).toEqual(["Note", "Newsletter"])
  })

  it("keeps at most two TILs so posts are not pushed off", () => {
    const tils = Array.from({ length: 5 }, (_, i) => item("TIL", `2026-11-2${i}`, i))
    const rows = pickWriting([...tils, item("Blog post", "2026-10-01"), item("Note", "2026-09-01")], 6, 2)
    expect(rows.filter((r) => r.kind === "TIL")).toHaveLength(2)
    expect(rows.map((r) => r.kind)).toContain("Blog post")
  })

  it("puts pinned posts first in their own order, then the newest of the rest", () => {
    const pinnedOld = { ...item("Blog post", "2024-01-01", 1), pinned: true }
    const pinnedOlder = { ...item("Blog post", "2023-01-01", 2), pinned: true }
    const rows = pickWriting([item("Note", "2026-11-20"), pinnedOld, pinnedOlder, item("TIL", "2026-11-21")], 3)
    expect(rows.map((r) => r.href)).toEqual(["/Blog post/1", "/Blog post/2", "/TIL/1"])
  })
})

describe("firstSentence", () => {
  it("drops a markdown link's address and keeps its words", () => {
    expect(firstSentence("[WSL 1 translated calls](https://example.test/a) on the fly. Then more.")).toBe("WSL 1 translated calls on the fly.")
  })

  it("strips inline markdown marks", () => {
    expect(firstSentence("Use `docker builder prune` to clear the **build** cache.")).toBe("Use docker builder prune to clear the build cache.")
  })
})

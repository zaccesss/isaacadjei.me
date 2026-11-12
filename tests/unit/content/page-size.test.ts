import { describe, expect, it } from "vitest"
import { GRID_PAGE_SIZES, LIST_PAGE_SIZES, resolvePageSize } from "@/components/shared/lists/Pagination"

describe("list page sizes", () => {
  it("offers 15, 30 and 45 on the lists of writing", () => {
    expect(LIST_PAGE_SIZES).toEqual([15, 30, 45])
    expect(GRID_PAGE_SIZES).toEqual([15, 30, 45])
  })
})

describe("resolvePageSize", () => {
  it("shows the default when nothing is stored", () => {
    expect(resolvePageSize(null, LIST_PAGE_SIZES)).toBe(15)
  })

  it("keeps a stored size that is still offered", () => {
    expect(resolvePageSize("30", LIST_PAGE_SIZES)).toBe(30)
    expect(resolvePageSize("45", LIST_PAGE_SIZES)).toBe(45)
  })

  it("falls back to the default for a size from the old options", () => {
    for (const old of ["20", "40", "60"]) expect(resolvePageSize(old, LIST_PAGE_SIZES)).toBe(15)
  })

  it("falls back for text that is not a size", () => {
    for (const bad of ["", "abc", "15.5", "-15", "NaN"]) expect(resolvePageSize(bad, LIST_PAGE_SIZES)).toBe(15)
  })

  it("always gives a size the picker lists, so the select is never left empty", () => {
    for (const stored of [null, "20", "40", "60", "0", "15", "30", "45"]) {
      expect(LIST_PAGE_SIZES).toContain(resolvePageSize(stored, LIST_PAGE_SIZES))
    }
  })

  it("uses the caller's own default when one is passed", () => {
    expect(resolvePageSize("20", LIST_PAGE_SIZES, 30)).toBe(30)
  })
})

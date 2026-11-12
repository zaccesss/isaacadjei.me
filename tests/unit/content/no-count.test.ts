import { describe, expect, it } from "vitest"
import { NO_COUNT_COOKIE, asksNotToBeCounted } from "@/lib/content/no-count"

describe("a browser asking not to be counted", () => {
  it("is heard when the cookie is the only one", () => {
    expect(asksNotToBeCounted("no_count=1")).toBe(true)
    expect(asksNotToBeCounted(`${NO_COUNT_COOKIE}=1`)).toBe(true)
  })

  it("is not heard when there are no cookies at all", () => {
    expect(asksNotToBeCounted("")).toBe(false)
    expect(asksNotToBeCounted(null)).toBe(false)
    expect(asksNotToBeCounted(undefined)).toBe(false)
  })

  it("is not heard when only other cookies are there", () => {
    expect(asksNotToBeCounted("theme=dark; page_size=20")).toBe(false)
  })

  it("is heard with other cookies around it, wherever it sits", () => {
    expect(asksNotToBeCounted("no_count=1; theme=dark")).toBe(true)
    expect(asksNotToBeCounted("theme=dark; no_count=1; page_size=20")).toBe(true)
    expect(asksNotToBeCounted("theme=dark;no_count=1")).toBe(true)
    expect(asksNotToBeCounted("theme=dark;  no_count=1 ")).toBe(true)
  })

  it("is not heard with any value other than 1", () => {
    for (const value of ["0", "", "true", "yes", "10", "01", "1x"]) expect(asksNotToBeCounted(`no_count=${value}`)).toBe(false)
    expect(asksNotToBeCounted("no_count")).toBe(false)
  })

  it("is not heard from a cookie whose name only looks alike", () => {
    expect(asksNotToBeCounted("xno_count=1")).toBe(false)
    expect(asksNotToBeCounted("no_count_2=1")).toBe(false)
    expect(asksNotToBeCounted("NO_COUNT=1")).toBe(false)
    expect(asksNotToBeCounted("note=no_count=1")).toBe(false)
  })
})

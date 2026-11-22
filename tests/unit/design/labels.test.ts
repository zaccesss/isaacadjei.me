import { describe, expect, it } from "vitest"
import { formatLabel } from "@/lib/ui/labels"

describe("formatLabel", () => {
  it("turns a stored value into sentence case words", () => {
    expect(formatLabel("not_started")).toBe("Not started")
    expect(formatLabel("in-progress")).toBe("In progress")
    expect(formatLabel("treasurer_approved")).toBe("Treasurer approved")
  })

  it("keeps known acronyms in capitals", () => {
    expect(formatLabel("su_approved")).toBe("SU approved")
    expect(formatLabel("pal")).toBe("PAL")
  })

  it("prefers the page's own wording when it has one", () => {
    expect(formatLabel("done", { done: "Finished" })).toBe("Finished")
  })

  it("gives nothing for an empty value", () => {
    expect(formatLabel(null)).toBe("")
    expect(formatLabel("")).toBe("")
  })
})

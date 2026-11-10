import { describe, expect, it } from "vitest"
import { ukShortDate } from "@/lib/time/short-date"

describe("ukShortDate", () => {
  it("writes September the way the server does, so Safari and the server agree", () => {
    expect(ukShortDate("2026-09-03")).toBe("3 Sept 2026")
    expect(ukShortDate("2026-11-10")).toBe("10 Nov 2026")
  })

  it("keeps a date with no time on its own day whatever the time zone", () => {
    expect(ukShortDate("2026-01-01")).toBe("1 Jan 2026")
    expect(ukShortDate("2026-12-31T23:59:59Z")).toBe("31 Dec 2026")
  })

  it("can leave the year out and returns bad input unchanged", () => {
    expect(ukShortDate("2026-05-09", false)).toBe("9 May")
    expect(ukShortDate("not a date")).toBe("not a date")
  })
})

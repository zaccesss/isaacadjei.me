import { describe, expect, it } from "vitest"
import { isQuietRelease, releaseStats } from "@/lib/stats/research-stats"

const list = [
  { version: "v1.2.1", date: "2026-05-04", fixed: ["One fix"] },
  { version: "v1.2.0", date: "2026-05-04", added: ["One thing", "Another"], changed: ["A change"] },
  { version: "v1.1.3", date: "2026-04-30", changed: ["Small behind-the-scenes improvements"] },
  { version: "v1.0.0", date: "2026-04-28", added: ["The site"] },
  { version: "Unreleased", date: "", added: ["Not out yet"] },
]

describe("releaseStats", () => {
  const s = releaseStats(list)

  it("counts dated releases only", () => {
    expect(s.total).toBe(4)
    expect(s.quiet).toBe(1)
  })

  it("groups by month with the oldest first and a running total", () => {
    expect(s.byMonth.map((m) => [m.name, m.total])).toEqual([["Apr 26", 2], ["May 26", 2]])
    expect(s.growth.map((g) => g.value)).toEqual([2, 4])
  })

  it("takes the newest listed release as the latest when two share a day", () => {
    expect(s.latest).toEqual({ version: "v1.2.1", date: "2026-05-04" })
    expect(s.first).toBe("2026-04-28")
  })

  it("reads the size of a release from its version", () => {
    expect(Object.fromEntries(s.sizes.map((k) => [k.name, k.value]))).toEqual({ Major: 1, Minor: 1, Patch: 2 })
  })

  it("leaves a quiet release's line out of the changes", () => {
    expect(s.lines).toBe(5)
    expect(Object.fromEntries(s.kinds.map((k) => [k.name, k.value]))).toEqual({ Added: 3, Changed: 1, Fixed: 1 })
  })

  it("puts each release on its weekday", () => {
    expect(Object.fromEntries(s.weekdays.filter((d) => d.value).map((d) => [d.name, d.value]))).toEqual({ Mon: 2, Tue: 1, Thu: 1 })
  })
})

describe("isQuietRelease", () => {
  it("is quiet only when every line is the stock one", () => {
    expect(isQuietRelease(list[2])).toBe(true)
    expect(isQuietRelease({ version: "v1", date: "2026-01-01", changed: ["Small behind-the-scenes improvements", "A real change"] })).toBe(false)
    expect(isQuietRelease({ version: "v1", date: "2026-01-01" })).toBe(false)
  })
})

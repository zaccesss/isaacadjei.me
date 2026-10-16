import { describe, expect, it } from "vitest"
import { isLiveFromHour, londonHour } from "@/lib/schedule"

describe("isLiveFromHour", () => {
  it("keeps a newsletter issue hidden until 08:00 London on its date", () => {
    expect(isLiveFromHour("2026-10-16", 8, new Date("2026-10-15T23:30:00Z"))).toBe(false)
    expect(isLiveFromHour("2026-10-16", 8, new Date("2026-10-16T06:59:00Z"))).toBe(false)
    expect(isLiveFromHour("2026-10-16", 8, new Date("2026-10-16T07:00:00Z"))).toBe(true)
  })

  it("follows GMT in winter", () => {
    expect(isLiveFromHour("2026-12-07", 8, new Date("2026-12-07T07:59:00Z"))).toBe(false)
    expect(isLiveFromHour("2026-12-07", 8, new Date("2026-12-07T08:00:00Z"))).toBe(true)
  })

  it("treats any earlier date as live and any later date as not live", () => {
    expect(isLiveFromHour("2026-10-15", 8, new Date("2026-10-16T01:00:00Z"))).toBe(true)
    expect(isLiveFromHour("2026-10-17", 8, new Date("2026-10-16T22:00:00Z"))).toBe(false)
  })
})

describe("londonHour", () => {
  it("reads the London wall clock", () => {
    expect(londonHour(new Date("2026-10-16T07:30:00Z"))).toBe(8)
    expect(londonHour(new Date("2026-12-07T07:30:00Z"))).toBe(7)
    expect(londonHour(new Date("2026-10-15T23:30:00Z"))).toBe(0)
  })
})

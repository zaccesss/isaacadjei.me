import { describe, it, expect } from "vitest"
import { hourName, longestRun, peakWindow, shareBetween, soundtrack, isCode } from "@/lib/stats-helpers"
import { placeOnMonths, placeOnWeeks } from "@/lib/stats-milestone-place"
import type { PublicStats } from "@/lib/public-stats"

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function stats(over: { codingHours?: number[]; weekdays?: number[]; plays?: number[]; playWeekdays?: number[]; gh?: { total30: number; total365: number } } = {}): PublicStats {
  const codingHours = over.codingHours ?? Array(24).fill(1)
  const plays = over.plays ?? Array(24).fill(10)
  const total = codingHours.reduce((a, b) => a + b, 0)
  return {
    coding: {
      totalHours: total,
      hourOfDay: codingHours.map((value, h) => ({ name: `${h}`, value })),
      weekdays: (over.weekdays ?? [1, 1, 1, 1, 1, 1, 1]).map((value, i) => ({ name: days[i], value })),
      languages: [],
    },
    music: { totalPlays: plays.reduce((a, b) => a + b, 0), plays30: 0, months: [], hours: plays, weekdays: (over.playWeekdays ?? [1, 1, 1, 1, 1, 1, 1]).map((value, i) => ({ name: days[i], value })) },
    github: { ...(over.gh ?? { total30: 0, total365: 0 }), months: [] },
  } as unknown as PublicStats
}

describe("helpers", () => {
  it("names hours the way people say them", () => {
    expect([0, 9, 12, 21].map(hourName)).toEqual(["midnight", "9am", "midday", "9pm"])
  })
  it("finds the longest run of consecutive days", () => {
    expect(longestRun(["2026-01-01", "2026-01-02", "2026-01-04", "2026-01-05", "2026-01-06"])).toEqual({ days: 3, end: "2026-01-06" })
    expect(longestRun([])).toBeNull()
  })
  it("wraps the peak window past midnight", () => {
    const h = Array(24).fill(0)
    h[23] = 5; h[0] = 5; h[1] = 5
    expect(peakWindow(h)).toMatchObject({ start: 23, end: 2, share: 1 })
    expect(shareBetween(h, 20, 4)).toBe(1)
  })
})

describe("programming languages only", () => {
  it("drops docs, config and tooling files and keeps code", () => {
    expect(["Markdown", "json", "Image (svg)", "Image (png)", "Git Config", "Plain text", "Graphviz (DOT)", "Makefile"].filter(isCode)).toEqual([])
    expect(["TypeScript", "Python", "Bash", "SQL", "HTML", "CSS", "Blade Template", "Vue"].every(isCode)).toBe(true)
  })
})

describe("soundtrack", () => {
  it("summarises the soundtrack only with enough of both", () => {
    expect(soundtrack(stats({ codingHours: Array(24).fill(0.1) })).summary).toBeNull()
    const h = Array(24).fill(1)
    h[21] = 30; h[22] = 30
    expect(soundtrack(stats({ codingHours: h, plays: h.map((x) => x * 20) })).summary).toBe("My coding peaks at 9pm and my listening at 9pm. Both run above their usual level from 9pm to 11pm.")
  })
  it("calls flat listening flat instead of naming a peak", () => {
    const flat = Array.from({ length: 24 }, (_, h) => 100 + (h % 3) * 10)
    const h = Array(24).fill(1)
    h[23] = 30
    expect(soundtrack(stats({ codingHours: h, plays: flat })).summary).toBe("My listening stays almost level all day, while my coding peaks at 11pm.")
  })
})

describe("milestone placement", () => {
  const ms = [
    { date: "2026-10-08", label: "A", detail: "a" },
    { date: "2026-10-13", label: "B", detail: "b" },
    { date: "2025-10-13", label: "Old", detail: "old" },
  ]
  it("groups launches in the same month and numbers them by date", () => {
    expect(placeOnMonths(ms, ["2026-09", "2026-10", "2026-11"])).toEqual([
      { index: 1, items: [{ ...ms[0], n: 1 }, { ...ms[1], n: 2 }] },
    ])
  })
  it("keeps a year old launch off this year's weeks", () => {
    const placed = placeOnWeeks(ms, ["09-28", "10-05", "10-12", "10-19"], new Date("2026-10-20T12:00:00Z"))
    expect(placed.map((p) => [p.index, p.items.map((x) => x.label)])).toEqual([[1, ["A"]], [2, ["B"]]])
  })
})

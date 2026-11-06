import { describe, it, expect } from "vitest"
import { cumulative, yearToDate, weekdayTotals, fourWeekChange, daysByAreas, writingExtra, weekdaySummary, listSummary, spreadSummary } from "@/components/stats/chart-data"

const week = (coding: number, plays = 0) => ({ coding, gaming: 0, plays, github: 0 })

describe("chart data", () => {
  it("adds a series up in order", () => {
    expect(cumulative([{ name: "a", value: 1.25 }, { name: "b", value: 2 }])).toEqual([{ name: "a", value: 1.3 }, { name: "b", value: 3.3 }])
  })
  it("counts hours from 1 January of the latest year only", () => {
    const rows = yearToDate([{ date: "2025-12-31", value: 9 }, { date: "2026-01-02", value: 2 }, { date: "2026-02-03", value: 3 }])
    expect(rows).toEqual([{ name: "2 Jan", value: 2 }, { name: "3 Feb", value: 5 }])
    expect(yearToDate([])).toEqual([])
  })
  it("sums a weekday by hour grid by day", () => {
    expect(weekdayTotals([{ day: 0, value: 1 }, { day: 0, value: 2 }, { day: 6, value: 4 }]).map((d) => d.value)).toEqual([3, 0, 0, 0, 0, 0, 4])
  })
  it("compares the last four weeks with the four before and skips a zero start", () => {
    const weeks = [...Array(4).fill(week(1, 0)), ...Array(4).fill(week(2, 5))]
    expect(fourWeekChange(weeks)).toEqual([{ name: "Coding", value: 100 }])
    expect(fourWeekChange(weeks.slice(0, 7))).toEqual([])
  })
  it("buckets days by how many areas were active", () => {
    expect(daysByAreas([{ value: 1 }, { value: 4 }, { value: 4 }, { value: 0 }]).map((d) => d.value)).toEqual([1, 0, 0, 2])
  })
  it("counts publishing weekdays and post lengths by kind", () => {
    const x = writingExtra([{ date: "2026-11-02", tags: [], type: "guide", readingTime: 5 }], [{ date: "2026-11-08", category: "x" }], [], [])
    expect(x.weekdays.map((d) => d.value)).toEqual([1, 0, 0, 0, 0, 0, 1])
    expect(x.lengthByKind).toEqual([{ name: "Guide", values: [5] }])
  })
})

describe("text alternatives", () => {
  it("never writes a comma before and or or, nor a long dash", () => {
    const lines = [
      weekdaySummary([{ name: "Mon", value: 3 }, { name: "Sun", value: 1 }], "hours"),
      listSummary([{ name: "Coding", value: 12 }, { name: "Gaming", value: -4 }], "", (v) => `${v}%`),
      spreadSummary([1, 5, 9], "hours", "days I coded"),
    ]
    expect(lines[0]).toBe("Most on Monday with 3 hours, least on Sunday with 1 hour.")
    expect(lines[1]).toBe("Coding: 12%. Gaming: -4%.")
    for (const l of lines) expect(l).not.toMatch(/, and |, or |[–—]/)
  })
})

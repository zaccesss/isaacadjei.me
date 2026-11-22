import { describe, it, expect } from "vitest"
import { cumulative, yearToDate, weekdayTotals, fourWeekChange, daysByAreas, writingExtra, weekdaySummary, listSummary, spreadSummary, rangeSummary, topSummary, boxSummary, gridSummary, calendarSummary, totalsSummary, treeTotals, monthName, weekName } from "@/components/stats/chart-data"
import { hoursTable, seriesTable, tableOf } from "@/components/analytics/chart-table"

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

describe("chart summaries and labels", () => {
  it("names the top of a ranking with no comma before and", () => {
    expect(topSummary([{ name: "C", value: 1 }, { name: "TypeScript", value: 9 }, { name: "Python", value: 4 }], "hours")).toBe("Most is TypeScript with 9 hours, then Python with 4 hours and C with 1 hour.")
    expect(topSummary([], "hours")).toBe("Nothing to show yet.")
  })
  it("gives the highest and lowest of a series", () => {
    expect(rangeSummary([{ name: "Jan 2026", value: 2 }, { name: "Feb 2026", value: 8 }], "posts")).toBe("Highest in Feb 2026 with 8 posts, lowest in Jan 2026 with 2 posts.")
  })
  it("adds each series up and trims an empty unit", () => {
    expect(totalsSummary([{ a: 1, b: 2 }, { a: 3, b: 0 }], [{ key: "a", name: "Notes" }, { key: "b", name: "Issues" }], "")).toBe("In total: Notes 4, Issues 2.")
  })
  it("reads box plots, grids and calendars in words", () => {
    expect(boxSummary([{ name: "Guide", values: [3, 5, 9] }], "minutes")).toBe("The middle value for each: Guide 5 minutes.")
    expect(gridSummary([{ day: 1, hour: 21, value: 4 }, { day: 0, hour: 9, value: 1 }], "plays")).toBe("Busiest on Tuesday at 21:00 with 4 plays.")
    expect(calendarSummary([{ date: "2026-11-03", value: 2 }, { date: "2026-11-04", value: 0 }], "hours")).toBe("1 active day. The busiest was 3 Nov 2026 with 2 hours.")
    expect(treeTotals([{ name: "Coding", children: [{ value: 2 }, { value: 3 }] }])).toEqual([{ name: "Coding", value: 5 }])
  })
  it("writes month and week keys the UK way", () => {
    expect(monthName("2026-09")).toBe("Sept 2026")
    expect(weekName("11-03")).toBe("3 Nov")
    expect(monthName("not a month")).toBe("not a month")
  })
  it("builds screen reader tables from the chart rows", () => {
    expect(tableOf([{ name: "Mon", value: 1200.5 }], ["Weekday", "Plays"])).toEqual({ columns: ["Weekday", "Plays"], rows: [["Mon", "1,200.5"]] })
    expect(seriesTable([{ name: "Nov", a: 1, b: 2 }], "Month", [{ key: "a", name: "A" }, { key: "b", name: "B" }])).toEqual({ columns: ["Month", "A", "B"], rows: [["Nov", "1", "2"]] })
    expect(hoursTable([0, 3], "Plays").rows).toEqual([["00:00", "0"], ["01:00", "3"]])
  })
})

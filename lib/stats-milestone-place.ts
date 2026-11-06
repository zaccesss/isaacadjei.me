export type Milestone = { date: string; label: string; detail: string }
export type PlacedMarker = { index: number; items: (Milestone & { n: number })[] }

const DAY = 86400000

function group(hits: { index: number; m: Milestone }[]): PlacedMarker[] {
  const sorted = [...hits].sort((a, b) => a.m.date.localeCompare(b.m.date))
  const out: PlacedMarker[] = []
  sorted.forEach(({ index, m }, i) => {
    const at = out.find((p) => p.index === index)
    const item = { ...m, n: i + 1 }
    if (at) at.items.push(item)
    else out.push({ index, items: [item] })
  })
  return out
}

export function placeOnMonths(milestones: Milestone[], months: string[]): PlacedMarker[] {
  return group(milestones.map((m) => ({ index: months.indexOf(m.date.slice(0, 7)), m })).filter((h) => h.index >= 0))
}

export function placeOnWeeks(milestones: Milestone[], weeks: string[], today = new Date()): PlacedMarker[] {
  const span = weeks.length * 7 * DAY
  return group(
    milestones
      .map((m) => {
        const d = new Date(`${m.date}T12:00:00Z`)
        const monday = new Date(d.getTime() - ((d.getUTCDay() + 6) % 7) * DAY).toISOString().slice(5, 10)
        const age = today.getTime() - d.getTime()
        return { index: age >= -DAY && age <= span ? weeks.indexOf(monday) : -1, m }
      })
      .filter((h) => h.index >= 0),
  )
}

export type IssueKind = "letter" | "outside" | "midweek"

export const RHYTHM_START = "2026-11-16"

const MIDWEEK_ANCHOR = "2026-11-11"

const LETTER_ANCHOR = "2026-11-13"

const DAY = 86_400_000

const utc = (date: string) => Date.parse(`${date}T00:00:00Z`)

export function slotKind(date: string): IssueKind | null {
  if (date < RHYTHM_START) return null
  const day = new Date(utc(date)).getUTCDay()
  const weeksFrom = (anchor: string) => Math.round((utc(date) - utc(anchor)) / (7 * DAY))
  if (day === 5) return weeksFrom(LETTER_ANCHOR) % 2 === 0 ? "letter" : null
  if (day !== 3) return null
  return weeksFrom(MIDWEEK_ANCHOR) % 2 === 0 ? "midweek" : "outside"
}

export function slotsBetween(from: string, to: string): { date: string; kind: IssueKind }[] {
  const slots: { date: string; kind: IssueKind }[] = []
  for (let t = utc(from < RHYTHM_START ? RHYTHM_START : from); t <= utc(to); t += DAY) {
    const date = new Date(t).toISOString().slice(0, 10)
    const kind = slotKind(date)
    if (kind) slots.push({ date, kind })
  }
  return slots
}

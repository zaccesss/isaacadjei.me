export type Named = { name: string; value: number }
export type RawPost = { date: string; tags: string[]; type: string; readingTime: number }
export type RawTIL = { date: string; category: string }
export type RawProject = { date: string; category: string; technologies: string[] }
export type RawDated = { date: string }

const count = (values: string[]): Named[] => {
  const m = new Map<string, number>()
  for (const v of values) m.set(v, (m.get(v) ?? 0) + 1)
  return [...m.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
}
const byMonth = (dates: string[]): Named[] => count(dates.map((d) => d.slice(0, 7))).sort((a, b) => a.name.localeCompare(b.name))

export function computeContentStats(
  posts: RawPost[],
  til: RawTIL[],
  projects: RawProject[],
  notes: RawDated[] = [],
  issues: RawDated[] = [],
) {
  const readingBuckets = ["1-3 min", "4-6 min", "7-10 min", "11+ min"]
  const reading = readingBuckets.map((name) => ({ name, value: 0 }))
  for (const p of posts) {
    const t = p.readingTime
    reading[t <= 3 ? 0 : t <= 6 ? 1 : t <= 10 ? 2 : 3].value++
  }
  const tags = count(posts.flatMap((p) => p.tags)).slice(0, 20)
  const techs = count(projects.flatMap((p) => p.technologies)).slice(0, 25)
  return {
    postCount: posts.length,
    tilCount: til.length,
    projectCount: projects.length,
    noteCount: notes.length,
    issueCount: issues.length,
    words: posts.reduce((s, p) => s + p.readingTime * 220, 0),
    postsByMonth: byMonth(posts.map((p) => p.date)),
    tilByMonth: byMonth(til.map((t) => t.date)),
    shortByMonth: (() => {
      const months = new Map<string, { name: string; notes: number; issues: number }>()
      for (const n of notes) {
        const m = n.date.slice(0, 7)
        months.set(m, { ...(months.get(m) ?? { name: m, notes: 0, issues: 0 }), notes: (months.get(m)?.notes ?? 0) + 1 })
      }
      for (const i of issues) {
        const m = i.date.slice(0, 7)
        months.set(m, { ...(months.get(m) ?? { name: m, notes: 0, issues: 0 }), issues: (months.get(m)?.issues ?? 0) + 1 })
      }
      return [...months.values()].sort((a, b) => a.name.localeCompare(b.name))
    })(),
    postTypes: count(posts.map((p) => p.type)),
    tilCategories: count(til.map((t) => t.category)),
    tags,
    reading,
    projectsByCategory: count(projects.map((p) => p.category)),
    techs,
  }
}

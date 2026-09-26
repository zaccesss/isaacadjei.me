import { getPublishedPosts } from "@/data/blog"
import { getPublishedTILEntries } from "@/data/til"
import { projects } from "@/data/projects"
import { books, videos, podcasts, articles, resources, others } from "@/data/consumed"

export type Named = { name: string; value: number }

const count = (values: string[]): Named[] => {
  const m = new Map<string, number>()
  for (const v of values) m.set(v, (m.get(v) ?? 0) + 1)
  return [...m.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
}
const byMonth = (dates: string[]): Named[] => count(dates.map((d) => d.slice(0, 7))).sort((a, b) => a.name.localeCompare(b.name))

export function getContentStats() {
  const posts = getPublishedPosts()
  const til = getPublishedTILEntries()
  const readingBuckets = ["1-3 min", "4-6 min", "7-10 min", "11+ min"]
  const reading = readingBuckets.map((name) => ({ name, value: 0 }))
  for (const p of posts) {
    const t = p.readingTime ?? 0
    reading[t <= 3 ? 0 : t <= 6 ? 1 : t <= 10 ? 2 : 3].value++
  }
  const tags = count(posts.flatMap((p) => p.tags)).slice(0, 20)
  const techs = count(projects.flatMap((p) => p.technologies)).slice(0, 25)
  return {
    postCount: posts.length,
    tilCount: til.length,
    projectCount: projects.length,
    words: posts.reduce((s, p) => s + (p.readingTime ?? 0) * 220, 0),
    postsByMonth: byMonth(posts.map((p) => p.date)),
    tilByMonth: byMonth(til.map((t) => t.date)),
    postTypes: count(posts.map((p) => p.type)),
    tilCategories: count(til.map((t) => t.category)),
    tags,
    reading,
    projectsByCategory: count(projects.map((p) => p.category)),
    techs,
    consumed: [
      { name: "Books", value: books.length },
      { name: "Videos", value: videos.length },
      { name: "Podcasts", value: podcasts.length },
      { name: "Articles", value: articles.length },
      { name: "Resources", value: resources.length },
      { name: "Other", value: others.length },
    ].filter((c) => c.value > 0),
  }
}

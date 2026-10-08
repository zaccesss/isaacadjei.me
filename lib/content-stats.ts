import { getPublishedPosts } from "@/data/blog"
import { getPublishedTILEntries } from "@/data/til"
import { projects } from "@/data/projects"
import { books, videos, podcasts, articles, resources, others, liveConsumed } from "@/data/consumed"
import { computeContentStats, type RawPost, type RawTIL, type RawProject } from "@/lib/content-stats-compute"

export type { Named, RawPost, RawTIL, RawProject } from "@/lib/content-stats-compute"
export { computeContentStats } from "@/lib/content-stats-compute"

export function getConsumedStats() {
  return [
    { name: "Books", value: liveConsumed(books).length },
    { name: "Videos", value: liveConsumed(videos).length },
    { name: "Podcasts", value: liveConsumed(podcasts).length },
    { name: "Articles", value: liveConsumed(articles).length },
    { name: "Resources", value: liveConsumed(resources).length },
    { name: "Other", value: liveConsumed(others).length },
  ].filter((c) => c.value > 0)
}

export function getRawContentItems(): { posts: RawPost[]; til: RawTIL[]; projects: RawProject[] } {
  return {
    posts: getPublishedPosts().map((p) => ({ date: p.date, tags: p.tags, type: p.type, readingTime: p.readingTime ?? 0 })),
    til: getPublishedTILEntries().map((t) => ({ date: t.date, category: t.category })),
    projects: projects.map((p) => ({ date: p.date, category: p.category, technologies: p.technologies })),
  }
}

export function getContentStats() {
  const { posts, til, projects: proj } = getRawContentItems()
  return { ...computeContentStats(posts, til, proj), consumed: getConsumedStats() }
}

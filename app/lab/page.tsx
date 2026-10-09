import type { Metadata } from "next"
import { Suspense } from "react"
import LabContent, { type LabData } from "./LabContent"
import { posts, getPublishedPosts } from "@/data/blog"
import { getPublishedTILEntries } from "@/data/til"

export const metadata: Metadata = {
  title: "Lab",
  description: "An interactive terminal explorer. Run commands to browse posts, TIL entries, publications and live stats. Try typing help.",
  alternates: { canonical: "https://www.isaacadjei.me/lab" },
  openGraph: {
    images: ["/api/og?title=Lab%20%7C%20Isaac%20Adjei&description=An%20interactive%20terminal%20explorer.%20Try%20typing%20help."],
  },
}

function labData(): LabData {
  const live = getPublishedPosts()
  const tils = getPublishedTILEntries().sort((a, b) => b.date.localeCompare(a.date))
  return {
    posts: live.map((p) => ({ slug: p.slug, tags: p.tags })),
    latestTils: tils.slice(0, 5).map((e) => ({ title: e.title, category: e.category, date: e.date })),
    tilCount: tils.length,
  }
}

export const revalidate = 604800

export default function LabPage() {
  return (
    <Suspense>
      <LabContent data={labData()} />
    </Suspense>
  )
}

import type { Metadata } from "next"
import { feedAlternates } from "@/lib/feeds"
import { Suspense } from "react"
import BlogContent from "./BlogContent"
import { getPublishedPosts, toCard } from "@/data/blog"

export const revalidate = 21600

export const metadata: Metadata = {
  title: "Blog",
  description: "Writing on embedded systems, software engineering, electronics, computer science and life. Tutorials, journals, research notes and personal essays.",
  alternates: { canonical: "https://www.isaacadjei.me/blog", types: feedAlternates("blog", "all") },
  openGraph: {
    images: ["/api/og?title=Blog%20%7C%20Isaac%20Adjei&description=Writing%20on%20embedded%20systems%2C%20software%20engineering%2C%20electronics%20and%20life."],
  },
}

export default function BlogPage() {
  return (
    <Suspense>
      <BlogContent posts={getPublishedPosts().map(toCard)} />
    </Suspense>
  )
}

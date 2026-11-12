import type { Metadata } from "next"
import { feedAlternates } from "@/lib/content/feeds"
import { Suspense } from "react"
import BlogContent from "../BlogContent"
import { getArchivedPosts, toCard } from "@/data/blog"

export const revalidate = 604800

export const metadata: Metadata = {
  title: "Blog archive",
  description: "Older posts from the blog, kept at their original addresses.",
  alternates: { canonical: "https://isaacadjei.me/blog/archive", types: feedAlternates("blog", "all") },
  openGraph: {
    images: ["/api/og?title=Blog%20archive%20%7C%20Isaac%20Adjei&description=Older%20posts%20from%20the%20blog%2C%20kept%20at%20their%20original%20addresses."],
  },
}

export default function BlogArchivePage() {
  const archived = getArchivedPosts().map(toCard)
  return (
    <Suspense>
      <BlogContent posts={archived} view="archive" archiveCount={archived.length} />
    </Suspense>
  )
}

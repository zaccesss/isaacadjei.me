import type { Metadata } from "next"
import Hero from "@/components/sections/Hero"
import AboutPreview from "@/components/sections/AboutPreview"
import FeaturedProjects from "@/components/sections/FeaturedProjects"
import FeaturedBlogPosts from "@/components/sections/FeaturedBlogPosts"
import FeaturedNewsletterIssues from "@/components/sections/FeaturedNewsletterIssues"
import FeaturedTIL from "@/components/sections/FeaturedTIL"
import FeaturedNotes from "@/components/sections/FeaturedNotes"
import SkillsOverview from "@/components/sections/SkillsOverview"
import ContactCTA from "@/components/sections/ContactCTA"
import SectionErrorBoundary from "@/components/shared/SectionErrorBoundary"
import { getPublishedPosts, toCard } from "@/data/blog"
import { getPublishedTILEntries } from "@/data/til"
import { getPublishedNotes } from "@/data/notes"

export const revalidate = 604800

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.isaacadjei.me",
  },
  openGraph: {
    images: ["/api/og?title=Isaac%20Adjei&description=Electronic%20Engineering%20%26%20Computer%20Science%20Student%20at%20Aston%20University."],
  },
}

export default function Home() {
  const featuredPosts = getPublishedPosts().map((p) => toCard({ ...p, readingTime: p.readingTime ?? 0 }))
  const latestTils = getPublishedTILEntries()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)
  const latestNotes = getPublishedNotes()
    .slice(0, 3)
    .map(({ slug, title, date, description, tags }) => ({ slug, title, date, description, tags }))
  return (
    <>
      <Hero />
      <AboutPreview />
      <FeaturedProjects />
      <FeaturedBlogPosts posts={featuredPosts} />
      <SectionErrorBoundary><FeaturedNewsletterIssues /></SectionErrorBoundary>
      <FeaturedTIL entries={latestTils} />
      <FeaturedNotes notes={latestNotes} />
      <SkillsOverview />
      <ContactCTA />
    </>
  )
}

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
import { getMainListPosts, toCard } from "@/data/blog"
import { getPublishedTILEntries } from "@/data/til"
import { getPublishedNotes } from "@/data/notes"

export const revalidate = 604800

export const metadata: Metadata = {
  alternates: {
    canonical: "https://isaacadjei.me",
  },
  openGraph: {
    images: ["/api/og?title=Isaac%20Adjei&description=Electronic%20Engineering%20and%20Computer%20Science%20student%20building%20full-stack%20software%2C%20embedded%20systems%2C%20AI%2FML%20and%20data%20science%2E"],
  },
}

export default function Home() {
  const featuredPosts = getMainListPosts().map((p) => toCard({ ...p, readingTime: p.readingTime ?? 0 }))
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

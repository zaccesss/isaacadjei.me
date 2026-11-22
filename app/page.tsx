import type { Metadata } from "next"
import Hero from "@/components/sections/Hero"
import AboutPreview from "@/components/sections/AboutPreview"
import FeaturedProjects from "@/components/sections/FeaturedProjects"
import WritingList from "@/components/sections/WritingList"
import ContactCTA from "@/components/sections/ContactCTA"

export const revalidate = 604800

export const metadata: Metadata = {
  alternates: {
    canonical: "https://isaacadjei.me",
  },
  openGraph: {
    images: ["/api/og?title=Isaac%20Adjei&description=Electronic%20Engineering%20and%20Computer%20Science%20student%20building%20circuit%20boards%2C%20firmware%2C%20software%20and%20AI%2FML%2E"],
  },
}

export default function Home() {
  return (
    <>
      <Hero />
      <AboutPreview />
      <FeaturedProjects />
      <WritingList />
      <ContactCTA />
    </>
  )
}

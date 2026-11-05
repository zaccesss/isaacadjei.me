import type { Metadata } from "next"
import Link from "next/link"
import { Download, ArrowRight } from "lucide-react"
import { experiences, isExperienceVisible, type Experience } from "@/data/experience"
import ExperienceTimeline from "@/components/sections/ExperienceTimeline"
import { Button } from "@/components/ui/button"

export const revalidate = 86400

export const metadata: Metadata = {
  title: "Experience",
  description: "My work experience, leadership roles, ventures and volunteering.",
  alternates: {
    canonical: "https://www.isaacadjei.me/experience",
  },
  openGraph: {
    images: ["/api/og?title=Experience&description=My%20work%20experience%2C%20leadership%20roles%2C%20ventures%20and%20volunteering%2E"],
  },
}

const leadershipIds = ["aston-school-rep", "aston-student-rep", "ces-treasurer"]
const volunteeringIds = ["targetjobs-judge", "cancer-research-volunteer"]

function inOrder(ids: string[], list: Experience[]) {
  return ids.flatMap((id) => list.filter((exp) => exp.id === id))
}

export default function ExperiencePage() {
  const visible = experiences.filter(isExperienceVisible)
  const named = new Set([...leadershipIds, ...volunteeringIds])
  const ventures = visible.filter((exp) => exp.group === "founder")
  const work = visible.filter((exp) => !named.has(exp.id) && exp.group !== "founder")
  const leadership = inOrder(leadershipIds, visible)
  const volunteering = inOrder(volunteeringIds, visible)

  const sections = [
    { title: "Work Experience", items: work },
    { title: "Leadership and Representation", items: leadership },
    { title: "Ventures", items: ventures },
    { title: "Volunteering", items: volunteering },
  ]

  return (
    <div className="container max-w-3xl py-24 space-y-10">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Experience</h1>
        <p className="text-lg text-muted-foreground">
          Work, leadership roles, the ventures I founded and volunteering.
        </p>
      </div>
      {sections
        .filter((section) => section.items.length > 0)
        .map((section) => (
          <div key={section.title} className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">{section.title}</h2>
            <ExperienceTimeline experiences={section.items} />
          </div>
        ))}

      <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center">
        <Button
          asChild
          size="lg"
          className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
        >
          <a href="/api/cv-pdf">
            <Download className="mr-2 h-4 w-4" />
            Download CV
          </a>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/projects">
            View My Work
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild size="lg">
          <Link href="/contact">
            Get in touch
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

import type { Metadata } from "next"
import { projects } from "@/data/projects"
import ProjectGrid from "@/components/projects/ProjectGrid"

const CATEGORY_NAMES: Record<string, string> = {
  embedded: "embedded systems",
  hardware: "hardware",
  iot: "IoT",
  web: "web",
  software: "software",
  cybersecurity: "cybersecurity",
  academic: "academic",
  other: "other",
}

function categoryList(): string {
  const present = new Set(projects.map((p) => p.category))
  const names = Object.keys(CATEGORY_NAMES).filter((c) => present.has(c as (typeof projects)[number]["category"])).map((c) => CATEGORY_NAMES[c])
  return names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names.at(-1)}` : (names[0] ?? "")
}

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A collection of my engineering projects, from embedded systems and hardware to web applications.",
  alternates: {
    canonical: "https://www.isaacadjei.me/projects",
  },
  openGraph: {
    images: ["/api/og?title=Projects&description=A%20collection%20of%20my%20engineering%20projects%20-%20from%20embedded%20systems%20to%20web%20applications%2E"],
  },
}

export default function ProjectsPage() {
  return (
    <div className="container py-24 space-y-10">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h1 className="text-4xl font-bold tracking-tight">Projects</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Things I&apos;ve built across {categoryList()} projects.
        </p>
      </div>
      <ProjectGrid projects={projects} />

      <p className="text-sm text-muted-foreground text-center pt-4">
        More projects and courses available on{" "}
        <a
          href="https://github.com/zaccesss"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          GitHub
        </a>{" "}
        and{" "}
        <a
          href="https://github.com/zaccesss?tab=projects"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          GitHub Projects
        </a>
        .
      </p>
    </div>
  )
}

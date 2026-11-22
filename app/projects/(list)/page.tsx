import type { Metadata } from "next"
import { projects } from "@/data/projects"
import ProjectGrid from "@/components/projects/ProjectGrid"
import PageHeader from "@/components/layout/PageHeader"

export const metadata: Metadata = {
  title: "Projects",
  description:
    "My hardware, software and accessibility projects: embedded circuits, web apps, a tool that records and undoes what AI agents do and an accessible document reader.",
  alternates: {
    canonical: "https://isaacadjei.me/projects",
  },
  openGraph: {
    images: ["/api/og?title=Projects&description=My%20engineering%20projects%20across%20hardware%2C%20software%20and%20accessibility%20tools%2E"],
  },
}

export default function ProjectsPage() {
  return (
    <div className="container py-24 space-y-10">
      <PageHeader
        title="Projects"
        description={
          <>
            Hardware, firmware and software I have built, with photos, code and write-ups.
          </>
        }
      />
      <ProjectGrid projects={projects} />

      <p className="text-sm text-muted-foreground text-center pt-4">
        More projects and courses available on{" "}
        <a
          href="https://github.com/zaccesss"
          target="_blank"
          rel="noopener noreferrer"
          className="body-link font-medium"
        >
          GitHub
        </a>{" "}
        and{" "}
        <a
          href="https://github.com/zaccesss?tab=projects"
          target="_blank"
          rel="noopener noreferrer"
          className="body-link font-medium"
        >
          GitHub Projects
        </a>
        .
      </p>
    </div>
  )
}

import { Section, SectionHeading } from "@/components/layout/Section"
import { projects } from "@/data/projects"
import type { Project } from "@/data/projects"
import ProjectCard from "@/components/projects/ProjectCard"

const FEATURED_ORDER = ["zacess", "phaemos", "led-cube", "audio-amplifier", "vitafolio", "lidarsat"]

export default function FeaturedProjects() {
  const featured = FEATURED_ORDER.map((id) => projects.find((p) => p.id === id)).filter((p): p is Project => p !== undefined)

  return (
    <Section labelledBy="projects">
      <SectionHeading id="projects" title="Projects" href="/projects" linkLabel="All projects" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {featured.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </Section>
  )
}

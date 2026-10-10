import Link from "next/link"
import Image from "@/components/shared/MediaImage"
import { ExternalLink, Globe } from "lucide-react"
import { FaGithub as Github } from "react-icons/fa6"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CATEGORY_LABELS, type Project } from "@/data/projects"
import StatusBadge from "./StatusBadge"
import { CHIP_CLASS, projectCategoryLabelClass } from "@/components/shared/Tag"
import ThemedCover from "@/components/shared/ThemedCover"

interface Props {
  project: Project
  priority?: boolean
}

export default function ProjectCard({ project, priority = false }: Props) {
  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      {(project.cover ?? project.images[0]) && (
        <Link href={`/projects/${project.id}`} className="block overflow-hidden rounded-t-lg">
          <div className="relative h-48 w-full bg-muted">
            <ThemedCover
              src={project.cover ?? project.images[0]}
              darkSrc={project.coverDark}
              alt={project.title}
              fill
              priority={priority}
              sizes="(max-width: 640px) 250px, (max-width: 1024px) 50vw, 33vw"
              className="object-cover sm:transition-transform sm:duration-300 sm:hover:scale-105"
            />
          </div>
        </Link>
      )}
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={projectCategoryLabelClass(project.category)}>{CATEGORY_LABELS[project.category] ?? project.category}</span>
            {project.status ? (
              <StatusBadge status={project.status} className="text-xs" />
            ) : project.ongoing && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" aria-hidden="true" />
                Ongoing
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground shrink-0">{project.date}</span>
        </div>
        <div>
          <CardTitle className="text-xl">
            <Link href={`/projects/${project.id}`} className="hover:text-primary transition-colors">
              {project.title}
            </Link>
          </CardTitle>
          <CardDescription className="mt-2">{project.description}</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 5).map((tech) => (
            <span key={tech} className={CHIP_CLASS}>
              {tech}
            </span>
          ))}
          {project.technologies.length > 5 && (
            <span className={CHIP_CLASS}>
              +{project.technologies.length - 5}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        <Button asChild variant="ghost" size="sm" className="pl-0">
          <Link href={`/projects/${project.id}`}>View details</Link>
        </Button>
        {project.github && (
          <Button asChild variant="ghost" size="icon">
            <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github className="h-4 w-4" />
            </a>
          </Button>
        )}
        {project.website && (
          <Button asChild variant="ghost" size="icon">
            <a href={project.website} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} website`}>
              <Globe className="h-4 w-4" />
            </a>
          </Button>
        )}
        {project.demo && (
          <Button asChild variant="ghost" size="icon">
            <a href={project.demo} target="_blank" rel="noopener noreferrer" aria-label="Live demo">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

import type { Project } from "@/data/projects"

const LABELS: Record<NonNullable<Project["status"]>, string> = {
  live: "Live",
  "in-progress": "In progress",
  completed: "Completed",
  archived: "Archived",
  research: "Research",
}

const DOTS: Record<NonNullable<Project["status"]>, string> = {
  live: "bg-green-500",
  "in-progress": "bg-sky-500",
  completed: "bg-violet-500",
  archived: "bg-zinc-400",
  research: "bg-amber-500",
}

export default function StatusBadge({ status, className = "" }: { status: NonNullable<Project["status"]>; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${DOTS[status]}`} aria-hidden="true" />
      {LABELS[status]}
    </span>
  )
}

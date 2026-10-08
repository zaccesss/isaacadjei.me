import type { ResearchStatus } from "@/data/respub/research"

const LABELS: Record<ResearchStatus, string> = {
  simulation: "In simulation",
  hardware: "Hardware phase",
  live: "Live",
}

const DOTS: Record<ResearchStatus, string> = {
  simulation: "bg-amber-500",
  hardware: "bg-sky-500",
  live: "bg-green-500",
}

export default function ResearchStatusBadge({ status }: { status: ResearchStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
      <span className={`h-1.5 w-1.5 rounded-full ${DOTS[status]}`} aria-hidden="true" />
      <span className="sr-only">Status: </span>
      {LABELS[status]}
    </span>
  )
}

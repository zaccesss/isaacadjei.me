import Link from "next/link"
import { ExternalLink, FileText } from "lucide-react"
import { type ResourceEntry } from "@/data/consumed/types"
import { consumedSlug, normTag } from "@/lib/tags"
import { TAG_LINK_CLASS } from "@/components/shared/Tag"
import { ConsumedImage, SiteIcon } from "./ConsumedImage"
import { LedTo } from "./LedTo"

export function ResourceCard({ resource }: { resource: ResourceEntry }) {
  const slug = consumedSlug(resource.title)
  const subpageHref = `/consumed/resources/${slug}`
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card hover:border-border transition-colors">
      <Link href={subpageHref} tabIndex={-1} aria-hidden="true">
        <ConsumedImage src={resource.image} alt={resource.title} kind="preview" sourceUrl={resource.url} />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5 flex-1 min-w-0">
          <Link
            href={subpageHref}
            className="text-sm font-semibold text-foreground leading-snug hover:text-primary transition-colors line-clamp-1 block"
          >
            {resource.title}
          </Link>
          <p className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><SiteIcon url={resource.url} size={14} /><span className="truncate">{resource.url.replace(/^https?:\/\//, "")}</span></p>
        </div>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${resource.title}`}
          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors mt-0.5"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed flex-1">{resource.description}</p>
      <LedTo links={resource.ledTo} />
      <div className="flex items-center gap-2">
        <Link
          href={`/tags/${normTag(resource.category)}`}
          className={TAG_LINK_CLASS}
        >
          {resource.category}
        </Link>
        <span className="inline-flex items-center text-xs font-medium text-muted-foreground">
          {resource.month.slice(0, 3)}
        </span>
        <Link
          href={subpageHref}
          className="ml-auto inline-flex items-center gap-1 text-[10px] text-primary hover:underline underline-offset-2"
        >
          <FileText className="h-3 w-3" />
          Notes
        </Link>
      </div>
      </div>
    </div>
  )
}

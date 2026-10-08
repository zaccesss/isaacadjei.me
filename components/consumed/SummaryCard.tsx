import Link from "next/link"
import type { ConsumedSummary } from "@/data/consumed/summary"
import { LABEL_CLASS } from "@/components/shared/Tag"
import { ConsumedImage, SiteIcon } from "./ConsumedImage"
import { LedTo } from "./LedTo"

const LABEL: Record<ConsumedSummary["category"], string> = {
  books: "Book", videos: "Video", podcasts: "Podcast", articles: "Article", resources: "Resource", others: "Other",
}

export function SummaryCard({ item }: { item: ConsumedSummary }) {
  const kind = item.imageKind ?? (item.category === "books" ? "cover" : item.category === "videos" ? "thumb" : "preview")
  return (
    <article className="flex gap-3 rounded-xl border border-border/60 bg-card p-3 hover:border-border transition-colors">
      <Link href={item.href} tabIndex={-1} aria-hidden="true" className={kind === "cover" ? "w-16 shrink-0" : "w-28 shrink-0"}>
        <ConsumedImage src={item.image} alt={item.title} kind={kind} sourceUrl={item.sourceUrl} className="rounded-md" />
      </Link>
      <div className="min-w-0 flex-1 space-y-1">
        <p className={LABEL_CLASS}>{LABEL[item.category]}</p>
        <Link
          href={item.href}
          className="block text-sm font-semibold leading-snug text-foreground hover:text-primary transition-colors line-clamp-2"
        >
          {item.title}
        </Link>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {item.sourceUrl && <SiteIcon url={item.sourceUrl} size={14} />}
          <span className="truncate">{item.byline}</span>
        </p>
        <LedTo links={item.ledTo} />
      </div>
    </article>
  )
}

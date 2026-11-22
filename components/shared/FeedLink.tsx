import { Rss } from "lucide-react"

export default function FeedLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="inline-flex min-h-11 items-center gap-1.5 text-base font-medium text-primary underline-offset-4 hover:underline"
    >
      <Rss className="h-5 w-5 shrink-0" aria-hidden="true" />
      Feed
    </a>
  )
}

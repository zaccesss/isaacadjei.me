import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import PageHeader from "@/components/layout/PageHeader"

export function StatsPageHeader({ title, description, children }: { title: string; description: string; children?: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <Link href="/stats" className="inline-flex min-h-11 items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft aria-hidden className="h-3.5 w-3.5" />
        Back to Stats
      </Link>
      <PageHeader title={title} description={description}>{children}</PageHeader>
    </div>
  )
}

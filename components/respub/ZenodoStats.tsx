import { BarChart3 } from "lucide-react"

interface ZenodoRecordStats {
  views: number
  downloads: number
  unique_views?: number
  unique_downloads?: number
}

async function fetchStats(recordId: string): Promise<ZenodoRecordStats | null> {
  try {
    const res = await fetch(`https://zenodo.org/api/records/${recordId}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return null
    const data = (await res.json()) as { stats?: Partial<ZenodoRecordStats> }
    const stats = data.stats
    if (!stats || typeof stats.views !== "number" || typeof stats.downloads !== "number") return null
    return stats as ZenodoRecordStats
  } catch {
    return null
  }
}

export default async function ZenodoStats({ recordId }: { recordId: string }) {
  const stats = await fetchStats(recordId)
  if (!stats) return null

  const fmt = new Intl.NumberFormat("en-GB")
  return (
    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <BarChart3 className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>
        <span className="font-medium text-foreground">{fmt.format(stats.views)}</span> views and{" "}
        <span className="font-medium text-foreground">{fmt.format(stats.downloads)}</span> downloads on Zenodo
      </span>
    </p>
  )
}

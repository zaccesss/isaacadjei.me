import { BarChart3 } from "lucide-react"
import { zenodoStats } from "@/lib/integrations/zenodo"

export default async function ZenodoStats({ recordId }: { recordId: string }) {
  const stats = await zenodoStats(recordId)
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

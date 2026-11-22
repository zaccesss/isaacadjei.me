import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type Figure = { label: string; value: React.ReactNode; sub?: string }

export function Figures({ label, items, className }: { label: string; items: Figure[]; className?: string }) {
  return (
    <Card className={cn("p-4", className)}>
      <dl aria-label={label} className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
        {items.map((it) => (
          <div key={it.label} className="min-w-0">
            <dt className="text-xs text-muted-foreground">{it.label}</dt>
            <dd className="mt-0.5 break-words text-lg font-semibold tabular-nums">{it.value}</dd>
            {it.sub && <dd className="text-xs text-muted-foreground">{it.sub}</dd>}
          </div>
        ))}
      </dl>
    </Card>
  )
}

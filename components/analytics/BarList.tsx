import EmptyState from "@/components/shared/EmptyState"
import { CHART_NEUTRAL, chartVar } from "@/lib/ui/chart-palette"
import { cn } from "@/lib/utils"

export type BarListItem = { name: string; value: number; colour?: string }
export type TreeNode = { name: string; value?: number; children?: TreeNode[] }

const ACCENT = chartVar("chart-1")
const plain = (v: number) => v.toLocaleString("en-GB", { maximumFractionDigits: 1 })
const percent = (part: number, whole: number) => (whole > 0 ? `${Math.round((part / whole) * 1000) / 10}%` : "0%")

type Row = { name: string; value: number; colour?: string; child?: boolean; share?: string }

function Rows({ rows, max, format, className }: { rows: Row[]; max: number; format: (v: number) => string; className?: string }) {
  return (
    <ul className={cn("space-y-2.5", className)}>
      {rows.map((r, i) => (
        <li key={`${r.name}-${i}`} className={r.child ? "pl-4" : undefined}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className={cn("min-w-0 break-words", r.child ? "text-muted-foreground" : "font-medium")}>{r.name}</span>
            <span className="shrink-0 tabular-nums text-muted-foreground">
              {format(r.value)}
              {r.share && <span className="ml-1.5">({r.share})</span>}
            </span>
          </div>
          <div className="mt-1 h-2 rounded-sm bg-muted" aria-hidden>
            <div
              className="h-full rounded-sm"
              style={{ width: `${max > 0 ? Math.max((Math.max(r.value, 0) / max) * 100, r.value > 0 ? 1 : 0) : 0}%`, backgroundColor: r.colour ?? (r.child ? CHART_NEUTRAL : ACCENT) }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

export function BarList({
  data,
  valueFormatter,
  share = false,
  sort = true,
  limit,
  max: scaleMax,
  emptyTitle = "Nothing to show yet",
  emptyDescription,
  className,
}: {
  data: BarListItem[]
  valueFormatter?: (value: number) => string
  share?: boolean
  sort?: boolean
  limit?: number
  max?: number
  emptyTitle?: string
  emptyDescription?: React.ReactNode
  className?: string
}) {
  const valid = data.filter((d) => Number.isFinite(d.value))
  const ordered = sort ? [...valid].sort((a, b) => b.value - a.value) : valid
  const shown = limit ? ordered.slice(0, limit) : ordered
  const total = valid.reduce((s, d) => s + Math.max(d.value, 0), 0)
  const max = Math.max(0, ...shown.map((d) => d.value))
  if (!shown.length || max <= 0) return <EmptyState title={emptyTitle} description={emptyDescription} />
  const rows = shown.map((d) => ({ ...d, share: share ? percent(d.value, total) : undefined }))
  return <Rows rows={rows} max={scaleMax ?? max} format={valueFormatter ?? plain} className={className} />
}

export function HierarchyBars({
  data,
  valueFormatter,
  share = false,
  childLimit,
  emptyTitle = "Nothing to show yet",
  emptyDescription,
}: {
  data: TreeNode[]
  valueFormatter?: (value: number) => string
  share?: boolean
  childLimit?: number
  emptyTitle?: string
  emptyDescription?: React.ReactNode
}) {
  const sum = (n: TreeNode): number => (n.children?.length ? n.children.reduce((s, c) => s + sum(c), 0) : Math.max(n.value ?? 0, 0))
  const groups = data
    .map((g) => ({ name: g.name, value: sum(g), children: (g.children ?? []).map((c) => ({ name: c.name, value: sum(c) })).filter((c) => c.value > 0).sort((a, b) => b.value - a.value) }))
    .filter((g) => g.value > 0)
    .sort((a, b) => b.value - a.value)
  const total = groups.reduce((s, g) => s + g.value, 0)
  if (!groups.length) return <EmptyState title={emptyTitle} description={emptyDescription} />
  const rows: Row[] = groups.flatMap((g) => [
    { name: g.name, value: g.value, share: share ? percent(g.value, total) : undefined },
    ...(childLimit ? g.children.slice(0, childLimit) : g.children).map((c) => ({ ...c, child: true, share: share ? percent(c.value, g.value) : undefined })),
  ])
  return <Rows rows={rows} max={groups[0].value} format={valueFormatter ?? plain} />
}

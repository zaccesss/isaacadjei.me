import EmptyState from "@/components/shared/EmptyState"
import SectionErrorBoundary from "@/components/shared/SectionErrorBoundary"
import { cn } from "@/lib/utils"

export type ChartTable = { columns: string[]; rows: (string | number)[][] }

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

export default function ChartFrame({
  title,
  unit,
  summary,
  table,
  empty,
  emptyTitle = "Nothing to show yet",
  emptyDescription,
  actions,
  id,
  className,
  children,
}: {
  title: string
  unit?: string
  summary?: React.ReactNode
  table?: ChartTable
  empty?: boolean
  emptyTitle?: string
  emptyDescription?: React.ReactNode
  actions?: React.ReactNode
  id?: string
  className?: string
  children: React.ReactNode
}) {
  const captionId = `chart-${id ?? slug(title)}`
  return (
    <figure aria-labelledby={captionId} className={cn("min-w-0 space-y-3", className)}>
      <figcaption id={captionId} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="text-base font-semibold">
          {title}
          {unit && <span className="ml-2 text-sm font-normal text-muted-foreground">({unit})</span>}
        </span>
        {actions}
      </figcaption>
      {summary && <p className="text-sm leading-relaxed text-muted-foreground">{summary}</p>}
      {empty ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <SectionErrorBoundary>
          <div>{children}</div>
        </SectionErrorBoundary>
      )}
      {table && !empty && (
        <div className="sr-only">
          <table>
            <caption>{title}{unit ? ` (${unit})` : ""}</caption>
            <thead>
              <tr>{table.columns.map((c) => <th key={c} scope="col">{c}</th>)}</tr>
            </thead>
            <tbody>
              {table.rows.map((r, i) => (
                <tr key={i}>{r.map((v, j) => (j === 0 ? <th key={j} scope="row">{v}</th> : <td key={j}>{v}</td>))}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </figure>
  )
}

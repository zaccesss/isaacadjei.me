import { cn } from "@/lib/utils"

export default function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string
  description?: React.ReactNode
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("rounded-lg border border-dashed px-6 py-10 text-center", className)}>
      <p className="text-base font-medium">{title}</p>
      {description && <p className="mx-auto mt-2 max-w-[48ch] text-sm leading-relaxed text-muted-foreground">{description}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  )
}

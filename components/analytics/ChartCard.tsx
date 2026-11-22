import type { ComponentProps } from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import ChartFrame from "./ChartFrame"

export function ChartCard({ wide, className, ...frame }: ComponentProps<typeof ChartFrame> & { wide?: boolean }) {
  return (
    <Card className={cn("min-w-0 p-4", wide && "lg:col-span-2", className)}>
      <ChartFrame {...frame} />
    </Card>
  )
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

export function ChartSection({ title, description, children, columns = 2 }: { title: string; description?: React.ReactNode; children: React.ReactNode; columns?: 1 | 2 }) {
  const id = `section-${slug(title)}`
  return (
    <section aria-labelledby={id} className="space-y-3">
      <div className="space-y-1">
        <h2 id={id} className="text-lg font-semibold">{title}</h2>
        {description && <p className="max-w-[70ch] text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className={cn("grid grid-cols-1 gap-4", columns === 2 && "lg:grid-cols-2")}>{children}</div>
    </section>
  )
}

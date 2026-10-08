import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { LedToLink } from "@/data/consumed/types"
import { cn } from "@/lib/utils"

export function LedTo({ links, className, size = "sm" }: { links?: LedToLink[]; className?: string; size?: "sm" | "base" }) {
  if (!links || links.length === 0) return null
  return (
    <p className={cn("flex flex-wrap items-center gap-x-1.5 gap-y-1 text-muted-foreground", size === "sm" ? "text-xs" : "text-sm", className)}>
      <ArrowRight className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} aria-hidden="true" />
      <span className="font-medium text-foreground/80">Led to:</span>
      {links.map((l, i) => (
        <span key={l.href}>
          <Link href={l.href} className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors">
            {l.label}
          </Link>
          {i < links.length - 1 && <span aria-hidden="true">,</span>}
        </span>
      ))}
    </p>
  )
}

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ArrowLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={cn("group/arrow body-link relative inline-flex items-center gap-1.5 text-base font-medium after:absolute after:-inset-3 after:content-['']", className)}
    >
      {children}
      <ArrowRight className="h-4 w-4 shrink-0 motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover/arrow:translate-x-0.5" aria-hidden="true" />
    </Link>
  )
}

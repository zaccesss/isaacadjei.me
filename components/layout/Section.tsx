import ArrowLink from "@/components/shared/ArrowLink"
import { cn } from "@/lib/utils"

export function Section({ children, className, labelledBy }: { children: React.ReactNode; className?: string; labelledBy?: string }) {
  return (
    <section aria-labelledby={labelledBy} className={cn("border-t py-12 sm:py-16", className)}>
      <div className="mx-auto w-full max-w-5xl px-6 sm:px-8">{children}</div>
    </section>
  )
}

export function SectionHeading({ id, title, href, linkLabel }: { id: string; title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
      <h2 id={id} className="text-2xl font-semibold tracking-tight sm:text-[1.75rem]">
        {title}
      </h2>
      {href && linkLabel && (
        <ArrowLink href={href}>{linkLabel}</ArrowLink>
      )}
    </div>
  )
}

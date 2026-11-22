import { cn } from "@/lib/utils"

export default function PageHeader({
  title,
  description,
  actions,
  align = "start",
  children,
  className,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  align?: "start" | "center"
  children?: React.ReactNode
  className?: string
}) {
  return (
    <header className={cn("space-y-4", align === "center" && "text-center", className)}>
      <div className={cn("flex flex-wrap items-center gap-x-6 gap-y-2", align === "center" ? "justify-center" : "justify-between")}>
        <h1 className="text-[2rem] font-bold leading-tight tracking-tight sm:text-[2.5rem]">{title}</h1>
        {actions && <div className="flex flex-wrap items-center gap-x-6">{actions}</div>}
      </div>
      {description && <div className={cn("max-w-[68ch] text-pretty text-lg leading-relaxed text-muted-foreground", align === "center" && "mx-auto")}>{description}</div>}
      {children}
    </header>
  )
}

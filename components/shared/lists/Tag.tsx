import Link from "next/link"
import { cn } from "@/lib/utils"

export const TAG_CLASS =
  "inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium leading-5 text-foreground/80 before:mr-0.5 before:text-muted-foreground before:content-['#']"

export const CHIP_CLASS = "inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium leading-5 text-foreground/80"

export const LABEL_BASE = "inline-flex items-center text-sm font-medium"
export const LABEL_CLASS = `${LABEL_BASE} text-muted-foreground`

export const postTypeLabelClass = (_type: string) => LABEL_CLASS
export const projectCategoryLabelClass = (_category: string) => LABEL_CLASS
export const tilCategoryLabelClass = (_category: string) => LABEL_CLASS

export const TAG_LINK_CLASS = cn(
  TAG_CLASS,
  "relative transition-colors hover:bg-primary/10 hover:text-primary hover:underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary after:absolute after:-inset-x-1 after:-inset-y-2.5 after:content-['']",
)

interface TagProps {
  children: React.ReactNode
  href?: string
  className?: string
  title?: string
}

export default function Tag({ children, href, className, title }: TagProps) {
  if (href) {
    return (
      <Link href={href} title={title} className={cn(TAG_LINK_CLASS, className)}>
        {children}
      </Link>
    )
  }
  return (
    <span title={title} className={cn(TAG_CLASS, className)}>
      {children}
    </span>
  )
}

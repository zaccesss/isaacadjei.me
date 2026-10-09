import Link from "next/link"
import { cn } from "@/lib/utils"

export const TAG_CLASS =
  "inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium leading-5 text-foreground/80 before:mr-0.5 before:text-muted-foreground before:content-['#']"

export const CHIP_CLASS = "inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium leading-5 text-foreground/80"

export const LABEL_BASE = "inline-flex items-center text-xs font-semibold uppercase tracking-wider"
export const LABEL_CLASS = `${LABEL_BASE} text-primary`

const HUE: Record<string, string> = {
  blue: "text-blue-700 dark:text-blue-400",
  sky: "text-sky-700 dark:text-sky-400",
  cyan: "text-cyan-700 dark:text-cyan-400",
  teal: "text-teal-700 dark:text-teal-400",
  emerald: "text-emerald-700 dark:text-emerald-400",
  green: "text-green-700 dark:text-green-400",
  amber: "text-amber-700 dark:text-amber-400",
  orange: "text-orange-700 dark:text-orange-400",
  red: "text-red-700 dark:text-red-400",
  rose: "text-rose-700 dark:text-rose-400",
  pink: "text-pink-700 dark:text-pink-400",
  violet: "text-violet-700 dark:text-violet-400",
  purple: "text-purple-700 dark:text-purple-400",
  indigo: "text-indigo-700 dark:text-indigo-400",
  slate: "text-slate-600 dark:text-slate-300",
}

const POST_TYPE_HUE: Record<string, string> = {
  blog: "blue", article: "violet", research: "emerald", journal: "amber",
  report: "rose", resources: "cyan", notes: "slate", newsletter: "indigo",
}

const PROJECT_CATEGORY_HUE: Record<string, string> = {
  embedded: "green", hardware: "amber", iot: "cyan", software: "violet",
  web: "blue", academic: "rose", cybersecurity: "red", other: "slate",
}

const TIL_CATEGORY_HUE: Record<string, string> = {
  "C": "blue", "Embedded": "green", "Electronics": "cyan", "Hardware": "amber", "Robotics": "teal",
  "Git": "orange", "GitHub": "slate", "CSS": "sky", "Web": "sky", "Next.js": "slate", "TypeScript": "blue",
  "PHP": "indigo", "Python": "amber", "Rust": "orange", "OOP": "cyan", "Algorithms & Data Structures": "violet",
  "Security": "red", "AI/ML": "purple", "Linux": "amber", "DevOps": "teal", "Testing": "emerald",
  "Architecture": "orange", "Database": "emerald", "Accessibility": "indigo", "Music": "pink",
  "Fitness": "teal", "Cooking": "rose", "Faith": "amber", "Life": "indigo", "Culture": "purple",
}

const hue = (map: Record<string, string>, key: string) => HUE[map[key] ?? ""] ?? "text-primary"

export const postTypeLabelClass = (type: string) => `${LABEL_BASE} ${hue(POST_TYPE_HUE, type)}`
export const projectCategoryLabelClass = (category: string) => `${LABEL_BASE} ${hue(PROJECT_CATEGORY_HUE, category)}`
export const tilCategoryLabelClass = (category: string) => `${LABEL_BASE} ${hue(TIL_CATEGORY_HUE, category)}`

export const TAG_LINK_CLASS = cn(
  TAG_CLASS,
  "transition-colors hover:bg-primary/10 hover:text-primary hover:underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
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

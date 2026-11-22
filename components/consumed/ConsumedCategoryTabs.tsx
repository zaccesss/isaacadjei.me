"use client"

import { useRouter } from "next/navigation"
import { LayoutList, Tv2, Headphones, Music2, BookOpen, Newspaper, BookMarked, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

export type ConsumedCategoryKey = "all" | "videos" | "audio" | "music" | "books" | "articles" | "resources" | "others"

const ITEMS: { key: ConsumedCategoryKey; label: string; path: string; Icon: typeof LayoutList }[] = [
  { key: "all", label: "All", path: "/consumed", Icon: LayoutList },
  { key: "videos", label: "Videos", path: "/consumed/videos", Icon: Tv2 },
  { key: "audio", label: "Audio", path: "/consumed/podcasts", Icon: Headphones },
  { key: "music", label: "Music", path: "/consumed/music", Icon: Music2 },
  { key: "books", label: "Books", path: "/consumed/books", Icon: BookOpen },
  { key: "articles", label: "Articles", path: "/consumed/articles", Icon: Newspaper },
  { key: "resources", label: "Resources", path: "/consumed/resources", Icon: BookMarked },
  { key: "others", label: "Others", path: "/consumed/others", Icon: Globe },
]

interface ConsumedCategoryTabsProps {
  active: ConsumedCategoryKey
  counts?: Partial<Record<ConsumedCategoryKey, number>>
}

export function ConsumedCategoryTabs({ active, counts }: ConsumedCategoryTabsProps) {
  const router = useRouter()
  const SHARED = ["q", "year", "month", "sort", "preview"]
  const go = (path: string) => {
    const from = new URLSearchParams(window.location.search)
    const keep = new URLSearchParams()
    for (const key of SHARED) for (const v of from.getAll(key)) keep.append(key, v)
    const qs = keep.toString()
    router.push(qs ? `${path}?${qs}` : path)
  }

  return (
    <nav aria-label="Consumed categories" className="flex flex-col items-center gap-3 text-center">
      <span className="text-xs font-semibold text-muted-foreground">Category</span>
      <ul className="flex flex-wrap justify-center gap-1 rounded-md bg-muted p-1 text-muted-foreground">
        {ITEMS.map(({ key, label, path, Icon }) => {
          const current = key === active
          const count = key === "music" ? undefined : counts?.[key]
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => go(path)}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center justify-center gap-1.5 whitespace-nowrap rounded-sm px-3 text-sm font-medium motion-safe:transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  current ? "bg-background text-foreground" : "hover:text-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {label}
                {count !== undefined && <span className="ml-1 text-xs tabular-nums text-muted-foreground">{count}</span>}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

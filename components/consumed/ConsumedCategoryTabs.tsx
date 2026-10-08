"use client"

import { useRouter } from "next/navigation"
import { LayoutList, Tv2, Headphones, Music2, BookOpen, Newspaper, BookMarked, Globe } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type ConsumedCategoryKey = "all" | "videos" | "audio" | "music" | "books" | "articles" | "resources" | "others"

const ROUTES: Record<Exclude<ConsumedCategoryKey, "all">, string> = {
  videos: "/consumed/videos",
  audio: "/consumed/podcasts",
  music: "/consumed/music",
  books: "/consumed/books",
  articles: "/consumed/articles",
  resources: "/consumed/resources",
  others: "/consumed/others",
}

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
  const c = {
    all: counts?.all,
    videos: counts?.videos,
    audio: counts?.audio,
    books: counts?.books,
    articles: counts?.articles,
    resources: counts?.resources,
    others: counts?.others,
  }

  return (
    <div className="space-y-3">
      <Tabs value={active}>
        <div className="flex flex-col items-center text-center gap-3">
          <span className="text-xs text-muted-foreground tracking-widest uppercase font-mono">Category</span>
          <TabsList className="flex-wrap h-auto gap-1 justify-center">
            <TabsTrigger value="all" onClick={() => go("/consumed")} className="gap-1.5">
              <LayoutList className="h-3.5 w-3.5" />
              All
              {c.all !== undefined && (
                <span className="ml-1 text-[10px] font-mono text-muted-foreground">{c.all}</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="videos" onClick={() => go(ROUTES.videos)} className="gap-1.5">
              <Tv2 className="h-3.5 w-3.5" />
              Videos
              {c.videos !== undefined && <span className="ml-1 text-[10px] font-mono text-muted-foreground">{c.videos}</span>}
            </TabsTrigger>
            <TabsTrigger value="audio" onClick={() => go(ROUTES.audio)} className="gap-1.5">
              <Headphones className="h-3.5 w-3.5" />
              Audio
              {c.audio !== undefined && <span className="ml-1 text-[10px] font-mono text-muted-foreground">{c.audio}</span>}
            </TabsTrigger>
            <TabsTrigger value="music" onClick={() => go(ROUTES.music)} className="gap-1.5">
              <Music2 className="h-3.5 w-3.5" />
              Music
            </TabsTrigger>
            <TabsTrigger value="books" onClick={() => go(ROUTES.books)} className="gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              Books
              {c.books !== undefined && <span className="ml-1 text-[10px] font-mono text-muted-foreground">{c.books}</span>}
            </TabsTrigger>
            <TabsTrigger value="articles" onClick={() => go(ROUTES.articles)} className="gap-1.5">
              <Newspaper className="h-3.5 w-3.5" />
              Articles
              {c.articles !== undefined && <span className="ml-1 text-[10px] font-mono text-muted-foreground">{c.articles}</span>}
            </TabsTrigger>
            <TabsTrigger value="resources" onClick={() => go(ROUTES.resources)} className="gap-1.5">
              <BookMarked className="h-3.5 w-3.5" />
              Resources
              {c.resources !== undefined && <span className="ml-1 text-[10px] font-mono text-muted-foreground">{c.resources}</span>}
            </TabsTrigger>
            <TabsTrigger value="others" onClick={() => go(ROUTES.others)} className="gap-1.5">
              <Globe className="h-3.5 w-3.5" />
              Others
              {c.others !== undefined && <span className="ml-1 text-[10px] font-mono text-muted-foreground">{c.others}</span>}
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
    </div>
  )
}

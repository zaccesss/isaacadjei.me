"use client"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Tv2 } from "lucide-react"
import { type VideoEntry, type ConsumedTotals } from "@/data/consumed/types"
import { VideoCard } from "@/components/consumed/VideoCard"
import ListControls from "@/components/shared/ListControls"
import { Pagination } from "@/components/shared/Pagination"
import { CONSUMED_PAGE_SIZES, useConsumedList } from "@/components/consumed/useConsumedList"
import { ConsumedCategoryTabs } from "@/components/consumed/ConsumedCategoryTabs"

export default function VideosContent({ videos, totals }: { videos: VideoEntry[]; totals: ConsumedTotals }) {
  const searchParams = useSearchParams()
  const preview = searchParams.get("preview") === "1"
  const [activeVideos, setActiveVideos] = useState<Set<string>>(new Set())
  const { query, groups, filtered, paginated, page, totalPages, perPage, setPerPage } = useConsumedList(videos, {
    storageKey: "videos",
    preview,
    text: (v) => [v.title, v.channel, ...v.tags],
    facet: { key: "tag", label: "Tags", kind: "multi", values: (v) => v.tags },
  })

  return (
    <div className="container py-24 space-y-10">
      <div className="space-y-4 max-w-2xl">
        <Link
          href="/consumed"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Consumed
        </Link>
        <div className="flex items-center gap-3">
          <Tv2 className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-4xl font-bold tracking-tight">Videos</h1>
          <span className="text-xs font-mono text-muted-foreground">
            {filtered.length}
          </span>
        </div>
        <p className="text-base text-muted-foreground leading-relaxed">
          YouTube videos and playlists watched throughout the year. Lectures, tutorials, conference talks, music videos and everything in between. Click any thumbnail to play inline.
        </p>
      </div>

      <ListControls
        query={query}
        groups={groups}
        searchLabel="Search videos"
        searchPlaceholder="Search videos by title, channel or tag..."
        resultCount={filtered.length}
        itemLabel={{ one: "video", many: "videos" }}
      />

      <ConsumedCategoryTabs active="videos" counts={{ ...totals, videos: filtered.length }} />

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">No videos match these filters.</p>
      ) : (
        <div id="consumed-list" className="scroll-mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((v) => (
            <VideoCard
              key={v.id}
              video={v}
              active={activeVideos.has(v.id)}
              onActivate={() => setActiveVideos((prev) => new Set([...prev, v.id]))}
            />
          ))}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={query.setPage}
        totalItems={filtered.length}
        pageSize={perPage}
        pageSizeOptions={CONSUMED_PAGE_SIZES}
        onPageSizeChange={(n) => {
          setPerPage(n)
          query.setPage(1)
        }}
        scrollTargetId="consumed-list"
        itemLabel="videos"
        label="Video pages"
      />
    </div>
  )
}

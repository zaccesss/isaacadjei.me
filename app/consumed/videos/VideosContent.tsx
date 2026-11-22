"use client"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { type VideoEntry, type ConsumedTotals } from "@/data/consumed/types"
import { VideoCard } from "@/components/consumed/VideoCard"
import ListControls from "@/components/shared/lists/ListControls"
import { Pagination } from "@/components/shared/lists/Pagination"
import { CONSUMED_PAGE_SIZES, useConsumedList } from "@/components/consumed/useConsumedList"
import { ConsumedCategoryTabs } from "@/components/consumed/ConsumedCategoryTabs"
import PageHeader from "@/components/layout/PageHeader"

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
      <div className="max-w-2xl space-y-6">
        <Link
          href="/consumed"
          className="inline-flex min-h-11 items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Consumed
        </Link>
        <PageHeader
          title="Videos"
          description="YouTube videos and playlists watched throughout the year. Lectures, tutorials, conference talks, music videos and everything in between. Click any thumbnail to play inline."
        >
          <p className="text-sm text-muted-foreground tabular-nums">
            {filtered.length} {filtered.length === 1 ? "item" : "items"}
          </p>
        </PageHeader>
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

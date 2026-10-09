import type { Metadata } from "next"
import { Suspense } from "react"
import VideosContent from "./VideosContent"
import { videos, consumedTotals } from "@/data/consumed"
import { consumedItemsForPage } from "@/data/consumed/summary"

export const revalidate = 604800

export const metadata: Metadata = {
  title: "Videos",
  description: "YouTube videos and playlists watched throughout the year. Lectures, tutorials, conference talks and more.",
  alternates: { canonical: "https://www.isaacadjei.me/consumed/videos" },
  openGraph: {
    images: ["/api/og?title=Videos%20%7C%20Consumed&description=YouTube%20videos%20and%20playlists%20watched%20throughout%20the%20year."],
  },
}

export default function VideosPage() {
  return (
    <Suspense>
      <VideosContent videos={consumedItemsForPage(videos)} totals={consumedTotals()} />
    </Suspense>
  )
}

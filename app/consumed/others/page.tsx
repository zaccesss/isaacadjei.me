import type { Metadata } from "next"
import { Suspense } from "react"
import OthersContent from "./OthersContent"
import { others, consumedTotals } from "@/data/consumed"
import { consumedItemsForPage } from "@/data/consumed/summary"

export const revalidate = 604800

export const metadata: Metadata = {
  title: "Others",
  description: "Tools, repos, extensions and miscellaneous finds that do not fit neatly into any other category.",
  alternates: { canonical: "https://www.isaacadjei.me/consumed/others" },
  openGraph: {
    images: ["/api/og?title=Others%20%7C%20Consumed&description=Tools%2C%20repos%20and%20miscellaneous%20finds%20that%20do%20not%20fit%20neatly%20into%20any%20other%20category."],
  },
}

export default function OthersPage() {
  return (
    <Suspense>
      <OthersContent others={consumedItemsForPage(others)} totals={consumedTotals()} />
    </Suspense>
  )
}

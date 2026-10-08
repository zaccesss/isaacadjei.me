import type { Metadata } from "next"
import { feedAlternates } from "@/lib/feeds"

export const metadata: Metadata = {
  title: "Blog",
  description: "Writing on tech, engineering and ideas.",
  alternates: {
    canonical: "https://www.isaacadjei.me/blog",
    types: feedAlternates("blog", "all"),
  },
  openGraph: {
    images: ["/api/og?title=Blog&description=Writing%20on%20tech%2C%20engineering%20and%20ideas."],
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

import type { Metadata } from "next"
import Link from "next/link"
import OpenSourceList from "@/components/opensource/OpenSourceList"
import { getOpenSourceStats } from "@/lib/opensource/open-source"
import { toListed } from "@/lib/opensource/open-source-list"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Open Source",
  description: "My contributions to open source projects: what each one changed, in which project and a link to the work.",
  alternates: { canonical: "https://isaacadjei.me/open-source" },
  openGraph: { images: ["/api/og?title=Open%20Source&description=My%20contributions%20to%20open%20source%20projects."] },
}

export default async function OpenSourcePage() {
  const { contributions } = await getOpenSourceStats()

  return (
    <div className="container max-w-3xl py-24 space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Open source</h1>
        <p className="text-muted-foreground">
          Work I have contributed to other people&apos;s projects and to the tools I publish for everyone to use, all in the open. Each entry says what it changed and links to the work itself.
        </p>
        <p className="text-muted-foreground">
          I keep the numbers and charts for this work on the{" "}
          <Link href="/stats#open-source" className="body-link inline-flex min-h-11 items-center">stats page</Link>.
        </p>
      </div>

      {contributions.length > 0 ? (
        <OpenSourceList rows={toListed(contributions)} />
      ) : (
        <p className="text-sm text-muted-foreground">My contributions are not loading at the moment. Please try again in a little while.</p>
      )}
    </div>
  )
}

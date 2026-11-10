import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { FaGithub } from "react-icons/fa6"
import CommandLine from "@/components/install/CommandLine"
import { installTools, type InstallTool } from "@/data/install"
import { latestRelease, releaseDate, type LatestRelease } from "@/lib/integrations/github-releases"

export const revalidate = 86400

export const metadata: Metadata = {
  title: "Install",
  description: "Every tool I publish and how to install it: Homebrew, winget, Cargo, editor marketplaces and browser stores. All free and open source.",
  alternates: { canonical: "https://isaacadjei.me/install" },
  openGraph: { images: ["/api/og?title=Install&description=Every%20tool%20I%20publish%20and%20how%20to%20install%20it."] },
}

function Tool({ tool, release }: { tool: InstallTool; release: LatestRelease | null }) {
  const commands = tool.channels.filter((c) => c.command)
  const listings = tool.channels.filter((c) => c.url)
  return (
    <section id={tool.id} aria-labelledby={`${tool.id}-title`} className="scroll-mt-24 rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6">
      <div className="space-y-2">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 id={`${tool.id}-title`} className="text-2xl font-semibold tracking-tight">{tool.name}</h2>
          {release && (
            <a href={release.url} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground underline-offset-2 hover:underline">
              <span className="font-mono text-foreground">{release.tag}</span> · {releaseDate(release.date)}
              <span className="sr-only"> (release notes open in a new tab)</span>
            </a>
          )}
        </div>
        <p className="text-muted-foreground leading-relaxed">{tool.summary}</p>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <a href={`https://github.com/${tool.repo}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 text-foreground underline-offset-2 hover:underline">
            <FaGithub className="h-4 w-4" aria-hidden />
            {tool.repo}<span className="sr-only"> on GitHub (opens in a new tab)</span>
          </a>
          <Link href={tool.project} className="inline-flex min-h-11 items-center text-primary underline-offset-2 hover:underline">
            About {tool.name}
          </Link>
        </p>
      </div>

      {commands.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">From the command line</h3>
          <div className="space-y-2">
            {commands.map((c) => (
              <CommandLine key={c.name} label={c.short ?? c.name} command={c.command!} prompt={c.shell !== false} />
            ))}
          </div>
        </div>
      )}

      {listings.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">From a store or listing</h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            {listings.map((c) => (
              <li key={c.name}>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-11 h-full items-start justify-between gap-3 rounded-lg border border-border px-4 py-3 transition-colors hover:border-foreground/40 hover:bg-muted/40"
                >
                  <span className="space-y-0.5">
                    <span className="block text-sm font-medium text-foreground">{c.name}</span>
                    {c.note && <span className="block text-xs text-muted-foreground">{c.note}</span>}
                  </span>
                  <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" aria-hidden />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

export default async function InstallPage() {
  const releases = await Promise.all(installTools.map((t) => latestRelease(t.repo)))
  return (
    <div className="container max-w-3xl py-24 space-y-10">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Install</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Everything here is free and open source. Pick a tool, then the way you usually install software. The version
          beside each tool is its latest release.
        </p>
        <nav aria-label="Tools on this page">
          <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
            {installTools.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} className="inline-flex min-h-11 items-center text-primary underline-offset-2 hover:underline">{t.name}</a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <div className="space-y-6">
        {installTools.map((t, i) => <Tool key={t.id} tool={t} release={releases[i]} />)}
      </div>
    </div>
  )
}

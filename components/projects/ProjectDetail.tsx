"use client"

import { ViewTransition } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Globe } from "lucide-react"
import { FaGithub as Github } from "react-icons/fa6"
import ImageGallery from "./ImageGallery"
import { mediaSrc } from "@/lib/content/media"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  LineChart as RLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts"
import { CATEGORY_LABELS, type Project } from "@/data/projects"
import { releaseDate, type LatestRelease } from "@/lib/integrations/github-releases"
import ShareButton from "@/components/shared/ShareButton"
import { renderBlock, buildHeadingIds, renderInline } from "@/components/shared/markdown/ContentBlocks"
import StatusBadge from "./StatusBadge"
import ProductCard from "./ProductCard"
import { CHIP_CLASS } from "@/components/shared/lists/Tag"
import ThemedCover from "@/components/shared/media/ThemedCover"
import TableOfContents from "@/components/shared/markdown/TableOfContents"
import { collectTocHeadings, hasToc, type TocHeading } from "@/lib/content/toc"
import { CHART_COLOURS } from "@/lib/ui/chart-palette"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { cn } from "@/lib/utils"

const ZacessStudio = dynamic(() => import("./zacess/Studio"))

export type LabMeasurementPoint = {
  measurement_set: string
  frequency_hz: number
  magnitude_db: number | null
  phase_deg: number | null
}

interface Props {
  project: Project
  measurements?: LabMeasurementPoint[]
  highlighted?: Record<number, string>
  releases?: { name: string; repo: string; release: LatestRelease | null }[]
}

const TICK = { fontSize: 13 }

function renderWithCode(text: string) {
  const parts = text.split(/(`[^`]+`)/)
  return parts.map((part, i) =>
    part.startsWith("`") && part.endsWith("`")
      ? <code key={i} className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded text-foreground">{part.slice(1, -1)}</code>
      : part
  )
}

const sameUrl = (a: string, b: string) => a.replace(/\/+$/, "").replace("://www.", "://") === b.replace(/\/+$/, "").replace("://www.", "://")
function linkedElsewhere(url: string, links: string[], ...buttons: (string | undefined)[]): boolean {
  return [...links, ...buttons].some((other) => other !== undefined && sameUrl(url, other))
}

export default function ProjectDetail({ project, measurements, highlighted, releases }: Props) {
  const sets = measurements?.length ? [...new Set(measurements.map((m) => m.measurement_set))] : []
  const frequencies = measurements?.length ? [...new Set(measurements.map((m) => m.frequency_hz))].sort((a, b) => a - b) : []
  const magnitudeData = frequencies.map((f) => {
    const row: Record<string, number> = { frequency_hz: f }
    for (const s of sets) {
      const p = measurements?.find((m) => m.measurement_set === s && m.frequency_hz === f)
      if (p?.magnitude_db != null) row[s] = p.magnitude_db
    }
    return row
  })
  const phaseData = frequencies.map((f) => {
    const row: Record<string, number> = { frequency_hz: f }
    for (const s of sets) {
      const p = measurements?.find((m) => m.measurement_set === s && m.frequency_hz === f)
      if (p?.phase_deg != null) row[s] = p.phase_deg
    }
    return row
  })
  const hasPhaseData = phaseData.some((row) => Object.keys(row).length > 1)

  const sectionIds = project.sections ? buildHeadingIds(project.sections) : new Map<number, string>()
  const taken = new Set(sectionIds.values())
  const fixedId = (base: string) => (taken.has(base) ? `${base}-section` : base)
  const ids = {
    overview: fixedId("overview"),
    highlights: fixedId("highlights"),
    releases: fixedId("releases"),
    technologies: fixedId("technologies"),
    frequency: fixedId("frequency-response"),
    team: fixedId("team"),
    gallery: fixedId("gallery"),
    references: fixedId("references"),
    involved: fixedId("get-involved"),
  }
  const hasReleases = !!releases?.some((r) => r.release)
  const hasTeam = !!project.team?.length
  const hasReferences = !!project.references?.length
  const hasInvolved = !!(project.getInvolved && project.github)
  const tocHeadings: TocHeading[] = [
    { id: ids.overview, text: "Overview", level: 2 },
    ...(project.sections ? collectTocHeadings(project.sections, sectionIds) : []),
    { id: ids.highlights, text: "Key highlights", level: 2 },
    ...(hasReleases ? [{ id: ids.releases, text: "Latest releases", level: 2 as const }] : []),
    { id: ids.technologies, text: "Technologies", level: 2 },
    ...(frequencies.length > 0 ? [{ id: ids.frequency, text: "Frequency response", level: 2 as const }] : []),
    ...(hasTeam ? [{ id: ids.team, text: "Team", level: 2 as const }] : []),
    ...(project.images.length > 0 ? [{ id: ids.gallery, text: "Gallery", level: 2 as const }] : []),
    ...(hasReferences ? [{ id: ids.references, text: "References and further reading", level: 2 as const }] : []),
    ...(hasInvolved ? [{ id: ids.involved, text: "Get involved", level: 2 as const }] : []),
  ]
  const showToc = hasToc(tocHeadings)
  const cover = project.cover ?? project.images[0]

  const specs: { term: string; value: React.ReactNode }[] = [
    { term: "Type", value: CATEGORY_LABELS[project.category] ?? project.category },
    ...(project.status
      ? [{ term: "Status", value: <StatusBadge status={project.status} className="text-sm text-foreground" /> }]
      : project.ongoing
        ? [{ term: "Status", value: "Ongoing" }]
        : []),
    { term: "Date", value: project.date },
    ...(hasTeam ? [{ term: "Team", value: `${project.team!.length} ${project.team!.length === 1 ? "person" : "people"}` }] : []),
    ...(project.technologies.length > 0
      ? [{ term: "Built with", value: project.technologies.slice(0, 3).join(", ") + (project.technologies.length > 3 ? ` and ${project.technologies.length - 3} more` : "") }]
      : []),
  ]

  const heading = (id: string, text: string) => (
    <h2 id={id} className="text-[1.625rem] leading-tight font-semibold tracking-tight scroll-mt-24">
      {text}
    </h2>
  )

  return (
    <div className={cn("container max-w-3xl py-24 space-y-10", showToc && "lg:max-w-5xl")}>
      <div>
        <Button asChild variant="ghost" size="sm" className="pl-0 mb-6 min-h-11">
          <Link href="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to projects
          </Link>
        </Button>

        <div className="space-y-4">
          <h1 className="text-[2rem] sm:text-[2.5rem] font-bold tracking-tight leading-tight">{project.title}</h1>
          <p className="max-w-[68ch] text-lg text-muted-foreground leading-relaxed">{project.description}</p>

          <dl className="flex flex-wrap gap-x-8 gap-y-3 pt-1 text-sm tabular-nums">
            {specs.map((s) => (
              <div key={s.term} className="space-y-0.5">
                <dt className="text-muted-foreground">{s.term}</dt>
                <dd className="font-medium">{s.value}</dd>
              </div>
            ))}
          </dl>

          <div className="flex items-center gap-3 pt-2 flex-wrap">
            {project.github && (
              <Button asChild variant="outline" size="sm">
                <a href={project.github} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
            )}
            {project.website && (
              <Button asChild size="sm">
                <a href={project.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="mr-2 h-4 w-4" />
                  Website
                </a>
              </Button>
            )}
            {project.demo && !linkedElsewhere(project.demo, project.links?.map((l) => l.url) ?? [], project.website) && (
              <Button asChild size="sm">
                <a href={project.demo} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Live demo
                </a>
              </Button>
            )}
            {project.links?.filter((l) => !linkedElsewhere(l.url, [], project.github, project.website)).map((l) => (
              <Button key={l.url} asChild variant="outline" size="sm" className="h-auto min-h-11 max-w-full whitespace-normal py-2 text-left">
                <a href={l.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4 shrink-0" />
                  {l.label}
                </a>
              </Button>
            ))}
            <ShareButton title={project.title} />
          </div>
        </div>
      </div>

      {cover && (
        <ViewTransition name={`project-cover-${project.id}`} share="project-cover" default="none">
          <div className="relative w-full aspect-4/3 sm:aspect-video overflow-hidden rounded-xl bg-muted">
            <ThemedCover
              src={cover}
              darkSrc={project.cover ? project.coverDark : undefined}
              alt={project.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 960px"
              className="object-cover"
            />
          </div>
        </ViewTransition>
      )}

      <Separator />

      <div className={cn(showToc && "lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-12 lg:items-start")}>
      {showToc && <TableOfContents headings={tocHeadings} />}
      <div className={cn("space-y-10", showToc && "min-w-0 lg:col-start-1 lg:row-start-1")}>
      <div className="space-y-6">
        <div className="max-w-[68ch] space-y-6">
          {heading(ids.overview, "Overview")}
          {project.longDescription.split("\n\n").map((para, i) => (
            <p key={i} className="text-lg leading-[1.7] text-foreground/90">
              {renderWithCode(para)}
            </p>
          ))}
        </div>

        {project.sections && project.sections.length > 0 && (
          <div className="space-y-6 [&>h2]:max-w-[68ch] [&>h3]:max-w-[68ch] [&>ol]:max-w-[68ch] [&>p]:max-w-[68ch] [&>ul]:max-w-[68ch]">
            {project.sections.map((block, i) => {
              if (block.type === "product") return <ProductCard key={i} block={block} />
              if (block.type === "studio") return <ZacessStudio key={i} />
              const prev = project.sections![i - 1]
              return renderBlock(block, i, sectionIds, prev?.type === "product" || prev?.type === "studio" ? undefined : prev, highlighted)
            })}
          </div>
        )}

        <div className="max-w-[68ch] space-y-3">
          {heading(ids.highlights, "Key highlights")}
          <ul className="space-y-2">
            {project.highlights.map((h) => (
              <li key={h} className="flex gap-3 text-foreground/90">
                <span className="text-primary mt-0.5 shrink-0">·</span>
                {h}
              </li>
            ))}
          </ul>
        </div>

        {hasReleases && (
          <div className="space-y-3">
            {heading(ids.releases, "Latest releases")}
            <ul className="space-y-1 text-sm text-muted-foreground">
              {releases!.map((r) => r.release && (
                <li key={r.repo}>
                  {r.name}{" "}
                  <a href={r.release.url} target="_blank" rel="noopener noreferrer" className="body-link">
                    {r.release.tag}, released {releaseDate(r.release.date)}<span className="sr-only"> (release notes open in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground">
              Every way to install them is on the <Link href="/install" className="body-link">Install</Link> page.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {heading(ids.technologies, "Technologies")}
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span key={tech} className={CHIP_CLASS}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {frequencies.length > 0 && (
        <>
          <Separator />
          <div className="space-y-4">
            {heading(ids.frequency, "Frequency response")}
            <p className="text-muted-foreground leading-relaxed">
              Real hand-logged readings across breadboard and PCB builds, plus a theoretical curve
              calculated from the reported component values - the standard Bode plot shape for
              this kind of analogue design.
            </p>
            <figure className="border border-border rounded-lg p-4 bg-card">
              <figcaption className="text-sm font-semibold mb-3">Magnitude (dB) vs frequency</figcaption>
              <ResponsiveContainer width="100%" height={260}>
                <RLineChart data={magnitudeData} margin={{ top: 6, right: 8, bottom: 0, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="frequency_hz" scale="log" domain={["auto", "auto"]} type="number" tick={TICK} tickLine={false} axisLine={false} />
                  <YAxis tick={TICK} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ fontSize: 13, borderRadius: 6 }} labelFormatter={(v) => `${v} Hz`} />
                  <Legend wrapperStyle={{ fontSize: "13px" }} />
                  {sets.map((s, i) => (
                    <Line key={s} type="monotone" dataKey={s} stroke={CHART_COLOURS[i % CHART_COLOURS.length]} strokeWidth={2} dot={{ r: 2 }} connectNulls isAnimationActive={false} />
                  ))}
                </RLineChart>
              </ResponsiveContainer>
            </figure>
            {hasPhaseData && (
              <figure className="border border-border rounded-lg p-4 bg-card">
                <figcaption className="text-sm font-semibold mb-3">Phase (deg) vs frequency</figcaption>
                <ResponsiveContainer width="100%" height={260}>
                  <RLineChart data={phaseData} margin={{ top: 6, right: 8, bottom: 0, left: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="frequency_hz" scale="log" domain={["auto", "auto"]} type="number" tick={TICK} tickLine={false} axisLine={false} />
                    <YAxis tick={TICK} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ fontSize: 13, borderRadius: 6 }} labelFormatter={(v) => `${v} Hz`} />
                    <Legend wrapperStyle={{ fontSize: "13px" }} />
                    {sets.map((s, i) => (
                      <Line key={s} type="monotone" dataKey={s} stroke={CHART_COLOURS[i % CHART_COLOURS.length]} strokeWidth={2} dot={{ r: 2 }} connectNulls isAnimationActive={false} />
                    ))}
                  </RLineChart>
                </ResponsiveContainer>
              </figure>
            )}
          </div>
        </>
      )}

      {hasTeam && (
        <>
          <Separator />
          <div className="space-y-3">
            {heading(ids.team, "Team")}
            <ul className="grid gap-3 sm:grid-cols-2">
              {project.team!.map((m) => (
                <li key={m.github} className="rounded-lg border border-border/60 p-3">
                  <a href={`https://github.com/${m.github}`} target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline-offset-4 hover:underline">
                    {m.name} <span className="font-mono text-xs text-muted-foreground">@{m.github}</span>
                  </a>
                  <p className="mt-1 text-sm text-muted-foreground">{m.role}</p>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {project.images.length > 0 && (
        <>
          <Separator />
          <div className="space-y-4">
            {heading(ids.gallery, "Gallery")}
            <ImageGallery images={project.images} title={project.title} />
            {project.video && (
              <figure className="space-y-3 pt-2">
                <h3 className="text-base font-semibold text-center">
                  Project demo
                </h3>
                <div className="flex justify-center">
                  <video
                    src={mediaSrc(project.video)}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full max-w-2xl rounded-lg aspect-video bg-black"
                    aria-label={`${project.title} demo video`}
                  >
                    {project.videoCaptions && (
                      <track kind="captions" src={project.videoCaptions} srcLang="en" label="English" default />
                    )}
                  </video>
                </div>
                {project.videoCaption && (
                  <figcaption className="text-sm text-center text-foreground/80">{project.videoCaption}</figcaption>
                )}
              </figure>
            )}
          </div>
        </>
      )}

      {hasReferences && (
        <>
          <Separator />
          <div className="space-y-3">
            {heading(ids.references, "References and further reading")}
            <ol className="space-y-2 list-none pl-0">
              {project.references!.map((r, j) => (
                <li key={r.url} className="flex gap-3 text-sm text-foreground/90">
                  <span className="shrink-0 tabular-nums text-primary">{j + 1}.</span>
                  <span>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="body-link">{r.title}</a>
                    {r.note && <span className="text-muted-foreground"> {renderInline(r.note)}</span>}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </>
      )}

      {hasInvolved && (
        <>
          <Separator />
          <div className="space-y-3">
            {heading(ids.involved, "Get involved")}
            <p className="text-sm text-muted-foreground">
              Questions, ideas and contributions are welcome. Read the contributing guide first, then
              pick whichever route fits.
            </p>
            <ul className="grid gap-2 sm:grid-cols-2 text-sm">
              {[
                { label: "Contributing guide", url: `${project.github}/blob/main/CONTRIBUTING.md` },
                ...(project.getInvolved!.discussions
                  ? [{ label: "Ask a question in Discussions", url: `${project.github}/discussions` }]
                  : []),
                { label: "Report a bug or suggest a feature", url: `${project.github}/issues/new/choose` },
                ...(project.getInvolved!.roadmap ? [{ label: "Roadmap board", url: project.getInvolved!.roadmap }] : []),
              ].map((l) => (
                <li key={l.url}>
                  <a href={l.url} target="_blank" rel="noopener noreferrer" className="body-link">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      </div>
      </div>
    </div>
  )
}

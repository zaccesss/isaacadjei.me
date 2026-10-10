"use client"

import Link from "next/link"
import { ArrowLeft, ExternalLink, Globe } from "lucide-react"
import { FaGithub as Github } from "react-icons/fa6"
import ImageGallery from "./ImageGallery"
import { mediaSrc } from "@/lib/media"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  LineChart as RLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts"
import { CATEGORY_LABELS, type Project } from "@/data/projects"
import { staggerContainer, fadeUp } from "@/lib/animations"
import ShareButton from "@/components/shared/ShareButton"
import { renderBlock, buildHeadingIds, renderInline } from "@/components/shared/ContentBlocks"
import StatusBadge from "./StatusBadge"
import { CHIP_CLASS, projectCategoryLabelClass } from "@/components/shared/Tag"

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
}

const BODE_COLOURS = ["#8b5cf6", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899"]

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

export default function ProjectDetail({ project, measurements, highlighted }: Props) {
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

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="container max-w-3xl py-24 space-y-10"
    >
      <motion.div variants={fadeUp}>
        <Button asChild variant="ghost" size="sm" className="pl-0 mb-6">
          <Link href="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to projects
          </Link>
        </Button>

        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className={projectCategoryLabelClass(project.category)}>
              {CATEGORY_LABELS[project.category] ?? project.category}
            </span>
            {project.status ? (
              <StatusBadge status={project.status} />
            ) : project.ongoing && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" aria-hidden="true" />
                Ongoing
              </span>
            )}
            <span className="text-sm text-muted-foreground">{project.date}</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">{project.title}</h1>
          <p className="text-lg text-muted-foreground">{project.description}</p>

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
              <Button key={l.url} asChild variant="outline" size="sm">
                <a href={l.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {l.label}
                </a>
              </Button>
            ))}
            <ShareButton title={project.title} />
          </div>
        </div>
      </motion.div>

      <Separator />

      <motion.div variants={fadeUp} className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Overview</h2>
          {project.longDescription.split("\n\n").map((para, i) => (
            <p key={i} className="text-muted-foreground leading-relaxed">
              {renderWithCode(para)}
            </p>
          ))}
        </div>

        {project.sections && project.sections.length > 0 && (
          <div className="space-y-4">
            {(() => {
              const ids = buildHeadingIds(project.sections)
              return project.sections.map((block, i) => renderBlock(block, i, ids, project.sections![i - 1], highlighted))
            })()}
          </div>
        )}

        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Key highlights</h2>
          <ul className="space-y-2">
            {project.highlights.map((h) => (
              <li key={h} className="flex gap-3 text-muted-foreground">
                <span className="text-primary mt-0.5 shrink-0">·</span>
                {h}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Technologies</h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span key={tech} className={CHIP_CLASS}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {frequencies.length > 0 && (
        <>
          <Separator />
          <motion.div variants={fadeUp} className="space-y-4">
            <h2 className="text-xl font-semibold">Frequency response</h2>
            <p className="text-muted-foreground leading-relaxed">
              Real hand-logged readings across breadboard and PCB builds, plus a theoretical curve
              calculated from the reported component values - the standard Bode plot shape for
              this kind of analogue design.
            </p>
            <div className="border border-border rounded-lg p-4 bg-card">
              <p className="text-sm font-semibold mb-3">Magnitude (dB) vs frequency</p>
              <ResponsiveContainer width="100%" height={260}>
                <RLineChart data={magnitudeData} margin={{ top: 6, right: 8, bottom: 0, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="frequency_hz" scale="log" domain={["auto", "auto"]} type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} labelFormatter={(v) => `${v} Hz`} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  {sets.map((s, i) => (
                    <Line key={s} type="monotone" dataKey={s} stroke={BODE_COLOURS[i % BODE_COLOURS.length]} strokeWidth={2} dot={{ r: 2 }} connectNulls />
                  ))}
                </RLineChart>
              </ResponsiveContainer>
            </div>
            {hasPhaseData && (
              <div className="border border-border rounded-lg p-4 bg-card">
                <p className="text-sm font-semibold mb-3">Phase (deg) vs frequency</p>
                <ResponsiveContainer width="100%" height={260}>
                  <RLineChart data={phaseData} margin={{ top: 6, right: 8, bottom: 0, left: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="frequency_hz" scale="log" domain={["auto", "auto"]} type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} labelFormatter={(v) => `${v} Hz`} />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    {sets.map((s, i) => (
                      <Line key={s} type="monotone" dataKey={s} stroke={BODE_COLOURS[i % BODE_COLOURS.length]} strokeWidth={2} dot={{ r: 2 }} connectNulls />
                    ))}
                  </RLineChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>
        </>
      )}

      {project.team && project.team.length > 0 && (
        <>
          <Separator />
          <motion.div variants={fadeUp} className="space-y-3">
            <h2 className="text-xl font-semibold">Team</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {project.team.map((m) => (
                <li key={m.github} className="rounded-lg border border-border/60 p-3">
                  <a href={`https://github.com/${m.github}`} target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline-offset-4 hover:underline">
                    {m.name} <span className="font-mono text-xs text-muted-foreground">@{m.github}</span>
                  </a>
                  <p className="mt-1 text-sm text-muted-foreground">{m.role}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        </>
      )}

      {project.images.length > 0 && (
        <>
          <Separator />
          <motion.div variants={fadeUp} className="space-y-4">
            <h2 className="text-xl font-semibold">Gallery</h2>
            <ImageGallery images={project.images} title={project.title} />
            {project.video && (
              <div className="space-y-3 pt-2">
                <h3 className="text-base font-semibold text-muted-foreground uppercase tracking-wide text-center">
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
                  />
                </div>
                {project.videoCaption && (
                  <p className="text-sm text-center text-foreground/80">{project.videoCaption}</p>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}

      {project.references && project.references.length > 0 && (
        <>
          <Separator />
          <motion.div variants={fadeUp} className="space-y-3">
            <h2 className="text-xl font-semibold">References and further reading</h2>
            <ol className="space-y-2 list-none pl-0">
              {project.references.map((r, j) => (
                <li key={r.url} className="flex gap-3 text-sm text-foreground/90">
                  <span className="shrink-0 font-mono text-primary">{String(j + 1).padStart(2, "0")}.</span>
                  <span>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4 hover:opacity-80">{r.title}</a>
                    {r.note && <span className="text-muted-foreground"> {renderInline(r.note)}</span>}
                  </span>
                </li>
              ))}
            </ol>
          </motion.div>
        </>
      )}

      {project.getInvolved && project.github && (
        <>
          <Separator />
          <motion.div variants={fadeUp} className="space-y-3">
            <h2 className="text-xl font-semibold">Get involved</h2>
            <p className="text-sm text-muted-foreground">
              Questions, ideas and contributions are welcome. Read the contributing guide first, then
              pick whichever route fits.
            </p>
            <ul className="grid gap-2 sm:grid-cols-2 text-sm">
              {[
                { label: "Contributing guide", url: `${project.github}/blob/main/CONTRIBUTING.md` },
                ...(project.getInvolved.discussions
                  ? [{ label: "Ask a question in Discussions", url: `${project.github}/discussions` }]
                  : []),
                { label: "Report a bug or suggest a feature", url: `${project.github}/issues/new/choose` },
                ...(project.getInvolved.roadmap ? [{ label: "Roadmap board", url: project.getInvolved.roadmap }] : []),
              ].map((l) => (
                <li key={l.url}>
                  <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4 hover:opacity-80">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </>
      )}

    </motion.div>
  )
}

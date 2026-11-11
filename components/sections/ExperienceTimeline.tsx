"use client"

import { motion } from "framer-motion"
import { type Experience } from "@/data/experience"
import { staggerContainer, fadeUp } from "@/lib/ui/animations"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import TimelineMarker from "@/components/changelog/TimelineMarker"

const typeLabel: Record<Experience["type"], string> = {
  work: "Work",
  internship: "Internship",
  virtual: "Virtual",
}

interface Props {
  experiences: Experience[]
}

type Item = { kind: "single"; exp: Experience } | { kind: "group"; title: string; start: string; end: string; entries: Experience[] }

function toItems(experiences: Experience[]): Item[] {
  const items: Item[] = []
  for (const exp of experiences) {
    const last = items[items.length - 1]
    if (exp.group && last?.kind === "group" && last.entries[0].group === exp.group) {
      last.entries.push(exp)
    } else if (exp.group) {
      items.push({ kind: "group", title: exp.groupTitle ?? exp.role, start: exp.groupStart ?? exp.startDate, end: exp.endDate, entries: [exp] })
    } else {
      items.push({ kind: "single", exp })
    }
  }
  return items
}

function Details({ exp }: { exp: Experience }) {
  return (
    <>
      <p className="text-base text-muted-foreground">{exp.description}</p>
      <ul className="space-y-1.5">
        {exp.achievements.map((a) => (
          <li key={a} className="text-sm text-muted-foreground flex gap-3">
            <span className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-muted-foreground" aria-hidden="true" />
            <span>{a}</span>
          </li>
        ))}
      </ul>
      {exp.technologies && exp.technologies.length > 0 && (
        <p className="text-sm text-muted-foreground pt-1">{exp.technologies.join(" · ")}</p>
      )}
    </>
  )
}

export default function ExperienceTimeline({ experiences }: Props) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      data-timeline
      className="relative space-y-8"
    >
      <div className="absolute left-3.5 top-2 bottom-2 w-px bg-border" aria-hidden="true" />
      <TimelineMarker fillClass="left-[13px] top-0" dotClass="left-[6px] -top-2" />

      {toItems(experiences).map((item, i) => (
        <motion.div key={item.kind === "group" ? item.entries[0].id : item.exp.id} variants={fadeUp} className="relative flex gap-4 pl-10">
          <div
            data-timeline-mark
            className="absolute left-0 z-10 mt-1.5 h-7 w-7 rounded-full border-2 border-background bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold shrink-0 transition-colors duration-300 data-[reached=true]:border-primary data-[reached=true]:bg-primary data-[reached=true]:text-primary-foreground"
          >
            {i + 1}
          </div>

          {item.kind === "single" ? (
            <div className="flex-1 min-w-0 space-y-2 pb-2">
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={item.exp.type === "work" || item.exp.type === "internship" ? "default" : "outline"}
                    className={cn("text-sm", item.exp.type === "internship" && "bg-amber-500 hover:bg-amber-500 text-white border-amber-500")}
                  >
                    {typeLabel[item.exp.type]}
                  </Badge>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {item.exp.startDate} - {item.exp.endDate}
                  </span>
                </div>
                <h3 className="text-lg font-semibold leading-snug">{item.exp.role}</h3>
                <p className="text-base text-muted-foreground">
                  {item.exp.company} · {item.exp.location}
                </p>
              </div>
              <Details exp={item.exp} />
            </div>
          ) : (
            <div className="flex-1 min-w-0 space-y-4 pb-2">
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="default" className="text-sm">
                    {typeLabel[item.entries[0].type]}
                  </Badge>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">{item.start} - {item.end}</span>
                </div>
                <h3 className="text-lg font-semibold leading-snug">{item.title}</h3>
                <p className="text-base text-muted-foreground">
                  {item.entries[0].groupSubtitle ?? (new Set(item.entries.map((e) => e.company)).size === 1
                    ? `${item.entries[0].company} · ${item.entries[0].location} · ${item.entries.length} terms`
                    : `${item.entries.length} ventures`)}
                </p>
              </div>
              <ol className="relative space-y-5 border-l border-border pl-5">
                {item.entries.map((exp) => (
                  <li key={exp.id} className="relative space-y-2">
                    <span className="absolute -left-6.25 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary" aria-hidden="true" />
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <h4 className="font-medium leading-snug">{exp.role}</h4>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    {exp.link && (
                      <a href={exp.link.url} target="_blank" rel="noopener noreferrer" className="text-base text-primary underline underline-offset-4 hover:opacity-80">
                        {exp.link.label}
                      </a>
                    )}
                    <Details exp={exp} />
                  </li>
                ))}
              </ol>
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  )
}

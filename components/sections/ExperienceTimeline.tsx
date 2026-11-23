import { type Experience } from "@/data/experience"
import TimelineMarker from "@/components/changelog/TimelineMarker"

const typeLabel: Record<Experience["type"], string> = {
  work: "Work",
  internship: "Internship",
  virtual: "Virtual",
}

const typeClass: Record<Experience["type"], string> = {
  work: "text-primary",
  internship: "text-amber-700 dark:text-amber-400",
  virtual: "text-foreground",
}

const span = (start: string, end: string) => (start === end ? start : `${start} - ${end}`)

function Heading({ type, title, dates, org }: { type: Experience["type"]; title: string; dates: string; org: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 text-sm">
        <p className={`font-medium ${typeClass[type]}`}>{typeLabel[type]}</p>
        <p className="text-muted-foreground whitespace-nowrap tabular-nums">{dates}</p>
      </div>
      <h3 className="text-lg font-semibold leading-snug">{title}</h3>
      {org && <p className="text-base italic text-muted-foreground">{org}</p>}
    </div>
  )
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
            <span className="mt-[0.7em] h-[1.5px] w-[0.35em] shrink-0 rounded-full bg-muted-foreground" aria-hidden="true" />
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
    <div data-timeline className="relative space-y-8">
      <div className="absolute left-3.5 top-2 bottom-2 w-px bg-border" aria-hidden="true" />
      <TimelineMarker fillClass="left-[13px] top-0" dotClass="left-[6px] -top-2" />

      {toItems(experiences).map((item) => (
        <div key={item.kind === "group" ? item.entries[0].id : item.exp.id} className="relative flex gap-4 pl-10">
          <div
            data-timeline-mark
            aria-hidden="true"
            className="absolute left-2 z-10 mt-1.5 h-3 w-3 rounded-full border-2 border-background bg-muted-foreground shrink-0 motion-safe:transition-colors motion-safe:duration-300 data-[reached=true]:bg-primary"
          />

          {item.kind === "single" ? (
            <div className="flex-1 min-w-0 space-y-2 pb-2">
              <Heading
                type={item.exp.type}
                title={item.exp.role}
                dates={span(item.exp.startDate, item.exp.endDate)}
                org={`${item.exp.company} · ${item.exp.location}`}
              />
              <Details exp={item.exp} />
            </div>
          ) : (
            <div className="flex-1 min-w-0 space-y-4 pb-2">
              <Heading
                type={item.entries[0].type}
                title={item.title}
                dates={span(item.start, item.end)}
                org={item.entries[0].groupSubtitle ?? (new Set(item.entries.map((e) => e.company)).size === 1
                  ? `${item.entries[0].company} · ${item.entries[0].location} · ${item.entries.length} terms`
                  : `${item.entries.length} ventures`)}
              />
              <ol className="relative space-y-5 border-l border-border pl-5">
                {item.entries.map((exp) => (
                  <li key={exp.id} className="relative space-y-2">
                    <span className="absolute -left-6.25 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary" aria-hidden="true" />
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <h4 className="font-medium leading-snug">{exp.role}</h4>
                      <span className="text-sm text-muted-foreground whitespace-nowrap tabular-nums">{span(exp.startDate, exp.endDate)}</span>
                    </div>
                    {exp.link && (
                      <a href={exp.link.url} target="_blank" rel="noopener noreferrer" className="text-base body-link">
                        {exp.link.label}
                      </a>
                    )}
                    <Details exp={exp} />
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

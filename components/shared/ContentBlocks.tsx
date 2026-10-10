import Image from "@/components/shared/MediaImage"
import { mediaSrc } from "@/lib/media"
import type { ContentBlock } from "@/data/blog"
import CodeBlock from "@/components/shared/CodeBlock"
import Callout from "@/components/shared/Callout"
import { Diagram } from "@/components/analytics/Diagram"

export function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g)
  if (parts.length === 1) return text
  return parts.map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (match) {
      const isExternal = match[2].startsWith("http")
      return (
        <a
          key={i}
          href={match[2]}
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          {match[1]}
        </a>
      )
    }
    return part
  })
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}

export function buildHeadingIds(content: ContentBlock[]): Map<number, string> {
  const counts = new Map<string, number>()
  const ids = new Map<number, string>()
  content.forEach((block, i) => {
    if (block.type !== "h2" && block.type !== "h3") return
    const base = slugify(block.text)
    const count = counts.get(base) ?? 0
    ids.set(i, count === 0 ? base : `${base}-${count}`)
    counts.set(base, count + 1)
  })
  return ids
}

export function renderBlock(
  block: ContentBlock,
  i: number,
  headingIds?: Map<number, string>,
  prevBlock?: ContentBlock,
  highlighted?: Record<number, string>,
): React.ReactNode {
  const afterAcknowledgements = prevBlock?.type === "h2" && prevBlock?.text === "Acknowledgements"
  switch (block.type) {
    case "p":
      return (
        <p key={i} className={`text-base leading-relaxed ${afterAcknowledgements ? "text-primary/90" : "text-foreground/90"}`}>
          {renderInline(block.text)}
        </p>
      )
    case "h2":
      return (
        <h2
          key={i}
          id={headingIds?.get(i)}
          className={`text-xl font-semibold tracking-tight mt-8 mb-2 scroll-mt-24 ${
            block.text === "Acknowledgements" ? "text-primary" : ""
          }`}
        >
          {block.text}
        </h2>
      )
    case "h3":
      return (
        <h3 key={i} id={headingIds?.get(i)} className="text-base font-semibold tracking-tight mt-6 mb-1 scroll-mt-24">
          {block.text}
        </h3>
      )
    case "ul":
      return (
        <ul key={i} className="space-y-1.5 list-none pl-0">
          {block.items.map((item, j) => (
            <li key={j} className="flex gap-2 text-base text-foreground/90">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      )
    case "ol":
      return (
        <ol key={i} className="space-y-1.5 list-none pl-0 counter-reset-[item]">
          {block.items.map((item, j) => (
            <li key={j} className="flex gap-3 text-base text-foreground/90">
              <span className="shrink-0 font-mono text-sm text-primary">
                {String(j + 1).padStart(2, "0")}.
              </span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ol>
      )
    case "code":
      return <CodeBlock key={i} lang={block.lang} text={block.text} html={highlighted?.[i]} />
    case "quote":
      return (
        <blockquote key={i} className="border-l-2 border-primary pl-5 py-1 space-y-1">
          <p className="text-base italic text-foreground/80">{block.text}</p>
          {block.source && (
            <p className="text-xs font-mono text-muted-foreground">- {block.source}</p>
          )}
        </blockquote>
      )
    case "ol-links":
      return (
        <ol key={i} className="space-y-2 list-none pl-0">
          {block.items.map((item, j) => (
            <li key={j} className="flex gap-3 text-sm text-foreground/90">
              <span className="shrink-0 font-mono text-sm text-primary">
                {String(j + 1).padStart(2, "0")}.
              </span>
              <span>
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
                  >
                    {item.text}
                  </a>
                ) : (
                  item.text
                )}
              </span>
            </li>
          ))}
        </ol>
      )
    case "image":
      return (
        <figure key={i} className="space-y-2 my-2">
          <Image
            src={block.src}
            alt={block.alt}
            width={900}
            height={500}
            sizes="(max-width: 768px) 100vw, 900px"
            className="rounded-lg border border-border/60 w-full h-auto"
          />
          {block.caption && (
            <figcaption className="text-xs text-center text-muted-foreground italic">
              {block.caption}
            </figcaption>
          )}
        </figure>
      )
    case "video":
      return (
        <figure key={i} className="space-y-2 my-4">
          <div className="relative aspect-video rounded-lg overflow-hidden border border-border/60">
            <iframe
              src={`https://www.youtube.com/embed/${block.youtubeId}`}
              title={block.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          {block.description && (
            <figcaption className="text-xs text-center text-muted-foreground italic">
              {block.description}
            </figcaption>
          )}
        </figure>
      )
    case "spotify":
      return (
        <figure key={i} className="space-y-2 my-4">
          <iframe
            src={`https://open.spotify.com/embed/episode/${block.episodeId}`}
            title={block.title}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="block w-full h-[152px] rounded-xl"
          />
          {block.description && (
            <figcaption className="text-xs text-center text-muted-foreground italic">
              {block.description}
            </figcaption>
          )}
        </figure>
      )
    case "diagram":
      return (
        <figure key={i} className="space-y-2 my-4 rounded-lg border border-border/60 p-4">
          <Diagram code={block.code} />
          {block.caption && (
            <figcaption className="text-sm text-center text-foreground/80">{block.caption}</figcaption>
          )}
        </figure>
      )
    case "table":
      return (
        <figure key={i} className="my-4 space-y-2">
          <div className="overflow-x-auto rounded-lg border border-border/60">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  {block.headers.map((h, j) => (
                    <th key={j} scope="col" className="px-3 py-2 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, r) => (
                  <tr key={r} className="border-t border-border/40">
                    {row.map((cell, c) => (
                      <td key={c} className="px-3 py-2 align-top text-foreground/90">{renderInline(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption && (
            <figcaption className="text-xs text-center text-muted-foreground italic">{block.caption}</figcaption>
          )}
        </figure>
      )
    case "callout":
      return (
        <Callout key={i} kind={block.tone}>
          {renderInline(block.text)}
        </Callout>
      )
    case "clip":
      return (
        <figure key={i} className="space-y-2 my-4">
          <video controls playsInline preload="none" poster={mediaSrc(block.poster)} aria-label={block.alt} className="w-full rounded-lg border border-border/60">
            <source src={mediaSrc(block.src)} type="video/mp4" />
          </video>
          {block.caption && (
            <figcaption className="text-xs text-center text-muted-foreground italic">{block.caption}</figcaption>
          )}
        </figure>
      )
    case "divider":
      return <hr key={i} className="border-border/40" />
    default:
      return null
  }
}


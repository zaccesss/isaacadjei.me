"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Copy } from "lucide-react"

interface Props {
  bibtex: string
  apa: string
  title: string
}

type Format = "BibTeX" | "APA"

export default function CopyCitationButtons({ bibtex, apa, title }: Props) {
  const [copied, setCopied] = useState<Format | null>(null)
  const [message, setMessage] = useState("")
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  async function copy(format: Format) {
    const text = format === "BibTeX" ? bibtex : apa
    try {
      await navigator.clipboard.writeText(text)
      setCopied(format)
      setMessage(`${format} citation copied to the clipboard`)
    } catch {
      setCopied(null)
      setMessage(`Could not copy the ${format} citation. Select the text and copy it instead.`)
    }
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setCopied(null)
      setMessage("")
    }, 2500)
  }

  const button =
    "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"

  return (
    <div className="flex flex-wrap items-center gap-2">
      {(["BibTeX", "APA"] as const).map((format) => {
        const done = copied === format
        const Icon = done ? Check : Copy
        return (
          <button
            key={format}
            type="button"
            onClick={() => copy(format)}
            aria-label={`Copy ${format} citation for ${title}`}
            className={button}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {done ? "Copied" : `Copy ${format}`}
          </button>
        )
      })}
      <span role="status" aria-live="polite" className="sr-only">
        {message}
      </span>
    </div>
  )
}

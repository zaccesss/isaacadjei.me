"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { Check, Copy } from "lucide-react"
import type { CitationStyle } from "@/data/respub/cite"

interface Props {
  styles: CitationStyle[]
  title: string
  showText?: boolean
}

const STORAGE_KEY = "respub-citation-style"

function readSaved(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}
function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange)
  return () => window.removeEventListener("storage", onChange)
}

export default function CitationPicker({ styles, title, showText = true }: Props) {
  const saved = useSyncExternalStore(subscribe, readSaved, () => null)
  const [picked, setPicked] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [message, setMessage] = useState("")
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  const current = styles.find((s) => s.id === (picked ?? saved)) ?? styles[0]

  function choose(id: string) {
    setPicked(id)
    setCopied(false)
    try {
      localStorage.setItem(STORAGE_KEY, id)
    } catch {}
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(current.text)
      setCopied(true)
      setMessage(`${current.label} citation copied to the clipboard`)
    } catch {
      setCopied(false)
      setMessage(`Could not copy the ${current.label} citation. Select the text and copy it instead.`)
    }
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setCopied(false)
      setMessage("")
    }, 2500)
  }

  const selectId = `cite-style-${title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}${showText ? "" : "-card"}`
  const control =
    "rounded-md border bg-background px-2.5 text-xs font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary min-h-11 sm:min-h-8"
  const Icon = copied ? Check : Copy

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor={selectId} className="text-xs text-muted-foreground">
          Citation style
        </label>
        <select
          id={selectId}
          value={current.id}
          onChange={(e) => choose(e.target.value)}
          className={`${control} pr-7`}
          aria-label={`Citation style for ${title}`}
        >
          {styles.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={copy}
          aria-label={`Copy ${current.label} citation for ${title}`}
          className={`${control} inline-flex items-center gap-1.5`}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          {copied ? "Copied" : "Copy"}
        </button>
        <span role="status" aria-live="polite" className="sr-only">
          {message}
        </span>
      </div>
      {showText &&
        (current.code ? (
          <pre className="overflow-x-auto rounded-md border bg-muted/40 p-4 text-xs leading-relaxed">
            <code>{current.text}</code>
          </pre>
        ) : (
          <p className="text-sm text-muted-foreground leading-relaxed">{current.text}</p>
        ))}
    </div>
  )
}

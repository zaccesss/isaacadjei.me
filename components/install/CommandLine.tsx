"use client"
import { useState } from "react"
import { Check, Copy } from "lucide-react"

export default function CommandLine({ label, command, prompt = true }: { label: string; command: string; prompt?: boolean }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="flex items-stretch overflow-hidden rounded-lg border border-border bg-muted/40">
      <span className="hidden sm:flex w-28 shrink-0 items-center border-r border-border px-3 text-xs font-medium text-muted-foreground">
        {label}
      </span>
      <code className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto whitespace-nowrap px-3 py-2.5 font-mono text-sm">
        <span className="sm:hidden text-xs font-sans font-medium text-muted-foreground">{label}</span>
        {prompt && <span aria-hidden className="select-none text-muted-foreground">$</span>}
        <span className="text-foreground">{command}</span>
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? `Copied: ${command}` : `Copy the ${label} command: ${command}`}
        className="flex min-h-11 min-w-11 shrink-0 items-center justify-center border-l border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring"
      >
        {copied ? <Check className="h-4 w-4 text-foreground" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
      </button>
      <span className="sr-only" role="status" aria-live="polite">{copied ? "Copied" : ""}</span>
    </div>
  )
}

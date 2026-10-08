"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { codeLabel } from "@/lib/code-labels"

interface CodeBlockProps {
  lang: string
  text: string
  html?: string
  label?: string
}

export default function CodeBlock({ lang, text, html, label }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const name = label ?? codeLabel(lang)

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard access can be refused (insecure context or permissions); the button simply stays as it was
    }
  }

  return (
    <figure className="code-frame not-prose my-4 overflow-hidden rounded-lg border border-border">
      <figcaption className="code-frame-header flex items-center justify-between gap-2 border-b border-border px-3 py-1.5">
        <span className="font-mono text-xs font-semibold tracking-wide">{name}</span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? `Copied ${name} code` : `Copy ${name} code`}
          className="flex min-h-6 items-center gap-1 rounded-md border border-current/30 px-2 py-0.5 text-xs transition-colors hover:border-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {copied ? <Check className="h-3 w-3" aria-hidden="true" /> : <Copy className="h-3 w-3" aria-hidden="true" />}
          <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
        </button>
      </figcaption>
      {html ? (
        <div className="code-frame-body overflow-x-auto text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <pre className="code-frame-body overflow-x-auto p-4 text-sm font-mono leading-relaxed">
          <code className={lang ? `language-${lang}` : undefined}>{text}</code>
        </pre>
      )}
    </figure>
  )
}

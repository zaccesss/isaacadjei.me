"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { ZACESS_THEMES } from "@/data/projects/zacess/themes-preview"

type Theme = (typeof ZACESS_THEMES.themes)[number]
type Token = keyof Theme["syntax"]

export const DEFAULT_THEME = "deep-contrast-dark"

export const shortName = (name: string): string => name.replace(/^Zacess /, "")

export function themeById(id: string): Theme {
  return ZACESS_THEMES.themes.find((t) => t.id === id) ?? ZACESS_THEMES.themes.find((t) => t.id === DEFAULT_THEME)!
}

export function tokenStyle(theme: Theme, token: string): React.CSSProperties {
  const colour = theme.syntax[token as Token] ?? theme.syntax.foreground
  const styles: readonly string[] = ZACESS_THEMES.styles[token as keyof typeof ZACESS_THEMES.styles] ?? []
  return {
    color: colour,
    fontWeight: styles.includes("bold") ? 700 : undefined,
    fontStyle: styles.includes("italic") ? "italic" : undefined,
    textDecoration: styles.includes("underline") ? "underline" : undefined,
  }
}

export function statusText(theme: Theme): string {
  return `Showing ${theme.name}. Its weakest code colour is ${theme.weakest.toFixed(1)} to 1 on the background.`
}

export default function ThemeSwitcher({ initial = DEFAULT_THEME }: { initial?: string }) {
  const [id, setId] = useState(initial)
  const theme = themeById(id)
  const { ui } = theme

  return (
    <div className="space-y-3">
      <div role="group" aria-label="Choose a Zacess code theme" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {ZACESS_THEMES.themes.map((t) => {
          const on = t.id === theme.id
          return (
            <button
              key={t.id}
              type="button"
              aria-pressed={on}
              onClick={() => setId(t.id)}
              className={`inline-flex min-h-11 min-w-11 items-center justify-start gap-2 rounded-md px-3 py-2 text-left text-sm leading-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                on ? "border-2 border-primary bg-primary/10 font-semibold text-foreground" : "border border-border bg-background text-foreground/90 hover:bg-muted"
              }`}
            >
              <span
                aria-hidden="true"
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border text-[10px] font-bold"
                style={{ background: t.ui.background, color: t.ui.foreground, borderColor: t.ui.border }}
              >
                {on ? <Check className="h-3.5 w-3.5" /> : "A"}
              </span>
              {shortName(t.name)}
            </button>
          )
        })}
      </div>
      <p className="text-sm text-foreground/90" role="status" aria-live="polite">
        {statusText(theme)}
      </p>
      <pre
        tabIndex={0}
        aria-label={`TypeScript sample in ${theme.name}`}
        className="overflow-x-auto rounded-md border-2 py-3 font-mono text-[13px] leading-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        style={{ background: ui.background, color: ui.foreground, borderColor: ui.border }}
      >
        <code className="block min-w-max">
          {ZACESS_THEMES.sample.map((line, i) => (
            <span key={i} className="flex pr-4" style={line.highlight ? { background: ui.lineHighlight } : undefined}>
              <span
                aria-hidden="true"
                className="inline-block w-9 shrink-0 select-none pr-3 text-right"
                style={{ color: line.highlight ? ui.lineNumberActive : ui.lineNumber }}
              >
                {i + 1}
              </span>
              <span>
                {line.tokens.map(([token, text], j) => (
                  <span key={j} style={tokenStyle(theme, token)}>{text}</span>
                ))}
              </span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  )
}

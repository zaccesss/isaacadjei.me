"use client"

import { useEffect, useId, useState } from "react"
import { useTheme } from "next-themes"

export function Diagram({ code, className }: { code: string; className?: string }) {
  const id = "mmd" + useId().replace(/[^a-zA-Z0-9]/g, "")
  const { resolvedTheme } = useTheme()
  const [svg, setSvg] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const mermaid = (await import("mermaid")).default
        mermaid.initialize({ startOnLoad: false, securityLevel: "strict", theme: resolvedTheme === "dark" ? "dark" : "neutral", fontFamily: "inherit" })
        const out = await mermaid.render(id, code)
        if (!cancelled) { setSvg(out.svg); setError("") }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "The diagram could not be drawn")
      }
    })()
    return () => { cancelled = true }
  }, [code, id, resolvedTheme])

  if (error) return <p className="text-xs text-destructive whitespace-pre-wrap">{error}</p>
  if (!svg) return <div className="h-32 animate-pulse rounded-md bg-muted/40" />
  return <div className={`overflow-x-auto [&_svg]:mx-auto [&_svg]:max-w-full ${className ?? ""}`} dangerouslySetInnerHTML={{ __html: svg }} />
}

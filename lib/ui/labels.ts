const ACRONYMS = new Set(["su", "pal", "pr", "prs", "cv", "uk", "ai", "ml", "iot", "pcb", "til", "api", "url", "id", "ssc", "ltc", "ci", "os", "pc", "ps5", "hc", "gpu", "cpu"])

export function formatLabel(value: string | null | undefined, map?: Record<string, string>): string {
  if (!value) return ""
  if (map && map[value]) return map[value]
  const words = value.trim().replace(/[_-]+/g, " ").replace(/\s+/g, " ").toLowerCase().split(" ")
  return words
    .map((w, i) => (ACRONYMS.has(w) ? w.toUpperCase() : i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(" ")
}
